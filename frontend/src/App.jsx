import React from 'react'
import Navbar from "./components/Navbar"
import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import Settings from "./pages/Settings"
import SignUpPage from "./pages/SignUpPage.jsx"
import LoginPage from "./pages/LoginPage"
import ProfilePage from "./pages/ProfilePage"
import { useAuthStore } from "./store/useAuthStore.js"
import { useEffect } from 'react'
import { Loader } from "lucide-react"
import {Navigate} from "react-router-dom"
import {Toaster} from "react-hot-toast"


function App() {
  const { authUser, checkAuth,isCheckingAuth } = useAuthStore()
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  
  console.log({ authUser })
  
  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin"/>
    </div>
  )
  return (
    <>
      <div>
        <Navbar />


        <Routes>
          <Route path="/" element={authUser? <HomePage/>:<Navigate to="/login"/>} />
          <Route path="/signup" element={!authUser?<SignUpPage/>:<Navigate to="/"/>} />
          <Route path="/login" element={!authUser?<LoginPage/>:<Navigate to="/"/>} />
          <Route path="/settings" element={<Settings/>} />
          <Route path="/profile" element={authUser?<ProfilePage/>:<Navigate to="/login"/>} />
        </Routes>

        <Toaster/>
      </div>
    </>
  )
}

export default App
