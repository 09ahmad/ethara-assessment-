import { prismaClient } from "../utils/generatedClient";

export const dashboardService = {
  async getSummary(role: string, userId: string) {
    const now = new Date();

    // scope: admin sees all, member sees only their projects' tasks
    const projectWhere: any = { isDeleted: false };
    if (role !== "ADMIN") {
      projectWhere.members = { some: { userId } };
    }

    const projects = await prismaClient.project.findMany({
      where: projectWhere,
      select: { id: true },
    });
    const projectIds = projects.map((p) => p.id);

    const taskWhere: any = { isDeleted: false, projectId: { in: projectIds } };

    const [total, todo, inProgress, done, overdue] = await Promise.all([
      prismaClient.task.count({ where: taskWhere }),
      prismaClient.task.count({ where: { ...taskWhere, status: "TODO" } }),
      prismaClient.task.count({
        where: { ...taskWhere, status: "IN_PROGRESS" },
      }),
      prismaClient.task.count({ where: { ...taskWhere, status: "DONE" } }),
      prismaClient.task.count({
        where: {
          ...taskWhere,
          dueDate: { lt: now },
          status: { not: "DONE" },
        },
      }),
    ]);

    return { totalTasks: total, todo, inProgress, done, overdue };
  },

  async getByProject(role: string, userId: string) {
    const now = new Date();

    const projectWhere: any = { isDeleted: false };
    if (role !== "ADMIN") {
      projectWhere.members = { some: { userId } };
    }

    const projects = await prismaClient.project.findMany({
      where: projectWhere,
      select: {
        id: true,
        name: true,
        tasks: {
          where: { isDeleted: false },
          select: { status: true, dueDate: true },
        },
      },
    });

    return projects.map((p) => ({
      projectId: p.id,
      projectName: p.name,
      total: p.tasks.length,
      todo: p.tasks.filter((t) => t.status === "TODO").length,
      inProgress: p.tasks.filter((t) => t.status === "IN_PROGRESS").length,
      done: p.tasks.filter((t) => t.status === "DONE").length,
      overdue: p.tasks.filter(
        (t) => t.dueDate && t.dueDate < now && t.status !== "DONE",
      ).length,
    }));
  },

  async getRecent(role: string, userId: string, limit: number) {
    const projectWhere: any = { isDeleted: false };
    if (role !== "ADMIN") {
      projectWhere.members = { some: { userId } };
    }

    const projects = await prismaClient.project.findMany({
      where: projectWhere,
      select: { id: true },
    });
    const projectIds = projects.map((p) => p.id);

    return prismaClient.task.findMany({
      where: { isDeleted: false, projectId: { in: projectIds } },
      orderBy: { updatedAt: "desc" },
      take: limit,
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true, email: true } },
      },
    });
  },
};

