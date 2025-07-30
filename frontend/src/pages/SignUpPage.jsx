"use client";
import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import { useState } from 'react'
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
} from 'lucide-react'
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { useAuthStore } from "../store/useAuthStore";

const SignupPage = () => {

  const [showPass, setShowPass] = useState(false)

  const [formData, setFormData] = useState({
    firstname: "",
    lastname:"",
    email: "",
    password: "",
    confirm:"",
  });

  const {signup,isSigningUp}=useAuthStore()

  const validate = () => {
    if(!formData.firstname.trim()) return toast.error("First Name is required!")
    if (!formData.email.trim()) return toast.error("Email is required!")
    if(!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format!")
    if(!formData.password.trim()) return toast.error("Password is required!")
    if (formData.password.length < 6) return toast.error("Password must be at keast 6 characters!")
    if(formData.password!==formData.confirm) return toast.error("The password doesn't match!")
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validate()
    
    if(success===true) signup(formData)
  };
  return (
    <div className="flex items-center h-full justify-center">
      <div
        className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-xl text-center font-bold text-neutral-800 dark:text-neutral-200">
          Welcome to <br />
          Blabber - Chat App
        </h2>
        <p className="mt-2 max-w-sm text-sm text-center text-neutral-600 dark:text-neutral-300">
          Sign Up to the Blabber Now!!!
        </p>
        <form className="my-8" onSubmit={handleSubmit}>
          <div
            className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <LabelInputContainer>
              <Label htmlFor="firstname">First name</Label>
              <Input id="firstname" placeholder="Tyler" type="text" value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname">Last name</Label>
              <Input id="lastname" placeholder="Durden" type="text" value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} />
            </LabelInputContainer>
          </div>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" placeholder="projectmayhem@fc.com" type="email" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input id="password" placeholder="••••••••" type={showPass ? "text" : "password"} value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            <button type="button" className="relative w-2 h-0 bottom-10 left-85" onClick={()=>setShowPass(!showPass)}>
              {showPass ? (
                <EyeOff className="size-5 text-base-content/40" />
              ) : (
                  <Eye className="size-5 text-base-content/40" />
              )}
            </button>
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <Label htmlFor="confirmpassword">Confirm password</Label>
            <Input id="confirmpassword" placeholder="••••••••" type="password" value={formData.confirm}
              onChange={(e) => setFormData({ ...formData, confirm: e.target.value })} />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit" onClick={handleSubmit}>
            Sign up &rarr;
            <BottomGradient />
          </button>

          <div
            className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="flex flex-col space-y-4">
            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
              type="submit">
              <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                GitHub
              </span>
              <BottomGradient />
            </button>
            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
              type="submit">
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Google
              </span>
              <BottomGradient />
            </button>
            <h2 className="text-center">
              Already have an account? <span className="text-blue-500 cursor-pointer" onClick={() => window.location.href = "/login"}>LogIn</span>
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

export default SignupPage;
