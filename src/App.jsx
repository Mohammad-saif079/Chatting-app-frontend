import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home.jsx"

import Signup from "./pages/Signup.jsx"
import { Signupprovider } from './context/Signupcontext.jsx'
import Chat from './pages/Chat.jsx'
import { ChatProvider } from './context/Chatcontext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Signupprovider><Home /></Signupprovider>} />
        <Route path='/signup' element={<Signupprovider><Signup /></Signupprovider>} />
        <Route path='/chats/:chatid?' element={<ProtectedRoute><ChatProvider><Chat /></ChatProvider></ProtectedRoute>} />


      </Routes>
    </>
  )
}

export default App
