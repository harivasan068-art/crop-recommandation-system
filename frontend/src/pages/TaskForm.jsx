import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { taskAPI, projectAPI } from '../services';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  getErrorMessage,
  formatDateForInput,
  TASK_STATUSES,
  TASK_PRIORITIES,
} from '../utils/helpers';

const TaskForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    taskName: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
    projectId: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsRes = await projectAPI.getAll();
        setProjects(projectsRes.data.data.projects);

        if (isEdit) {
          const taskRes = await taskAPI.getById(id);
          const task = taskRes.data.data.task;
          setFormData({
            taskName: task.taskName,
            description: task.description || '',
            priority: task.priority,
            status: task.status,
            dueDate: formatDateForInput(task.dueDate),
            projectId: String(task.projectId),
          });
        }
      } catch (error) {
        showError(getErrorMessage(error));
        navigate('/tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEdit, navigate, showError]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        projectId: parseInt(formData.projectId, 10),
        dueDate: formData.dueDate || null,
      };

      if (isEdit) {
        await taskAPI.update(id, payload);
        showSuccess('Task updated successfully');
      } else {
        await taskAPI.create(payload);
        showSuccess('Task created successfully');
      }
      navigate('/tasks');
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading..." />;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="d-flex align-items-center mb-4">
          <Link to="/tasks" className="btn btn-outline-secondary btn-sm me-3">
            ← Back
          </Link>
          <h1 className="h3 mb-0">{isEdit ? 'Edit Task' : 'New Task'}</h1>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            {projects.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted mb-3">
                  You need at least one project before creating a task.
                </p>
                <Link to="/projects/new" className="btn btn-primary">
                  Create a Project
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="taskName" className="form-label">
                    Task Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="taskName"
                    name="taskName"
                    value={formData.taskName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="projectId" className="form-label">
                    Project <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="projectId"
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.projectName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="priority" className="form-label">
                      Priority
                    </label>
                    <select
                      className="form-select"
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      {TASK_PRIORITIES.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      {TASK_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="dueDate" className="form-label">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Saving...
                      </>
                    ) : isEdit ? (
                      'Update Task'
                    ) : (
                      'Create Task'
                    )}
                  </button>
                  <Link to="/tasks" className="btn btn-outline-secondary">
                    Cancel
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
