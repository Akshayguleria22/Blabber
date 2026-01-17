import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import Logo from "./Logo";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";

function SiteHeader() {
  const { authUser, logout } = useAuthStore();
  const primaryHref = authUser ? "/chat" : "/signup";
  const secondaryHref = authUser ? "/profile" : "/login";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: "blur(12px)",
        backgroundColor: "rgba(0,0,0,0)",
        borderBottom: "1px solid",
        borderColor: "rgba(var(--border), 0.7)",
      }}
    >
      <Toolbar sx={{ maxWidth: "1280px", width: "100%", mx: "auto", px: 3 }}>
        <Link to="/" className="inline-flex items-center">
          <Logo />
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Button
            component={Link}
            to={primaryHref}
            variant="contained"
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            {authUser ? "Open Chat" : "Get Started"}
          </Button>
          <Button
            component={Link}
            to={secondaryHref}
            variant="outlined"
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            {authUser ? "Profile" : "Login"}
          </Button>
          {authUser && (
            <Button
              type="button"
              onClick={logout}
              variant="text"
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Logout
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default SiteHeader;
