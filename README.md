# ChatApp

A modern, full‑stack real‑time chat application with authentication (email/password + Google/GitHub OAuth), online presence, media messaging, theming, and a clean UI.

- Frontend: React + Vite, Zustand, Axios, Tailwind CSS v4, DaisyUI
- Backend: Node.js, Express, MongoDB (Mongoose), JWT (httpOnly cookies), Passport (Google/GitHub), Socket.IO, Cloudinary
- Realtime: Online users, live message stream

## Features

- Email/password auth + OAuth (Google, GitHub)
- JWT auth via httpOnly cookies
- Profile management (Cloudinary image uploads)
- Realtime 1‑to‑1 chat with Socket.IO
- Online users indicator
- Theming with DaisyUI (e.g., retro, light, dark)
- Responsive UI with accessible components

## Tech Stack

- Frontend: React, Vite, Zustand, Axios, Tailwind v4, DaisyUI, React Router
- Backend: Express, Mongoose, Passport, Socket.IO, Cloudinary, CORS, cookie‑parser
- Infra: MongoDB Atlas, Cloudinary

## Project Structure

```
ChatApp/
├─ backend/
│  ├─ src/
│  │  ├─ controllers/         # auth.controllers.js, message.controllers.js
│  │  ├─ lib/                 # cloudinary.js, passport.js, validateEnv.js, utils.js
│  │  ├─ middlewares/         # auth.middlewares.js (authorize, etc.)
│  │  ├─ models/              # user.model.js, message.model.js
│  │  ├─ routes/              # auth.routes.js, message.routes.js
│  │  ├─ seeds/               # user.seed.js
│  │  └─ index.js             # Express app entry
│  └─ .env
└─ frontend/
   ├─ src/
   │  ├─ components/          # Navbar, Sidebar, ChatWindow, MessageInput, etc.
   │  ├─ pages/               # LandingPage, LoginPage, SignUpPage, ProfilePage, Settings
   │  └─ store/               # useAuthStore.js, useChatStore.js
   ├─ index.html
   └─ .env
```

## Getting Started

### Prerequisites
- Node.js 18+ (recommended 20+)
- npm
- MongoDB Atlas (or local Mongo)
- Cloudinary account
- Google & GitHub OAuth apps

### 1) Clone and install

```bash
# from project root
cd backend && npm i
cd ../frontend && npm i
```

### 2) Environment variables

Create backend/.env:

```
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=replace_me
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000

GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GITHUB_CLIENT_ID=Iv1_xxx
GITHUB_CLIENT_SECRET=xxx
```

Create frontend/.env:

```
VITE_API_URL=http://localhost:5000
```

### 3) Run development servers (Windows)

- Backend (port 5000):

```bash
cd backend
npm run dev   # or: npx nodemon src/index.js
```

- Frontend (Vite on 5173):

```bash
cd frontend
npm run dev
```

If you use 5174, add it to backend CORS origins.

### 4) Optional: Seed demo users

```bash
cd backend
node src/seeds/user.seed.js
```

## Configuration Notes

### CORS
Backend allows multiple origins. Update in backend/src/index.js if needed:

```js
const ORIGINS = [process.env.CLIENT_URL, "http://localhost:5173", "http://localhost:5174"].filter(Boolean);
app.use(cors({ origin: ORIGINS, credentials: true }));
```

### Body size limits (image upload/messages)
Ensure large payloads are accepted:

```js
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
```

### Cloudinary
Configured in backend/src/lib/cloudinary.js. Ensure dotenv is loaded before cloudinary.config.

### OAuth (Google & GitHub)
- Google Console:
  - Authorized JavaScript origins: http://localhost:5173 (and/or 5174)
  - Authorized redirect URI: http://localhost:5000/api/auth/google/callback
- GitHub Developer Settings:
  - Homepage: http://localhost:5173
  - Callback: http://localhost:5000/api/auth/github/callback

Passport strategies read env vars; load dotenv inside passport.js or import after dotenv in index.js.

## API Overview

Base URL: http://localhost:5000/api

- Auth
  - POST /auth/signup
  - POST /auth/login
  - POST /auth/logout
  - GET  /auth/check            (protected)
  - PUT  /auth/update-profile   (protected)  body: { profilePic: base64 or URL }

- Messages
  - GET  /messages/:userId      (protected)  fetch conversation
  - POST /messages/send/:userId (protected)  body: { text?, image? (base64) }
  - GET  /messages/users        (protected)  sidebar contacts (excluding self)

JWT is sent via httpOnly cookie.

## Sockets (Realtime)

Events (example):
- Client → server: "user-online", payload: userId
- Server → client: "online-users", payload: [userId...]
- Server → client: "message:new", payload: message

Use Zustand store to connect, set online users, and append incoming messages only for the active chat.

## Theming (Tailwind v4 + DaisyUI)

- Install daisyUI in frontend: `npm i daisyui`
- Add to tailwind.config.js plugins if you use custom themes:
  - plugins: [require('daisyui')]
  - daisyui: { themes: ["retro","light","dark", ...] }
- Apply in JSX: `<div data-theme="retro">...</div>`

## Common Issues & Fixes

- 413 Payload Too Large
  - Ensure `express.json/urlencoded` limits are set (50mb or as needed).
- CORS blocked
  - Add your frontend origin (5173/5174) to backend ORIGINS and restart.
- Cloudinary "Must supply api_key"
  - Verify .env is loaded before cloudinary.config; check values aren’t empty.
- Passport "clientID option" missing
  - Load dotenv within passport.js (`import 'dotenv/config'`) or import passport after dotenv in index.js.
- Images not showing
  - Ensure you save `uploadResponse.secure_url` to user.profilePic/messages and the URL is public.
- Messages disappear on re-render
  - Subscribe once per selected chat; don’t clear messages on every effect run.

## Scripts (suggested)

You can add these to package.json:

Backend:
```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "seed:users": "node src/seeds/user.seed.js"
  }
}
```

Frontend:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Security

- Do not commit .env (rotate any leaked secrets immediately)
- Use strong JWT_SECRET in production
- Set secure cookies and proper sameSite in production

## License

MIT (or your preferred license)

## Acknowledgements

- Tailwind CSS, DaisyUI
- Passport, Socket.IO
- Cloudinary
