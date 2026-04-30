import { z } from "zod";
import { TaskStatus, Priority } from "../config/generated/prisma/enums";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z
    .enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    .optional(),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]).optional(),
  dueDate: z.coerce.date().optional(),
  assigneeId: z.string().uuid().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z
    .enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    .optional(),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]).optional(),
  dueDate: z.coerce.date().optional(),
  assigneeId: z.string().uuid().nullable().optional(),
});

export const taskFilterSchema = z.object({
  status: z
    .enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
    .optional(),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]).optional(),
  assigneeId: z.string().optional(),
  search: z.string().optional(),
  overdue: z.coerce.boolean().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export type CreateTaskType = z.infer<typeof createTaskSchema>;
export type UpdateTaskType = z.infer<typeof updateTaskSchema>;
export type TaskFilterType = z.infer<typeof taskFilterSchema>;
