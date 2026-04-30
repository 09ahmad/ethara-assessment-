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

  async updateRole(id: string, role: string) {
    if (!Object.values(Role).includes(role as Role)) {
      throw { status: 400, message: "Invalid role" };
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

  async updateStatus(id: string, status: string) {
    if (!Object.values(Status).includes(status as Status)) {
      throw { status: 400, message: "Invalid status" };
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