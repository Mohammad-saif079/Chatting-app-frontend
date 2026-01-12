import React from 'react'

const GlobalInput = (props) => {
    const setsearch = props.setsearch
    const handlesearch = (e) => {
        setsearch(e.target.value)
    }


    return (
        <div className='w-[calc(100%)] ' >
            <input
                type="search"
                name="no_autofill_please"

                autoComplete="new-password"
                autoCorrect="off"
                spellCheck="false"
                autoCapitalize="none"
                inputMode="text"
                value={props.search}
                onChange={handlesearch}
                placeholder={props.placeholder}
                className="w-full pl-4 py-3 text-white box bg-[#1F1F2B] text-[18px] outline-0 placeholder:text-[#A3A3A3] rounded-[10px]"
            />

        </div>
    )
}

export default GlobalInput
