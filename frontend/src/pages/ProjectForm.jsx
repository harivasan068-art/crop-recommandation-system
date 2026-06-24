import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { projectAPI } from '../services';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  getErrorMessage,
  formatDateForInput,
  PROJECT_STATUSES,
} from '../utils/helpers';

const ProjectForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    status: 'Not Started',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    const fetchProject = async () => {
      try {
        const response = await projectAPI.getById(id);
        const project = response.data.data.project;
        setFormData({
          projectName: project.projectName,
          description: project.description || '',
          status: project.status,
          startDate: formatDateForInput(project.startDate),
          endDate: formatDateForInput(project.endDate),
        });
      } catch (error) {
        showError(getErrorMessage(error));
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
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
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      };

      if (isEdit) {
        await projectAPI.update(id, payload);
        showSuccess('Project updated successfully');
      } else {
        await projectAPI.create(payload);
        showSuccess('Project created successfully');
      }
      navigate('/projects');
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading project..." />;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <div className="d-flex align-items-center mb-4">
          <Link to="/projects" className="btn btn-outline-secondary btn-sm me-3">
            ← Back
          </Link>
          <h1 className="h3 mb-0">{isEdit ? 'Edit Project' : 'New Project'}</h1>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="projectName" className="form-label">
                  Project Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
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
                  {PROJECT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="startDate" className="form-label">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="endDate" className="form-label">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
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
                    'Update Project'
                  ) : (
                    'Create Project'
                  )}
                </button>
                <Link to="/projects" className="btn btn-outline-secondary">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
