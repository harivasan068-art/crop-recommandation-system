import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { PROJECT_STATUSES } from '../../utils/helpers';
import { formatDateForInput } from '../../utils/helpers';

const emptyForm = {
  projectName: '',
  description: '',
  status: 'Not Started',
  startDate: '',
  endDate: '',
};

const ProjectModal = ({ isOpen, onClose, onSubmit, project = null, loading = false }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        projectName: project.projectName || '',
        description: project.description || '',
        status: project.status || 'Not Started',
        startDate: formatDateForInput(project.startDate),
        endDate: formatDateForInput(project.endDate),
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
  }, [project, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.projectName.trim()) newErrors.projectName = 'Project name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Create Project'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {project ? 'Update Project' : 'Create Project'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="projectName">
            Project Name <span className="required">*</span>
          </label>
          <input
            id="projectName"
            name="projectName"
            className={`form-input ${errors.projectName ? 'error' : ''}`}
            value={formData.projectName}
            onChange={handleChange}
            placeholder="Enter project name"
          />
          {errors.projectName && <p className="form-error">{errors.projectName}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-textarea"
            value={formData.description}
            onChange={handleChange}
            placeholder="Project description"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            className="form-select"
            value={formData.status}
            onChange={handleChange}
          >
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="form-input"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              className="form-input"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;
