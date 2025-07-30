import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js'

const HomePage = () => {
  const {authUser}=useAuthStore()
  return (
    <div>
      hello
    </div>
  )
}

export default HomePage
