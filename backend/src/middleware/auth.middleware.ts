import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role } from "../config/generated/prisma/enums";
import { prismaClient } from "../utils/generatedClient";

interface JwtPayloadType {
  userId: string;
  role: Role;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
     res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

   if (!token) {
     res.status(401).json({
      success: false,
      message: "Token missing",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded === "string") {
       res.status(401).json({
        success: false,
        message: "Invalid token",
      });
      return;
    }

    const payload = decoded as JwtPayloadType;

    const dbUser = await prismaClient.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true, status: true },
    });

    if (!dbUser) {
      res.status(401).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    if (dbUser.status !== "ACTIVE") {
      res.status(403).json({
        success: false,
        message: "Account is inactive",
      });
      return;
    }

    req.user = {
      userId: dbUser.id,
      role: dbUser.role as Role,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};