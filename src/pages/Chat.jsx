import { useState, useEffect, useRef } from 'react'
import Logo from '../components/Logo'
import GlobalInput from '../components/GlobalInput'
import SearchIcon from '../components/SearchIcon'
import UserId from '../components/UserId'
import SendIcon from '../components/SendIcon'
import Profile from '../components/Profile'
import ThreeDots from '../components/ThreeDots'
import Message from '../components/Message'
import { useChat } from '../context/Chatcontext'
import { useParams } from 'react-router-dom'

import { useNavigate } from 'react-router-dom'
import Logout from '../components/Logout'
import DotsIcon from '../components/DotsIcon'
import { gsap } from "gsap";
import axios from 'axios'
import { Timeline } from 'gsap/gsap-core'
import { io } from "socket.io-client";
import Toaster from '../components/Toaster'
import Lightlogo from '../components/Lightlogo'
import BgWithSkeleton from '../components/SkeletalBg'


const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
    transports: ["websocket"], // ensures fast connection
    autoConnect: false
});

const Chat = () => {
    const [chatid, setchatid] = useState(useParams().chatid)
    const { messages, setmessages, mainid, contact, contact_status, setcontact, setcontact_status, setmainid, chatbox, setchatbox, chatselected, setchatselected, msgloading, setmsgloading, pfp, setpfp } = useChat()

    const chatIdRef = useRef(chatid)
    const messageRef = useRef(null)

    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loadingOlder, setLoadingOlder] = useState(false);


    const updatechatref = (val) => {
        chatIdRef.current = val
    }

    const profileRef = useRef(null);


    //file uploader logic starts here

    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);

    const [canupdated, setcanupdated] = useState(false)

    const previewimg = useRef(false);

    const [dragging, setDragging] = useState(false);

  

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFile = async (selectedFile) => {
        if (!selectedFile) return;
        if (!selectedFile.type.startsWith("image/")) {
            return;
        }
        setFile(selectedFile);
        const objectUrl = URL.createObjectURL(selectedFile);
        if (!previewimg.current) {
            previewimg.current = mainid.profilePic;

        }

        setmainid(prev => ({
            ...prev,
            profilePic: objectUrl
        }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setDragging(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const handleChange = (e) => {
        handleFile(e.target.files[0]);
    };





    //file uploader logic ends here
    const navigate = useNavigate()


    const [search, setsearch] = useState("")//search state


    const [profilewindow, setprofilewindow] = useState("hidden")

    const [mainloading, setmainloading] = useState("flex")
    const [logoutLoad, setlogoutLoad] = useState("Logout")
    const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);

    //profile update states 

    const [updatefullname, setupdatefullname] = useState("")
    const [updatebio, setupdatebio] = useState("")

    useEffect(() => {
        if (!file && updatefullname.trim() === "" && updatebio.trim() === "") {
            setcanupdated(false)
        }
        else {
            setcanupdated(true)
        }

    }, [updatefullname, updatebio, file])

    const loadOlderMessages = async () => {
        if (!hasMore || loadingOlder) return;

        const container = msgContainerRef.current;
        if (!container) return;

        setLoadingOlder(true);

        const prevScrollHeight = container.scrollHeight;

        const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/msg/getmessages`,
            {
                userone: mainid.username,
                usertwo: chatIdRef.current,
                before: cursor,
                limit: 20,
                token: localStorage.getItem("AuthToken")
            }
        );

        setmessages(prev => [...res.data.messages, ...prev]);
        setCursor(res.data.nextCursor);
        setHasMore(res.data.hasMore);

        // 🔥 preserve scroll position
        requestAnimationFrame(() => {
            container.scrollTop =
                container.scrollHeight - prevScrollHeight;
        });

        setLoadingOlder(false);
    };


    const handleScroll = () => {
        const box = msgContainerRef.current;
        if (!box) return;

        // 🔥 user reached top → load older messages
        if (box.scrollTop === 0) {
            loadOlderMessages();
        }

        const isNearBottom =
            box.scrollHeight - box.scrollTop - box.clientHeight < 80;

        setIsUserScrolledUp(!isNearBottom);
    };


    const [msginput, setmsginput] = useState("")
    const [selecteduser_globe, setselecteduser_globe] = useState({})


    useEffect(() => { chatIdRef.current = chatid; }, [chatid]);
    // refs for scrollable containers
    const userBoxRef = useRef(null)
    const msgContainerRef = useRef(null)

    const handlechatback = () => {
        chatIdRef.current = ""
        setmsginput("")
        setchatselected(false)
        setchatbox("hidden")
        navigate("/chats", { replace: true })
    }
    const handlelogout = async () => {
        socket.disconnect()
        setlogoutLoad("Please wait...")

        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {
                _id: mainid._id
            })
            localStorage.setItem("AuthToken", "")

            setlogoutLoad("Logout")
            setmainid("")
            navigate("/", { replace: true })
        }
        catch (err) {

        }
    }

    const handleprofile = () => {
        setprofilewindow("flex"); // optional, but ok

        previewimg.current = mainid.profilePic;

    };
    const closeProfile = () => {
        setprofilewindow("hidden");
        setremovepfp(false);
        setcanupdated(false);
        setFile(null);
        setupdatebio("");
        setupdatefullname("");

        setmainid(prev => ({
            ...prev,
            profilePic: previewimg.current
        }));
    };


    const [isTyping, setIsTyping] = useState(false)
    const typingTimeoutRef = useRef(null);


    const handlemsginpchange = async (e) => {
        setmsginput(e.target.value)
        if (!isTyping) {

            socket.emit("typing", {
                to: chatIdRef.current
            })

        }

        // reset debounce timer
        clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {

            socket.emit("stopTyping", {
                to: chatIdRef.current
            })

        }, 1200); // WhatsApp-like delay

    }



    const scrollToBottom = () => {
        const el = msgContainerRef.current;
        if (!el) return;

        el.scrollTo({
            top: el.scrollHeight,
            behavior: "smooth",   // ⭐ This makes it smooth
        });
    };

    useEffect(() => {
        if (!isUserScrolledUp) {
            scrollToBottom();
        }
    }, [messages]);





    const handlesendmsg = async () => {
        if (msginput.trim() === "") {
            return
        }
        socket.emit("SendMsg", {
            to: {
                username: chatIdRef.current,
                userid: selecteduser_globe._id
            },
            timestamp: new Date,

            message: msginput.trim()
        })
        setmessages(messages => [...messages, {
            sender_username: mainid.username,
            receiver_username: selecteduser_globe.username,
            sender_id: mainid._id,
            receiver_id: selecteduser_globe._id,
            message: msginput.trim(),
            timestamp: new Date
        }])
        setmsginput("")
        messageRef.current.focus()
        setusers(prevUsers => {
            const updatedUsers = prevUsers.filter(
                u => u._id !== selecteduser_globe._id
            )

            return [
                {
                    ...selecteduser_globe,

                },
                ...updatedUsers
            ]
        })


    }

    const [removepfp, setremovepfp] = useState(false)

    const handleremovepfp = () => {
        // previewimg.current = "default"
        setremovepfp(true)

        setmainid(prev => ({
            ...prev,
            profilePic: "default"
        }));
        setFile(null)
        setcanupdated(true)
        // setremovepfp(true)
    }


    //handling user profile update
    const [updateLoad, setupdateLoad] = useState("Update")
    const updateprofilehandler = async () => {


        const formData = new FormData();
        formData.append("userid", mainid._id);
        formData.append("updatefullname", updatefullname);
        formData.append("updatebio", updatebio);
        formData.append("removepfp", removepfp);
        formData.append("token", localStorage.getItem("AuthToken"));

        if (file) {
            formData.append("profilePic", file);
        }
        setupdateLoad("Updating...")
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/updateprofile`, formData)
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

                setupdatebio("")
                setupdatefullname("")
                setmainid(res.data.user)
                setupdateLoad("Update")
                setcanupdated(false)
                setFile(null)
                setprofilewindow("hidden")
            }
        })

    }






    const [users, setusers] = useState([])







    // searching useEffect starts here 

    useEffect(() => {
        const getdefaultusers = async () => {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/valid`, {
                token: localStorage.getItem("AuthToken")
            })

            // setmainid(res.data.data)
            const users = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/alladmins`, {
                contacts: res.data.data.contacts,
                token: localStorage.getItem("AuthToken")
            })

            setusers(users.data.users)

        }
        // If query is empty, skip API call
        if (!search.trim()) {
            getdefaultusers()
            return;
        }

        const delayDebounce = setTimeout(async () => {
            try {
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/searchuser`, {
                    username: search,
                    token: localStorage.getItem("AuthToken")
                })
                setusers(res.data);

            } catch (err) {

            }
        }, 400);

        // Cleanup to cancel previous timeout if query changes fast
        return () => clearTimeout(delayDebounce);
    }, [search]);


    //main use Effect

    useEffect(() => {
        async function fetchdata() {

            if (chatid) {
                setchatselected(true)

                setchatbox("flex")
            }



            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/valid`, {
                token: localStorage.getItem("AuthToken")
            })

            setmainid(res.data.data)
            const users = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/alladmins`, {
                contacts: res.data.data.contacts,
                token: localStorage.getItem("AuthToken")
            })


            setusers(users.data.users)


            setmainloading("hidden")
            if (chatid) {
                setmsgloading(true)
                const selecteduser = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/searchuser`, {
                    username: chatid,
                    token: localStorage.getItem("AuthToken")
                })
                const selecteduser_data = selecteduser.data[0]
                setcontact(selecteduser_data.fullname)
                setselecteduser_globe(selecteduser_data)
                { selecteduser_data.status ? setcontact_status("Online") : setcontact_status("Offline") }
                setpfp(selecteduser_data.profilePic)
                const resMsgs = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/msg/getmessages`,
                    {
                        userone: res.data.data.username,
                        usertwo: chatid,
                        limit: 9,
                        token: localStorage.getItem("AuthToken")
                    }
                );

                setmessages(resMsgs.data.messages);
                setCursor(resMsgs.data.nextCursor);
                setHasMore(resMsgs.data.hasMore);



                await setmsgloading(false)


            }

            socket.auth = { token: localStorage.getItem("AuthToken") }
            socket.connect()

        }
        fetchdata()


    }, [])



    useEffect(() => {


        socket.on("userStatus", async (data) => {
            if (data.username === chatid && data.type === "connect") {
                setcontact_status("Online")

            }
            else {
                if (data.username === chatid && data.type === "disconnect") {
                    setcontact_status("Offline")

                }
            }

        }
        )

        socket.on("ReceiveMsg", async (data) => {
            // if (data.sender_username === chatid) {
            if (data.message.sender_username === chatIdRef.current) {
                setmessages(messages => [...messages, data.message]);
                const clear = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/clearunread`, {
                    userone: mainid.username,
                    usertwo: data.message.sender_id,
                    token: localStorage.getItem("AuthToken")
                })

            }
            else {
                const newcontacts = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/alladmins`, {
                    contacts: data.contacts,
                    token: localStorage.getItem("AuthToken")
                })

                setusers(newcontacts.data.users)

            }


        }
        )


        socket.on("typingResponse", (data) => {
            if (data.username === chatIdRef.current) {
                setIsTyping(true)
            }

        })
        socket.on("stopTypingResponse", (data) => {
            if (data.username === chatIdRef.current) {
                setIsTyping(false)
            }

        })



    }, [])

    const formatLastSeen = (lastSeen) => {
        if (!lastSeen) return "";

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const last = new Date(lastSeen);

        const diffMs = last - now;
        const diffHours = diffMs / (1000 * 60 * 60);


        // ⏰ within 24 hours → show time
        if (diffHours > 0) {
            return last.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            });
        }

        // 📅 between 24 and 48 hours → Yesterday
        if (diffHours >= -24 && diffHours < 0) {
            return "Yesterday";
        }

        // 🗓️ older → DD/MM/YY
        const day = String(last.getDate()).padStart(2, "0");
        const month = String(last.getMonth() + 1).padStart(2, "0");
        const year = String(last.getFullYear()).slice(-2);

        return `${day}/${month}/${year}`;
    };


    const handlekd = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handlesendmsg();
        }
    }


    return (

        <div tabIndex={0} onKeyDown={(e) => {
            handlekd(e)
        }} className="mainchat md:flex-row gap-0 flex-col flex md:gap-2">
            {/* Sidebar */}
            <div className="sidenavbar  md:h-[100svh] W-[90px] flex md:flex-col justify-between items-center">
                <div className="m-5 flex items-center gap-3 justify-center ">
                    <Logo size={50} />
                    <h1 className='text-3xl text-[#ffffff] font-medium flex md:hidden '  >Messenger</h1>
                </div>
                <div className='flex md:flex-col justify-center items-center'>


                    <button onClick={handleprofile} className="m-5  ">
                        {mainid.profilePic != "default" ? (

                            <BgWithSkeleton imageUrl={mainid.profilePic} size={40} />
                        ) : (
                            <Profile size={40} />)}
                    </button>

                </div>
            </div>

            {/* Users */}
            <div className="md:h-[100svh] h-[calc(100svh-90px)] md:w-[40%] w-[100%] ">
                <div className="relative searchbox w-[calc(100%-40px)] md:m-5 mx-5 mb-5 flex justify-center items-center gap-3">
                    <GlobalInput search={search} setsearch={setsearch} users={users} setusers={setusers} placeholder={"Search a User by Username"} />
                    <button className='absolute right-2  p-2 ' >
                        <SearchIcon />
                    </button>
                </div>

                <div
                    id="userbox"
                    ref={userBoxRef}
                    className="md:h-[calc(100%-91px)] h-[calc(100%-71px)] overflow-y-scroll overflow-x-hidden">
                    {users.map((user) => {
                        const new_bio =
                            user.bio.length > 26 ? user.bio.slice(0, 26) + "..." : user.bio;
                        const lastSeenFormatted = formatLastSeen(user.lastSeen);


                        return (
                            <UserId
                                id={user._id}
                                key={user.username}
                                fullname={user.fullname}
                                status={user.status}
                                bio={new_bio}
                                profile={user.profilePic}
                                lastseen={lastSeenFormatted}
                                username={user.username}
                                isAdmin={user.isAdmin}
                                userone={mainid.username}
                                mssginput={msginput}
                                setmssginput={setmsginput}
                                setchattid={setchatid}
                                setslctuserglobe={setselecteduser_globe}
                                unreadmessages={user.unreadmessages}
                                setuser={setusers}
                                updateref={updatechatref}
                                chatIdRef={chatIdRef}
                                setCursor={setCursor}
                                setHasMore={setHasMore}

                            />
                        );
                    })}




                </div>
            </div>

            {/* Chat Area */}
            {chatselected ? (!msgloading ? (<div className={` bg-[#0B0B0F] chatarea ${chatbox}  md:flex md:w-[calc(100vw-40%)] w-[100%] fixed md:top-0 md:static flex-col`} >


                <div className="m-5 flex justify-between items-center ">
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
                            {pfp != "default" ? (
                                // <div style={{ backgroundImage: `url(${pfp})` }} className={`bg-cover bg-center w-[50px] h-[50px] rounded-full `}>

                                // </div>
                                <BgWithSkeleton imageUrl={pfp} size={50} />
                            ) : (
                                <Profile />
                            )}
                            <div className="flex flex-col">
                                <span className="text-2xl text-white">{contact}</span>
                                {isTyping ? (<span className="text-[#7e6060]">Typing...</span>) : <span className="text-[#7e6060]">{contact_status}</span>}
                            </div>
                        </div>

                    </div>
                    <button>
                        <ThreeDots color={"#0B0B0F"} />
                    </button>
                </div>
                <div className="flex flex-col relative">

                    {/* BACKGROUND LAYER */}
                    <div
                        style={{
                            backgroundImage: `url("/doodle.png")`,
                            backgroundSize: "400px"
                        }}
                        className="absolute inset-0 bg-repeat bg-center opacity-10 z-0"
                    />

                    {/* CONTENT LAYER */}
                    <div className="relative z-10 flex flex-col">

                        {/* Messages */}
                        <div className="h-[calc(100svh-187px)] flex flex-col justify-end">
                            <div
                                onScroll={handleScroll}
                                ref={msgContainerRef}
                                className="msgcontainer max-h-[calc(100svh-187px)] flex flex-col items-center overflow-y-scroll"
                            >

                                {hasMore && !loadingOlder && (
                                    <button
                                        onClick={loadOlderMessages}
                                        className="my-3 px-4 py-2 text-sm text-white bg-[#2f3136] rounded-lg"
                                    >
                                        Load older messages
                                    </button>
                                )}
                                {loadingOlder && (
                                    <div className="my-2 text-sm text-gray-400 flex items-center gap-2">
                                        <span className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></span>
                                        Loading older messages…
                                    </div>
                                )}

                                {Array.isArray(messages) &&
                                    messages.map((msg, i) => {
                                        const date = new Date(msg.timestamp);
                                        const time = date.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        });

                                        return msg.sender_id === mainid._id ? (
                                            <Message
                                                key={msg._id || i}
                                                sent
                                                message={msg.message}
                                                time={time}
                                            />
                                        ) : (
                                            <Message
                                                key={msg._id || i}
                                                message={msg.message}
                                                time={time}
                                            />
                                        );
                                    })}


                            </div>
                        </div>

                        {/* Send box */}
                        <div className="sendmsgbox m-5 flex justify-between items-center gap-3">
                            <input
                                ref={messageRef}
                                value={msginput}
                                placeholder="Type your Message"
                                className="w-[calc(100%-30px)] pl-4 py-3 text-white bg-[#1F1F2B] text-[18px] outline-0 placeholder:text-[#A3A3A3] rounded-[10px]"
                                type="search"
                                onChange={handlemsginpchange}
                            />
                            <button onClick={handlesendmsg}>
                                <SendIcon />
                            </button>
                        </div>

                    </div>
                </div>




            </div>) : (<div className={` bg-[#0B0B0F] chatarea ${chatbox} h-[100%]  md:flex md:w-[calc(100vw-40%)] w-[100%] fixed md:top-0 md:static flex-col`} >


                <div className="m-5 flex justify-between items-center">
                    <div className='flex items-center justify-center gap-3 ' >
                        <button onClick={handlechatback} className='md:hidden flex' >
                            <svg xmlns="http://www.w3.org/2000/svg" width="45" viewBox="0 0 52 52" fill="none">
                                <path
                                    d="M36.8355 20.5836H16.0572L18.8739 17.7886C19.2819 17.3806 19.5111 16.8272 19.5111 16.2502C19.5111 15.6733 19.2819 15.1199 18.8739 14.7119C18.4659 14.3039 17.9125 14.0747 17.3355 14.0747C16.7586 14.0747 16.2052 14.3039 15.7972 14.7119L9.29722 21.2119C9.09996 21.418 8.94534 21.6609 8.84222 21.9269C8.62551 22.4544 8.62551 23.0461 8.84222 23.5736C8.94534 23.8395 9.09996 24.0825 9.29722 24.2886L15.7972 30.7886C15.9986 30.9917 16.2383 31.1528 16.5023 31.2628C16.7663 31.3728 17.0495 31.4295 17.3355 31.4295C17.6216 31.4295 17.9048 31.3728 18.1688 31.2628C18.4328 31.1528 18.6725 30.9917 18.8739 30.7886C19.077 30.5872 19.2381 30.3475 19.3481 30.0835C19.4581 29.8195 19.5148 29.5363 19.5148 29.2502C19.5148 28.9642 19.4581 28.681 19.3481 28.417C19.2381 28.153 19.077 27.9133 18.8739 27.7119L16.0572 24.9169H36.8355C37.4102 24.9169 37.9613 25.1452 38.3676 25.5515C38.7739 25.9578 39.0022 26.5089 39.0022 27.0836V35.7502C39.0022 36.3249 39.2305 36.876 39.6368 37.2823C40.0431 37.6886 40.5942 37.9169 41.1689 37.9169C41.7435 37.9169 42.2946 37.6886 42.7009 37.2823C43.1073 36.876 43.3355 36.3249 43.3355 35.7502V27.0836C43.3355 25.3597 42.6507 23.7064 41.4317 22.4874C40.2128 21.2684 38.5595 20.5836 36.8355 20.5836Z"
                                    fill="#2f3136"
                                />
                            </svg>
                        </button>
                        <div className="flex items-center gap-2.5">

                            <div className='w-[50px] h-[50px] bg-[#2f3136] rounded-full ' ></div>
                            <div className="flex flex-col">
                                <span className="text-2xl w-[150px] h-[30px] bg-[#2f3136] rounded-2xl text-white"></span>
                                <span className="text-2xl mt-2 w-[70px] h-[15px] bg-[#2f3136] rounded-2xl text-white"></span>

                            </div>
                        </div>

                    </div>
                    <button>
                        <ThreeDots color={"#0B0B0F"} />
                    </button>
                </div>
                <div className='bg-repeat' >

                    {/* Messages */}
                    <div
                        ref={msgContainerRef}
                        className={`msgcontainer h-[calc(100svh-187px)] flex  items-center overflow-y-scroll flex-col-reverse   `}

                    >

                        <div className="messages w-full  ">
                            <div className=" mx-3 my-1  flex flex-col gap-1 justify-center ">
                                <div className="text  max-w-[90%] text-[#2f3136] w-fit text-lg py-1 px-3 rounded-md font-medium bg-[#2F3136] break-all whitespace-pre-wrap ">Hello,This is Saif</div>
                                <span className=' my-0.75 text-white h-[20px] w-[40px] bg-[#2f3136] rounded-[10px] ' ></span>
                            </div>
                        </div>
                        <div className="messages w-full  ">
                            <div className=" mx-3 my-1 flex flex-col gap-1 justify-center items-end ">
                                <div className="text max-w-[50%] text-[#2f3136] w-fit text-lg py-1 px-3 rounded-md font-medium bg-[#2f3136]">Yeah Bro whats up</div>
                                <span className=' my-0.75 text-white h-[20px] w-[40px] bg-[#2f3136] rounded-[10px] ' ></span>
                            </div>
                        </div>
                    </div>

                    {/* Send box */}
                    <div className="sendmsgbox m-5 flex justify-between items-center gap-3">
                        <div
                            placeholder=""
                            className="w-[calc(100%-30px)] pl-4 py-3  text-[#2f3136] box bg-[#2f3136] text-[18px] outline-0 placeholder:text-[#A3A3A3] rounded-[10px]"
                            type="text"
                        >saif_00749</div>
                        <button  >
                            <SendIcon color='#2f3136' />
                        </button>
                    </div>
                </div>



            </div>)) : (

                <div className={` bg-[#0B0B0F] ${chatbox} gap-4 flex-col  md:flex md:w-[calc(100vw-40%)] w-[100%] justify-center items-center `} >
                    <Lightlogo size="60" />
                    <div className='text-[#ffffff] text-4xl font-semibold  text-center ' ref={msgContainerRef} >
                        Select a friend and say hi!
                    </div>
                </div>
            )}


            <div className=' w-[100vw] z-5 flex justify-center z-10 toaster fixed top-0 translate-y-[-100%] scale-[1]  ' >
                <Toaster />
            </div>

            <div className={`w-full h-[100svh] bg-[#0B0B0F] fixed top-0 ${mainloading} flex-col gap-2 justify-center items-center`}>
                <Logo size="60" />
                <h1 className='text-white text-xl font-medium  ' >Messenger</h1>
            </div>


            <div
                ref={profileRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`profile-window fixed inset-0  ${profilewindow} justify-center items-center bg-black/40 backdrop-blur-md`}
            >
                <button onClick={closeProfile} className='absolute top-0 right-0 p-4' >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        fill="white"
                        viewBox="0 0 16 16"

                    >
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                    </svg>

                </button>
                <div className='text-white  sm:w-[600px] w-[90vw] ' >
                    <div className='flex justify-center items-start gap-1 ' >

                        <div className='flex flex-col justify-center relative items-center  ' >

                            <button className='relative'
                                onClick={handleClick}

                            >

                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                {
                                    dragging
                                        ? (
                                            <div className='w-[80px] h-[80px] rounded-full flex justify-center items-center ' >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={60}
                                                    viewBox="0 0 30 30"
                                                    fill="none"
                                                    className="text-white"
                                                >
                                                    <path
                                                        d="M15.9375 25.3125V19.6875H19.6875L15 14.0625L10.3125 19.6875H14.0625V25.3125H9.375V25.2656C9.2175 25.275 9.0675 25.3125 8.90625 25.3125C7.04145 25.3125 5.25302 24.5717 3.93441 23.2531C2.61579 21.9345 1.875 20.1461 1.875 18.2812C1.875 14.6737 4.60313 11.7338 8.10375 11.3306C8.41068 9.72618 9.2671 8.27883 10.5257 7.23751C11.7843 6.1962 13.3665 5.626 15 5.625C16.6338 5.6259 18.2162 6.19602 19.4751 7.23732C20.734 8.27861 21.5908 9.72602 21.8981 11.3306C25.3988 11.7338 28.1231 14.6737 28.1231 18.2812C28.1231 20.1461 27.3823 21.9345 26.0637 23.2531C24.7451 24.5717 22.9567 25.3125 21.0919 25.3125C20.9344 25.3125 20.7825 25.275 20.6231 25.2656V25.3125H15.9375Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>

                                            </div>
                                        )
                                        : mainid.profilePic === "default"
                                            ? <Profile size={80} />
                                            : (

                                                <BgWithSkeleton imageUrl={mainid.profilePic} size={80} />
                                            )
                                }






                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="45"
                                    viewBox="0 0 37 37"
                                    fill="none"
                                    className="text-white absolute -bottom-2 -right-2 "
                                >
                                    <path
                                        d="M15.0312 20.042C15.0312 19.122 15.3967 18.2397 16.0472 17.5892C16.6977 16.9387 17.58 16.5732 18.5 16.5732C19.42 16.5732 20.3023 16.9387 20.9528 17.5892C21.6033 18.2397 21.9687 19.122 21.9687 20.042C21.9687 20.962 21.6033 21.8443 20.9528 22.4948C20.3023 23.1453 19.42 23.5107 18.5 23.5107C17.58 23.5107 16.6977 23.1453 16.0472 22.4948C15.3967 21.8443 15.0312 20.962 15.0312 20.042Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M11.5228 11.7814C11.5224 11.1452 11.6474 10.5151 11.8907 9.92725C12.134 9.33938 12.4908 8.80523 12.9407 8.35535C13.3906 7.90547 13.9247 7.54868 14.5126 7.3054C15.1005 7.06211 15.7305 6.9371 16.3667 6.9375H20.6341C21.2703 6.9371 21.9004 7.06211 22.4882 7.3054C23.0761 7.54868 23.6103 7.90547 24.0602 8.35535C24.51 8.80523 24.8668 9.33938 25.1101 9.92725C25.3534 10.5151 25.4784 11.1452 25.478 11.7814C25.4783 11.7924 25.4824 11.803 25.4898 11.8112C25.4971 11.8194 25.5072 11.8247 25.5181 11.8261L28.956 12.1036C30.4961 12.23 31.7618 13.3678 32.0501 14.8863C32.7821 18.7598 32.8364 22.731 32.2105 26.623L32.0609 27.5542C31.9237 28.4074 31.5043 29.1898 30.8699 29.7765C30.2355 30.3631 29.4226 30.7201 28.5613 30.7902L25.5659 31.0322C20.8633 31.4142 16.1375 31.4142 11.435 31.0322L8.4395 30.7902C7.57802 30.72 6.76498 30.3628 6.13051 29.7759C5.49603 29.1889 5.0768 28.4061 4.93991 27.5527L4.79037 26.623C4.16291 22.7303 4.21841 18.7605 4.95071 14.8863C5.09073 14.1479 5.4693 13.4759 6.02827 12.9734C6.58724 12.471 7.2957 12.166 8.04483 12.1052L11.4827 11.8261C11.4937 11.8247 11.5037 11.8194 11.511 11.8112C11.5184 11.803 11.5226 11.7924 11.5228 11.7814ZM18.5004 14.2604C16.9671 14.2604 15.4966 14.8695 14.4125 15.9537C13.3283 17.0379 12.7192 18.5084 12.7192 20.0417C12.7192 21.575 13.3283 23.0454 14.4125 24.1296C15.4966 25.2138 16.9671 25.8229 18.5004 25.8229C20.0337 25.8229 21.5042 25.2138 22.5884 24.1296C23.6726 23.0454 24.2817 21.575 24.2817 20.0417C24.2817 18.5084 23.6726 17.0379 22.5884 15.9537C21.5042 14.8695 20.0337 14.2604 18.5004 14.2604Z"
                                        fill="currentColor"
                                    />
                                </svg>



                            </button>
                            <h1 className='text-2xl' >{mainid.username}</h1>
                            <div className='text-xl absolute -top-5 -right-7 ' onClick={handleremovepfp} >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40"
                                    fill="white"
                                    viewBox="0 0 16 16"

                                >
                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                                </svg>
                            </div>
                        </div>



                    </div>

                    <div className="update flex flex-col justify-center items-center gap-5 ">
                        <input value={updatefullname} onChange={(e) => {
                            e.preventDefault()
                            setupdatefullname(e.target.value)
                        }
                        } type="search" placeholder={`~${mainid.fullname}`} className='p-2 border-b-[#a3a3a3] w-full text-[20px] border-b-2 outline-0 ' />
                        <textarea value={updatebio} onChange={(e) => {
                            e.preventDefault()
                            setupdatebio(e.target.value)

                        }
                        } type="search" placeholder={`~${mainid.bio}`} className='p-2 border-b-[#a3a3a3] w-full text-[20px] border-b-2 outline-0 resize-none ' />

                        {canupdated ? (<button onClick={updateprofilehandler} className=' sm:w-[580px] overflow-hidden flex justify-center items-center rounded-[10px] py-3 text-[18px] w-full bg-[#FFD700] text-[#0B0B0F] font-semibold ' >
                            {updateLoad}
                        </button>) : (

                            <button className=' sm:w-[580px] overflow-hidden flex justify-center items-center rounded-[10px] py-3 text-[18px] w-full bg-[#2f3136] text-[#fff] font-semibold ' >
                                Update
                            </button>
                        )}





                        <button onClick={handlelogout} className="text-[#FF0038]  text-[18px] font-semibold ">
                            {logoutLoad}
                        </button>


                    </div>

                </div>

            </div>

        </div>
    )
}

export default Chat
