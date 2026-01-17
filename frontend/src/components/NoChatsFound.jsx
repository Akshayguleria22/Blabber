import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

function NoChatsFound() {
  const { setActiveTab } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[rgb(var(--surface-1))] border border-[rgb(var(--border))]">
        <MessageCircleIcon className="w-8 h-8 text-[rgb(var(--accent))]" />
      </div>
      <div>
        <h4 className="text-[rgb(var(--text))] font-medium mb-1">No conversations yet</h4>
        <p className="text-[rgb(var(--muted))] text-sm px-6">
          Start a new chat by selecting a contact from the contacts tab
        </p>
      </div>
      <button
        onClick={() => setActiveTab("contacts")}
        className="auth-btn max-w-[180px]"
      >
        Find contacts
      </button>
    </div>
  );
}
export default NoChatsFound;
