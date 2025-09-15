const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Store active users and projects
const activeUsers = new Map(); // userId -> socketId
const activeProjects = new Map(); // projectId -> Set of userIds

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? 'https://your-frontend-domain.com' 
        : 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('username avatar');
      
      if (!user) {
        return next(new Error('Authentication error'));
      }

      socket.userId = user._id.toString();
      socket.username = user.username;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.username);

    // Add user to active users
    activeUsers.set(socket.userId, socket.id);

    // Handle joining a project room
    socket.on('join-project', (projectId) => {
      socket.join(projectId);
      
      // Add user to active projects
      if (!activeProjects.has(projectId)) {
        activeProjects.set(projectId, new Set());
      }
      activeProjects.get(projectId).add(socket.userId);

      // Notify others in the project
      socket.to(projectId).emit('user-joined', {
        userId: socket.userId,
        username: socket.username,
        activeUsers: Array.from(activeProjects.get(projectId))
      });

      console.log(`User ${socket.username} joined project ${projectId}`);
    });

    // Handle code changes
    socket.on('code-change', (data) => {
      const { projectId, changes, language } = data;
      
      // Broadcast changes to other users in the project
      socket.to(projectId).emit('code-update', {
        changes,
        language,
        userId: socket.userId,
        username: socket.username,
        timestamp: new Date().toISOString()
      });
    });

    // Handle cursor position
    socket.on('cursor-move', (data) => {
      const { projectId, position } = data;
      
      socket.to(projectId).emit('user-cursor', {
        userId: socket.userId,
        username: socket.username,
        position,
        timestamp: new Date().toISOString()
      });
    });

    // Handle typing events
    socket.on('typing-start', (data) => {
      socket.to(data.projectId).emit('user-typing', {
        userId: socket.userId,
        username: socket.username,
        isTyping: true
      });
    });

    socket.on('typing-stop', (data) => {
      socket.to(data.projectId).emit('user-typing', {
        userId: socket.userId,
        username: socket.username,
        isTyping: false
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.username);
      
      // Remove from active users
      activeUsers.delete(socket.userId);

      // Remove from all projects
      activeProjects.forEach((users, projectId) => {
        if (users.has(socket.userId)) {
          users.delete(socket.userId);
          socket.to(projectId).emit('user-left', {
            userId: socket.userId,
            username: socket.username,
            activeUsers: Array.from(users)
          });
        }
      });
    });
  });

  return io;
};

module.exports = { setupSocket };