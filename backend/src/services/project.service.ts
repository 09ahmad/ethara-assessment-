import { prismaClient } from "../utils/generatedClient";
import type {
  CreateProjectType,
  UpdateProjectType,
} from "../validators/project.schema";

export const projectService = {
  async createProject(ownerId: string, input: CreateProjectType) {
    const project = await prismaClient.project.create({
      data: {
        ...input,
        ownerId,
        members: {
          create: { userId: ownerId }, // owner is auto-added as member
        },
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });
    return project;
  },

  async getProjects(userId: string, role: string) {
    const where: any = { isDeleted: false };

    if (role !== "ADMIN") {
      where.members = { some: { userId } };
    }

    return prismaClient.project.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        _count: { select: { tasks: { where: { isDeleted: false } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getProjectById(projectId: string, userId: string, role: string) {
    const project = await prismaClient.project.findUnique({
      where: { id: projectId },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        _count: { select: { tasks: { where: { isDeleted: false } } } },
      },
    });

    if (!project || project.isDeleted) {
      throw { status: 404, message: "Project not found" };
    }

    if (role !== "ADMIN") {
      const isMember = project.members.some((m) => m.userId === userId);
      if (!isMember) {
        throw { status: 403, message: "Access denied" };
      }
    }

    return project;
  },

  async updateProject(
    projectId: string,
    userId: string,
    role: string,
    data: UpdateProjectType,
  ) {
    const project = await prismaClient.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.isDeleted) {
      throw { status: 404, message: "Project not found" };
    }

    if (role !== "ADMIN" && project.ownerId !== userId) {
      throw {
        status: 403,
        message: "Only the project owner or admin can update this project",
      };
    }

    return prismaClient.project.update({
      where: { id: projectId },
      data,
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async deleteProject(projectId: string, userId: string, role: string) {
    const project = await prismaClient.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.isDeleted) {
      throw { status: 404, message: "Project not found" };
    }

    if (role !== "ADMIN" && project.ownerId !== userId) {
      throw {
        status: 403,
        message: "Only the project owner or admin can delete this project",
      };
    }

    return prismaClient.project.update({
      where: { id: projectId },
      data: { isDeleted: true },
    });
  },

  async addMember(
    projectId: string,
    userId: string,
    role: string,
    newUserId: string,
  ) {
    const project = await prismaClient.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.isDeleted) {
      throw { status: 404, message: "Project not found" };
    }

    if (role !== "ADMIN" && project.ownerId !== userId) {
      throw {
        status: 403,
        message: "Only the project owner or admin can add members",
      };
    }

    // verify target user exists
    const targetUser = await prismaClient.user.findUnique({
      where: { id: newUserId },
    });
    if (!targetUser) {
      throw { status: 404, message: "User not found" };
    }

    // check already a member
    const existing = await prismaClient.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: newUserId } },
    });
    if (existing) {
      throw {
        status: 409,
        message: "User is already a member of this project",
      };
    }

    return prismaClient.projectMember.create({
      data: { projectId, userId: newUserId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async removeMember(
    projectId: string,
    userId: string,
    role: string,
    targetUserId: string,
  ) {
    const project = await prismaClient.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.isDeleted) {
      throw { status: 404, message: "Project not found" };
    }

    if (role !== "ADMIN" && project.ownerId !== userId) {
      throw {
        status: 403,
        message: "Only the project owner or admin can remove members",
      };
    }

    // cannot remove the owner
    if (targetUserId === project.ownerId) {
      throw { status: 400, message: "Cannot remove the project owner" };
    }

    const membership = await prismaClient.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: targetUserId } },
    });

    if (!membership) {
      throw { status: 404, message: "User is not a member of this project" };
    }

    return prismaClient.projectMember.delete({
      where: { projectId_userId: { projectId, userId: targetUserId } },
    });
  },
};
