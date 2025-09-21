import { useState, useEffect } from 'react'
import SignHead from '../components/SignHead'
import Input from '../components/Input'
import DotsIcon from '../components/DotsIcon'
import { Usesign } from '../context/Signupcontext.jsx'
import { gsap } from "gsap";

const Home = () => {
  const [loading, setloading] = useState(false)
  const { username, password, setusername, setpassword, err2, err3, seterr2, seterr3 } = Usesign()

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
        if (password.length < 6) {
          seterr3("*Password must be at least 6 characters");
          valid = false;
        } else {
          seterr3("");
        }
      }
      if (valid) {
        setloading(true)
        console.log("✅ Account login passed all checks!");

        // You can call your API or next steps here
      }
    }else{}



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
    <div className=' w-[100vw] h-[100svh] relative bg-[#0B0B0F]  flex items-center justify-center '>
      <div className='absolute top-7 flex flex-col justify-center items-center gap-2 sm:gap-0 ' >
        <SignHead size={50} create={true} />

        <div className=' overflow-hidden sm:w-[600px] w-[90vw] flex flex-col justify-center '>
          <h1 className='sm:w-[full] w-[90vw] mx-0 my-1 text-white text-3xl '>Login account</h1>

          <Input title="Username*" placeholder="Username" error={err2} herovalue={username} setherovalue={setusername} />
          <Input title="Password*" placeholder="Password" error={err3} herovalue={password} setherovalue={setpassword} />

          <button onClick={handleLogin} className=' sm:w-[580px] overflow-hidden flex justify-center items-center rounded-[10px] py-3 text-[18px] w-full bg-[#FFD700] text-[#0B0B0F] font-semibold ' >
            {loading ? (
              <div className='loader' >
                <DotsIcon />
              </div>
            ) : "Login account"}
          </button>
        </div>

      </div>


    </div>


  )
}

export default Home
