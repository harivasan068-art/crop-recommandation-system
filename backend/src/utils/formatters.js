export const PROJECT_STATUSES = ['Not Started', 'In Progress', 'Completed'];
export const TASK_STATUSES = ['Pending', 'In Progress', 'Completed'];
export const TASK_PRIORITIES = ['Low', 'Medium', 'High'];

export const mapProjectStatusToPrisma = (status) => {
  const map = {
    'Not Started': 'Not_Started',
    'In Progress': 'In_Progress',
    Completed: 'Completed',
  };
  return map[status] || status;
};

export const mapProjectStatusFromPrisma = (status) => {
  const map = {
    Not_Started: 'Not Started',
    In_Progress: 'In Progress',
    Completed: 'Completed',
  };
  return map[status] || status;
};

export const mapTaskStatusToPrisma = (status) => {
  const map = {
    Pending: 'Pending',
    'In Progress': 'In_Progress',
    Completed: 'Completed',
  };
  return map[status] || status;
};

export const mapTaskStatusFromPrisma = (status) => {
  const map = {
    Pending: 'Pending',
    In_Progress: 'In Progress',
    Completed: 'Completed',
  };
  return map[status] || status;
};

export const formatUser = (user) => ({
  id: user.id,
  fullName: user.fullName,
  email: user.email,
  createdAt: user.createdAt,
});

export const formatProject = (project) => ({
  id: project.id,
  projectName: project.projectName,
  description: project.description,
  status: mapProjectStatusFromPrisma(project.status),
  startDate: project.startDate,
  endDate: project.endDate,
  createdAt: project.createdAt,
  userId: project.userId,
  tasks: project.tasks
    ? project.tasks.map(formatTask)
    : undefined,
  _count: project._count,
});

export const formatTask = (task) => ({
  id: task.id,
  taskName: task.taskName,
  description: task.description,
  priority: task.priority,
  status: mapTaskStatusFromPrisma(task.status),
  dueDate: task.dueDate,
  createdAt: task.createdAt,
  projectId: task.projectId,
  project: task.project
    ? {
        id: task.project.id,
        projectName: task.project.projectName,
      }
    : undefined,
});
