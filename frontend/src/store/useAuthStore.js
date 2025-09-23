import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/api";

// Use origin for sockets in production to avoid /api/socket.io path issues
const SOCKET_URL = import.meta.env.MODE === "development" ? BASE_URL : window.location.origin;

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({ authUser: res.data })
            get().connectSocket();
        } catch (error) {
            set({ authUser: null })
            console.log("Error in checkAuth", error)
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            const msg = error.response?.data?.message || error.message || "Login failed";
            toast.error(msg);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data });
            toast.success("Account created successfully!!")
            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            set({ isSigningUp: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully!")
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed")
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser || socket?.connected) return;

        const s = io(SOCKET_URL, {
            withCredentials: true,
            query: { userId: authUser._id },
        });

        s.connect();
        set({ socket: s });

        s.on("getOnlineUsers", (userIds) => set({ onlineUsers: userIds }));
    },

    disconnectSocket: () => {
        const s = get().socket;
        if (s?.connected) s.disconnect();
    },

    setOnlineUsers: (users) => set({ onlineUsers: users })
}))
