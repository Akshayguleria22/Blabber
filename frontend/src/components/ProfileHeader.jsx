import { useState, useRef } from "react";
import { LogOutIcon, CameraIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";


function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="px-5 pt-5 pb-4 border-b border-[rgb(var(--border))]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              className="size-12 rounded-2xl overflow-hidden border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] group"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/avatar.png";
                }}
              />
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <CameraIcon className="size-4 text-white" />
              </div>
            </button>

            <span className="absolute -bottom-1 -right-1 size-3 rounded-full bg-[rgb(var(--success))] border-2 border-[rgb(var(--surface-1))]" />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          <div>
            <h3 className="text-[rgb(var(--text))] font-semibold text-sm max-w-[180px] truncate">
              {authUser.fullName || "Unnamed user"}
            </h3>
            <p className="text-[rgb(var(--muted))] text-xs">Online</p>
          </div>
        </div>

        <button
          className="text-[rgb(var(--muted))] hover:text-[rgb(var(--text))] transition-colors"
          onClick={logout}
        >
          <LogOutIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
export default ProfileHeader;
