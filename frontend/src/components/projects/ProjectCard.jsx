import StatusBadge from './StatusBadge';
import {
  FolderKanban,
  Calendar,
  CalendarCheck,
  Eye,
  Pencil,
  Trash2,
  CheckSquare,
} from 'lucide-react';
import { formatDate, calculateProjectProgress } from '../../utils/helpers';

const getProgressVariant = (progress, status) => {
  if (progress === 100 || status === 'Completed') return 'success';
  if (progress > 0 || status === 'In Progress') return 'primary';
  return 'warning';
};

const ProjectCard = ({ project, tasks = [], onView, onEdit, onDelete, index = 0 }) => {
  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const progress = calculateProjectProgress({ ...project, tasks: projectTasks });
  const progressVariant = getProgressVariant(progress, project.status);
  const completedTasks = projectTasks.filter((t) => t.status === 'Completed').length;

  return (
    <article
      className="project-card"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="project-card-glow" aria-hidden="true" />
      <div className="project-card-inner">
        <div className="project-card-accent" data-status={project.status} />

        <div className="project-card-body">
          <div className="project-card-header">
            <div
              className="project-card-icon"
              data-status={project.status}
            >
              <FolderKanban size={20} />
            </div>
            <div className="project-card-title-wrap">
              <h3 className="project-card-title">{project.projectName}</h3>
              <div className="project-card-meta-row">
                <span>{projectTasks.length} task{projectTasks.length !== 1 ? 's' : ''}</span>
                {completedTasks > 0 && (
                  <>
                    <span>·</span>
                    <span>{completedTasks} done</span>
                  </>
                )}
              </div>
            </div>
            <StatusBadge status={project.status} />
          </div>

          <p className="project-card-description">
            {project.description || 'No description provided for this project.'}
          </p>

          <div className="project-card-dates">
            <span className="project-date-chip">
              <Calendar size={13} />
              Start {formatDate(project.startDate)}
            </span>
            <span className="project-date-chip">
              <CalendarCheck size={13} />
              End {formatDate(project.endDate)}
            </span>
          </div>

          <div className="project-card-progress">
            <div className="project-card-progress-header">
              <span className="project-card-progress-label">Progress</span>
              <span className="project-card-progress-value">{progress}%</span>
            </div>
            <div className="project-progress-bar">
              <div
                className={`project-progress-fill ${progressVariant}`}
                style={{ width: `${progress}%`, animationDelay: `${index * 80 + 200}ms` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="project-card-stats">
              <span className="project-card-stat">
                <CheckSquare size={11} />
                {completedTasks}/{projectTasks.length} completed
              </span>
            </div>
          </div>

          <div className="project-card-footer">
            <span className="project-card-task-count">
              <CheckSquare size={13} />
              {project._count?.tasks ?? projectTasks.length} tasks
            </span>
            <div className="project-card-actions">
              <button
                type="button"
                className="project-action-btn"
                onClick={() => onView(project)}
              >
                <Eye size={14} />
                View
              </button>
              <button
                type="button"
                className="project-action-btn"
                onClick={() => onEdit(project)}
              >
                <Pencil size={14} />
                Edit
              </button>
              <button
                type="button"
                className="project-action-btn danger"
                onClick={() => onDelete(project)}
                aria-label="Delete project"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
