import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";

import { Toaster } from "react-hot-toast";
import ThemeToggle from "./components/ThemeToggle";
import { AnimatePresence, motion } from "framer-motion";
import SiteHeader from "./components/SiteHeader";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const MotionRoute = motion.div;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isCheckingAuth) {
      const params = new URLSearchParams(location.search);
      if (params.has("oauth") && authUser) {
        navigate("/chat", { replace: true });
      }
    }
  }, [isCheckingAuth, authUser, location.search, navigate]);

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
      <div className="absolute inset-0 soft-grid opacity-70" />
      <div className="absolute top-0 -left-10 size-[520px] bg-[radial-gradient(circle_at_center,rgba(var(--accent),0.22),transparent_60%)] blur-[50px]" />
      <div className="absolute bottom-0 -right-10 size-[520px] bg-[radial-gradient(circle_at_center,rgba(var(--accent-soft),0.16),transparent_60%)] blur-[50px]" />

      <SiteHeader />
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <AnimatePresence mode="wait">
        <MotionRoute
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Routes location={location}>
            <Route path="/" element={<LandingPage />} />

            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/chat" replace />} />
            <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/chat" replace />} />

            <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" replace />} />
            <Route
              path="/profile"
              element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MotionRoute>
      </AnimatePresence>

      <Toaster />
    </div>
  );
}
export default App;
