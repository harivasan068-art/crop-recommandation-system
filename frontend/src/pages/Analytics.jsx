import { useDashboard } from '../hooks/useDashboard';
import {
  TaskStatusChart,
  ProjectProgressChart,
  WeeklyActivityChart,
} from '../components/charts/ChartComponents';
import { SkeletonCard } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { BarChart3 } from 'lucide-react';

const Analytics = () => {
  const { projects, tasks, loading } = useDashboard();

  if (loading) {
    return (
      <div className="grid-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (projects.length === 0 && tasks.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No data to analyze"
        description="Create projects and tasks to see analytics and insights."
      />
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Visual insights into your project performance</p>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.25rem' }}>
        <div className="card chart-card">
          <h3 className="chart-card-title">Task Status Distribution</h3>
          <p className="chart-card-subtitle">Breakdown by current status</p>
          <div className="chart-container">
            <TaskStatusChart tasks={tasks} />
          </div>
        </div>

        <div className="card chart-card chart-span-2">
          <h3 className="chart-card-title">Project Progress</h3>
          <p className="chart-card-subtitle">Completion percentage per project</p>
          <div className="chart-container">
            <ProjectProgressChart projects={projects} tasks={tasks} />
          </div>
        </div>
      </div>

      <div className="card chart-card">
        <h3 className="chart-card-title">Weekly Activity</h3>
        <p className="chart-card-subtitle">Tasks created this week</p>
        <div className="chart-container">
          <WeeklyActivityChart tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
