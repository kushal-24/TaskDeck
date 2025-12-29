import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './Pages/LandingPage'
import Login from './Pages/Login'
import SignUp from './Pages/Signup'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Login/>
      <SignUp/> */}
      <LandingPage/>
      </>
  )
}

export default App
