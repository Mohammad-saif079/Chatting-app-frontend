import { useState } from 'react'
import Logo from '../components/Logo'
import SettingIcon from '../components/SettingIcon'
import GlobalInput from '../components/GlobalInput'
import SearchIcon from '../components/SearchIcon'

const Chat = () => {
    const [search, setsearch] = useState("")

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
                    <GlobalInput   placeholder={"Search a User"} />
                    <button>
                        <SearchIcon/>
                    </button>
                </div>
            </div>



        </div>
    )
}

export default Chat
