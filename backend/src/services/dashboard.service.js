import prisma from '../prisma/client.js';

export const getDashboardStats = async (userId) => {
  const [
    totalProjects,
    totalTasks,
    completedTasks,
    pendingTasks,
    projectsInProgress,
  ] = await Promise.all([
    prisma.project.count({ where: { userId } }),
    prisma.task.count({ where: { project: { userId } } }),
    prisma.task.count({
      where: { project: { userId }, status: 'Completed' },
    }),
    prisma.task.count({
      where: { project: { userId }, status: 'Pending' },
    }),
    prisma.project.count({
      where: { userId, status: 'In_Progress' },
    }),
  ]);

  return {
    totalProjects,
    totalTasks,
    completedTasks,
    pendingTasks,
    projectsInProgress,
  };
};
