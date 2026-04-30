import { prismaClient } from "../utils/generatedClient";
import { Role, Status } from "../config/generated/prisma/enums";

export const userService = {
  async getAllUsers() {
    return prismaClient.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  },

  async getUserById(id: string) {
    const user = await prismaClient.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    return user;
  },

  async updateRole(id: string, role: string, actorUserId: string) {
    if (!Object.values(Role).includes(role as Role)) {
      throw { status: 400, message: "Invalid role" };
    }

    if (id === actorUserId && role !== "ADMIN") {
      throw { status: 400, message: "You cannot remove your own admin role" };
    }

    const user = await prismaClient.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    if (user.role === "ADMIN" && role === "MEMBER") {
      const totalAdmins = await prismaClient.user.count({
        where: { role: "ADMIN", status: "ACTIVE" },
      });
      if (totalAdmins <= 1) {
        throw { status: 400, message: "At least one active admin is required" };
      }
    }

    return prismaClient.user.update({
      where: { id },
      data: { role: role as Role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  },

  async updateStatus(id: string, status: string, actorUserId: string) {
    if (!Object.values(Status).includes(status as Status)) {
      throw { status: 400, message: "Invalid status" };
    }

    if (id === actorUserId && status !== "ACTIVE") {
      throw { status: 400, message: "You cannot deactivate your own account" };
    }

    const user = await prismaClient.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    if (user.role === "ADMIN" && status === "INACTIVE") {
      const totalAdmins = await prismaClient.user.count({
        where: { role: "ADMIN", status: "ACTIVE" },
      });
      if (totalAdmins <= 1) {
        throw { status: 400, message: "At least one active admin is required" };
      }
    }

    return prismaClient.user.update({
      where: { id },
      data: { status: status as Status },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
      },
    });
  },
};