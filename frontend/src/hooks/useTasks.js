import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { taskAPI } from '../services';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../utils/helpers';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess, showError } = useToast();

  const search = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || '';
  const priorityFilter = searchParams.get('priority') || '';
  const projectId = searchParams.get('projectId') || '';

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (projectId) params.projectId = projectId;
      const response = await taskAPI.getAll(params);
      setTasks(response.data.data.tasks);
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, projectId, showError]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const updateFilters = (filters) => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.projectId) params.projectId = filters.projectId;
    setSearchParams(params);
  };

  const createTask = async (data) => {
    const response = await taskAPI.create(data);
    showSuccess('Task created successfully');
    await fetchTasks();
    return response.data.data.task;
  };

  const updateTask = async (id, data) => {
    await taskAPI.update(id, data);
    showSuccess('Task updated successfully');
    await fetchTasks();
  };

  const deleteTask = async (id) => {
    await taskAPI.delete(id);
    showSuccess('Task deleted successfully');
    await fetchTasks();
  };

  const updateTaskStatus = async (id, status) => {
    await taskAPI.update(id, { status });
    showSuccess('Task status updated');
    await fetchTasks();
  };

  return {
    tasks,
    loading,
    search,
    statusFilter,
    priorityFilter,
    projectId,
    updateFilters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  };
};
