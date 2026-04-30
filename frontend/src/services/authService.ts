import { api } from "./api";
import type { AuthResponse } from "../utils/types";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const authService = {
  async login(payload: { email: string; password: string }) {
    const { data } = await api.post<ApiResponse<AuthResponse>>("/login", payload);
    return data.data;
  },
  async register(payload: { name: string; email: string; password: string }) {
    const { data } = await api.post<ApiResponse<AuthResponse>>("/register", payload);
    return data.data;
  },
};
