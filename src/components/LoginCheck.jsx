import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';


const LoginCheck = ({ children }) => {
  const navigate = useNavigate()

  async function fetchdata() {

    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/valid`, {
      token: localStorage.getItem("AuthToken")
    })
    console.log(res.data.sucess)
    if (res.data.sucess) {
      // localStorage.setItem("AuthToken","")
      console.log("hello bro ")
      return navigate("/chats")

    }
  }
  fetchdata()

  return children
}

export default LoginCheck
