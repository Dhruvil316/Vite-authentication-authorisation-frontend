// src/lib/axios.ts
import axios from "axios";
import { store } from "@/store";
import { logout, setUserAndCsrf } from "@/store/authSlice";

const api = axios.create({
  baseURL: "http://localhost:8080", // change as needed
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const csrf = store.getState().auth.antiCsrfToken;
  if (csrf) config.headers["X-CSRF-Token"] = csrf;
  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token?: string | null ) => {
  failedQueue.forEach((prom) =>
    error ? prom.reject(error) : prom.resolve(token)
  );
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) =>
          failedQueue.push({ resolve, reject })
        )
          .then(() => api(originalRequest))
          .catch(Promise.reject);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await api.post("/auth/refresh");
        store.dispatch(setUserAndCsrf(res.data));
        processQueue(null, res.data.antiCsrfToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        store.dispatch(logout());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
