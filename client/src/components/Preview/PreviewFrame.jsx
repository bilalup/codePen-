import { useEffect, useRef } from 'react';

const PreviewFrame = ({ html, css, js, onConsoleLog }) => {
  const iframeRef = useRef();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const updatePreview = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const content = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              ${css}
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                padding: 20px; 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: white;
                color: #333;
                line-height: 1.6;
              }
            </style>
          </head>
          <body>
            ${html}
            <script>
              // Override console methods to capture logs
              const originalLog = console.log;
              const originalError = console.error;
              const originalWarn = console.warn;
              
              console.log = function(...args) {
                originalLog.apply(console, args);
                window.parent.postMessage({
                  type: 'CONSOLE_LOG',
                  message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
                }, '*');
              };
              
              console.error = function(...args) {
                originalError.apply(console, args);
                window.parent.postMessage({
                  type: 'CONSOLE_ERROR', 
                  message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
                }, '*');
              };
              
              console.warn = function(...args) {
                originalWarn.apply(console, args);
                window.parent.postMessage({
                  type: 'CONSOLE_WARN',
                  message: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ')
                }, '*');
              };

              // Error handling for user code
              window.addEventListener('error', (e) => {
                window.parent.postMessage({
                  type: 'RUNTIME_ERROR',
                  message: e.error.toString()
                }, '*');
              });

              try {
                ${js}
              } catch (error) {
                window.parent.postMessage({
                  type: 'RUNTIME_ERROR',
                  message: error.toString()
                }, '*');
              }
            </script>
          </body>
        </html>
      `;

      try {
        iframe.contentDocument.open();
        iframe.contentDocument.write(content);
        iframe.contentDocument.close();
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        console.log('Preview update in progress...');
      }
    };

    if (isFirstRender.current) {
      // Wait for iframe to load first time
      const timer = setTimeout(updatePreview, 100);
      return () => clearTimeout(timer);
    } else {
      updatePreview();
    }
  }, [html, css, js, onConsoleLog]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type && event.data.message) {
        onConsoleLog(event.data.message);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConsoleLog]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border-0"
      sandbox="allow-scripts allow-same-origin"
      title="code-preview"
      onLoad={() => {
        isFirstRender.current = false;
      }}
    />
  );
};

export default PreviewFrame;