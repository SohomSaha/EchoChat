import express from 'express';
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDb } from './lib/db.js';

dotenv.config();

const app=express();

const PORT=process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes)
app.listen(PORT,()=>{
    console.log('Server is running on PORT: '+PORT);
    connectDb();
});