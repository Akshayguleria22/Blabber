import 'dotenv/config'; // ensure env is loaded before using process.env
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.model.js"; // adjust path if needed

const requireEnv = (k) => {
  if (!process.env[k]) throw new Error(`Missing env: ${k}`);
  return process.env[k];
};

// Google
passport.use(
  new GoogleStrategy(
    {
      clientID: requireEnv("GOOGLE_CLIENT_ID"),
      clientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
      callbackURL: `${process.env.SERVER_URL || "http://localhost:5000"}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const first = profile.name?.givenName || profile.displayName?.split(" ")?.[0] || "User";
        const last = profile.name?.familyName || profile.displayName?.split(" ")?.slice(1)?.join(" ") || "";
        const photo = profile.photos?.[0]?.value || "";
        const email = profile.emails?.find((e) => e.verified)?.value || profile.emails?.[0]?.value || "";

        let user = email ? await User.findOne({ email }) : null;
        if (!user) user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            firstname: first,
            lastname: last,
            email,
            googleId: profile.id,
            profilePic: photo,
            password: Math.random().toString(36).slice(2) + Date.now(),
          });
        } else {
          if (!user.googleId) user.googleId = profile.id;
          if (photo && !user.profilePic) user.profilePic = photo;
          await user.save();
        }
        return done(null, user);
      } catch (e) {
        return done(e, null);
      }
    }
  )
);

// GitHub
passport.use(
  new GitHubStrategy(
    {
      clientID: requireEnv("GITHUB_CLIENT_ID"),
      clientSecret: requireEnv("GITHUB_CLIENT_SECRET"),
      callbackURL: `${process.env.SERVER_URL || "http://localhost:5000"}/api/auth/github/callback`,
      scope: ["user:email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const first = profile.displayName?.split(" ")?.[0] || "User";
        const last = profile.displayName?.split(" ")?.slice(1)?.join(" ") || "";
        const photo = profile.photos?.[0]?.value || "";
        const email =
          profile.emails?.find((e) => e.primary && e.verified)?.value ||
          profile.emails?.[0]?.value ||
          "";

        let user = email ? await User.findOne({ email }) : null;
        if (!user) user = await User.findOne({ githubId: profile.id });

        if (!user) {
          user = await User.create({
            firstname: first,
            lastname: last,
            email,
            githubId: profile.id,
            profilePic: photo,
            password: Math.random().toString(36).slice(2) + Date.now(),
          });
        } else {
          if (!user.githubId) user.githubId = profile.id;
          if (photo && !user.profilePic) user.profilePic = photo;
          await user.save();
        }
        return done(null, user);
      } catch (e) {
        return done(e, null);
      }
    }
  )
);

export default passport;
