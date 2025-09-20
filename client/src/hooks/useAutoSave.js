import { useEffect } from 'react';
import { debounce } from 'lodash';

const useAutoSave = (code, projectId, updateProject) => {
  useEffect(() => {
    if (!projectId) return;

    const save = debounce(async () => {
      try {
        await updateProject(projectId, code);
        console.log('Project auto-saved!');
      } catch (err) {
        console.error('Failed to auto-save:', err);
      }
    }, 1000);

    save();

    return () => save.cancel();
  }, [code, projectId, updateProject]);
};

export default useAutoSave;
