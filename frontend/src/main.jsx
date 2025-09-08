import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Initialize theme from localStorage early
const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
