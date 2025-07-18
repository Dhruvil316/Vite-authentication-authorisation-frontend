import axios from "axios";
import { store } from "@/store";
import { logout, setUserAndCsrf } from "@/store/authSlice";
import {
  enqueueRequest,
  finishRefreshing,
  getIsRefreshing,
  getRefreshSignal,
  processQueue,
  startRefreshing,
} from "./refreshQueue";
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
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const code = error.response?.data?.error;

    const shouldRefresh =
      (status === 401 && ["INVALID_TOKEN", "TOKEN_EXPIRED"].includes(code)) ||
      (status === 403 && code === "CSRF_INVALID");

    // Don't refresh again if already tried
    if (!shouldRefresh || original._retry) {
      return Promise.reject(error);
    }

    // If another refresh in progress, queue this request
    if (getIsRefreshing()) {
      return new Promise((resolve, reject) => {
        enqueueRequest({ resolve, reject });
      })
        .then(() => api(original))
        .catch((err) => Promise.reject(err));
    }

    // Start the refresh process
    original._retry = true;
    startRefreshing();

    try {
      const res = await api.post(
        "/auth/refresh",
        {},
        { signal: getRefreshSignal() }
      );

      if (isLoggedOut()) {
        return Promise.reject(new Error("Refresh aborted — user logged out"));
      }

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
