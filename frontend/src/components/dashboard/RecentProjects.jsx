import { Link } from 'react-router-dom';
import { FolderKanban } from 'lucide-react';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import { formatDate, getStatusVariant, calculateProjectProgress } from '../../utils/helpers';

const RecentProjects = ({ projects, tasks }) => {
  const recent = [...projects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="dashboard-panel" style={{ animationDelay: '350ms' }}>
      <div className="dashboard-panel-header">
        <div>
          <h3 className="dashboard-panel-title">Recent Projects</h3>
          <p className="dashboard-panel-subtitle">Your latest project updates</p>
        </div>
        <Link to="/projects" className="dashboard-panel-link">View all</Link>
      </div>
      <div className="dashboard-panel-body" style={{ paddingTop: 0, paddingBottom: 0 }}>
        {recent.length === 0 ? (
          <div className="dashboard-empty-recent">No projects yet. Create your first project!</div>
        ) : (
          <div className="dashboard-recent-list">
            {recent.map((project) => {
              const projectTasks = tasks.filter((t) => t.projectId === project.id);
              const progress = calculateProjectProgress({ ...project, tasks: projectTasks });

              return (
                <Link
                  key={project.id}
                  to={`/tasks?projectId=${project.id}`}
                  className="dashboard-recent-item"
                >
                  <div className="dashboard-recent-icon">
                    <FolderKanban size={16} />
                  </div>
                  <div className="dashboard-recent-info">
                    <div className="dashboard-recent-name">{project.projectName}</div>
                    <div className="dashboard-recent-meta">
                      {formatDate(project.startDate)} – {formatDate(project.endDate)}
                    </div>
                    <div style={{ marginTop: '0.375rem', maxWidth: '180px' }}>
                      <ProgressBar value={progress} variant={progress === 100 ? 'success' : 'primary'} />
                    </div>
                  </div>
                  <div className="dashboard-recent-badge">
                    <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentProjects;
