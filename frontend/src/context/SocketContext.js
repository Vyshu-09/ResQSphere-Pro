import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getSocketUrl } from '../config/api';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    // Only create socket if user exists and socket doesn't exist yet
    if (user && !socketRef.current) {
      const newSocket = io(getSocketUrl(), {
        transports: ['websocket', 'polling'], // Allow fallback to polling
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5
      });

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        if (user.role === 'admin') {
          newSocket.emit('join-room', 'admin');
        }
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        // Only reset socket state if it was intentionally disconnected
        if (reason === 'io client disconnect') {
          socketRef.current = null;
          setSocket(null);
        }
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      return () => {
        if (socketRef.current && socketRef.current.connected) {
          socketRef.current.close();
          socketRef.current = null;
          setSocket(null);
        }
      };
    } else if (!user && socketRef.current) {
      // User logged out - close socket
      socketRef.current.close();
      socketRef.current = null;
      setSocket(null);
    }
  }, [user?.id]); // Only depend on user.id to avoid recreating socket on user object reference changes

  // Update room when user role changes (but socket already exists)
  useEffect(() => {
    if (socketRef.current && socketRef.current.connected && user) {
      if (user.role === 'admin') {
        socketRef.current.emit('join-room', 'admin');
      }
    }
  }, [socket, user?.role]);

  const value = {
    socket,
    emit: (event, data) => {
      if (socket) {
        socket.emit(event, data);
      }
    },
    on: (event, callback) => {
      if (socket) {
        socket.on(event, callback);
      }
    },
    off: (event, callback) => {
      if (socket) {
        socket.off(event, callback);
      }
    }
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

