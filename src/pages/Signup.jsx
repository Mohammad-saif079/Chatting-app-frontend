import SignHead from '../components/SignHead'
import Input from '../components/Input'
import { useState, useEffect } from "react"
import { Usesign } from "../context/Signupcontext.jsx"
import { gsap } from "gsap";
import DotsIcon from '../components/DotsIcon.jsx';

const Signup = () => {
  const { firstname, lastname, password, setpassword, username, setusername, confirmpass, setconfirmpass } = Usesign()
  const { err1, err2, err3, err4, seterr1, seterr2, seterr3, seterr4 } = Usesign()
  const [loading, setloading] = useState(false)
  //function for submission

  const handlecreateaccount = () => {
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
          if (lastname.trim() === "") {
            seterr1("*Last name is required");
            valid = false;
          }
          else {
            seterr1("")
          }
        }

      }


      if (username.trim() === "") {
        seterr2("*Required")
        valid = false
      } else {
        seterr2("")
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
        console.log("✅ Account creation passed all checks!");

        // You can call your API or next steps here
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


    <div className=' w-[100vw] h-[100svh] relative bg-[#0B0B0F]  flex items-center justify-center '>
      <div className='absolute top-7 flex flex-col justify-center items-center gap-2 sm:gap-0 ' >
        <SignHead size={50} />

        <div className=' overflow-hidden sm:w-[600px] w-[90vw] flex flex-col justify-center '>
          <h1 className='sm:w-[full] w-[90vw] mx-0 my-1 text-white text-3xl '>Create account</h1>

          <Input title="Enter full name*" cut={true} error={err1} />
          <Input title="Choose a username*" placeholder="Username" error={err2} herovalue={username} setherovalue={setusername} />
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


    </div>

  )
}

export default Signup
