import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import friendRoutes from "./routes/friend.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = ENV.PORT || 3000;

const isDev = ENV.NODE_ENV !== "production";
const allowedOrigins = new Set(
  [
    ENV.CLIENT_URL,
    ...(isDev ? ["http://localhost:5173", "http://localhost:5174"] : []),
  ].filter(Boolean)
);

const originFn = (origin, callback) => {
  if (!origin) return callback(null, true);
  if (allowedOrigins.has(origin)) return callback(null, true);

  if (isDev && /^http:\/\/localhost:\d+$/.test(origin)) {
    return callback(null, true);
  }

  return callback(new Error(`CORS blocked origin: ${origin}`));
};

app.use(express.json({ limit: "5mb" })); // req.body
app.use(cors({ origin: originFn, credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/friends", friendRoutes);

// make ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});
