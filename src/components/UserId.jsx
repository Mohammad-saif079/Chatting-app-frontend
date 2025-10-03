import React from 'react'
import Profile from './Profile'
import { useChat } from '../context/Chatcontext'

const UserId = (props) => {
    const { setchatbox, setcontact, setcontact_status } = useChat()

    const handlechat = async () => {
        setchatbox("flex")
        setcontact(props.fullname)
        
        props.status ? setcontact_status("Online") : setcontact_status("Offline")


    }


    return (
        <div onClick={handlechat} className="users h-[65px] ml-5 mb-1 flex items-center justify-between  w-[90%] ">
            <div className='flex gap-4 items-center' >
                <Profile />
                <div className='flex flex-col' >
                    <span className='text-2xl text-white ' >{props.fullname}</span>
                    <span className='text-[16px] text-[#a3a3a3] ' >{props.bio}</span>

                </div>
            </div>
            {props.status ? (<div className='text-white flex items-center gap-1 justify-center ' >
                <div className=' w-[13px] h-[13px] rounded-full bg-[#FFD700] ' ></div>
                <span className='text-[#FFD700]' >Online</span>
            </div>) : (
                <div className='text-white flex items-center gap-1 justify-center ' >
                    <div className=' w-[13px] h-[13px] rounded-full bg-[#FF0038] ' ></div>
                    <span className='text-[#FF0038]' >Offline</span>
                </div>
            )}

        </div>
    )
}

export default UserId
