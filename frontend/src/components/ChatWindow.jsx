import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore.js';
import Chatheader from './Chatheader.jsx';
import MessageInput from './MessageInput.jsx';
import MessageSkeleton from './Skeletons/MessageSkeleton.jsx';
import { useAuthStore } from '../store/useAuthStore.js';

const ChatWindow = () => {
  const { getMessages, messages, selectedUser, isChatsLoading, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore();

  const listRef = useRef(null);
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    // defer to next frame to ensure layout is settled
    requestAnimationFrame(() => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  };

  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useLayoutEffect(() => {
    if (!messages?.length) return;
    scrollToBottom();
  }, [messages]);

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
      <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-4 scroll-smooth">
        {messages.map((msg) => {
          const isSender = msg.senderId !== selectedUser._id;
          return (
            <div
              key={msg._id}
              className={`flex items-end ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar for received messages */}
              {!isSender && (
                <div className="mr-2 flex flex-col items-end">
                  <img
                    src={selectedUser.profilePic}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-base-200 shadow"
                  />
                </div>
              )}

              <div
                className={`
                  relative flex flex-col
                  ${isSender ? 'items-end' : 'items-start'}
                  max-w-xs md:max-w-md lg:max-w-lg
                `}
              >
                <div
                  className={`
                    px-4 py-2 rounded-2xl shadow
                    ${isSender
                      ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-br-none'
                      : 'bg-red-500 text-white rounded-bl-none'
                    }
                  `}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="sent image"
                      className="mb-2 max-h-60 rounded-lg"
                      onLoad={scrollToBottom} // ensure smooth scroll after image loads
                    />
                  )}
                  <p className="break-words">{msg.text}</p>
                </div>
                <span className={`text-xs mt-1 ${isSender ? 'text-blue-300' : 'text-gray-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              </div>

              {/* Avatar for sent messages */}
              {isSender && (
                <div className="ml-2 flex flex-col items-end">
                  <img
                    src={authUser?.profilePic}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-base-200 shadow"
                  />
                </div>
              )}
            </div>
          );
        })}
        {/* bottom sentinel to scroll to */}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />

    </div>
  )
}

export default ChatWindow
