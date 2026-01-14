import { useState, useEffect } from 'react'
import SignHead from '../components/SignHead'
import Input from '../components/Input'
import DotsIcon from '../components/DotsIcon'
import { Usesign } from '../context/Signupcontext.jsx'
import { gsap } from "gsap";
import axios from "axios"
import Toaster from '../components/Toaster.jsx'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [loading, setloading] = useState(false)
  const { username, password, setusername, setpassword, err2, err3, seterr2, seterr3 } = Usesign()
  const navigate = useNavigate()
  const handleLogin = async () => {
    if (!loading) {

      let valid = true
      //username
      if (username.trim() === "") {
        seterr2("*Required")
        valid = false
      } else {
        seterr2("")
      }
      //password
      if (password.trim() === "") {
        seterr3("*Required")
        valid = false;
      } else {
        seterr3("")
      }
      if (valid) {
        setloading(true)




        // You can call your API or next steps here
        try {
          const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/authuser`, {
            username: username.trim(),
            password: password.trim()
          })
    
          if (res.data.sucess) {
            const tl = gsap.timeline()
            tl.to(".toaster", {
              y: 20,
              duration: 0.9,
              scale: 1,
              ease: "power4.out"
            })
            tl.to(".toaster", {
              y: "-100%",
              duration: 0.9,
              scale: 1,
              ease: "power4.out",
              onComplete:()=>{
            
                localStorage.setItem("AuthToken",res.data.token)
                navigate("/chats",{replace:true})

              }
            })

          }
          else {

            seterr2(res.data.message)
            setloading(false)
          }

        }
        catch (err) {
          seterr2("Network Error")
          setloading(false)
        }

      }
    } else { }



  }

  useEffect(() => {
    gsap.to(".loader", {
      rotate: 360,
      duration: 2,
      repeat: -1,
      ease: "linear"
    })
  }, [loading])




  return (
    <div className=' w-[100vw] h-[100svh] relative bg-[#0B0B0F]   flex items-center justify-center '>
      <div className='absolute top-7 flex flex-col justify-center items-center gap-2 sm:gap-0 ' >
        <SignHead size={50} create={true} />

        <div className=' overflow-hidden sm:w-[600px] w-[90vw] flex flex-col justify-center '>
          <h1 className='sm:w-[full] w-[90vw] mx-0 my-1 text-white text-3xl '>Login account</h1>

          <Input title="Username* OR Email*" placeholder="Username/Email" error={err2} herovalue={username} setherovalue={setusername} />
          <Input title="Password*" ispassword={true} placeholder="Password" error={err3} herovalue={password} setherovalue={setpassword} />

          <button onClick={handleLogin} className=' sm:w-[580px] overflow-hidden flex justify-center items-center rounded-[10px] py-3 text-[18px] w-full bg-[#FFD700] text-[#0B0B0F] font-semibold ' >
            {loading ? (
              <div className='loader' >
                <DotsIcon />
              </div>
            ) : "Login account"}
          </button>
        </div>

      </div>
      <div className=' toaster fixed top-0 translate-y-[-100%] scale-[1] ' >
        <Toaster />
      </div>


    </div>


  )
}

export default Home
