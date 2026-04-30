import type { Request, Response } from "express";
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { taskService } from "../services/task.service";
import {
  createTaskSchema,
  updateTaskSchema,
  taskFilterSchema,
} from "../validators/task.schema";

export const taskRouter = Router();

// POST /projects/:projectId/tasks  → create task (any project member)
taskRouter.post(
  "/projects/:projectId/tasks",
  authMiddleware,
  async (req: Request, res: Response) => {
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    try {
      const { userId } = req.user!;
      const task = await taskService.createTask(
        req.params.projectId as string,
        userId,
        parsed.data,
      );
      res.status(201).json({ success: true, data: task });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to create task",
      });
    }
  },
);

// GET /projects/:projectId/tasks  → list tasks with filters (project members)
taskRouter.get(
  "/projects/:projectId/tasks",
  authMiddleware,
  async (req: Request, res: Response) => {
    const parsed = taskFilterSchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid filters",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    try {
      const { userId, role } = req.user!;
      const result = await taskService.getTasks(
        req.params.projectId as string,
        userId,
        role,
        parsed.data,
      );
      res.status(200).json({ success: true, ...result });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to fetch tasks",
      });
    }
  },
);

// GET /tasks/:id  → get single task
taskRouter.get(
  "/tasks/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { userId, role } = req.user!;
      const task = await taskService.getTaskById(req.params.id as string, userId, role);
      res.status(200).json({ success: true, data: task });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to fetch task",
      });
    }
  },
);

// PATCH /tasks/:id  → update task (project members)
taskRouter.patch(
  "/tasks/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    try {
      const { userId, role } = req.user!;
      const updated = await taskService.updateTask(
        req.params.id as string,
        userId,
        role,
        parsed.data,
      );
      res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to update task",
      });
    }
  },
);

// DELETE /tasks/:id  → soft delete (admin or project owner)
taskRouter.delete(
  "/tasks/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { userId, role } = req.user!;
      await taskService.deleteTask(req.params.id as string, userId, role);
      res.status(200).json({ success: true, message: "Task deleted" });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to delete task",
      });
    }
  },
);
