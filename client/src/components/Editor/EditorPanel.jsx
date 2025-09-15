import { useState, useEffect } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import CodeEditor from './CodeEditor';
import PreviewFrame from '../Preview/PreviewFrame';
import EditorTabs from './EditorTabs';
import ConsoleOutput from '../Preview/ConsoleOutput';

const EditorPanel = () => {
  const { currentProject } = useProject();
  const [activeTab, setActiveTab] = useState('html');
  const [code, setCode] = useState({
    html: '',
    css: '',
    js: ''
  });
  const [consoleLogs, setConsoleLogs] = useState([]);

  useEffect(() => {
    if (currentProject) {
      setCode({
        html: currentProject.html || '<h1>Hello World</h1>',
        css: currentProject.css || 'body { padding: 20px; background: #f5f5f5; }',
        js: currentProject.js || 'console.log("Hello from CodePen+!");'
      });
      setConsoleLogs([]);
    }
  }, [currentProject]);

  const handleCodeChange = (language, value) => {
    setCode(prev => ({
      ...prev,
      [language]: value
    }));
  };

  const handleConsoleLog = (message) => {
    setConsoleLogs(prev => [...prev, message]);
  };

  const clearConsole = () => {
    setConsoleLogs([]);
  };

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p>Select or create a project to start coding</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex">
        {/* Editor Section */}
        <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700">
          <EditorTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="flex-1">
            {activeTab === 'html' && (
              <CodeEditor
                language="html"
                value={code.html}
                onChange={(value) => handleCodeChange('html', value)}
                projectId={currentProject._id}
              />
            )}
            {activeTab === 'css' && (
              <CodeEditor
                language="css"
                value={code.css}
                onChange={(value) => handleCodeChange('css', value)}
                projectId={currentProject._id}
              />
            )}
            {activeTab === 'js' && (
              <CodeEditor
                language="javascript"
                value={code.js}
                onChange={(value) => handleCodeChange('js', value)}
                projectId={currentProject._id}
              />
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
            <h3 className="font-medium text-gray-900 dark:text-white">Preview</h3>
            <button
              onClick={clearConsole}
              className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Clear Console
            </button>
          </div>
          <div className="flex-1 bg-white relative">
            <PreviewFrame 
              html={code.html} 
              css={code.css} 
              js={code.js} 
              onConsoleLog={handleConsoleLog}
            />
          </div>
        </div>
      </div>

      {/* Console Output */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <ConsoleOutput logs={consoleLogs} />
      </div>
    </div>
  );
};

export default EditorPanel;