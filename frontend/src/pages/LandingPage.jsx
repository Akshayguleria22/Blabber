import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { useAuthStore } from "../store/useAuthStore";

function LandingPage() {
  const { authUser } = useAuthStore();
  const MotionSection = motion.div;

  return (
    <div className="page-shell">
      <div className="relative w-full max-w-6xl">
        <MotionSection
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-2 gap-10 items-center"
        >
          <div className="space-y-6">
            <Badge>
              <span className="size-2 rounded-full bg-[rgb(var(--accent))]" />
              Secure • Real-time • Privacy-first
            </Badge>

            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
              {authUser ? "Welcome back," : "Professional messaging,"}
              <span className="block text-[rgb(var(--muted))]">
                {authUser ? authUser.fullName || "there" : "made for focus."}
              </span>
            </h1>
            <p className="text-lg text-[rgb(var(--muted))] max-w-xl">
              {authUser
                ? "Pick up your conversations where you left off."
                : "Blabber keeps your conversations crisp, private, and synced in real time."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button as={Link} to={authUser ? "/chat" : "/signup"} className="px-6">
                {authUser ? "Open Chat" : "Get Started"}
              </Button>
              <Button as={Link} to={authUser ? "/profile" : "/login"} variant="outline" className="px-6">
                {authUser ? "View Profile" : "Login"}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-lg">
              {[
                { title: "Real-time", desc: "Instant delivery across devices." },
                { title: "Privacy", desc: "Friend-only chat access." },
                { title: "Media", desc: "Secure image sharing." },
                { title: "Presence", desc: "Live online indicators." },
              ].map((item) => (
                <Card key={item.title}>
                  <CardContent className="p-4">
                    <p className="text-sm font-semibold text-[rgb(var(--text))]">{item.title}</p>
                    <p className="text-xs text-[rgb(var(--muted))] mt-1">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 opacity-50 gradient-bg" />
              <div className="relative grid gap-4">
                {[
                  { title: "Secure by design", desc: "JWT sessions and protected routes." },
                  { title: "Live presence", desc: "Online indicators and typing awareness." },
                  { title: "Media sharing", desc: "Cloud uploads and previews." },
                ].map((item) => (
                  <Card key={item.title} className="bg-[rgba(var(--surface-1),0.8)]">
                    <CardContent className="p-4">
                      <p className="text-sm font-semibold text-[rgb(var(--text))]">{item.title}</p>
                      <p className="text-xs text-[rgb(var(--muted))] mt-1">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
                <Card className="bg-[rgba(var(--surface-2),0.8)]">
                  <CardContent className="p-5">
                    <p className="text-xs text-[rgb(var(--muted))]">Trusted by teams</p>
                    <p className="text-lg font-semibold mt-1">Build conversations that feel effortless.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </MotionSection>
      </div>
    </div>
  );
}

export default LandingPage;
