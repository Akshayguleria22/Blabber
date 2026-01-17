import { MessageCircleIcon } from "lucide-react";

const NoChatHistoryPlaceholder = ({ name }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-[rgba(var(--accent),0.12)] border border-[rgb(var(--border))]">
        <MessageCircleIcon className="size-8 text-[rgb(var(--accent))]" />
      </div>
      <h3 className="text-lg font-medium text-[rgb(var(--text))] mb-3">
        Start your conversation with {name}
      </h3>
      <div className="flex flex-col space-y-3 max-w-md mb-5">
        <p className="text-[rgb(var(--muted))] text-sm">
          This is the beginning of your conversation. Send a message to start chatting!
        </p>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-[rgba(var(--accent),0.35)] to-transparent mx-auto" />
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;
