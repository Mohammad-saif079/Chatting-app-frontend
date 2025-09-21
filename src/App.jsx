import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home.jsx"

import Signup from "./pages/Signup.jsx"
import { Signupprovider } from './context/Signupcontext.jsx'
import Chat from './pages/Chat.jsx'


const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Signupprovider><Home /></Signupprovider>} />
        <Route path='/chats' element={<Chat />} />


        <Route path='/signup' element={<Signupprovider><Signup /></Signupprovider>} />


      </Routes>
    </>
  )
}

export default App
