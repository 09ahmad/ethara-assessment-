import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

export const addMemberSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});

export type CreateProjectType = z.infer<typeof createProjectSchema>;
export type UpdateProjectType = z.infer<typeof updateProjectSchema>;
export type AddMemberType = z.infer<typeof addMemberSchema>;
