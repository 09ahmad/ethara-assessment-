import type { Request, Response } from "express";
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { dashboardService } from "../services/dashboard.service";

export const dashboardRouter = Router();

// GET /dashboard/summary  → task counts + overdue (all roles, scoped)
dashboardRouter.get(
  "/dashboard/summary",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { role, userId } = req.user!;
      const data = await dashboardService.getSummary(role, userId);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to fetch summary",
      });
    }
  },
);

// GET /dashboard/by-project  → per-project task breakdown
dashboardRouter.get(
  "/dashboard/by-project",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { role, userId } = req.user!;
      const data = await dashboardService.getByProject(role, userId);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to fetch project breakdown",
      });
    }
  },
);

// GET /dashboard/recent?limit=5  → recently updated tasks
dashboardRouter.get(
  "/dashboard/recent",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { role, userId } = req.user!;
      const limit = Number(req.query.limit) || 5;
      const data = await dashboardService.getRecent(role, userId, limit);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to fetch recent tasks",
      });
    }
  },
);

