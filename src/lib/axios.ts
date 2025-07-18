// api.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { store } from "@/store";
import { logout, setUserAndCsrf } from "@/store/authSlice";
import {
  enqueueRequest,
  finishRefreshing,
  getIsRefreshing,
  getRefreshSignal,
  processQueue,
  startRefreshing,
  resetQueue,
} from "./refreshQueue";

const REFRESH_TIMEOUT = 10000; // 10 seconds timeout
const MAX_RETRY_ATTEMPTS = 2;

// Define custom properties on axios config
interface CustomRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

// Define error response structure
interface ErrorResponse {
  error?: string;
}

export function isLoggedOut(): boolean {
  return store.getState().auth.user === null;
}

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const csrf = store.getState().auth.antiCsrfToken;
  if (csrf) config.headers["X-CSRF-Token"] = csrf;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ErrorResponse>) => {
    const original = error.config as CustomRequestConfig;
    if (!original) return Promise.reject(error);
    
    const status = error.response?.status;
    const code = error.response?.data?.error;

    const shouldRefresh =
      (status === 401 && code && ["INVALID_TOKEN", "TOKEN_EXPIRED"].includes(code)) ||
      (status === 403 && code === "CSRF_INVALID");

    // Prevent infinite loops and check retry attempts
    const retryCount = original._retryCount || 0;
    if (!shouldRefresh || retryCount >= MAX_RETRY_ATTEMPTS) {
      return Promise.reject(error);
    }

    // Check for logout before processing
    if (isLoggedOut()) {
      resetQueue();
      return Promise.reject(new Error("Request aborted - user logged out"));
    }

    // Queue request if refresh in progress
    if (getIsRefreshing()) {
      return new Promise((resolve, reject) => {
        enqueueRequest({
          resolve: (token) => {
            if (token && typeof token === "string") {
              // Apply new token directly to queued requests
              original.headers = original.headers || {};
              original.headers["X-CSRF-Token"] = token;
            }
            resolve(api(original));
          },
          reject
        });
      });
    }

    // Start refresh process
    original._retry = true;
    original._retryCount = retryCount + 1;
    startRefreshing(REFRESH_TIMEOUT);  // Pass timeout duration

    try {
      const res = await api.post(
        "/auth/refresh",
        {},
        { signal: getRefreshSignal() }
      );

      // Re-check logout status after refresh
      if (isLoggedOut()) {
        throw new Error("Refresh aborted - user logged out");
      }

      // Update store and process queue with new token
      store.dispatch(setUserAndCsrf(res.data));
      processQueue(null, res.data.antiCsrfToken);
      return api(original);
    } catch (refreshError) {
      if (!isLoggedOut()) {
        processQueue(refreshError);
        store.dispatch(logout());
      }
      return Promise.reject(refreshError);
    } finally {
      finishRefreshing();
    }
  }
);

export default api;