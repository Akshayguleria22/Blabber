// backend/src/socket.js
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Keep track of online users
const userSocketMap = {};

// Determine CORS origin based on environment
const FRONTEND_URLS = [
    "http://localhost:5173",           // local frontend
    "https://blabber-5anu.onrender.com" // deployed frontend
];

const io = new Server(server, {
    cors: {
        origin: FRONTEND_URLS,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// Helper function to get socket id of a user
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // Emit updated online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Listen for messages
    socket.on("send_message", (data) => {
        console.log("Message received:", data);

        const receiverSocketId = userSocketMap[data.to]; // for direct messaging
        if (receiverSocketId) {
            // Send message to a specific user
            io.to(receiverSocketId).emit("receive_message", data);
        } else {
            // Broadcast if no specific receiver
            io.emit("receive_message", data);
        }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        if (userId) delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// Use environment PORT or fallback to 5000
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { io, server, app };
