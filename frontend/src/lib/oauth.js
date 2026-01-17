const API_BASE = import.meta.env.VITE_API_BASE || "";

export const oauthUrl = {
  google: API_BASE ? `${API_BASE}/api/auth/google` : "/api/auth/google",
  github: API_BASE ? `${API_BASE}/api/auth/github` : "/api/auth/github",
};
