import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="mx-4 my-3 rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-1))] p-1.5 flex gap-1">
      {[
        { key: "chats", label: "Chats" },
        { key: "contacts", label: "Contacts" },
        { key: "friends", label: "Add" },
        { key: "profile", label: "Profile" },
      ].map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`flex-1 rounded-xl px-3 py-2 text-xs font-medium transition-colors ${activeTab === tab.key
              ? "bg-[rgba(var(--accent),0.15)] text-[rgb(var(--accent))]"
              : "text-[rgb(var(--muted))] hover:text-[rgb(var(--text))]"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
export default ActiveTabSwitch;
