import { useChatStore } from "../store/useChatStore";
import { useState } from "react";
import { SearchIcon } from "lucide-react";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import AddFriends from "../components/AddFriends";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import ProfileSettings from "../components/ProfileSettings";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-full flex items-center justify-center px-6 pt-12 pb-4">
      <div className="relative w-full max-w-7xl h-[calc(100vh-112px)] min-h-[560px]">
        <BorderAnimatedContainer>
          <div className="flex h-full">
            {/* LEFT SIDE */}
            <div
              className={`absolute z-20 inset-y-0 left-0 w-80 bg-[rgba(var(--surface-1),0.85)] backdrop-blur-xl flex flex-col border-r border-[rgb(var(--border))] transition-transform duration-300 md:static md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
              <ProfileHeader />
              <ActiveTabSwitch />

              {(activeTab === "chats" || activeTab === "contacts") && (
                <div className="px-4 pb-3">
                  <div className="relative">
                    <SearchIcon className="auth-input-icon" />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={`Search ${activeTab === "chats" ? "chats" : "contacts"}`}
                      className="input"
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
                {activeTab === "chats" ? (
                  <ChatsList searchTerm={searchTerm} />
                ) : activeTab === "contacts" ? (
                  <ContactList searchTerm={searchTerm} />
                ) : activeTab === "friends" ? (
                  <AddFriends />
                ) : (
                  <ProfileSettings />
                )}
              </div>
            </div>

            {sidebarOpen && (
              <div
                className="absolute inset-0 bg-black/40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* RIGHT SIDE */}
            <div className="flex-1 flex flex-col bg-[rgba(var(--surface-0),0.65)] backdrop-blur-sm">
              {selectedUser ? (
                <ChatContainer onOpenSidebar={() => setSidebarOpen(true)} />
              ) : (
                <NoConversationPlaceholder onOpenSidebar={() => setSidebarOpen(true)} />
              )}
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
export default ChatPage;
