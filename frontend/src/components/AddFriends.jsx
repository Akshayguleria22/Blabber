import { useEffect, useMemo, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { SearchIcon, UserPlusIcon, CheckIcon, XIcon, MessageCircleIcon } from "lucide-react";

function AddFriends() {
  const {
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendRequests,
    friendRequests,
    setSelectedUser,
    setActiveTab,
  } = useChatStore();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    getFriendRequests();
  }, [getFriendRequests]);

  useEffect(() => {
    const t = setTimeout(async () => {
      const q = query.trim();
      if (!q) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      const data = await searchUsers(q);
      setResults(data);
      setIsSearching(false);
    }, 250);

    return () => clearTimeout(t);
  }, [query, searchUsers]);

  const requestsById = useMemo(() => {
    const map = new Map();
    for (const r of friendRequests || []) map.set(r._id, r);
    return map;
  }, [friendRequests]);

  return (
    <div className="space-y-3">
      <div className="px-1">
        <div className="relative">
          <SearchIcon className="auth-input-icon" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email"
            className="input"
          />
        </div>
        {isSearching && <p className="text-xs text-[rgb(var(--muted))] mt-2">Searching…</p>}
      </div>

      {friendRequests?.length > 0 && (
        <div className="card-outline p-4">
          <h4 className="text-[rgb(var(--text))] text-sm font-medium mb-3">Requests</h4>
          <div className="space-y-2">
            {friendRequests.map((u) => (
              <div key={u._id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-10 rounded-2xl overflow-hidden border border-[rgb(var(--border))]">
                    <img
                      src={u.profilePic || "/avatar.png"}
                      alt={u.fullName}
                      className="size-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/avatar.png";
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[rgb(var(--text))] text-sm truncate">{u.fullName}</p>
                    <p className="text-[rgb(var(--muted))] text-xs truncate">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-2 py-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] hover:bg-[rgb(var(--surface-3))] text-[rgb(var(--text))]"
                    onClick={() => acceptFriendRequest(u._id)}
                    title="Accept"
                  >
                    <CheckIcon className="size-4" />
                  </button>
                  <button
                    type="button"
                    className="px-2 py-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] hover:bg-[rgb(var(--surface-3))] text-[rgb(var(--text))]"
                    onClick={() => rejectFriendRequest(u._id)}
                    title="Reject"
                  >
                    <XIcon className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((u) => {
            const isRequestReceived = requestsById.has(u._id);
            const disabled = u.relationship === "friends" || u.relationship === "request_sent";

            return (
              <div
                key={u._id}
                className="card-outline p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-10 rounded-2xl overflow-hidden border border-[rgb(var(--border))]">
                    <img
                      src={u.profilePic || "/avatar.png"}
                      alt={u.fullName}
                      className="size-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/avatar.png";
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[rgb(var(--text))] text-sm truncate">{u.fullName}</p>
                    <p className="text-[rgb(var(--muted))] text-xs truncate">{u.email}</p>
                  </div>
                </div>

                {isRequestReceived ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="px-2 py-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] hover:bg-[rgb(var(--surface-3))] text-[rgb(var(--text))]"
                      onClick={() => acceptFriendRequest(u._id)}
                      title="Accept"
                    >
                      <CheckIcon className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="px-2 py-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] hover:bg-[rgb(var(--surface-3))] text-[rgb(var(--text))]"
                      onClick={() => rejectFriendRequest(u._id)}
                      title="Reject"
                    >
                      <XIcon className="size-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                      u.relationship === "friends"
                        ? "border border-[rgb(var(--border))] text-[rgb(var(--text))] hover:bg-[rgb(var(--surface-2))]"
                        : disabled
                          ? "bg-[rgb(var(--surface-2))] text-[rgb(var(--muted))] cursor-not-allowed"
                          : "bg-[rgb(var(--surface-2))] hover:bg-[rgb(var(--surface-3))] text-[rgb(var(--text))]"
                    }`}
                    disabled={disabled && u.relationship !== "friends"}
                    onClick={() => {
                      if (u.relationship === "friends") {
                        setSelectedUser(u);
                        setActiveTab("chats");
                        return;
                      }
                      sendFriendRequest(u._id);
                    }}
                  >
                    {u.relationship === "friends" ? (
                      <>
                        <MessageCircleIcon className="size-4" />
                        Message
                      </>
                    ) : (
                      <>
                        <UserPlusIcon className="size-4" />
                        {u.relationship === "request_sent" ? "Requested" : "Add"}
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!query.trim() && (!friendRequests || friendRequests.length === 0) && (
        <div className="text-center text-[rgb(var(--muted))] text-sm py-6">
          Search for users to add them as contacts.
        </div>
      )}
    </div>
  );
}

export default AddFriends;
