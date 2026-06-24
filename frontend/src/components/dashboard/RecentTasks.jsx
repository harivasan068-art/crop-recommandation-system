import { Link } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatDate, getStatusVariant } from '../../utils/helpers';

const RecentTasks = ({ tasks }) => {
  const recent = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="dashboard-panel" style={{ animationDelay: '300ms' }}>
      <div className="dashboard-panel-header">
        <div>
          <h3 className="dashboard-panel-title">Recent Tasks</h3>
          <p className="dashboard-panel-subtitle">Latest activity across projects</p>
        </div>
        <Link to="/tasks" className="dashboard-panel-link">View all</Link>
      </div>
      <div className="dashboard-panel-body" style={{ paddingTop: 0, paddingBottom: 0 }}>
        {recent.length === 0 ? (
          <div className="dashboard-empty-recent">No tasks yet. Create your first task!</div>
        ) : (
          <div className="dashboard-recent-list">
            {recent.map((task) => (
              <Link
                key={task.id}
                to="/tasks"
                className="dashboard-recent-item"
              >
                <div className="dashboard-recent-icon task">
                  <CheckSquare size={16} />
                </div>
                <div className="dashboard-recent-info">
                  <div className="dashboard-recent-name">{task.taskName}</div>
                  <div className="dashboard-recent-meta">
                    {task.project?.projectName || 'No project'} · Due {formatDate(task.dueDate)}
                  </div>
                </div>
                <div className="dashboard-recent-badge">
                  <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentTasks;
