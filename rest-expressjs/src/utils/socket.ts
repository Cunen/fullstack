import type { Server } from "node:http";
import { Server as IO } from "socket.io";

export let io: IO | null = null;

export const initializeSocket = (server: Server) => {
  if (io) return io;

  io = new IO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
};

export const getIO = (): IO => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
