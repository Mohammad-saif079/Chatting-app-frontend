import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';


const LoginCheck = ({ children }) => {
  const navigate = useNavigate()

  async function fetchdata() {
    try{

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/valid`, {
        token: localStorage.getItem("AuthToken")
      })

      if (res.data.sucess) {
        // localStorage.setItem("AuthToken","")
    
        return navigate("/chats")
  
      }
    }
    catch(err){
      console.log("Network Error")
    }

  }
  fetchdata()

  return children
}

export default LoginCheck
