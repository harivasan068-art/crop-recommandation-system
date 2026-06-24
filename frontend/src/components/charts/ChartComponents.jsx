import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler
);

const chartColors = {
  primary: '#2563EB',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  secondary: '#64748B',
};

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { padding: 16, usePointStyle: true, font: { family: 'Inter', size: 12 } },
    },
  },
};

export const TaskStatusChart = ({ tasks }) => {
  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;

  const data = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [pending, inProgress, completed],
        backgroundColor: [chartColors.warning, chartColors.primary, chartColors.success],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  return <Pie data={data} options={defaultOptions} />;
};

export const ProjectProgressChart = ({ projects, tasks }) => {
  const labels = projects.slice(0, 8).map((p) =>
    p.projectName.length > 15 ? p.projectName.slice(0, 15) + '…' : p.projectName
  );

  const progressData = projects.slice(0, 8).map((project) => {
    const projectTasks = tasks.filter((t) => t.projectId === project.id);
    if (projectTasks.length === 0) {
      if (project.status === 'Completed') return 100;
      if (project.status === 'In Progress') return 50;
      return 0;
    }
    const completed = projectTasks.filter((t) => t.status === 'Completed').length;
    return Math.round((completed / projectTasks.length) * 100);
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Progress %',
        data: progressData,
        backgroundColor: chartColors.primary,
        borderRadius: 6,
        barThickness: 24,
      },
    ],
  };

  const options = {
    ...defaultOptions,
    indexAxis: 'y',
    plugins: { ...defaultOptions.plugins, legend: { display: false } },
    scales: {
      x: { max: 100, grid: { color: '#f1f5f9' }, ticks: { callback: (v) => v + '%' } },
      y: { grid: { display: false } },
    },
  };

  return <Bar data={data} options={options} />;
};

export const WeeklyActivityChart = ({ tasks }) => {
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

  const data = {
    labels: days,
    datasets: [
      {
        label: 'Tasks Created',
        data: counts,
        borderColor: chartColors.primary,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: chartColors.primary,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    ...defaultOptions,
    plugins: { ...defaultOptions.plugins, legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: '#f1f5f9' } },
      x: { grid: { display: false } },
    },
  };

  return <Line data={data} options={options} />;
};
