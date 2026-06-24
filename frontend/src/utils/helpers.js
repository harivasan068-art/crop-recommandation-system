export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};

export const formatFullDate = () => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const PROJECT_STATUSES = ['Not Started', 'In Progress', 'Completed'];
export const TASK_STATUSES = ['Pending', 'In Progress', 'Completed'];
export const TASK_PRIORITIES = ['Low', 'Medium', 'High'];

export const getStatusVariant = (status) => {
  const map = {
    'Not Started': 'secondary',
    'In Progress': 'primary',
    Completed: 'success',
    Pending: 'warning',
    Low: 'info',
    Medium: 'primary',
    High: 'danger',
  };
  return map[status] || 'secondary';
};

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'var(--color-danger)' };
  if (score <= 3) return { score: 2, label: 'Fair', color: 'var(--color-warning)' };
  if (score <= 4) return { score: 3, label: 'Good', color: 'var(--color-primary)' };
  return { score: 4, label: 'Strong', color: 'var(--color-success)' };
};

export const calculateProjectProgress = (project) => {
  const tasks = project.tasks || [];
  if (tasks.length === 0) {
    if (project.status === 'Completed') return 100;
    if (project.status === 'In Progress') return 50;
    return 0;
  }
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  return Math.round((completed / tasks.length) * 100);
};

export const getWeeklyActivity = (tasks) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const counts = Array(7).fill(0);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  tasks.forEach((task) => {
    const date = new Date(task.createdAt);
    if (date >= weekStart) {
      counts[date.getDay()]++;
    }
  });

  return { labels: days, data: counts };
};

export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
