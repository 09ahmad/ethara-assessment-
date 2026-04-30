import express from "express";
import rateLimit from "express-rate-limit";

import { authRouter } from "./auth.routes";
import { userRouter } from "./user.routes";
import { projectRouter } from "./project.routes";
import { taskRouter } from "./task.routes";
import { dashboardRouter } from "./dashboard.routes";

export const apiRouter = express.Router();

const isTest = process.env.NODE_ENV === "test";

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isTest ? 10000 : 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again after 15 minutes",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isTest ? 10000 : 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many auth attempts, please try again after 15 minutes",
  },
});

apiRouter.use(generalLimiter);
apiRouter.use("/register", authLimiter);
apiRouter.use("/login", authLimiter);

apiRouter.use(authRouter);
apiRouter.use(userRouter);
apiRouter.use(projectRouter);
apiRouter.use(taskRouter);
apiRouter.use(dashboardRouter);

