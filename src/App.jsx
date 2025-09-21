import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import { Signupprovider } from './context/Signupcontext.jsx'


const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Signupprovider><Home /></Signupprovider>} />
        <Route path='/login' element={<Login />} />


        <Route path='/signup' element={<Signupprovider><Signup /></Signupprovider>} />


      </Routes>
    </>
  )
}

export default App
