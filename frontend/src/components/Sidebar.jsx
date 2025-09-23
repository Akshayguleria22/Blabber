import React from 'react'
import { useChatStore } from '../store/useChatStore'
import { useAuthStore } from '../store/useAuthStore'
import { useEffect } from 'react'
import SidebarSkeleton from './Skeletons/SidebarSkeleton'
import { Users } from 'lucide-react'
const Sidebar = () => {
  const { users, getUsers, setSelectedUser, selectedUser, isUsersLoading } = useChatStore()
  const { onlineUsers } = useAuthStore();
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;
  return (
    <aside className="flex h-full w-20 lg:w-72 flex-col border-r border-base-300 transition-all duration-200">
      <div className="shrink-0 border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      {/* Make this a vertical list */}
      <div className="flex-1 overflow-y-auto w-full py-3 px-2 flex flex-col gap-1">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3 text-left
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative">
              <img
                src={user.profilePic}
                alt={user.firstname}
                className="size-12 rounded-full object-cover"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="hidden lg:block min-w-0 flex-1">
              <div className="font-medium truncate">{user.firstname} {user.lastname}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
