import prisma from '../prisma/client.js';
import {
  formatProject,
  mapProjectStatusToPrisma,
} from '../utils/formatters.js';
import { AppError } from '../utils/asyncHandler.js';

const buildProjectWhere = (userId, { search, status }) => {
  const where = { userId };

  if (status) {
    where.status = mapProjectStatusToPrisma(status);
  }

  if (search) {
    where.OR = [
      { projectName: { contains: search } },
      { description: { contains: search } },
    ];
  }

  return where;
};

export const getProjects = async (userId, filters = {}) => {
  const where = buildProjectWhere(userId, filters);

  const projects = await prisma.project.findMany({
    where,
    include: {
      _count: { select: { tasks: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return projects.map(formatProject);
};

export const getProjectById = async (userId, projectId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    include: {
      tasks: { orderBy: { createdAt: 'desc' } },
      _count: { select: { tasks: true } },
    },
  });

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  return formatProject(project);
};

export const createProject = async (userId, data) => {
  const project = await prisma.project.create({
    data: {
      projectName: data.projectName,
      description: data.description || null,
      status: data.status
        ? mapProjectStatusToPrisma(data.status)
        : 'Not_Started',
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      userId,
    },
    include: {
      _count: { select: { tasks: true } },
    },
  });

  return formatProject(project);
};

export const updateProject = async (userId, projectId, data) => {
  const existing = await prisma.project.findFirst({
    where: { id: projectId, userId },
  });

  if (!existing) {
    throw new AppError('Project not found', 404);
  }

  const updateData = {};

  if (data.projectName !== undefined) updateData.projectName = data.projectName;
  if (data.description !== undefined) updateData.description = data.description || null;
  if (data.status !== undefined) updateData.status = mapProjectStatusToPrisma(data.status);
  if (data.startDate !== undefined) {
    updateData.startDate = data.startDate ? new Date(data.startDate) : null;
  }
  if (data.endDate !== undefined) {
    updateData.endDate = data.endDate ? new Date(data.endDate) : null;
  }

  const project = await prisma.project.update({
    where: { id: projectId },
    data: updateData,
    include: {
      _count: { select: { tasks: true } },
    },
  });

  return formatProject(project);
};

export const deleteProject = async (userId, projectId) => {
  const existing = await prisma.project.findFirst({
    where: { id: projectId, userId },
  });

  if (!existing) {
    throw new AppError('Project not found', 404);
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return { id: projectId };
};

export const verifyProjectOwnership = async (userId, projectId) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
  });

  if (!project) {
    throw new AppError('Project not found or access denied', 404);
  }

  return project;
};
