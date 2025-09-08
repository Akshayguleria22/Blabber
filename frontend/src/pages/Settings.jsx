import React, { useEffect, useMemo, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore.js'
import { toast } from 'react-hot-toast'

// Match DaisyUI config
const themes = ["light", "dark", "retro"]
const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
]

const defaultSettings = {
  appearance: {
    theme: typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'retro') : 'retro',
    fontSize: 'base',
    reduceMotion: false,
  },
  notifications: {
    enabled: true,
    sound: true,
    desktop: false,
  },
  privacy: {
    showEmail: true,
    readReceipts: true,
    lastSeen: 'everyone', // everyone | contacts | nobody
  },
  accessibility: {
    highContrast: false,
    focusOutline: true,
  },
  language: {
    locale: 'en',
  },
  data: {
    mediaAutoDownload: 'wifi', // never | wifi | always
    cacheSizeMb: 128,
  }
}

const Settings = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore()

  // Profile image handling
  const [profilePic, setProfilePic] = useState("")
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

  // Settings state with local persistence
  const initial = useMemo(() => {
    try {
      const raw = localStorage.getItem('app_settings')
      return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings
    } catch {
      return defaultSettings
    }
  }, [])
  const [settings, setSettings] = useState(initial)

  useEffect(() => {
    localStorage.setItem('app_settings', JSON.stringify(settings))
  }, [settings])

  // Apply appearance immediately
  useEffect(() => {
    const theme = settings.appearance.theme
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
    document.documentElement.style.fontSize = settings.appearance.fontSize === 'sm' ? '14px' : settings.appearance.fontSize === 'lg' ? '18px' : '16px'
    document.documentElement.style.setProperty('scroll-behavior', settings.appearance.reduceMotion ? 'auto' : 'smooth')
  }, [settings.appearance])

  const setAppearance = (key, value) => setSettings(s => ({ ...s, appearance: { ...s.appearance, [key]: value } }))
  const setNotifications = (key, value) => setSettings(s => ({ ...s, notifications: { ...s.notifications, [key]: value } }))
  const setPrivacy = (key, value) => setSettings(s => ({ ...s, privacy: { ...s.privacy, [key]: value } }))
  const setAccessibility = (key, value) => setSettings(s => ({ ...s, accessibility: { ...s.accessibility, [key]: value } }))
  const setLanguage = (key, value) => setSettings(s => ({ ...s, language: { ...s.language, [key]: value } }))
  const setData = (key, value) => setSettings(s => ({ ...s, data: { ...s.data, [key]: value } }))

  const clearCache = () => {
    toast.success('Cache cleared')
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ settings }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'app-settings.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto mt-20 p-6 sm:p-8">
      <h2 className="text-3xl font-extrabold mb-6 text-center">Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Side Nav */}
        <aside className="md:col-span-1">
          <ul className="menu bg-base-100 rounded-box shadow">
            <li><a href="#profile">Profile</a></li>
            <li><a href="#account">Account</a></li>
            <li><a href="#security">Security</a></li>
            <li><a href="#appearance">Appearance</a></li>
            <li><a href="#notifications">Notifications</a></li>
            <li><a href="#privacy">Privacy</a></li>
            <li><a href="#accessibility">Accessibility</a></li>
            <li><a href="#language">Language</a></li>
            <li><a href="#data">Data & Storage</a></li>
            <li><a href="#danger">Danger Zone</a></li>
          </ul>
        </aside>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">
          {/* Profile */}
          <section id="profile" className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Profile</h3>
              <div className="flex flex-col items-center gap-4">
                <div className="avatar">
                  <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={profilePic || authUser?.profilePic} alt="User" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{authUser?.firstname} {authUser?.lastname}</div>
                  {settings.privacy.showEmail && (
                    <div className="text-sm opacity-70">{authUser?.email}</div>
                  )}
                </div>
                <form onSubmit={handleProfileUpdate} className="w-full max-w-sm flex flex-col gap-3">
                  <input type="file" accept="image/*" className="file-input file-input-bordered w-full" onChange={handleProfilePicChange} />
                  <button type="submit" className="btn btn-primary" disabled={isUpdatingProfile}>
                    {isUpdatingProfile ? 'Updating...' : 'Update Picture'}
                  </button>
                </form>
              </div>
            </div>
          </section>

          {/* Account */}
          <section id="account" className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Account</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">First name</span></label>
                  <input className="input input-bordered" defaultValue={authUser?.firstname} disabled />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Last name</span></label>
                  <input className="input input-bordered" defaultValue={authUser?.lastname} disabled />
                </div>
                <div className="form-control sm:col-span-2">
                  <label className="label"><span className="label-text">Email</span></label>
                  <input className="input input-bordered" defaultValue={authUser?.email} disabled />
                </div>
              </div>
              <div className="alert mt-4">
                Changing name/email is not implemented in this demo.
              </div>
            </div>
          </section>

          {/* Security */}
          <section id="security" className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Security</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control sm:col-span-2">
                  <label className="label"><span className="label-text">Current password</span></label>
                  <input type="password" className="input input-bordered" placeholder="********" />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">New password</span></label>
                  <input type="password" className="input input-bordered" placeholder="********" />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Confirm new password</span></label>
                  <input type="password" className="input input-bordered" placeholder="********" />
                </div>
              </div>
              <div className="card-actions justify-end mt-2">
                <button className="btn btn-outline" onClick={() => toast('Password change not implemented in demo')}>Update password</button>
              </div>
            </div>
          </section>

          {/* Appearance */}
          <section id="appearance" className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Appearance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Theme</span></label>
                  <select className="select select-bordered" value={settings.appearance.theme} onChange={(e) => setAppearance('theme', e.target.value)}>
                    {themes.map(t => <option key={t} value={t}>{t[0].toUpperCase()+t.slice(1)}</option>)}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Font size</span></label>
                  <select className="select select-bordered" value={settings.appearance.fontSize} onChange={(e) => setAppearance('fontSize', e.target.value)}>
                    <option value="sm">Small</option>
                    <option value="base">Base</option>
                    <option value="lg">Large</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer justify-between">
                    <span className="label-text">Reduce motion</span>
                    <input type="checkbox" className="toggle" checked={settings.appearance.reduceMotion} onChange={(e) => setAppearance('reduceMotion', e.target.checked)} />
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section id="notifications" className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Notifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="label cursor-pointer justify-between">
                  <span className="label-text">Enable notifications</span>
                  <input type="checkbox" className="toggle toggle-primary" checked={settings.notifications.enabled} onChange={(e) => setNotifications('enabled', e.target.checked)} />
                </label>
                <label className="label cursor-pointer justify-between">
                  <span className="label-text">Play sound</span>
                  <input type="checkbox" className="toggle" checked={settings.notifications.sound} onChange={(e) => setNotifications('sound', e.target.checked)} />
                </label>
                <label className="label cursor-pointer justify-between">
                  <span className="label-text">Desktop alerts</span>
                  <input type="checkbox" className="toggle" checked={settings.notifications.desktop} onChange={(e) => setNotifications('desktop', e.target.checked)} />
                </label>
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section id="privacy" className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Privacy</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="label cursor-pointer justify-between">
                  <span className="label-text">Show email</span>
                  <input type="checkbox" className="toggle" checked={settings.privacy.showEmail} onChange={(e) => setPrivacy('showEmail', e.target.checked)} />
                </label>
                <label className="label cursor-pointer justify-between">
                  <span className="label-text">Read receipts</span>
                  <input type="checkbox" className="toggle" checked={settings.privacy.readReceipts} onChange={(e) => setPrivacy('readReceipts', e.target.checked)} />
                </label>
                <div className="form-control">
                  <label className="label"><span className="label-text">Last seen</span></label>
                  <select className="select select-bordered" value={settings.privacy.lastSeen} onChange={(e) => setPrivacy('lastSeen', e.target.value)}>
                    <option value="everyone">Everyone</option>
                    <option value="contacts">Contacts</option>
                    <option value="nobody">Nobody</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Accessibility */}
          <section id="accessibility" className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Accessibility</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="label cursor-pointer justify-between">
                  <span className="label-text">High contrast</span>
                  <input type="checkbox" className="toggle" checked={settings.accessibility.highContrast} onChange={(e) => setAccessibility('highContrast', e.target.checked)} />
                </label>
                <label className="label cursor-pointer justify-between">
                  <span className="label-text">Focus outlines</span>
                  <input type="checkbox" className="toggle" checked={settings.accessibility.focusOutline} onChange={(e) => setAccessibility('focusOutline', e.target.checked)} />
                </label>
              </div>
              <div className="alert mt-2">High contrast/focus outlines may be further refined in CSS.</div>
            </div>
          </section>

          {/* Language */}
          <section id="language" className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Language</h3>
              <div className="form-control max-w-sm">
                <label className="label"><span className="label-text">App language</span></label>
                <select className="select select-bordered" value={settings.language.locale} onChange={(e) => setLanguage('locale', e.target.value)}>
                  {languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Data & Storage */}
          <section id="data" className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title">Data & Storage</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">Media auto-download</span></label>
                  <select className="select select-bordered" value={settings.data.mediaAutoDownload} onChange={(e) => setData('mediaAutoDownload', e.target.value)}>
                    <option value="never">Never</option>
                    <option value="wifi">Wi‑Fi only</option>
                    <option value="always">Always</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Cache size (MB)</span></label>
                  <input type="number" min="0" className="input input-bordered" value={settings.data.cacheSizeMb} onChange={(e) => setData('cacheSizeMb', Number(e.target.value))} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Actions</span></label>
                  <button className="btn" onClick={clearCache}>Clear cache</button>
                </div>
              </div>
              <div className="card-actions justify-end mt-2">
                <button className="btn btn-outline" onClick={exportData}>Export settings</button>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section id="danger" className="card bg-base-100 shadow border border-error/30">
            <div className="card-body">
              <h3 className="card-title text-error">Danger Zone</h3>
              <p className="opacity-80">These actions are destructive. Proceed with caution.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="btn btn-outline btn-error" onClick={() => { localStorage.removeItem('app_settings'); toast.success('Settings reset'); setSettings(defaultSettings) }}>Reset settings</button>
                <button className="btn btn-error" onClick={() => toast('Account deletion not implemented in demo')}>Delete account</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Settings
