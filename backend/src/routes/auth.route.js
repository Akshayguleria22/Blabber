import express from "express";
import {
    signup,
    login,
    logout,
    updateProfile,
    googleAuth,
    googleCallback,
    githubAuth,
    githubCallback,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router()

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);
router.get("/github", githubAuth);
router.get("/github/callback", githubCallback);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user));

export default router;
