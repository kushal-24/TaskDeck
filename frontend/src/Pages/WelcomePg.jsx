import React from 'react'
import { useNavigate } from 'react-router-dom'

function WelcomePg() {
    const navigate=useNavigate()
    console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);

  return (
    <div 
    onClick={()=> navigate('/login')}
    className='h-screen cursor-pointer w-full justify-center items-center flex text-4xl'>Welcome to TaskDeck, Your SOUL platform for Project management</div>
  )
}

export default WelcomePg