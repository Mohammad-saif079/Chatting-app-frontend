import React from 'react'
import Profile from './Profile'
import { useChat } from '../context/Chatcontext'
import { useNavigate } from 'react-router-dom'
import Verified from './Verified'
import axios from 'axios'
import BgWithSkeleton from './SkeletalBg'

const UserId = (props) => {
    const { setmessages, setchatbox, setcontact, setcontact_status, setchatselected, setmsgloading, setpfp } = useChat()
    const navigate = useNavigate()

    const handlechat = async () => {
        if (props.username === props.userone) {
            return;
        }

        if (props.username === props.chatIdRef.current) {
            return;
        }
        props.setCursor(null);
        props.setHasMore(true);
        setmessages([]);

        navigate(`/chats/${props.username}`, { replace: true })
        await props.setchattid(props.username)
        props.updateref(props.username)
        props.setmssginput("")
        setchatbox("flex")
        setchatselected(true)
        setmsgloading(true)
        const selecteduser = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/searchuser`, {
            username: props.username,
            token: localStorage.getItem("AuthToken")
        })
        const selecteduser_data = selecteduser.data[0]
        props.setslctuserglobe(selecteduser_data)
        setcontact(selecteduser_data.fullname)
        { selecteduser_data.status ? setcontact_status("Online") : setcontact_status("Offline") }
        setpfp(selecteduser_data.profilePic)
        const clear = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/clearunread`, {
            userone: props.userone,
            usertwo: props.id,
            token: localStorage.getItem("AuthToken")
        })

        const users = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/alladmins`, {
            contacts: clear.data.contacts,
            token: localStorage.getItem("AuthToken")
        })

        props.setuser(users.data.users)


        const resMsgs = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/msg/getmessages`,
            {
                userone: props.userone,
                usertwo: props.username,
                limit: 9,
                token: localStorage.getItem("AuthToken")
            }
        );
        setmessages(resMsgs.data.messages)
        props.setCursor(resMsgs.data.nextCursor);
        props.setHasMore(resMsgs.data.hasMore);

        setmsgloading(false)



    }


    return (
        <div onClick={handlechat} className="users relative md:static h-[65px] ml-5 mb-1 flex items-center justify-between  w-[100%] md:w-[90%] ">
            <div className='flex gap-4 items-center' >
                {props.profile == "default" ? (<Profile />) :
                    // <div style={{ backgroundImage: `url(${props.profile})` }} className={`bg-cover bg-center w-[50px] h-[50px] rounded-full `} >

                    // </div>
                    <BgWithSkeleton imageUrl={props.profile} size={50} />
                }

                <div className='flex flex-col' >
                    <div className="flex items-center justify-start gap-1.5" >
                        <div className='text-2xl text-white ' >{props.fullname}</div>
                        {props.isAdmin ? (<Verified />) : ("")}



                    </div>
                    {props.unreadmessages > 0 ? (
                        <span className="text-[16px] font-semibold text-[#ffffff]">{props.unreadmessages} unread messages</span>

                    ) : (
                        <span className="text-[16px] text-[#a3a3a3]">{props.bio}</span>
                    )}

                </div>
            </div>
            <div className='text-white flex items-center gap-1 justify-center absolute right-10 md:static  ' >

                <span className='text-[#a3a3a3]' >{props.lastseen}</span>
            </div>

        </div >
    )
}

export default UserId
