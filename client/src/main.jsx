import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ProjectProvider } from './contexts/ProjectContext'; // <-- import your provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProjectProvider> {/* <-- wrap your App here */}
      <App />
    </ProjectProvider>
  </StrictMode>
);
