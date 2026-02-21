import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { COOKIE_KEYS, API_ROUTES } from '@/constants';
import { PromiseCallback } from '@/types/api';
import { AuthRefreshResponse } from '@/types/auth';

// 1. Base URL configuration
const API_BASE_URL = API_ROUTES.BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor: Attach Access Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // cookies-next handles choosing between browser cookies and server-side headers
    const token = getCookie(COOKIE_KEYS.ACCESS_TOKEN);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 3. Response Interceptor: Handle Token Refresh
let isRefreshing = false;

let failedQueue: PromiseCallback[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request if a refresh is already in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getCookie(COOKIE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        // No refresh token available, logout user or handle accordingly
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Call your refresh token endpoint
        // Adjust the URL and payload based on your backend implementation
        const response = await axios.post<AuthRefreshResponse>(`${API_BASE_URL}${API_ROUTES.AUTH.REFRESH}`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Save new tokens
        setCookie(COOKIE_KEYS.ACCESS_TOKEN, accessToken);
        if (newRefreshToken) setCookie(COOKIE_KEYS.REFRESH_TOKEN, newRefreshToken);

        processQueue(null, accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Clean up on total failure
        deleteCookie(COOKIE_KEYS.ACCESS_TOKEN);
        deleteCookie(COOKIE_KEYS.REFRESH_TOKEN);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
