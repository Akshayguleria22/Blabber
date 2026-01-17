import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { ENV } from "../lib/env.js";
import cloudinary from "../lib/cloudinary.js";
import crypto from "crypto";

const getBaseUrl = (req) => {
  const proto = (req.headers["x-forwarded-proto"] || req.protocol || "http").toString();
  const host = (req.headers["x-forwarded-host"] || req.get("host") || "localhost:3000").toString();
  return `${proto}://${host}`;
};

const oauthRedirect = (res) => {
  const target = ENV.CLIENT_URL ? `${ENV.CLIENT_URL}/chat` : "/";
  return res.redirect(target);
};

const randomPassword = () => `oauth-${crypto.randomUUID()}`;

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // check if emailis valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // 123456 => $dnjasdkasj_?dmsakmk
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // before CR:
      // generateToken(newUser._id, res);
      // await newUser.save();

      // after CR:
      // Persist user first, then issue auth cookie
      const savedUser = await newUser.save();
      generateToken(savedUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });

      try {
        await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    // never tell the client which one is incorrect: password or email

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const { profilePic, fullName, bio } = req.body;
    const update = {};

    if (typeof fullName === "string") {
      const trimmed = fullName.trim();
      if (trimmed.length < 2) return res.status(400).json({ message: "Full name is too short" });
      update.fullName = trimmed;
    }

    if (typeof bio === "string") {
      update.bio = bio.trim();
    }

    if (typeof profilePic === "string" && profilePic.trim()) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      update.profilePic = uploadResponse.secure_url;
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "No profile fields provided" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true }).select(
      "-password"
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const googleAuth = async (req, res) => {
  const { GOOGLE_CLIENT_ID } = ENV;
  if (!GOOGLE_CLIENT_ID) return res.status(500).json({ message: "GOOGLE_CLIENT_ID missing" });

  const redirectUri = `${getBaseUrl(req)}/api/auth/google/callback`;
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", GOOGLE_CLIENT_ID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("prompt", "select_account");

  res.redirect(url.toString());
};

export const googleCallback = async (req, res) => {
  try {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = ENV;
    const code = req.query.code;

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return res.status(500).json({ message: "Google OAuth env vars missing" });
    }
    if (!code) return res.status(400).json({ message: "Missing code" });

    const redirectUri = `${getBaseUrl(req)}/api/auth/google/callback`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: code.toString(),
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok) {
      return res.status(400).json({ message: "Google token exchange failed", details: tokenJson });
    }

    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` },
    });
    const profile = await userRes.json();
    if (!userRes.ok) {
      return res.status(400).json({ message: "Google userinfo failed", details: profile });
    }

    const email = profile.email;
    const fullName = profile.name || profile.given_name || profile.email?.split("@")[0] || "Google User";
    const profilePic = profile.picture || "";

    if (!email) return res.status(400).json({ message: "Google account missing email" });

    let user = await User.findOne({ email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword(), salt);
      user = await User.create({ fullName, email, password: hashedPassword, profilePic });
    } else {
      const update = {};
      const hasName = typeof user.fullName === "string" && user.fullName.trim().length > 0;
      if (!hasName || user.fullName === "Google User") update.fullName = fullName;
      if (!user.profilePic && profilePic) update.profilePic = profilePic;
      if (Object.keys(update).length > 0) {
        user = await User.findByIdAndUpdate(user._id, update, { new: true });
      }
    }

    generateToken(user._id, res);
    return oauthRedirect(res);
  } catch (error) {
    console.log("Error in googleCallback:", error);
    res.status(500).json({ message: "OAuth error" });
  }
};

export const githubAuth = async (req, res) => {
  const { GITHUB_CLIENT_ID } = ENV;
  if (!GITHUB_CLIENT_ID) return res.status(500).json({ message: "GITHUB_CLIENT_ID missing" });

  const redirectUri = `${getBaseUrl(req)}/api/auth/github/callback`;
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", GITHUB_CLIENT_ID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "read:user user:email");

  res.redirect(url.toString());
};

export const githubCallback = async (req, res) => {
  try {
    const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = ENV;
    const code = req.query.code;

    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
      return res.status(500).json({ message: "GitHub OAuth env vars missing" });
    }
    if (!code) return res.status(400).json({ message: "Missing code" });

    const redirectUri = `${getBaseUrl(req)}/api/auth/github/callback`;

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code.toString(),
        redirect_uri: redirectUri,
      }),
    });

    const tokenJson = await tokenRes.json();
    if (!tokenRes.ok || !tokenJson.access_token) {
      return res.status(400).json({ message: "GitHub token exchange failed", details: tokenJson });
    }

    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenJson.access_token}`, "User-Agent": "chatify" },
    });
    const ghUser = await userRes.json();
    if (!userRes.ok) {
      return res.status(400).json({ message: "GitHub user fetch failed", details: ghUser });
    }

    const emailsRes = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${tokenJson.access_token}`, "User-Agent": "chatify" },
    });
    const emails = await emailsRes.json();

    const primary = Array.isArray(emails)
      ? emails.find((e) => e.primary && e.verified) || emails.find((e) => e.verified) || emails[0]
      : null;

    const email = primary?.email;
    const fullName = ghUser.name || ghUser.login || "GitHub User";
    const profilePic = ghUser.avatar_url || "";

    if (!email) return res.status(400).json({ message: "GitHub account missing email" });

    let user = await User.findOne({ email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword(), salt);
      user = await User.create({ fullName, email, password: hashedPassword, profilePic });
    } else {
      const update = {};
      const hasName = typeof user.fullName === "string" && user.fullName.trim().length > 0;
      if (!hasName || user.fullName === "GitHub User") update.fullName = fullName;
      if (!user.profilePic && profilePic) update.profilePic = profilePic;
      if (Object.keys(update).length > 0) {
        user = await User.findByIdAndUpdate(user._id, update, { new: true });
      }
    }

    generateToken(user._id, res);
    return oauthRedirect(res);
  } catch (error) {
    console.log("Error in githubCallback:", error);
    res.status(500).json({ message: "OAuth error" });
  }
};
