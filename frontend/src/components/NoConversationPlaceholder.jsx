import { MessageCircleIcon, PanelLeftIcon } from "lucide-react";

const NoConversationPlaceholder = ({ onOpenSidebar }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="size-20 rounded-full flex items-center justify-center mb-6 bg-[rgba(var(--accent),0.12)] border border-[rgb(var(--border))]">
        <MessageCircleIcon className="size-10 text-[rgb(var(--accent))]" />
      </div>
      <h3 className="text-2xl font-bold text-[rgb(var(--text))] mb-3">No conversation selected</h3>
      <p className="max-w-md text-[rgb(var(--muted))]">Select a contact from the sidebar to start chatting.</p>
      <button
        type="button"
        onClick={onOpenSidebar}
        className="mt-6 md:hidden rounded-xl border border-[rgb(var(--border))] px-4 py-2 text-sm text-[rgb(var(--text))] flex items-center gap-2"
      >
        <PanelLeftIcon className="size-4" />
        Open sidebar
      </button>
    </div>
  );
};

export default NoConversationPlaceholder;
