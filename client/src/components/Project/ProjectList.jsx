import { useEffect, useState } from 'react';
import { Plus, Folder, Code, Trash2, Edit3 } from 'lucide-react';
import { useProject } from '../../contexts/ProjectContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProjectList = () => {
  const { projects, fetchProjects, createProject, deleteProject, setCurrentProject } = useProject();
  // eslint-disable-next-line no-unused-vars
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async () => {
    setLoading(true);
    const result = await createProject({
      title: 'Untitled Project',
      html: '<h1>Hello World</h1>',
      css: 'body { margin: 0; padding: 20px; }',
      js: 'console.log("Hello from CodePen+");'
    });

    if (result.success) {
      setCurrentProject(result.data);
      toast.success('Project created!');
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const handleDeleteProject = async (projectId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      const result = await deleteProject(projectId);
      if (result.success) {
        toast.success('Project deleted');
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <div className="p-4 h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Projects</h2>
        <button
          onClick={handleCreateProject}
          disabled={loading}
          className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2">
        {projects.map((project) => (
          <div
            key={project._id}
            onClick={() => setCurrentProject(project)}
            className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Code className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <button
                onClick={(e) => handleDeleteProject(project._id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-600 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No projects yet</p>
            <p className="text-sm">Create your first project to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
