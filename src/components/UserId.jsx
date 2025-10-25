import React from 'react'
import Profile from './Profile'
import { useChat } from '../context/Chatcontext'
import { useNavigate } from 'react-router-dom'
import Verified from './Verified'

const UserId = (props) => {
    const { setchatbox, setcontact, setcontact_status } = useChat()
    const navigate = useNavigate()
    const handlechat = async () => {
        navigate(`/chats/${props.username}`, { replace: true })
        setchatbox("flex")
        setcontact(props.fullname)

        props.status ? setcontact_status("Online") : setcontact_status("Offline")


    }


    return (
        <div onClick={handlechat} className="users h-[65px] ml-5 mb-1 flex items-center justify-between  w-[90%] ">
            <div className='flex gap-4 items-center' >
                {props.profile == "default" ? (<Profile />) :
                    <div style={{ backgroundImage: `url(${props.profile})` }} className={`bg-cover bg-center w-[50px] h-[50px] rounded-full `} >

                    </div>
                }

                <div className='flex flex-col' >
                    <div className="flex items-center justify-start gap-1.5" >
                        <div className='text-2xl text-white ' >{props.fullname}</div>
                        {props.isAdmin?(<Verified />):("")}
                        


                    </div>
                    <span className='text-[16px] text-[#a3a3a3] ' >{props.bio}</span>

                </div>
            </div>
            {props.status ? (<div className='text-white flex items-center gap-1 justify-center ' >

                <span className='text-[#a3a3a3]' >Active</span>
            </div>) : (
                <div className='text-white flex items-center gap-1 justify-center ' >

                    <span className='text-[#a3a3a3]' >{props.lastseen}</span>
                </div>
            )}

        </div>
    )
}

export default UserId
