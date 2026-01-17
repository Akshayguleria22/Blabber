import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { LockIcon, MailIcon, UserIcon, LoaderIcon, GithubIcon, ChromeIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { oauthUrl } from "../lib/oauth";
import { motion } from "framer-motion";
import Logo from "../components/Logo";
import Button from "../components/ui/Button";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();
  const MotionCard = motion.div;

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="page-shell">
      <MotionCard
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel-strong rounded-2xl p-8">
          <div className="mb-6">
            <Logo />
          </div>
          <div className="space-y-2 mb-6">
            <h2 className="text-2xl font-semibold">Create your account</h2>
            <p className="text-sm text-[rgb(var(--muted))]">Start secure conversations today.</p>
          </div>

          <div className="space-y-3 mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full py-2.5"
              onClick={() => window.location.assign(oauthUrl.google)}
            >
              <ChromeIcon className="size-5" />
              Sign up with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full py-2.5"
              onClick={() => window.location.assign(oauthUrl.github)}
            >
              <GithubIcon className="size-5" />
              Sign up with GitHub
            </Button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-[rgb(var(--border))]" />
            <span className="text-xs text-[rgb(var(--muted))]">or</span>
            <div className="h-px flex-1 bg-[rgb(var(--border))]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="auth-input-label">Full Name</label>
              <div className="relative">
                <UserIcon className="auth-input-icon" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="auth-input-label">Email</label>
              <div className="relative">
                <MailIcon className="auth-input-icon" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                  placeholder="johndoe@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="auth-input-label">Password</label>
              <div className="relative">
                <LockIcon className="auth-input-icon" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <Button className="w-full" type="submit" disabled={isSigningUp}>
              {isSigningUp ? <LoaderIcon className="w-full h-5 animate-spin text-center" /> : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="auth-link">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </MotionCard>
    </div>
  );
}
export default SignUpPage;
