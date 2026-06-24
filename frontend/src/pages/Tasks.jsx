import { useState, useEffect } from 'react';
import { Search, LayoutGrid, List, Pencil, Trash2, CheckCircle } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { projectAPI } from '../services';
import { TASK_STATUSES, TASK_PRIORITIES, formatDate, getStatusVariant } from '../utils/helpers';
import { getErrorMessage } from '../utils/helpers';
import { useToast } from '../context/ToastContext';
import TaskModal from '../components/tasks/TaskModal';
import KanbanBoard from '../components/tasks/KanbanBoard';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import FloatingActionButton from '../components/ui/FloatingActionButton';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { SkeletonTable } from '../components/ui/Skeleton';

const Tasks = () => {
  const {
    tasks,
    loading,
    search,
    statusFilter,
    priorityFilter,
    projectId,
    updateFilters,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  } = useTasks();

  const [searchInput, setSearchInput] = useState(search);
  const [statusInput, setStatusInput] = useState(statusFilter);
  const [priorityInput, setPriorityInput] = useState(priorityFilter);
  const [view, setView] = useState('kanban');
  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { showError } = useToast();

  useEffect(() => {
    projectAPI.getAll().then((res) => {
      setProjects(res.data.data.projects);
    }).catch((err) => showError(getErrorMessage(err)));
  }, [showError]);

  useEffect(() => {
    setSearchInput(search);
    setStatusInput(statusFilter);
    setPriorityInput(priorityFilter);
  }, [search, statusFilter, priorityFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({
      search: searchInput,
      status: statusInput,
      priority: priorityInput,
      projectId,
    });
  };

  const handleCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
      } else {
        await createTask(data);
      }
      setModalOpen(false);
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await deleteTask(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title">Tasks</h1>
            <p className="page-subtitle">Organize and track your work</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div className="view-toggle">
              <button
                className={`view-toggle-btn ${view === 'kanban' ? 'active' : ''}`}
                onClick={() => setView('kanban')}
              >
                <LayoutGrid size={16} /> Kanban
              </button>
              <button
                className={`view-toggle-btn ${view === 'table' ? 'active' : ''}`}
                onClick={() => setView('table')}
              >
                <List size={16} /> Table
              </button>
            </div>
            <Button onClick={handleCreate}>+ Add Task</Button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <form className="filter-bar" onSubmit={handleSearch}>
          <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.25rem', width: '100%' }}
              placeholder="Search tasks..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <select className="form-select" value={statusInput} onChange={(e) => setStatusInput(e.target.value)}>
            <option value="">All Statuses</option>
            {TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="form-select" value={priorityInput} onChange={(e) => setPriorityInput(e.target.value)}>
            <option value="">All Priorities</option>
            {TASK_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <Button type="submit" variant="secondary">Filter</Button>
        </form>
      </div>

      {loading ? (
        <SkeletonTable rows={6} />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={List}
          title="No tasks found"
          description="Create your first task to get started."
          action={<Button onClick={handleCreate}>Create Task</Button>}
        />
      ) : view === 'kanban' ? (
        <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} />
      ) : (
        <div className="card">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{task.taskName}</div>
                      {task.description && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {task.description}
                        </div>
                      )}
                    </td>
                    <td>{task.project?.projectName || '—'}</td>
                    <td><Badge variant={getStatusVariant(task.priority)}>{task.priority}</Badge></td>
                    <td><Badge variant={getStatusVariant(task.status)}>{task.status}</Badge></td>
                    <td>{formatDate(task.dueDate)}</td>
                    <td>
                      <div className="table-actions">
                        {task.status !== 'Completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusChange(task.id, 'Completed')}
                            title="Mark complete"
                          >
                            <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(task)}>
                          <Pencil size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(task)}>
                          <Trash2 size={16} style={{ color: 'var(--color-danger)' }} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <FloatingActionButton onClick={handleCreate} label="Create Task" />

      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        task={editingTask}
        projects={projects}
        loading={submitting}
        defaultProjectId={projectId}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTarget?.taskName}"?`}
        confirmText="Delete"
        loading={submitting}
      />
    </div>
  );
};

export default Tasks;
