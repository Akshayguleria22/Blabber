import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

// Serve frontend if dist exists
const distPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ message: 'Not found' });
    res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      console.log("CORS origins:", ORIGINS);
  });
});
