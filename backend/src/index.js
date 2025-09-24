import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
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

// Frontend static serving (production build) only if dist exists
const distPath = path.join(__dirname, '../../frontend/dist');
const distExists = fs.existsSync(distPath);
if (distExists) {
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) return next();
        const indexFile = path.join(distPath, 'index.html');
        return fs.existsSync(indexFile)
            ? res.sendFile(indexFile)
            : res.status(500).json({ message: 'Frontend build missing index.html. Rebuild frontend.' });
    });
} else {
    console.warn('[startup] Frontend dist folder not found. Run build: cd frontend && npm run build');
}

// Simple health route
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
    console.error('Unhandled error:', err); // keep simple; enhance logging as needed
    if (res.headersSent) return; // already responded
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const basePort = Number(process.env.PORT) || 5000;

function startServer(port, attempt = 0) {
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        console.log('CORS origins:', ORIGINS);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE' && attempt < 3) {
            const nextPort = port + 1;
            console.warn(`Port ${port} in use. Retrying with ${nextPort}...`);
            startServer(nextPort, attempt + 1);
        } else {
            console.error('Failed to start server:', err.message);
            process.exit(1);
        }
    });
}

connectDB().then(() => startServer(basePort));
