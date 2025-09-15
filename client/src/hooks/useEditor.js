import { useState, useCallback } from 'react';
import { debounce } from '../utils/helpers';

const useEditor = (initialCode = { html: '', css: '', js: '' }) => {
  const [code, setCode] = useState(initialCode);
  const [isDirty, setIsDirty] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateCode = useCallback(
    debounce((language, value) => {
      setCode(prev => {
        const newCode = { ...prev, [language]: value };
        setIsDirty(true);
        return newCode;
      });
    }, 300),
    []
  );

  const resetDirty = () => setIsDirty(false);

  return {
    code,
    updateCode,
    isDirty,
    resetDirty,
    setCode
  };
};

export default useEditor;
