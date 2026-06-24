import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, FolderKanban, CheckSquare, Target, Clock, Rocket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { formatFullDate } from '../utils/helpers';
import {
  ProjectProgressChart,
  WeeklyActivityChart,
} from '../components/charts/ChartComponents';
import StatCard from '../components/dashboard/StatCard';
import RecentTasks from '../components/dashboard/RecentTasks';
import RecentProjects from '../components/dashboard/RecentProjects';
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton';

const CompletionWidget = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (rate / 100) * circumference;

  const pending = tasks.filter((t) => t.status === 'Pending').length;
  const inProgress = tasks.filter((t) => t.status === 'In Progress').length;

  return (
    <div className="dashboard-panel" style={{ animationDelay: '200ms' }}>
      <div className="dashboard-panel-header">
        <div>
          <h3 className="dashboard-panel-title">Task Overview</h3>
          <p className="dashboard-panel-subtitle">Completion & status breakdown</p>
        </div>
        <Link to="/analytics" className="dashboard-panel-link">Analytics</Link>
      </div>
      <div className="dashboard-panel-body">
        <div className="dashboard-completion">
          <div className="dashboard-completion-ring">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle className="dashboard-completion-ring-bg" cx="60" cy="60" r="52" />
              <circle
                className="dashboard-completion-ring-fill"
                cx="60"
                cy="60"
                r="52"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="dashboard-completion-value">
              <strong>{rate}%</strong>
              <span>Complete</span>
            </div>
          </div>

          <div className="dashboard-completion-stats">
            <div className="dashboard-completion-stat">
              <strong>{completed}</strong>
              <span>Completed</span>
            </div>
            <div className="dashboard-completion-stat">
              <strong>{total - completed}</strong>
              <span>Remaining</span>
            </div>
          </div>
        </div>

        <div className="dashboard-status-legend">
          <div className="dashboard-status-item">
            <span className="dashboard-status-item-left">
              <span className="dashboard-status-dot pending" />
              Pending
            </span>
            <span className="dashboard-status-count">{pending}</span>
          </div>
          <div className="dashboard-status-item">
            <span className="dashboard-status-item-left">
              <span className="dashboard-status-dot progress" />
              In Progress
            </span>
            <span className="dashboard-status-count">{inProgress}</span>
          </div>
          <div className="dashboard-status-item">
            <span className="dashboard-status-item-left">
              <span className="dashboard-status-dot completed" />
              Completed
            </span>
            <span className="dashboard-status-count">{completed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, projects, tasks, loading } = useDashboard();

  const statCards = useMemo(() => [
    { title: 'Total Projects', value: stats?.totalProjects ?? 0, icon: FolderKanban, variant: 'primary', trend: 12, link: '/projects' },
    { title: 'Total Tasks', value: stats?.totalTasks ?? 0, icon: CheckSquare, variant: 'info', trend: 8, link: '/tasks' },
    { title: 'Completed', value: stats?.completedTasks ?? 0, icon: Target, variant: 'success', trend: 15, link: '/tasks?status=Completed' },
    { title: 'Pending', value: stats?.pendingTasks ?? 0, icon: Clock, variant: 'warning', trend: -3, link: '/tasks?status=Pending' },
    { title: 'In Progress', value: stats?.projectsInProgress ?? 0, icon: Rocket, variant: 'danger', trend: 5, link: '/projects?status=In Progress' },
  ], [stats]);

  if (loading) return <DashboardSkeleton />;

  const firstName = user?.fullName?.split(' ')[0] || 'there';

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="dashboard-hero">
        <div className="dashboard-hero-content">
          <p className="dashboard-hero-greeting">Dashboard</p>
          <h2>Good to see you, {firstName} 👋</h2>
          <p>Track progress, manage tasks, and stay on top of your projects.</p>
        </div>
        <div className="dashboard-hero-right">
          <div className="dashboard-hero-date">
            <Calendar size={15} />
            {formatFullDate()}
          </div>
          <div className="dashboard-hero-actions">
            <Link to="/projects" className="dashboard-hero-btn primary">
              <Plus size={15} /> New Project
            </Link>
            <Link to="/tasks" className="dashboard-hero-btn ghost">
              <Plus size={15} /> New Task
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard-stats">
        {statCards.map((card, index) => (
          <StatCard key={card.title} {...card} index={index} />
        ))}
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-charts-left">
          <div className="dashboard-panel" style={{ animationDelay: '150ms' }}>
            <div className="dashboard-panel-header">
              <div>
                <h3 className="dashboard-panel-title">Weekly Activity</h3>
                <p className="dashboard-panel-subtitle">Tasks created this week</p>
              </div>
              <Link to="/analytics" className="dashboard-panel-link">Full report</Link>
            </div>
            <div className="dashboard-panel-body">
              <div className="dashboard-chart-wrap">
                <WeeklyActivityChart tasks={tasks} />
              </div>
            </div>
          </div>

          <div className="dashboard-panel" style={{ animationDelay: '200ms' }}>
            <div className="dashboard-panel-header">
              <div>
                <h3 className="dashboard-panel-title">Project Progress</h3>
                <p className="dashboard-panel-subtitle">Completion by project</p>
              </div>
              <Link to="/projects" className="dashboard-panel-link">All projects</Link>
            </div>
            <div className="dashboard-panel-body">
              <div className="dashboard-chart-wrap">
                {projects.length > 0 ? (
                  <ProjectProgressChart projects={projects} tasks={tasks} />
                ) : (
                  <div className="dashboard-empty-recent">No projects to display</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <CompletionWidget tasks={tasks} />
      </div>

      <div className="dashboard-bottom-grid">
        <RecentTasks tasks={tasks} />
        <RecentProjects projects={projects} tasks={tasks} />
      </div>
    </div>
  );
};

export default Dashboard;
