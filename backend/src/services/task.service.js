import prisma from '../prisma/client.js';
import {
  formatTask,
  mapTaskStatusToPrisma,
} from '../utils/formatters.js';
import { AppError } from '../utils/asyncHandler.js';
import { verifyProjectOwnership } from './project.service.js';

const buildTaskWhere = (userId, { search, status, priority, projectId }) => {
  const where = {
    project: { userId },
  };

  if (projectId) {
    where.projectId = parseInt(projectId, 10);
  }

  if (status) {
    where.status = mapTaskStatusToPrisma(status);
  }

  if (priority) {
    where.priority = priority;
  }

  if (search) {
    where.OR = [
      { taskName: { contains: search } },
      { description: { contains: search } },
    ];
  }

  return where;
};

export const getTasks = async (userId, filters = {}) => {
  const where = buildTaskWhere(userId, filters);

  const tasks = await prisma.task.findMany({
    where,
    include: {
      project: {
        select: { id: true, projectName: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return tasks.map(formatTask);
};

export const getTaskById = async (userId, taskId) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: { userId },
    },
    include: {
      project: {
        select: { id: true, projectName: true },
      },
    },
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  return formatTask(task);
};

export const createTask = async (userId, data) => {
  await verifyProjectOwnership(userId, data.projectId);

  const task = await prisma.task.create({
    data: {
      taskName: data.taskName,
      description: data.description || null,
      priority: data.priority || 'Medium',
      status: data.status ? mapTaskStatusToPrisma(data.status) : 'Pending',
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      projectId: data.projectId,
    },
    include: {
      project: {
        select: { id: true, projectName: true },
      },
    },
  });

  return formatTask(task);
};

export const updateTask = async (userId, taskId, data) => {
  const existing = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: { userId },
    },
  });

  if (!existing) {
    throw new AppError('Task not found', 404);
  }

  if (data.projectId !== undefined) {
    await verifyProjectOwnership(userId, data.projectId);
  }

  const updateData = {};

  if (data.taskName !== undefined) updateData.taskName = data.taskName;
  if (data.description !== undefined) updateData.description = data.description || null;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.status !== undefined) updateData.status = mapTaskStatusToPrisma(data.status);
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }
  if (data.projectId !== undefined) updateData.projectId = data.projectId;

  const task = await prisma.task.update({
    where: { id: taskId },
    data: updateData,
    include: {
      project: {
        select: { id: true, projectName: true },
      },
    },
  });

  return formatTask(task);
};

export const deleteTask = async (userId, taskId) => {
  const existing = await prisma.task.findFirst({
    where: {
      id: taskId,
      project: { userId },
    },
  });

  if (!existing) {
    throw new AppError('Task not found', 404);
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return { id: taskId };
};

export const markTaskCompleted = async (userId, taskId) => {
  return updateTask(userId, taskId, { status: 'Completed' });
};
