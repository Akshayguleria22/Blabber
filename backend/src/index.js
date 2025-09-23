import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from './lib/passport.js';
import authRouter from './routes/auth.routes.js';
import messageRouter from './routes/message.routes.js';
import { connectDB } from './lib/utils.js';
import { validateEnv } from './lib/validateEnv.js';

const app = express();
const server = http.createServer(app);

validateEnv();

const ORIGINS = [
    process.env.CLIENT_URL,
    "http://localhost:5173",
    "http://localhost:5174",
].filter(Boolean);

app.use(cors({
    origin: ORIGINS,
    credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      console.log("CORS origins:", ORIGINS);
  });
});
