export const COOKIE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export const API_ROUTES = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  AUTH: {
    REFRESH: '/auth/refresh',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
} as const;

export const QUERY_CONFIG = {
  STALE_TIME: 60 * 1000, // 1 minute
} as const;
