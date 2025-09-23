import React from 'react'
import { X } from 'lucide-react'
import { useChatStore } from '../store/useChatStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
const Chatheader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedUser.profilePic} alt={selectedUser.firstname}  />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium">{selectedUser.firstname + " " + selectedUser.lastname}</h3>
                        <p className="text-sm text-base-content/10">{onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}</p>
                    </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="btn btn-ghost btn-circle">
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

export default Chatheader
