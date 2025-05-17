import { io, Socket } from "socket.io-client";
import useUserContext from "./useUser";
import { useEffect, useRef, useState } from "react";
import { SocketContext } from "./useSocket";
import { baseUrl } from "../util";

const SocketProvider = ({ children }) => {
  const { user } = useUserContext();
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const userId = user?._id;

  useEffect(() => {
    console.log("👤 User in SocketProvider:", user);
  }, [user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => disconnectSocket();
  }, []);

  // Handle user changes
  useEffect(() => {
    if (user?._id) {
      connectSocket(user._id);
    } else {
      disconnectSocket();
    }

    return () => disconnectSocket();
  }, [user?._id]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (updatedUsers) => {
      setOnlineUsers(updatedUsers.map((id) => ({ userId: id })));
    };

    socket.on("OnlineUsers", handleOnlineUsers);
    socket.on("userOffline", handleOnlineUsers); // Add this line

    return () => {
      socket.off("OnlineUsers", handleOnlineUsers);
      socket.off("userOffline", handleOnlineUsers);
    };
  }, [socket]);

  const connectSocket = () => {
    if (!userId || socketRef.current?.connected) return;

    const token = localStorage.getItem("chatToke");
    const newSocket = io(baseUrl, {
      auth: { token },
      query: { userId },
      autoConnect: true,
      reconnection: true, // Allow reconnection
      reconnectionAttempts: 5, // Limit reconnection attempts
      reconnectionDelay: 1000, // Start with 1 second delay
      transports: ["websocket"], // Prefer WebSocket
      upgrade: true, // Allow upgrade from HTTP to WebSocket
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("✅ Socket connected");
      setTimeout(() => connectSocket(), 5000); // Retry after 5 seconds
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("❌ Socket disconnected");
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      console.log("Disconnecting socket...");
      socketRef.current.removeAllListeners();
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
      setOnlineUsers([]);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        onlineUsers,
        connectSocket,
        disconnectSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
