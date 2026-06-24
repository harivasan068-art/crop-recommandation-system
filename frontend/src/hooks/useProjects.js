import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { projectAPI } from '../services';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../utils/helpers';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess, showError } = useToast();

  const search = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || '';

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const response = await projectAPI.getAll(params);
      setProjects(response.data.data.projects);
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, showError]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const updateFilters = (newSearch, newStatus) => {
    const params = {};
    if (newSearch) params.search = newSearch;
    if (newStatus) params.status = newStatus;
    setSearchParams(params);
  };

  const createProject = async (data) => {
    const response = await projectAPI.create(data);
    showSuccess('Project created successfully');
    await fetchProjects();
    return response.data.data.project;
  };

  const updateProject = async (id, data) => {
    await projectAPI.update(id, data);
    showSuccess('Project updated successfully');
    await fetchProjects();
  };

  const deleteProject = async (id) => {
    await projectAPI.delete(id);
    showSuccess('Project deleted successfully');
    await fetchProjects();
  };

  return {
    projects,
    loading,
    search,
    statusFilter,
    updateFilters,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};
