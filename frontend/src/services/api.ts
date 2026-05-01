import axios from "axios";

console.log(import.meta.env.VITE_API_BASE_URL);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://ethara-assessment-production.up.railway.app/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ttm_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ttm_token");
      localStorage.removeItem("ttm_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    const message = error.response?.data?.message ?? "Something went wrong";
    return Promise.reject(new Error(message));
  },
);
