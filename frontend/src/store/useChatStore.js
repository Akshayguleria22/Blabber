import { create } from 'zustand';
import toast from "react-hot-toast";
import { axiosInstance } from '../lib/axios.js';


export const useChatStore = create((set) => ({
    chats: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isChatsLoading: false,


    getUsers: async () => {
      set({ isUsersLoading: true });
      try {
        const response = await axiosInstance.get('/messages/users');
        set({ users: response.data });
      } catch (error) {
        toast.error("Error fetching users");
      } finally {
        set({ isUsersLoading: false });
      }
  },

    getMessages: async (userId) => {
      set({ isChatsLoading: true });
      try {
        const response = await axiosInstance.get(`/messages/${userId}`);
        set({ chats: response.data });
      } catch (error) {
        toast.error("Error fetching messages");
      } finally {
        set({ isChatsLoading: false });
      }
    },

  addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
  removeChat: (chatId) => set((state) => ({
    chats: state.chats.filter(chat => chat.id !== chatId)
  })),
  clearChats: () => set({ chats: [] }),
}));
