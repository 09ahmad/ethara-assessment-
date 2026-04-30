import { api } from "./api";
import type { DashboardSummary, Task } from "../utils/types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface ByProjectItem {
  projectId: string;
  projectName: string;
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number;
}

export const dashboardService = {
  async getSummary() {
    const { data } = await api.get<ApiResponse<DashboardSummary>>("/dashboard/summary");
    return data.data;
  },
  async getByProject() {
    const { data } = await api.get<ApiResponse<ByProjectItem[]>>("/dashboard/by-project");
    return data.data;
  },
  async getRecent(limit = 8) {
    const { data } = await api.get<ApiResponse<Task[]>>(`/dashboard/recent?limit=${limit}`);
    return data.data;
  },
};
