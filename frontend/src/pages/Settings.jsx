import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore.js'
import { toast } from 'react-hot-toast'

// Align with configured DaisyUI themes
const themes = ["light", "dark", "retro"]

const Settings = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore()
  const [profilePic, setProfilePic] = useState("")
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "retro")
  const [showEmail, setShowEmail] = useState(true)
  const [notifications, setNotifications] = useState(true)

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setProfilePic(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    if (!profilePic) return toast.error("Please select a profile picture!")
    updateProfile({ profilePic })
  }

  const handleThemeChange = (e) => {
    setTheme(e.target.value)
    document.documentElement.setAttribute("data-theme", e.target.value)
    localStorage.setItem("theme", e.target.value)
    toast.success(`Theme changed to ${e.target.value}`)
  }

  const handleSettingsSave = (e) => {
    e.preventDefault()
    toast.success("Settings saved!")
    // Here you can add logic to persist settings if needed
  }

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6 sm:p-8">
      <h2 className="text-3xl font-extrabold mb-6 text-center">Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="card bg-base-100 shadow">
          <div className="card-body items-center">
          <div className="avatar mb-4">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={profilePic || authUser?.profilePic} alt="User" />
            </div>
          </div>
          <div className="font-bold text-lg">{authUser?.firstname} {authUser?.lastname}</div>
          {showEmail && (
            <div className="text-sm text-gray-500">{authUser?.email}</div>
          )}
          <form onSubmit={handleProfileUpdate} className="w-full mt-6 flex flex-col items-center gap-3">
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={handleProfilePicChange}
            />
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? "Updating..." : "Update Picture"}
            </button>
          </form>
          </div>
        </div>

        {/* Settings Card */}
        <form onSubmit={handleSettingsSave} className="card bg-base-100 shadow">
          <div className="card-body space-y-6">
          <div>
            <label className="block mb-2 font-semibold">Theme</label>
            <select
              className="select select-bordered w-full"
              value={theme}
              onChange={handleThemeChange}
            >
              {themes.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Show Email on Profile</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={showEmail}
                onChange={() => setShowEmail((v) => !v)}
              />
            </label>
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Enable Notifications</span>
              <input
                type="checkbox"
                className="toggle toggle-secondary"
                checked={notifications}
                onChange={() => setNotifications((v) => !v)}
              />
            </label>
          </div>
          <div className="card-actions">
            <button className="btn btn-accent w-full" type="submit">
              Save Settings
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  )
}
export default Settings;
