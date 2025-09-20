import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get('/projects');
      setProjects(response.data.data);
    } catch (err) {
      console.error('Fetch projects error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      setProjects(prev => [response.data.data, ...prev]);
      setCurrentProject(response.data.data);
      return { success: true, data: response.data.data };
    } catch (err) {
      console.error('Create project error:', err.response?.data);
      return { success: false, error: err.response?.data?.error || 'Failed to create project' };
    }
  };

  const updateProject = async (id, updates) => {
    if (!id) return;
    try {
      const response = await api.put(`/projects/${id}`, {
        html: updates.html,
        css: updates.css,
        js: updates.js
      });

      setProjects(prev => prev.map(p => p._id === id ? response.data.data : p));
      if (currentProject?._id === id) setCurrentProject(response.data.data);

      return { success: true };
    } catch (err) {
      console.error('Update project error:', err.response?.data || err);
      return { success: false, error: err.response?.data?.error || 'Failed to update project' };
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
      if (currentProject?._id === id) setCurrentProject(null);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Failed to delete project' };
    }
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      loading,
      fetchProjects,
      createProject,
      updateProject,
      deleteProject,
      setCurrentProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
