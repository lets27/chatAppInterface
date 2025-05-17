import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

export const SocketContext = createContext({
  socket: null,
  isConnected: false,
  connectSocket: () => {},
  disconnectSocket: () => {},
  onlineUsers: [],
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
