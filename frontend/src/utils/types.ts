export type Role = "ADMIN" | "MEMBER";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status?: "ACTIVE" | "INACTIVE";
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ProjectMember {
  userId: string;
  user: User;
}

export interface Project {
  id: string;
  name: string;
  description?: string | null;
  ownerId: string;
  owner: User;
  members: ProjectMember[];
  _count?: { tasks: number };
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  assigneeId?: string | null;
  creatorId: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  assignee?: User | null;
  creator: User;
  project?: {
    id: string;
    name: string;
  };
}

export interface DashboardSummary {
  totalTasks: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number;
}
