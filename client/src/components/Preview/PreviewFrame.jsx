import { useEffect, useRef } from 'react';

const PreviewFrame = ({ html, css, js, prevJsRef, onConsoleLog }) => {
  const iframeRef = useRef();

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const document = iframe.contentDocument;
    document.open();
    document.write(`
      <html>
        <head>
          <style>${css}</style>
        </head>
        <body>
          ${html}
          <script>
            // Override console.log
            const oldLog = console.log;
            console.log = (...args) => {
              window.parent.postMessage({ type: 'console', args }, '*');
              oldLog(...args);
            };
          </script>
        </body>
      </html>
    `);
    document.close();

    // Only run JS if it changed
    if (js !== prevJsRef.current) {
      const script = document.createElement('script');
      script.innerHTML = js;
      document.body.appendChild(script);
      prevJsRef.current = js;
    }

  }, [html, css, js, prevJsRef]);

  // Listen to iframe console messages
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'console') {
        onConsoleLog(event.data.args.join(' '));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConsoleLog]);

  return <iframe ref={iframeRef} title="preview" className="w-full h-full border-0" sandbox="allow-scripts allow-same-origin" />;
};

export default PreviewFrame;
