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

// Centralized environment aware URLs
const CLIENT_URL = process.env.CLIENT_URL || (process.env.NODE_ENV === 'production'
    ? 'https://blabber-5anu.onrender.com'
    : 'http://localhost:5173');
const SERVER_URL = process.env.SERVER_URL || (process.env.NODE_ENV === 'production'
    ? 'https://blabber-5anu-backend.onrender.com'
    : 'http://localhost:5000');

const ORIGINS = [CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174']
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i); // de-dupe

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

// Frontend static serving (production build) only if dist exists.
// If deploying frontend separately (e.g. Render Static Site), we gracefully redirect or respond.
const distPath = path.join(__dirname, '../../frontend/dist');
const distExists = fs.existsSync(distPath);
console.log('[static] expecting frontend dist at:', distPath, 'exists:', distExists);
if (distExists) {
    app.use(express.static(distPath));
    // SPA fallback for client-side routing
    app.get(['/', '/dashboard', '/login', '/signup', '/profile', '/settings', '/chat', '/chat/*'], (req, res) => {
        const indexFile = path.join(distPath, 'index.html');
        if (fs.existsSync(indexFile)) return res.sendFile(indexFile);
        return res.status(500).json({ message: 'Frontend build missing index.html. Rebuild frontend.' });
    });
} else {
    console.warn('[startup] Frontend dist folder not found. If this is intentional (separate deployment), root will redirect to CLIENT_URL.');
    // Root redirect (only if different host) else simple message
    app.get('/', (req, res) => {
        const hostHeader = req.headers.host || '';
        const clientHost = (() => {
            try { return new URL(CLIENT_URL).host; } catch { return ''; }
        })();
        if (clientHost && clientHost !== hostHeader) {
            return res.redirect(CLIENT_URL);
        }
        return res.json({
            message: 'Backend running. Frontend dist not present here.',
            client: CLIENT_URL,
            server: SERVER_URL,
        });
    });
}

// Always provide an API root for diagnostics
app.get('/api', (_req, res) => {
    res.json({
        status: 'ok',
        server: SERVER_URL,
        client: CLIENT_URL,
        distExists,
        time: new Date().toISOString()
    });
});

// Final catch-all to avoid 'Cannot GET /' if a route slips through (non-API)
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ message: 'API route not found' });
    if (distExists) {
        const indexFile = path.join(distPath, 'index.html');
        if (fs.existsSync(indexFile)) return res.sendFile(indexFile);
    }
    // Fallback JSON (separate deployment scenario)
    return res.status(200).json({ message: 'Frontend not served from this backend.', client: CLIENT_URL });
});

// Simple health route
app.get('/health', (_req, res) => res.json({ status: 'ok', server: SERVER_URL }));

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
