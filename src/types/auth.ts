export interface AuthTokenSet {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthRefreshResponse {
  accessToken: string;
  refreshToken?: string;
}
