import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { socketService } from '../../services/socket';

const CodeEditor = ({ language, value, onChange, projectId }) => {
  const editorRef = useRef();
  const timeoutRef = useRef();

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    
    socketService.onCodeUpdate((data) => {
      if (data.language === language && data.userId !== localStorage.getItem('userId')) {
        editor.setValue(data.changes);
      }
    });
  };

  const handleChange = (value) => {
    onChange(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (projectId) {
        socketService.emitCodeChange({
          projectId,
          changes: value,
          language
        });
      }
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={handleChange}
      onMount={handleEditorDidMount}
      theme="vs-dark"
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on'
      }}
    />
  );
};

export default CodeEditor;