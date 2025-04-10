import React from 'react'
import { FiEdit } from "react-icons/fi";


const IconBtn = ({
    text,
    onclick,
    children,
    disabled,
    outline=false,
    customClasses,
    type,
}) => {
  return (
    <button className='flex items-center bg-yellow-50 cursor-pointer gap-x-2 rounded-md  text-sm md:text-lg px-3 md:px-5 font-semibold text-richblack-900' disabled={disabled} onClick={onclick} type={type}>
        {children?(
            <>
                <span>{text}</span>
                {children}
            </>
        ):(text)}

    </button>
  )
}

export default IconBtn
