import { api } from "./api";
import type { Role, User } from "../utils/types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const userService = {
  async getUsers() {
    const { data } = await api.get<ApiResponse<User[]>>("/users");
    return data.data;
  },
  async updateRole(userId: string, role: Role) {
    await api.patch(`/users/${userId}/role`, { role });
  },
  async updateStatus(userId: string, status: "ACTIVE" | "INACTIVE") {
    await api.patch(`/users/${userId}/status`, { status });
  },
};
