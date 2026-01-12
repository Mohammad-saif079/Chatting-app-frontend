import React from 'react'

const Message = (props) => {
    return (
        <div className="messages w-full  ">
            {props.sent ? (<div className=" mx-3 my-1 flex flex-col gap-1 justify-center items-end ">
                <div className="text max-w-[90%] text-[#0F0F10] w-fit text-lg py-1 px-3 rounded-md font-medium bg-[#FFD700] break-all whitespace-pre-wrap ">{props.message}</div>
                <span className='text-white' >{props.time}</span>
            </div>) : (
                <div className=" mx-3 my-1  flex flex-col gap-1 justify-center ">
                    <div className="text max-w-[90%] text-[#fff] w-fit text-lg py-1 px-3 rounded-md font-medium bg-[#2F3136] break-all whitespace-pre-wrap ">{props.message}</div>
                    <span className='text-white' >{props.time}</span>
                </div>
            )}
        </div>

    )
}

export default Message
