import { useState } from 'react'
import Logo from '../components/Logo'
import SettingIcon from '../components/SettingIcon'
import GlobalInput from '../components/GlobalInput'
import SearchIcon from '../components/SearchIcon'
import UserId from '../components/UserId'



const Chat = () => {
    const [search, setsearch] = useState("")

    // dummy data 
    const data = [
        {
            fullname: "Mr Saif :)",
            status: true,
            _id: "651f2b4c8f0e4d23a1c7e9b5"
        },
        {
            fullname: "Aarav Mehta",
            status: false,
            _id: "652a1b7f3c8e9a12d4b5f6c7"
        },
        {
            fullname: "Riya Kapoor",
            status: true,
            _id: "652a1b9e4f0d7b21c8e6a3f4"
        },
        {
            fullname: "Kabir Malhotra",
            status: false,
            _id: "652a1bbb9a4e6f27d1c3b8a9"
        },
        {
            fullname: "Zara Sheikh",
            status: true,
            _id: "652a1bdc2e9c8a13f5b6d7e8"
        },
        {
            fullname: "Arjun Nair",
            status: false,
            _id: "652a1c014d7f2b19e3c6a9d4"
        },
        {
            fullname: "Maya Iyer",
            status: true,
            _id: "652a1c226b9e0a14c7d8f2e3"
        },
        {
            fullname: "Dev Sharma",
            status: false,
            _id: "652a1c433e7d5f28b9c1a4e7"
        },
        {
            fullname: "Anaya Reddy",
            status: true,
            _id: "652a1c64a9d2e317f4b8c6d1"
        },
        {
            fullname: "Karan Gupta",
            status: false,
            _id: "652a1c85f3e1b026d7a9c4e2"
        }
    ]

    const [users, setusers] = useState(data)
 

    console.log(users)

    return (
        <div className="mainchat flex gap-2 ">

            <div className="sidenavbar h-[100svh]  W-[90px] flex flex-col justify-between items-center  ">
                <div className='m-5' >

                    <Logo size={50} />
                </div>
                <button className='m-5' >
                    <SettingIcon size={40} />
                </button>
            </div>

            <div className='h-[100svh]  ' >
                <div className="searchbox m-5 flex justify-center items-center gap-3 ">
                    <GlobalInput placeholder={"Search a User"} />
                    <button>
                        <SearchIcon />
                    </button>
                </div>
                <div id='userbox' className='h-[calc(100svh-91px)]   overflow-y-scroll ' >

                    {users.map((user)=>{
                        return <UserId key={user._id} fullname={user.fullname} status={user.status} /> 
                    })}

                </div>
            </div>



        </div>
    )
}

export default Chat
