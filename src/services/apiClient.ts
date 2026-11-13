import axios from "axios";
import type {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import type { RefreshTokenResponse } from "../features/auth/types/auth.types";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let accessToken: string | null = null;
let onAuthenticationLost: () => void = () => {};
let onSessionRefreshed: (data?: RefreshTokenResponse) => void = () => {};

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function setOnAuthenticationLost(callback: () => void): void {
  onAuthenticationLost = callback;
}

export function setOnSessionRefreshed(
  callback: (data?: RefreshTokenResponse) => void
): void {
  onSessionRefreshed = callback;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let refreshPromise: Promise<RefreshTokenResponse> | null = null;

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (AxiosRequestConfig & RetryableRequestConfig)
      | undefined;

    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Don't refresh recursively for authentication endpoints.
    const url = originalRequest.url ?? "";

    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/logout");

    if (isAuthEndpoint || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {

      if (!refreshPromise) {
        refreshPromise = api
          .post("/auth/refresh")
          .then((response) => {
            const data: RefreshTokenResponse = response.data;

            if (!data.accessToken || !data.user) {
              throw new Error("Refresh did not return an authenticated session.");
            }

            onSessionRefreshed(data);
            return data;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      await refreshPromise;
      
      originalRequest.headers.Authorization =
        `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      accessToken = null;
      onAuthenticationLost();

      return Promise.reject(refreshError);
    }
  }
);

export default api;