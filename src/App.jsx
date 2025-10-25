import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home.jsx"

import Signup from "./pages/Signup.jsx"
import { Signupprovider } from './context/Signupcontext.jsx'
import Chat from './pages/Chat.jsx'
import { ChatProvider } from './context/Chatcontext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { useAuth } from './context/Authcontext.jsx'
import LoginCheck from './components/LoginCheck.jsx'

const App = () => {

  return (

    <>
      <Routes>
        <Route path='/' element={<LoginCheck><Signupprovider><Home /></Signupprovider></LoginCheck>} />
        <Route path='/signup' element={<LoginCheck><Signupprovider><Signup /></Signupprovider></LoginCheck>} />
        <Route path='/chats/:chatid?' element={<ProtectedRoute><ChatProvider><Chat /></ChatProvider></ProtectedRoute>} />


      </Routes>
    </>
  )
}

export default App
