import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { socketService } from './services/socket';
import Header from './components/Layout/Header';
import EditorPanel from './components/Editor/EditorPanel';
import ProjectList from './components/Project/ProjectList';
import AuthModal from './components/Auth/AuthModal';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference or saved theme
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const theme = savedTheme === 'dark' || (!savedTheme && systemDark);
    setDarkMode(theme);
    document.documentElement.classList.toggle('dark', theme);

    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      socketService.connect(token);
    } else {
      socketService.disconnect();
    }

    return () => {
      socketService.disconnect();
    };
  }, [isAuthenticated]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 dark:from-dark-300 dark:to-dark-200">
        <Header onToggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Bilal CodePen+
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              The ultimate code playground with real-time collaboration
            </p>
            <AuthModal />
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-200">
      <Header onToggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <div className="flex h-[calc(100vh-4rem)]">
        <aside className="w-80 bg-white dark:bg-dark-100 border-r border-gray-200 dark:border-gray-700">
          <ProjectList />
        </aside>
        <main className="flex-1">
          <EditorPanel />
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;