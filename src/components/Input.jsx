import { useState } from 'react'

import { Usesign } from "../context/Signupcontext"
import Eye from './Eye'
import CloseEye from './CloseEye'

const Input = (props) => {

    const [pass, setpass] = useState(true)

    const { firstname, lastname, setfirstname, setlastname } = Usesign()

    const handlepassbox = ()=>{
        {pass ? setpass(false):setpass(true)}
    }

    const handlechange = (e) => {
        props.setherovalue(e.target.value)
    }
    const handlefst = (e) => {
        setfirstname(e.target.value)

    }
    const handlelst = (e) => {
        setlastname(e.target.value)

    }

    const password_input = (
        <div className='flex  items-center relative ' >
            <input type={pass ? "password" : "text"} value={props.herovalue} onChange={(e) => { handlechange(e) }} placeholder={props.placeholder} className=' w-full pl-4 py-3 text-white  box sm:w-[580px] bg-[#1F1F2B] text-[18px] outline-0 placeholder:text-[#A3A3A3] rounded-[10px] ' />
            <button onClick={handlepassbox} className=' absolute sm:right-8 right-3 flex justify-center items-center ' >
                {pass ? <CloseEye/> : <Eye />}

            </button>
        </div>
    )
    const normal = <input value={props.herovalue} onChange={(e) => { handlechange(e) }} placeholder={props.placeholder} className=' w-full pl-4 py-3 text-white  box sm:w-[580px] bg-[#1F1F2B] text-[18px] outline-0 placeholder:text-[#A3A3A3] rounded-[10px] ' type="text" />

    return (
        <div className=' flex-col flex justify-center gap-1 h-[120px] box-border ' >
            <h1 className=' text-xl text-white ' >{props.title}</h1>

            {props.cut ?
                <div className='flex justify-between items-center sm:w-[580px]' >
                    <input onChange={(e) => { handlefst(e) }} value={firstname} placeholder="First name" className='w-[44vw] sm:w-[49%] pl-4 py-3 text-white  bg-[#1F1F2B] text-[18px] outline-0 placeholder:text-[#A3A3A3] rounded-[10px] ' type="text" />
                    <input onChange={(e) => { handlelst(e) }} value={lastname} placeholder="Last name" className='w-[44vw] sm:w-[49%] pl-4 py-3 text-white  bg-[#1F1F2B] text-[18px] outline-0 placeholder:text-[#A3A3A3] rounded-[10px] ' type="text" />

                </div>

                : props.ispassword ? password_input : normal}


            <h1 className=' text-[18px] h-[28px] text-[#FF0038] ' >{props.error}</h1>


        </div>
    )
}

export default Input
