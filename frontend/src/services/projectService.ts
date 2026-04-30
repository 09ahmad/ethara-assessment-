import { api } from "./api";
import type { Project } from "../utils/types";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const projectService = {
  async getProjects() {
    const { data } = await api.get<ApiResponse<Project[]>>("/projects");
    return data.data;
  },
  async getProjectById(projectId: string) {
    const { data } = await api.get<ApiResponse<Project>>(`/projects/${projectId}`);
    return data.data;
  },
  async createProject(payload: { name: string; description?: string }) {
    const { data } = await api.post<ApiResponse<Project>>("/projects", payload);
    return data.data;
  },
  async updateProject(projectId: string, payload: { name?: string; description?: string }) {
    const { data } = await api.patch<ApiResponse<Project>>(`/projects/${projectId}`, payload);
    return data.data;
  },
  async deleteProject(projectId: string) {
    await api.delete(`/projects/${projectId}`);
  },
  async addMember(projectId: string, userId: string) {
    await api.post(`/projects/${projectId}/members`, { userId });
  },
  async removeMember(projectId: string, userId: string) {
    await api.delete(`/projects/${projectId}/members/${userId}`);
  },
};
