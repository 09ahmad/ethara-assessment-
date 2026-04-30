import type { Request, Response } from "express";
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { authorizationMiddleware } from "../middleware/role.middleware";
import { projectService } from "../services/project.service";
import {
  createProjectSchema,
  updateProjectSchema,
  addMemberSchema,
} from "../validators/project.schema";

export const projectRouter = Router();

// POST /projects  → create project (ADMIN only)
projectRouter.post(
  "/projects",
  authMiddleware,
  authorizationMiddleware("ADMIN"),
  async (req: Request, res: Response) => {
    const parsed = createProjectSchema.safeParse(req.body);
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
      const project = await projectService.createProject(userId, parsed.data);
      res.status(201).json({ success: true, data: project });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to create project",
      });
    }
  },
);

// GET /projects  → list projects (scoped by role)
projectRouter.get(
  "/projects",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { userId, role } = req.user!;
      const projects = await projectService.getProjects(userId, role);
      res.status(200).json({ success: true, data: projects });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to fetch projects",
      });
    }
  },
);

// GET /projects/:id  → get single project
projectRouter.get(
  "/projects/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { userId, role } = req.user!;
      const project = await projectService.getProjectById(
        req.params.id as string ,
        userId,
        role,
      );
      res.status(200).json({ success: true, data: project });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to fetch project",
      });
    }
  },
);

// PATCH /projects/:id  → update project (owner or admin)
projectRouter.patch(
  "/projects/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    const parsed = updateProjectSchema.safeParse(req.body);
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
      const project = await projectService.updateProject(
        req.params.id as string,
        userId,
        role,
        parsed.data,
      );
      res.status(200).json({ success: true, data: project });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to update project",
      });
    }
  },
);

// DELETE /projects/:id  → soft delete (owner or admin)
projectRouter.delete(
  "/projects/:id",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { userId, role } = req.user!;
      await projectService.deleteProject(req.params.id as string, userId, role);
      res.status(200).json({ success: true, message: "Project deleted" });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to delete project",
      });
    }
  },
);

// POST /projects/:id/members  → add member (owner or admin)
projectRouter.post(
  "/projects/:id/members",
  authMiddleware,
  async (req: Request, res: Response) => {
    const parsed = addMemberSchema.safeParse(req.body);
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
      const member = await projectService.addMember(
        req.params.id as string,
        userId,
        role,
        parsed.data.userId,
      );
      res.status(201).json({ success: true, data: member });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to add member",
      });
    }
  },
);

// DELETE /projects/:id/members/:userId  → remove member (owner or admin)
projectRouter.delete(
  "/projects/:id/members/:userId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { userId, role } = req.user!;
      await projectService.removeMember(
        req.params.id as string ,
        userId,
        role,
        req.params.userId as string,
      );
      res.status(200).json({ success: true, message: "Member removed" });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to remove member",
      });
    }
  },
);
