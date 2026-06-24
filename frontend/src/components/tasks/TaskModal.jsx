import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { TASK_STATUSES, TASK_PRIORITIES, formatDateForInput } from '../../utils/helpers';

const emptyForm = {
  taskName: '',
  description: '',
  priority: 'Medium',
  status: 'Pending',
  dueDate: '',
  projectId: '',
};

const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  task = null,
  projects = [],
  loading = false,
  defaultProjectId = '',
}) => {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        taskName: task.taskName || '',
        description: task.description || '',
        priority: task.priority || 'Medium',
        status: task.status || 'Pending',
        dueDate: formatDateForInput(task.dueDate),
        projectId: String(task.projectId || ''),
      });
    } else {
      setFormData({ ...emptyForm, projectId: defaultProjectId || '' });
    }
    setErrors({});
  }, [task, isOpen, defaultProjectId]);

  const validate = () => {
    const newErrors = {};
    if (!formData.taskName.trim()) newErrors.taskName = 'Task name is required';
    if (!formData.projectId) newErrors.projectId = 'Please select a project';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      projectId: parseInt(formData.projectId, 10),
      dueDate: formData.dueDate || null,
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
      title={task ? 'Edit Task' : 'Create Task'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </>
      }
    >
      {projects.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '1rem' }}>
          You need at least one project before creating a task.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="taskName">
              Task Name <span className="required">*</span>
            </label>
            <input
              id="taskName"
              name="taskName"
              className={`form-input ${errors.taskName ? 'error' : ''}`}
              value={formData.taskName}
              onChange={handleChange}
              placeholder="Enter task name"
            />
            {errors.taskName && <p className="form-error">{errors.taskName}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="projectId">
              Project <span className="required">*</span>
            </label>
            <select
              id="projectId"
              name="projectId"
              className={`form-select ${errors.projectId ? 'error' : ''}`}
              value={formData.projectId}
              onChange={handleChange}
            >
              <option value="">Select a project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.projectName}</option>
              ))}
            </select>
            {errors.projectId && <p className="form-error">{errors.projectId}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="priority">Priority</label>
              <select id="priority" name="priority" className="form-select" value={formData.priority} onChange={handleChange}>
                {TASK_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="status">Status</label>
              <select id="status" name="status" className="form-select" value={formData.status} onChange={handleChange}>
                {TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="dueDate">Due Date</label>
              <input type="date" id="dueDate" name="dueDate" className="form-input" value={formData.dueDate} onChange={handleChange} />
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default TaskModal;
