import { useState, useEffect, useRef } from 'react'
import Logo from '../components/Logo'
import SettingIcon from '../components/SettingIcon'
import GlobalInput from '../components/GlobalInput'
import SearchIcon from '../components/SearchIcon'
import UserId from '../components/UserId'
import SendIcon from '../components/SendIcon'
import Profile from '../components/Profile'
import ThreeDots from '../components/ThreeDots'
import Message from '../components/Message'
import Lenis from '@studio-freight/lenis'
import { useChat } from '../context/Chatcontext'
import { useParams } from 'react-router-dom'
import bgpic from "../assets/doodle.png"
import { useNavigate } from 'react-router-dom'
import Logout from '../components/Logout'
import DotsIcon from '../components/DotsIcon'
import { gsap } from "gsap";
import axios from 'axios'
import { Timeline } from 'gsap/gsap-core'

const Chat = () => {
    const navigate = useNavigate()


    const [search, setsearch] = useState("")
    const { mainid, contact, contact_status, setcontact, setcontact_status, setmainid, chatbox, setchatbox } = useChat()

    const [mainloading, setmainloading] = useState("flex")
    const [logoutLoad, setlogoutLoad] = useState(false)
    // refs for scrollable containers
    const userBoxRef = useRef(null)
    const msgContainerRef = useRef(null)

    const handlechatback = () => {

        setchatbox("hidden")
        navigate("/chats", { replace: true })
    }
    const handlelogout = async () => {
        setlogoutLoad(true)
        console.log(mainid)
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {
            _id: mainid
        })
        setmainid("")
        localStorage.setItem("AuthToken", "")

        navigate("/", { replace: true })
        setlogoutLoad(false)
    }






    const message_data = [
        {
            sender_id: "651f2b4c8f0e4d23a1c7e9b5",
            receiver_id: "652a1c64a9d2e317f4b8c6d1",
            message: "Hey baby, guess what? 😏",
            timestamp: "20:55"
        },
        {
            sender_id: "652a1c64a9d2e317f4b8c6d1",
            receiver_id: "651f2b4c8f0e4d23a1c7e9b5",
            message: "Uh oh… this sounds sus already 😂 what?",
            timestamp: "20:56"
        },
        {
            sender_id: "651f2b4c8f0e4d23a1c7e9b5",
            receiver_id: "652a1c64a9d2e317f4b8c6d1",
            message: "I just realized… my hoodie misses you more than I do 🥺",
            timestamp: "20:57"
        },
        {
            sender_id: "652a1c64a9d2e317f4b8c6d1",
            receiver_id: "651f2b4c8f0e4d23a1c7e9b5",
            message: "Bruh not the hoodie again 😭 you want it back?",
            timestamp: "20:58"
        },
        {
            sender_id: "651f2b4c8f0e4d23a1c7e9b5",
            receiver_id: "652a1c64a9d2e317f4b8c6d1",
            message: "Nooo, keep it. Looks cuter on you anyway 😘",
            timestamp: "20:59"
        },
        {
            sender_id: "652a1c64a9d2e317f4b8c6d1",
            receiver_id: "651f2b4c8f0e4d23a1c7e9b5",
            message: "Stop it, I’m blushing rn 🫣",
            timestamp: "21:00"
        },
        {
            sender_id: "651f2b4c8f0e4d23a1c7e9b5",
            receiver_id: "652a1c64a9d2e317f4b8c6d1",
            message: "Blushing looks good, but smiling looks *perfect* on you ❤️",
            timestamp: "21:01"
        },
        {
            sender_id: "652a1c64a9d2e317f4b8c6d1",
            receiver_id: "651f2b4c8f0e4d23a1c7e9b5",
            message: "Okay Mr. Smooth-talker, what did you eat today? 😆",
            timestamp: "21:03"
        },
        {
            sender_id: "651f2b4c8f0e4d23a1c7e9b5",
            receiver_id: "652a1c64a9d2e317f4b8c6d1",
            message: "Only breakfast… was waiting for my dinner date 😏",
            timestamp: "21:04"
        },
        {
            sender_id: "652a1c64a9d2e317f4b8c6d1",
            receiver_id: "651f2b4c8f0e4d23a1c7e9b5",
            message: "👀 Dinner date? With who?",
            timestamp: "21:05"
        },
        {
            sender_id: "651f2b4c8f0e4d23a1c7e9b5",
            receiver_id: "652a1c64a9d2e317f4b8c6d1",
            message: "With the prettiest girl alive… you ofc ❤️",
            timestamp: "21:06"
        },
        {
            sender_id: "652a1c64a9d2e317f4b8c6d1",
            receiver_id: "651f2b4c8f0e4d23a1c7e9b5",
            message: "Cheesy AF but I’ll allow it 🤭",
            timestamp: "21:07"
        },
        {
            sender_id: "651f2b4c8f0e4d23a1c7e9b5",
            receiver_id: "652a1c64a9d2e317f4b8c6d1",
            message: "Wait till dessert, my lines get sweeter 😎🍫",
            timestamp: "21:08"
        },
        {
            sender_id: "652a1c64a9d2e317f4b8c6d1",
            receiver_id: "651f2b4c8f0e4d23a1c7e9b5",
            message: "STOP 😂 you’re literally impossible.",
            timestamp: "21:09"
        },
        {
            sender_id: "651f2b4c8f0e4d23a1c7e9b5",
            receiver_id: "652a1c64a9d2e317f4b8c6d1",
            message: "Impossible? Nahhh… I’m inevitable, Thanos style 😏💜",
            timestamp: "21:10"
        },
        {
            sender_id: "652a1c64a9d2e317f4b8c6d1",
            receiver_id: "651f2b4c8f0e4d23a1c7e9b5",
            message: "LMAOOO okay big guy, calm down 😂",
            timestamp: "21:11"
        },
        {
            sender_id: "652a1c64a9d2e317f4b8c6d1",
            receiver_id: "651f2b4c8f0e4d23a1c7e9b5",
            message: "Okay i will talk to you later",
            timestamp: "21:12"
        }
    ]


    const [users, setusers] = useState([])
    const [messages, setmessages] = useState(message_data)

    //lenis function
    const LenisStart = async () => {
        const createLenis = (element) => {
            const lenis = new Lenis({
                wrapper: element,
                content: element,
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                smoothTouch: false,
            })
            function raf(time) {
                lenis.raf(time)
                requestAnimationFrame(raf)
            }
            requestAnimationFrame(raf)
            return lenis
        }

        const lenisUser = createLenis(userBoxRef.current)
        const lenisMsg = createLenis(msgContainerRef.current)

        return () => {
            lenisUser.destroy()
            lenisMsg.destroy()
        }
    }
    //loader animation useEffect
    useEffect(() => {
        gsap.to(".loader", {
            rotate: 360,
            duration: 2,
            repeat: -1,
            ease: "linear"
        })
    }, [logoutLoad])

    useEffect(() => {
        async function fetchdata() {

            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/valid`, {
                token: localStorage.getItem("AuthToken")
            })
            setmainid(res.data.data)
            const users = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/allusers`)
            console.log(users.data)
            setusers(users.data.users)
            LenisStart()

            setmainloading("hidden")

        }
        fetchdata()



    }, [])

   


    return (

        <div className="mainchat md:flex-row gap-0 flex-col flex md:gap-2">
            {/* Sidebar */}
            <div className="sidenavbar  md:h-[100svh] W-[90px] flex md:flex-col justify-between items-center">
                <div className="m-5 flex items-center gap-3 justify-center ">
                    <Logo size={50} />
                    <h1 className='text-3xl text-[#ffd700] font-medium flex md:hidden '  >WhatsApp</h1>
                </div>
                <div className='flex md:flex-col justify-center items-center'>


                    <button className="m-1 flex justify-center items-center " onClick={handlelogout} >
                        {logoutLoad ? (<div className='loader' ><DotsIcon color='#fff' size={37} /></div>) : (<Logout size={40} />)}

                    </button>

                    <button className="m-5">
                    
                        <Profile size={40} />
                    </button>
                </div>
            </div>

            {/* Users */}
            <div className="md:h-[100svh] h-[calc(100svh-90px)] md:w-[40%] w-[100%] ">
                <div className="relative searchbox w-[calc(100%-40px)] md:m-5 mx-5 mb-5 flex justify-center items-center gap-3">
                    <GlobalInput placeholder={"Search a User by Username"} />
                    <button className='absolute right-2  p-2 ' >
                        <SearchIcon  />
                    </button>
                </div>

                <div
                    id="userbox"
                    ref={userBoxRef}
                    className="md:h-[calc(100%-91px)] h-[calc(100%-71px)] overflow-y-scroll">
                    {users.map((user) => {
                        const new_bio =
                            user.bio.length > 26 ? user.bio.slice(0, 26) + "..." : user.bio;
                        const date = new Date(user.lastSeen);
                        const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

                        return (
                            <UserId
                                id={user._id}
                                key={user.username}
                                fullname={user.fullname}
                                status={user.status}
                                bio={new_bio}
                                profile={user.profilePic}
                                lastseen={time}
                                username={user.username}
                                isAdmin={user.isAdmin}XZ 
                            />
                        );
                    })}




                </div>
            </div>

            {/* Chat Area */}
            <div className={` bg-[#0B0B0F] chatarea ${chatbox}  md:flex md:w-[calc(100vw-40%)] w-[100%] fixed md:top-0 md:static flex-col`} >
                {/* Header */}
                <div className="m-5 flex justify-between items-center">
                    <div className='flex items-center justify-center gap-3 ' >
                        <button onClick={handlechatback} className='md:hidden flex' >
                            <svg xmlns="http://www.w3.org/2000/svg" width="45" viewBox="0 0 52 52" fill="none">
                                <path
                                    d="M36.8355 20.5836H16.0572L18.8739 17.7886C19.2819 17.3806 19.5111 16.8272 19.5111 16.2502C19.5111 15.6733 19.2819 15.1199 18.8739 14.7119C18.4659 14.3039 17.9125 14.0747 17.3355 14.0747C16.7586 14.0747 16.2052 14.3039 15.7972 14.7119L9.29722 21.2119C9.09996 21.418 8.94534 21.6609 8.84222 21.9269C8.62551 22.4544 8.62551 23.0461 8.84222 23.5736C8.94534 23.8395 9.09996 24.0825 9.29722 24.2886L15.7972 30.7886C15.9986 30.9917 16.2383 31.1528 16.5023 31.2628C16.7663 31.3728 17.0495 31.4295 17.3355 31.4295C17.6216 31.4295 17.9048 31.3728 18.1688 31.2628C18.4328 31.1528 18.6725 30.9917 18.8739 30.7886C19.077 30.5872 19.2381 30.3475 19.3481 30.0835C19.4581 29.8195 19.5148 29.5363 19.5148 29.2502C19.5148 28.9642 19.4581 28.681 19.3481 28.417C19.2381 28.153 19.077 27.9133 18.8739 27.7119L16.0572 24.9169H36.8355C37.4102 24.9169 37.9613 25.1452 38.3676 25.5515C38.7739 25.9578 39.0022 26.5089 39.0022 27.0836V35.7502C39.0022 36.3249 39.2305 36.876 39.6368 37.2823C40.0431 37.6886 40.5942 37.9169 41.1689 37.9169C41.7435 37.9169 42.2946 37.6886 42.7009 37.2823C43.1073 36.876 43.3355 36.3249 43.3355 35.7502V27.0836C43.3355 25.3597 42.6507 23.7064 41.4317 22.4874C40.2128 21.2684 38.5595 20.5836 36.8355 20.5836Z"
                                    fill="white"
                                />
                            </svg>
                        </button>
                        <div className="flex items-center gap-2.5">
                            <Profile />
                            <div className="flex flex-col">
                                <span className="text-2xl text-white">{contact}</span>
                                <span className="text-[#7e6060]">{contact_status}</span>
                            </div>
                        </div>

                    </div>
                    <button>
                        <ThreeDots />
                    </button>
                </div>
                <div style={{ backgroundImage: `url(${bgpic})`, backgroundSize: "200px" }} className='bg-repeat' >

                    {/* Messages */}
                    <div
                        ref={msgContainerRef}
                        className={`msgcontainer h-[calc(100svh-187px)] flex flex-col items-center overflow-y-scroll   `}

                    >
                        {messages.map((msg, i) =>
                            msg.sender_id === mainid ? (
                                <Message
                                    key={i}
                                    sent={true}
                                    message={msg.message}
                                    time={msg.timestamp}
                                />
                            ) : (
                                <Message
                                    key={i}
                                    sent={false}
                                    message={msg.message}
                                    time={msg.timestamp}
                                />
                            )
                        )}
                    </div>

                    {/* Send box */}
                    <div className="sendmsgbox m-5 flex justify-between items-center gap-3">
                        <input
                            placeholder="Type your Message"
                            className="w-[calc(100%-30px)] pl-4 py-3 text-white box bg-[#1F1F2B] text-[18px] outline-0 placeholder:text-[#A3A3A3] rounded-[10px]"
                            type="text"
                        />
                        <button>
                            <SendIcon />
                        </button>
                    </div>
                </div>

            </div>


            <div className={`w-full h-[100svh] bg-black fixed top-0 ${mainloading} justify-center items-center`}>
                <Logo size="60" />
            </div>

        </div>
    )
}

export default Chat
