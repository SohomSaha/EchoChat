import express from "express";
import authRoutes from "./routes/auth.route.js";
import cors from "cors";

import messageRoutes from "./routes/message.route.js";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDb } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
server.listen(PORT, () => {
  console.log("Server is running on PORT: " + PORT);
  connectDb();
});
