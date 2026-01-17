<h1 align="center">Blabber — Professional Messaging App</h1>

Highlights:

- 🔐 Custom JWT Authentication
- ⚡ Real-time Messaging via Socket.io
- 🟢 Online/Offline Presence Indicators
- 📨 Welcome Emails on Signup (Resend)
- 🗂️ Image Uploads (Cloudinary)
- 🧰 REST API with Node.js & Express
- 🧱 MongoDB for Data Persistence
- 🎨 Modern UI with React, Tailwind CSS, MUI & shadcn-style components
- 🧠 Zustand for State Management

---

## 🧪 .env Setup

### Backend (`/backend`)

```bash
PORT=3000
MONGO_URI=your_mongo_uri_here
NODE_ENV=development
JWT_SECRET=your_jwt_secret

RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_verified_sender@yourdomain.com
EMAIL_FROM_NAME=Blabber

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development

### Frontend (`/frontend`)

VITE_API_BASE=http://localhost:3000

```

---

## 🔧 Run the Backend

```bash
cd backend
npm install
npm run dev
```

## 💻 Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🚀 Deployment (High-level)

1) Backend: deploy on Render/Railway/Fly/VM and set backend `.env` values.
2) Frontend: deploy `frontend/dist` to Vercel/Netlify/Static host.
3) Set `VITE_API_BASE` in the frontend host to your backend URL.
