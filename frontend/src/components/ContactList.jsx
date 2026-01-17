import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList({ searchTerm = "" }) {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading, selectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  const term = searchTerm.trim().toLowerCase();
  const filtered = term
    ? allContacts.filter((contact) =>
      `${contact.fullName} ${contact.email || ""}`.toLowerCase().includes(term)
    )
    : allContacts;

  if (filtered.length === 0) {
    return (
      <div className="text-sm text-[rgb(var(--muted))] text-center py-6">
        {term ? "No contacts match your search." : "No contacts yet. Add people to start chatting."}
      </div>
    );
  }

  return (
    <>
      {filtered.map((contact) => (
        <div
          key={contact._id}
          className={`p-4 rounded-2xl cursor-pointer transition-colors border border-[rgb(var(--border))] bg-[rgb(var(--surface-1))] hover:bg-[rgb(var(--surface-2))] ${selectedUser?._id === contact._id ? "ring-1 ring-[rgb(var(--accent))]" : ""
            }`}
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="size-12 rounded-2xl overflow-hidden border border-[rgb(var(--border))]">
                <img
                  src={contact.profilePic || "/avatar.png"}
                  className="size-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/avatar.png";
                  }}
                />
              </div>
              <span
                className={`absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-[rgb(var(--surface-1))] ${onlineUsers.includes(contact._id) ? "bg-[rgb(var(--success))]" : "bg-[rgb(var(--border))]"
                  }`}
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-[rgb(var(--text))] font-medium truncate">{contact.fullName}</h4>
              <p className="text-xs text-[rgb(var(--muted))] truncate">Start a chat</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
export default ContactList;
