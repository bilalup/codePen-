export const LANGUAGES = {
  HTML: 'html',
  CSS: 'css',
  JAVASCRIPT: 'javascript'
};

export const DEFAULT_CODE = {
  html: `<!DOCTYPE html>
<html>
<head>
    <title>Welcome to CodePen+</title>
</head>
<body>
    <div class="container">
        <h1>Hello, World! 👋</h1>
        <p>Start coding with HTML, CSS, and JavaScript</p>
        <button id="clickMe">Click me!</button>
    </div>
</body>
</html>`,

  css: `body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    text-align: center;
    max-width: 400px;
}

h1 {
    color: #333;
    margin-bottom: 1rem;
}

p {
    color: #666;
    margin-bottom: 2rem;
}

button {
    background: #667eea;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s;
}

button:hover {
    background: #5a67d8;
}`,

  js: `document.getElementById('clickMe').addEventListener('click', function() {
    alert('Hello from CodePen+! 🎉');
    
    // Create a fun effect
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 100);
});

console.log('Welcome to CodePen+! Start coding...');`
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};