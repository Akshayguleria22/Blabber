import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="min-h-screen hero bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-extrabold">Blabber</h1>
          <p className="py-6 text-lg opacity-80">
            Real-time chat with typing indicators, media sharing, and a clean UI. Connect instantly with your friends and team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup" className="btn btn-primary w-48">Get started</Link>
            <Link to="/login" className="btn btn-outline w-48">Log in</Link>
            <Link to="/settings" className="btn btn-ghost w-48">Settings</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage

