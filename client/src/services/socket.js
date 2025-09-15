import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket) return;

    this.socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('Disconnected from server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinProject(projectId) {
    this.socket?.emit('join-project', projectId);
  }

  leaveProject(projectId) {
    this.socket?.emit('leave-project', projectId);
  }

  onCodeUpdate(callback) {
    this.socket?.on('code-update', callback);
  }

  onUserJoined(callback) {
    this.socket?.on('user-joined', callback);
  }

  onUserLeft(callback) {
    this.socket?.on('user-left', callback);
  }

  emitCodeChange(data) {
    this.socket?.emit('code-change', data);
  }

  emitCursorMove(data) {
    this.socket?.emit('cursor-move', data);
  }

  removeAllListeners() {
    this.socket?.removeAllListeners();
  }
}

export const socketService = new SocketService();