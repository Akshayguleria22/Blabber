import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export const axiosInstance = axios.create({
  baseURL: API_BASE ? `${API_BASE}/api` : "/api",
  withCredentials: true,
});
