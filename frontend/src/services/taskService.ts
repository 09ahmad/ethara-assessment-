import { api } from "./api";
import type { Task, TaskPriority, TaskStatus } from "../utils/types";

interface TaskListResponse {
  success: boolean;
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const taskService = {
  async getTasks(projectId: string) {
    const { data } = await api.get<TaskListResponse>(`/projects/${projectId}/tasks`);
    return data;
  },
  async createTask(
    projectId: string,
    payload: {
      title: string;
      description?: string;
      dueDate?: string;
      assigneeId?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
    },
  ) {
    const { data } = await api.post<ApiResponse<Task>>(`/projects/${projectId}/tasks`, payload);
    return data.data;
  },
  async updateTask(
    taskId: string,
    payload: Partial<{
      title: string;
      description: string;
      dueDate: string;
      assigneeId: string | null;
      status: TaskStatus;
      priority: TaskPriority;
    }>,
  ) {
    const { data } = await api.patch<ApiResponse<Task>>(`/tasks/${taskId}`, payload);
    return data.data;
  },
  async deleteTask(taskId: string) {
    await api.delete(`/tasks/${taskId}`);
  },
};
