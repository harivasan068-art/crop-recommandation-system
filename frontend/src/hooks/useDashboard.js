import { useState, useEffect } from 'react';
import { dashboardAPI, projectAPI, taskAPI } from '../services';
import { useToast } from '../context/ToastContext';
import { getErrorMessage } from '../utils/helpers';

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, projectsRes, tasksRes] = await Promise.all([
          dashboardAPI.getStats(),
          projectAPI.getAll(),
          taskAPI.getAll(),
        ]);
        setStats(statsRes.data.data);
        setProjects(projectsRes.data.data.projects);
        setTasks(tasksRes.data.data.tasks);
      } catch (error) {
        showError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showError]);

  return { stats, projects, tasks, loading };
};
