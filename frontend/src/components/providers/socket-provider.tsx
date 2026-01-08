'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSocketStore } from '@/stores/socket-store';

export const SocketProvider = () => {
  const { data: session } = useSession();
  const { connect, disconnect } = useSocketStore();

  useEffect(() => {
    if (session?.user?.accessToken) {
      // Connect to the socket server
      // Assuming NEXT_PUBLIC_API_URL includes /api, we need the base URL for socket
      // But NestJS gateway typically listens on the same port.
      // If API_URL is http://localhost:3000/api, socket might be http://localhost:3000
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      // Basic heuristic to remove /api suffix if present, though socket.io usually handles paths
      // If NestJS default, it listens on root.
      // Let's assume API_URL points to the backend root or /api.
      // Ideally, we have a NEXT_PUBLIC_SOCKET_URL
      
      const socketUrl = apiUrl.replace(/\/api$/, ''); 
      
      // We need to connect to the specific namespace 'notifications'
      // URL structure: http://host:port/notifications
      
      connect(`${socketUrl}/notifications`, session.user.accessToken);
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [session, connect, disconnect]);

  return null; // This component doesn't render anything
};
