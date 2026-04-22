import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (user) {
      const socketUrl = import.meta.env.PROD 
        ? 'https://voitheia-backend.onrender.com' 
        : 'http://localhost:5000';
      socketRef.current = io(socketUrl);
    }
    return () => socketRef.current?.disconnect();
  }, [user]);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
