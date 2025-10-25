import React from 'react'

const GlobalInput = (props) => {
    return (
        <div className='w-[calc(100%)] ' >
            <input placeholder={props.placeholder} className=' w-full  pl-4 py-3 text-white  box  bg-[#1F1F2B] text-[18px] outline-0 placeholder:text-[#A3A3A3] rounded-[10px] ' type="text" />
        </div>
    )
}

export default GlobalInput
