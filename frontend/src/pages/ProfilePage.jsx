import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { UserCircle2Icon, LogOutIcon, PencilIcon, MailIcon, ShieldCheckIcon } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";

function ProfilePage() {
  const { authUser, updateProfile, logout } = useAuthStore();

  const initial = useMemo(
    () => ({
      fullName: authUser?.fullName || "",
      bio: authUser?.bio || "",
      email: authUser?.email || "",
    }),
    [authUser]
  );

  const [fullName, setFullName] = useState(initial.fullName);
  const [bio, setBio] = useState(initial.bio);

  const onSave = async (e) => {
    e.preventDefault();
    await updateProfile({ fullName, bio });
  };

  return (
    <div className="page-shell">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Profile & Settings</h1>
            <p className="text-sm text-[rgb(var(--muted))] mt-1">
              Keep your identity consistent across devices.
            </p>
          </div>
          <Button as={Link} to="/chat" variant="outline">Back to chat</Button>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <Card className="glass-panel rounded-2xl">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="size-24 rounded-full overflow-hidden border border-[rgb(var(--border))]">
                <img
                  src={authUser?.profilePic || "/avatar.png"}
                  alt={authUser?.fullName}
                  className="size-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/avatar.png";
                  }}
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{authUser?.fullName}</h3>
              <p className="text-xs text-[rgb(var(--muted))]">{authUser?.email}</p>
              <div className="mt-6 w-full space-y-3">
                <Button className="w-full" type="button">
                  <PencilIcon className="size-4" />
                  Change avatar (use header)
                </Button>
                <Button className="w-full" variant="outline" type="button" onClick={logout}>
                  <LogOutIcon className="size-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel-strong rounded-2xl">
            <CardHeader className="p-6 flex items-center gap-3">
              <div className="size-10 rounded-xl bg-[rgba(var(--accent),0.15)] flex items-center justify-center">
                <UserCircle2Icon className="size-5 text-[rgb(var(--accent))]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Identity</h2>
                <p className="text-sm text-[rgb(var(--muted))]">Update your name and status message.</p>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={onSave} className="space-y-4">
                <div>
                  <label className="text-xs text-[rgb(var(--muted))]">Full name</label>
                  <input
                    className="input w-full"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-xs text-[rgb(var(--muted))]">Email</label>
                  <div className="relative">
                    <MailIcon className="auth-input-icon" />
                    <input className="input w-full opacity-80" value={initial.email} readOnly />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-[rgb(var(--muted))]">Status message</label>
                  <textarea
                    className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] text-[rgb(var(--text))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(var(--accent),0.35)]"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Focus mode, responses in 5 mins"
                    maxLength={280}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                  <div className="inline-flex items-center gap-2 text-xs text-[rgb(var(--muted))]">
                    <ShieldCheckIcon className="size-4" />
                    Profile data is private by default
                  </div>
                  <Button type="submit">Save changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
