import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpDown, FolderOpen } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { taskAPI } from '../services';
import { usePagination } from '../hooks/usePagination';
import { PROJECT_STATUSES } from '../utils/helpers';
import { getErrorMessage } from '../utils/helpers';
import { useToast } from '../context/ToastContext';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectCardSkeleton from '../components/projects/ProjectCardSkeleton';
import ProjectModal from '../components/projects/ProjectModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import FloatingActionButton from '../components/ui/FloatingActionButton';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';

const Projects = () => {
  const {
    projects,
    loading,
    search,
    statusFilter,
    updateFilters,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects();

  const [searchInput, setSearchInput] = useState(search);
  const [statusInput, setStatusInput] = useState(statusFilter);

  useEffect(() => {
    setSearchInput(search);
    setStatusInput(statusFilter);
  }, [search, statusFilter]);

  const [sortField, setSortField] = useState('projectName');
  const [sortDir, setSortDir] = useState('asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const { showError } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    taskAPI.getAll().then((res) => {
      setAllTasks(res.data.data.tasks);
    }).catch((err) => showError(getErrorMessage(err)));
  }, [showError]);

  const summary = useMemo(() => ({
    total: projects.length,
    inProgress: projects.filter((p) => p.status === 'In Progress').length,
    completed: projects.filter((p) => p.status === 'Completed').length,
    notStarted: projects.filter((p) => p.status === 'Not Started').length,
  }), [projects]);

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';
      if (sortField === 'startDate' || sortField === 'endDate') {
        aVal = aVal ? new Date(aVal) : new Date(0);
        bVal = bVal ? new Date(bVal) : new Date(0);
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [projects, sortField, sortDir]);

  const { currentPage, totalPages, paginatedItems, goToPage, totalItems, itemsPerPage } =
    usePagination(sortedProjects, 6);

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters(searchInput, statusInput);
    goToPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleCreate = () => {
    setEditingProject(null);
    setModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleView = (project) => {
    navigate(`/tasks?projectId=${project.id}`);
  };

  const handleModalSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, data);
      } else {
        await createProject(data);
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
      await deleteProject(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="projects-page animate-fade-in">
      <div className="page-header">
        <div className="page-header-top">
          <div>
            <h1 className="page-title">Projects</h1>
            <p className="page-subtitle">Manage and track all your projects</p>
          </div>
          <Button onClick={handleCreate}>+ Add Project</Button>
        </div>
      </div>

      {!loading && projects.length > 0 && (
        <div className="projects-summary">
          <div className="projects-summary-pill">
            <span className="projects-summary-dot all" />
            <span><strong>{summary.total}</strong> Total</span>
          </div>
          <div className="projects-summary-pill">
            <span className="projects-summary-dot progress" />
            <span><strong>{summary.inProgress}</strong> In Progress</span>
          </div>
          <div className="projects-summary-pill">
            <span className="projects-summary-dot done" />
            <span><strong>{summary.completed}</strong> Completed</span>
          </div>
          <div className="projects-summary-pill">
            <span className="projects-summary-dot pending" />
            <span><strong>{summary.notStarted}</strong> Not Started</span>
          </div>
        </div>
      )}

      <div className="projects-filter-glass">
        <form className="filter-bar" onSubmit={handleSearch}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.25rem', width: '100%' }}
              placeholder="Search projects..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <select
            className="form-select"
            value={statusInput}
            onChange={(e) => setStatusInput(e.target.value)}
          >
            <option value="">All Statuses</option>
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <Button type="submit" variant="secondary">Search</Button>
          <Button type="button" variant="ghost" onClick={() => handleSort('projectName')}>
            <ArrowUpDown size={16} />
            Sort {sortDir === 'asc' ? '↑' : '↓'}
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="project-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} index={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No projects found"
          description="Get started by creating your first project."
          action={<Button onClick={handleCreate}>Create Project</Button>}
        />
      ) : (
        <>
          <div className="project-grid">
            {paginatedItems.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                tasks={allTasks}
                index={index}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
          <div className="projects-pagination-glass">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={goToPage}
            />
          </div>
        </>
      )}

      <FloatingActionButton onClick={handleCreate} label="Create Project" />

      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        project={editingProject}
        loading={submitting}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.projectName}"? This will also delete all associated tasks.`}
        confirmText="Delete"
        loading={submitting}
      />
    </div>
  );
};

export default Projects;
