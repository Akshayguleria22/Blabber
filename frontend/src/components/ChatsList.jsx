import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList({ searchTerm = "" }) {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  const term = searchTerm.trim().toLowerCase();
  const filtered = term
    ? chats.filter((chat) =>
      `${chat.fullName} ${chat.email || ""}`.toLowerCase().includes(term)
    )
    : chats;

  if (filtered.length === 0) return <NoChatsFound />;

  return (
    <>
      {filtered.map((chat) => (
        <div
          key={chat._id}
          className={`p-4 rounded-2xl cursor-pointer transition-colors border border-[rgb(var(--border))] bg-[rgb(var(--surface-1))] hover:bg-[rgb(var(--surface-2))] ${selectedUser?._id === chat._id ? "ring-1 ring-[rgb(var(--accent))]" : ""
            }`}
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="size-12 rounded-2xl overflow-hidden border border-[rgb(var(--border))]">
                <img
                  src={chat.profilePic || "/avatar.png"}
                  alt={chat.fullName}
                  className="size-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/avatar.png";
                  }}
                />
              </div>
              <span
                className={`absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-[rgb(var(--surface-1))] ${onlineUsers.includes(chat._id) ? "bg-[rgb(var(--success))]" : "bg-[rgb(var(--border))]"
                  }`}
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-medium truncate text-[rgb(var(--text))]">{chat.fullName}</h4>
              <p className="text-xs text-[rgb(var(--muted))] truncate">Tap to open conversation</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
export default ChatsList;
