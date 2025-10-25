import SignHead from '../components/SignHead'
import Input from '../components/Input'
import { useState, useEffect } from "react"
import { Usesign } from "../context/Signupcontext.jsx"
import { useChat } from '../context/Chatcontext.jsx';
import { gsap } from "gsap";
import DotsIcon from '../components/DotsIcon.jsx';
import Toaster from '../components/Toaster.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { firstname, lastname, password, setpassword, username, email, setemail, setusername, confirmpass, setconfirmpass } = Usesign()
  const { err1, err5, err2, err3, err4, seterr1, seterr2, seterr3, seterr4, seterr5 } = Usesign()
  const { mainid, setmainid } = useChat()

  const [loading, setloading] = useState(false)
  //function for submission
  const navigate = useNavigate()
  const handlecreateaccount = async () => {
    if (!loading) {
      let valid = true;

      // First Name


      if (firstname.trim() === "" && lastname.trim() === "") {
        seterr1("*Required");
        valid = false;
      } else {
        if (firstname.trim() === "") {
          seterr1("*First name is required");
          valid = false;
        } else {
          seterr1("")
        }

      }


      if (username.trim() === "") {
        seterr2("*Required")
        valid = false
      } else {
        seterr2("")
      }
      if (email.trim() === "") {
        seterr5("*Required")
        valid = false
      } else {
        seterr5("")
      }

      // Password
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

      // Confirm Password
      if (confirmpass.trim() === "") {
        seterr4("*Required");
        valid = false;

      } else {
        if (confirmpass !== password) {
          seterr4("*Passwords do not match");
          valid = false;
        } else {
          seterr4("");
        }
      }



      // If valid, proceed with submission
      if (valid) {
        setloading(true)
        try {
          const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/createuser`, {
            fullname: (firstname.trim() + " " + lastname.trim()).trim(),
            email: email.trim(),
            username: username.trim(),
            password: password.trim()
          })

          console.log(response.data)
          if (!response.data.success) {
            if (response.data.errorcode == 0) {
              seterr5(response.data.errors[0])
            }
            if (response.data.errorcode == 456) {
              seterr2(`Try ${response.data.suggestions[1]}`)
            }

          } else {
            localStorage.setItem("AuthToken", response.data.token)
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
              onComplete: () => {
                
                setmainid(response.data.user.id)
                // console.log("account created")
                navigate("/chats",{replace:true})
              }
            })

          }
          setloading(false)
        }
        catch {
          setloading(false)
          console.log("network error")
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



    <div className=' w-[100vw] h-[100svh] relative  flex items-center justify-center '>
      <div className='absolute top-7  flex flex-col justify-center items-center gap-2 sm:gap-0 ' >
        <SignHead size={50} />

        <div className='  overflow-hidden  sm:w-[600px] w-[90vw] flex flex-col justify-center '>
          <h1 className='sm:w-[full] w-[90vw] mx-0 my-1 text-white text-3xl '>Create account</h1>

          <Input title="Enter full name*" cut={true} error={err1} />
          <Input title="Choose a username*" placeholder="Username" error={err2} herovalue={username} setherovalue={setusername} />
          <Input title="Choose an Email*" placeholder="Email" error={err5} herovalue={email} setherovalue={setemail} />
          <Input title="Choose a password*" ispassword={true} placeholder="Password" error={err3} herovalue={password} setherovalue={setpassword} />
          <Input title="Confirm password*" ispassword={true} placeholder="Re-enter" error={err4} herovalue={confirmpass} setherovalue={setconfirmpass} />
          <button onClick={handlecreateaccount} className='mb-7 sm:w-[580px] overflow-hidden flex justify-center items-center rounded-[10px] py-3 text-[18px] w-full bg-[#FFD700] text-[#0B0B0F] font-semibold ' >
            {loading ? (
              <div className='loader' >
                <DotsIcon />
              </div>
            ) : "Create account"}
          </button>
        </div>

      </div>
      <div className=' toaster fixed top-0 translate-y-[-100%] scale-[1] ' >
        <Toaster />
      </div>



    </div>


  )
}

export default Signup
