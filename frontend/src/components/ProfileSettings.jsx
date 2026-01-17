import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import Button from "./ui/Button";
import { Card, CardContent } from "./ui/Card";

function ProfileSettings() {
  const { authUser, updateProfile } = useAuthStore();

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

  useEffect(() => {
    setFullName(initial.fullName);
    setBio(initial.bio);
  }, [initial.fullName, initial.bio]);

  const onSave = async (e) => {
    e.preventDefault();
    await updateProfile({ fullName, bio });
  };

  const remaining = 280 - (bio?.length || 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="text-[rgb(var(--text))] font-semibold">Profile</h3>
          <p className="text-sm text-[rgb(var(--muted))] mt-1">
            Update your name and status. Avatar change is in the header.
          </p>

          <form onSubmit={onSave} className="mt-4 space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-[rgb(var(--muted))]">Full name</label>
              <input
                className="input w-full"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[rgb(var(--muted))]">Email</label>
              <input className="input w-full opacity-80" value={initial.email} readOnly />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[rgb(var(--muted))]">Status</label>
                <span className="text-xs text-[rgb(var(--muted))]">{remaining}</span>
              </div>
              <textarea
                className="w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-2))] text-[rgb(var(--text))] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(var(--accent),0.35)]"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Focus mode, responses in 5 mins"
                maxLength={280}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button as={Link} to="/profile" variant="outline">Open full profile</Button>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileSettings;
