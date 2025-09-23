import React from 'react'
import { useChatStore } from '../store/useChatStore.js';
import { useEffect } from 'react';
import Chatheader from './Chatheader.jsx';
import MessageInput from './MessageInput.jsx';
import MessageSkeleton from './Skeletons/MessageSkeleton.jsx';

const ChatWindow = () => {
  const { getMessages, messages, selectedUser, isChatsLoading } = useChatStore();
  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser, getMessages]);
  if (isChatsLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <Chatheader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <Chatheader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4"></div>

      <MessageInput />

    </div>
  )
}

export default ChatWindow
