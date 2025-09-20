import { useState, useEffect, useRef } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import CodeEditor from './CodeEditor';
import PreviewFrame from '../Preview/PreviewFrame';
import EditorTabs from './EditorTabs';
import ConsoleOutput from '../Preview/ConsoleOutput';

const EditorPanel = () => {
  const { currentProject, updateProject } = useProject();
  const [activeTab, setActiveTab] = useState('html');
  const [code, setCode] = useState({ html: '', css: '', js: '' });
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [saving, setSaving] = useState(false);
  const prevJsRef = useRef(''); // Keep track of previous JS

  useEffect(() => {
    if (currentProject) {
      setCode({
        html: currentProject.html || '<h1>Hello World</h1>',
        css: currentProject.css || 'body { padding: 20px; background: #f5f5f5; }',
        js: currentProject.js || 'console.log("Hello from CodePen+!");'
      });
      prevJsRef.current = currentProject.js || '';
      setConsoleLogs([]);
    }
  }, [currentProject]);

  const handleCodeChange = (language, value) => {
    setCode(prev => ({ ...prev, [language]: value }));

    // Only update console if JS changed
    if (language === 'js') {
      setConsoleLogs([]);
    }
  };

  const handleConsoleLog = (message) => {
    setConsoleLogs(prev => [...prev, message]);
  };

  const clearConsole = () => setConsoleLogs([]);

  const handleSave = async () => {
    if (!currentProject?._id) return;
    try {
      setSaving(true);
      await updateProject(currentProject._id, code);
      setSaving(false);
      alert('Project saved!');
    } catch (err) {
      setSaving(false);
      console.error('Save failed:', err);
      alert('Failed to save project.');
    }
  };

  if (!currentProject) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        <p>Select or create a project to start coding</p>
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
              <CodeEditor language="html" value={code.html} onChange={(v) => handleCodeChange('html', v)} />
            )}
            {activeTab === 'css' && (
              <CodeEditor language="css" value={code.css} onChange={(v) => handleCodeChange('css', v)} />
            )}
            {activeTab === 'js' && (
              <CodeEditor language="javascript" value={code.js} onChange={(v) => handleCodeChange('js', v)} />
            )}
          </div>
        </div>

        {/* Preview Section */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
            <h3 className="font-medium text-gray-900 dark:text-white">Preview</h3>
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className={`text-xs px-2 py-1 rounded ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={clearConsole} className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600">
                Clear Console
              </button>
            </div>
          </div>
          <div className="flex-1 bg-white relative">
            <PreviewFrame
              html={code.html}
              css={code.css}
              js={code.js}
              prevJsRef={prevJsRef}
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
