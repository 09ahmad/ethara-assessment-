import type { Request, Response } from "express";
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { authorizationMiddleware } from "../middleware/role.middleware";
import { userService } from "../services/user.service";

export const userRouter = Router();

// GET    /users          → list all users (ADMIN)

userRouter.get(
  "/users",
  authMiddleware,
  authorizationMiddleware("ADMIN"),
  async (req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({ success: true, data: users });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to fetch users",
      });
    }
  }
);

// GET    /users/:id      → get one user (ADMIN)
userRouter.get(
  "/users/:id",
  authMiddleware,
  authorizationMiddleware("ADMIN"),
  async (req: Request, res: Response) => {
    try {
      const user = await userService.getUserById(req.params.id as string);
      res.status(200).json({ success: true, data: user });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to fetch user",
      });
    }
  }
);

// PATCH  /users/:id/role → update role (ADMIN)
userRouter.patch(
  "/users/:id/role",
  authMiddleware,
  authorizationMiddleware("ADMIN"),
  async (req: Request, res: Response) => {
    try {
      const updated = await userService.updateRole(req.params.id as string, req.body.role);
      res.status(200).json({
        success: true,
        message: "User role updated",
        data: updated,
      });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to update role",
      });
    }
  }
);

// PATCH  /users/:id/status → activate/deactivate (ADMIN)
userRouter.patch(
  "/users/:id/status",
  authMiddleware,
  authorizationMiddleware("ADMIN"),
  async (req: Request, res: Response) => {
    try {
      const updated = await userService.updateStatus(req.params.id as string, req.body.status);
      res.status(200).json({
        success: true,
        message: "User status updated",
        data: updated,
      });
    } catch (err: any) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Failed to update status",
      });
    }
  }
);