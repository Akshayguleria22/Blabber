"use client";
import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore.js";
import { useState } from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import {
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";

const LoginPage = () => {

  const [showPass, setShowPass] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Use the correct loading flag; fallback to the old typo if still present
  const { isLoggingIn, isLoggingIng, login } = useAuthStore()
  const loading = isLoggingIn || isLoggingIng;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  const handleOAuth = (provider) => {
    // Redirect to backend OAuth endpoint
    window.location.href = `${API_URL}/api/auth/${provider}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-10">
      <div
        className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-xl text-center font-bold text-neutral-800 dark:text-neutral-200">
          Welcome Back!!!
        </h2>
        <p className="mt-2 max-w-sm text-sm text-center text-neutral-600 dark:text-neutral-300">
          Log In Now
        </p>
        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" placeholder="projectmayhem@fc.com" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                placeholder="••••••••"
                type={showPass ? "text" : "password"}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label={showPass ? 'Hide password' : 'Show password'}
                title={showPass ? 'Hide password' : 'Show password'}
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-2 flex items-center text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300 focus:outline-none"
              >
                {showPass ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit" disabled={loading}>
            {
              loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="size-5 animate-spin" />
                  <h2 className="text-gray-200">Loading...</h2>
                </div>
              ) : (<div>Log In &rarr;</div>)
            }
            <BottomGradient />
          </button>

          <div
            className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="flex flex-col space-y-4">
            {/* OAuth buttons must NOT submit the form */}
            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
              type="button"
              onClick={() => handleOAuth("github")}
            >
              <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Continue with GitHub
              </span>
              <BottomGradient />
            </button>
            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
              type="button"
              onClick={() => handleOAuth("google")}
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Continue with Google
              </span>
              <BottomGradient />
            </button>
            <h2 className="text-center">
              Don't have an account? <span className="text-blue-500 cursor-pointer" onClick={() => window.location.href = "/signup"}>SignUp</span>
            </h2>
          </div>
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span
        className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span
        className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default LoginPage;
