import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
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
const _dirname = path.resolve();
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

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(_dirname, '../frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(_dirname, '../frontend/dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running....');
    });
}
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      console.log("CORS origins:", ORIGINS);
  });
});
