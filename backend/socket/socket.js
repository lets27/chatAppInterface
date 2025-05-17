import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Track users and their socket ids
const userSocketMap = {};

//io server
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getRecieverSocketId(recieverId) {
  return userSocketMap[recieverId]; //get the Id from the list of Ids
}

io.on("connection", (socket) => {
  console.log(`✅ New connection: ${socket.id}`);
  const userId = socket.handshake.query.userId;

  if (userId) {
    // Initialize array if first connection for this user
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = [];
    }

    // Add new socket ID to this user's array
    userSocketMap[userId].push(socket.id);

    console.log("Current userSocketMap:", userSocketMap);
    io.emit("OnlineUsers", Object.keys(userSocketMap)); // Emit user IDs who are online
  }

  socket.on("disconnect", () => {
    console.log(`❌ Disconnected: ${socket.id}`);
    if (userId && userSocketMap[userId]) {
      // Remove this specific socket ID from the user's array
      userSocketMap[userId] = userSocketMap[userId].filter(
        (id) => id !== socket.id
      );

      // If no more sockets for this user, remove them entirely
      if (userSocketMap[userId].length === 0) {
        delete userSocketMap[userId];
      }

      console.log("Updated userSocketMap:", userSocketMap);
      io.emit("OnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, app, server };
