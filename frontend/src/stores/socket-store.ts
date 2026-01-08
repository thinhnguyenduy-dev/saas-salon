import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  connect: (url: string, token: string) => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  connect: (url: string, token: string) => {
    const { socket } = get();
    
    // If socket exists and is connected, don't reconnect
    if (socket && socket.connected) return;

    // Disconnect existing socket if any
    if (socket) {
      socket.disconnect();
    }

    const newSocket = io(url, {
      auth: { token },
      transports: ['websocket'],
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      set({ isConnected: true });
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      set({ isConnected: false });
    });
    
    // Handle connection errors
    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      // Optional: Logic to handle auth failure (e.g. invalid token)
    });

    set({ socket: newSocket });
  },
  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({ socket: null, isConnected: false });
  },
}));
