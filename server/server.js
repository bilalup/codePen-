require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { setupSocket } = require('./src/sockets/socket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Setup Socket.IO
setupSocket(server);

server.listen(PORT, () => {
  console.log('🚀 CodePen+ Backend Server Started');
  console.log(`📍 Port: ${PORT}`);
});