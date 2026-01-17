import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  friends: [],
  friendRequests: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  searchUsers: async (q) => {
    try {
      const res = await axiosInstance.get(`friends/search?q=${encodeURIComponent(q)}`);
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to search users");
      return [];
    }
  },

  getFriends: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("friends/list");
      set({ friends: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load friends");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getFriendRequests: async () => {
    try {
      const res = await axiosInstance.get("friends/requests");
      set({ friendRequests: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load friend requests");
    }
  },

  sendFriendRequest: async (userId) => {
    try {
      await axiosInstance.post(`friends/request/${userId}`);
      toast.success("Request sent");
      await get().getFriendRequests();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send request");
    }
  },

  acceptFriendRequest: async (userId) => {
    try {
      await axiosInstance.post(`friends/accept/${userId}`);
      toast.success("Request accepted");
      await Promise.all([get().getFriends(), get().getFriendRequests()]);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to accept request");
    }
  },

  rejectFriendRequest: async (userId) => {
    try {
      await axiosInstance.post(`friends/reject/${userId}`);
      toast.success("Request rejected");
      await get().getFriendRequests();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reject request");
    }
  },

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load contacts");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load chats");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true, // flag to identify optimistic messages (optional)
    };
    // immidetaly update the ui by adding the message
    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(`messages/send/${selectedUser._id}`, messageData);
      set({ messages: messages.concat(res.data) });
    } catch (error) {
      // remove optimistic message on failure
      set({ messages: messages });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");

        notificationSound.currentTime = 0; // reset to start
        notificationSound.play().catch((e) => console.log("Audio play failed:", e));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
