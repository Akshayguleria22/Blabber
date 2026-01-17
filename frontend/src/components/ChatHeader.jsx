import { XIcon, PanelLeftIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader({ onOpenSidebar }) {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div className="flex justify-between items-center border-b border-[rgb(var(--border))] px-6 py-4">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden text-[rgb(var(--muted))] hover:text-[rgb(var(--text))]"
          onClick={onOpenSidebar}
        >
          <PanelLeftIcon className="size-5" />
        </button>

        <div className="size-11 rounded-2xl overflow-hidden border border-[rgb(var(--border))]">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="size-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/avatar.png";
            }}
          />
        </div>

        <div>
          <h3 className="text-[rgb(var(--text))] font-semibold">{selectedUser.fullName}</h3>
          <p className="text-[rgb(var(--muted))] text-xs">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-5 h-5 text-[rgb(var(--muted))] hover:text-[rgb(var(--text))] transition-colors cursor-pointer" />
      </button>
    </div>
  );
}
export default ChatHeader;
