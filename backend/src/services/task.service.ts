import { prismaClient } from "../utils/generatedClient";
import type {
  CreateTaskType,
  UpdateTaskType,
  TaskFilterType,
} from "../validators/task.schema";

export const taskService = {
  async createTask(
    projectId: string,
    creatorId: string,
    input: CreateTaskType,
  ) {
    const membership = await prismaClient.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: creatorId } },
    });

    if (!membership) {
      throw { status: 403, message: "You are not a member of this project" };
    }

    if (input.assigneeId) {
      const assigneeMembership = await prismaClient.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId: input.assigneeId } },
      });
      if (!assigneeMembership) {
        throw {
          status: 400,
          message: "Assignee is not a member of this project",
        };
      }
    }

    return prismaClient.task.create({
      data: {
        ...input,
        projectId,
        creatorId,
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async getTasks(
    projectId: string,
    userId: string,
    role: string,
    filters: TaskFilterType,
  ) {
    if (role !== "ADMIN") {
      const membership = await prismaClient.projectMember.findUnique({
        where: { projectId_userId: { projectId, userId } },
      });
      if (!membership) {
        throw { status: 403, message: "You are not a member of this project" };
      }
    }

    const { status, priority, assigneeId, search, overdue, page, limit } =
      filters;
    const now = new Date();

    const where: any = { projectId, isDeleted: false };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assigneeId) where.assigneeId = assigneeId;

    if (overdue) {
      where.dueDate = { lt: now };
      where.status = { not: "DONE" };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [tasks, total] = await Promise.all([
      prismaClient.task.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          creator: { select: { id: true, name: true, email: true } },
          assignee: { select: { id: true, name: true, email: true } },
        },
      }),
      prismaClient.task.count({ where }),
    ]);

    return { tasks, total, page, limit };
  },

  async getTaskById(taskId: string, userId: string, role: string) {
    const task = await prismaClient.task.findUnique({
      where: { id: taskId },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
        project: { select: { id: true, name: true } },
      },
    });

    if (!task || task.isDeleted) {
      throw { status: 404, message: "Task not found" };
    }

    if (role !== "ADMIN") {
      const membership = await prismaClient.projectMember.findUnique({
        where: { projectId_userId: { projectId: task.projectId, userId } },
      });
      if (!membership) {
        throw { status: 403, message: "Access denied" };
      }
    }

    return task;
  },

  async updateTask(
    taskId: string,
    userId: string,
    role: string,
    data: UpdateTaskType,
  ) {
    const task = await prismaClient.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.isDeleted) {
      throw { status: 404, message: "Task not found" };
    }

    if (role !== "ADMIN") {
      const membership = await prismaClient.projectMember.findUnique({
        where: { projectId_userId: { projectId: task.projectId, userId } },
      });
      if (!membership) {
        throw { status: 403, message: "Access denied" };
      }
    }

    if (data.assigneeId) {
      const assigneeMembership = await prismaClient.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: task.projectId,
            userId: data.assigneeId,
          },
        },
      });
      if (!assigneeMembership) {
        throw {
          status: 400,
          message: "Assignee is not a member of this project",
        };
      }
    }

    return prismaClient.task.update({
      where: { id: taskId },
      data,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });
  },

  async deleteTask(taskId: string, userId: string, role: string) {
    const task = await prismaClient.task.findUnique({
      where: { id: taskId },
    });

    if (!task || task.isDeleted) {
      throw { status: 404, message: "Task not found" };
    }

    if (role !== "ADMIN") {
      const project = await prismaClient.project.findUnique({
        where: { id: task.projectId },
      });
      if (project?.ownerId !== userId) {
        throw {
          status: 403,
          message: "Only admins or project owners can delete tasks",
        };
      }
    }

    return prismaClient.task.update({
      where: { id: taskId },
      data: { isDeleted: true },
    });
  },
};
