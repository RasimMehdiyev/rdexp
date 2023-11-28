import React from 'react'
import {useNavigate} from 'react-router-dom';


const StickyEditProfileComponent = () => {
    const nagivate = useNavigate();

    const getPreviousPage = () => {
        nagivate(-1);
    }


  return (
    <div className="bg-sn-subheader-blue sticky top-1 shadow-md z-10"> 
      <div className="p-2 h-16 flex flex-row justify-between items-center">
        <div className='flex flex-row justify-between gap-1 items-center'>
            <img className='cursor-pointer' onClick={getPreviousPage} src={process.env.PUBLIC_URL + "/images/chevron-down.svg"} alt="" />
            <p className='text-[20px] font-russoOne text-white'>Game</p>
        </div>
        <div className='flex flex-row justify-between gap-4'>       
            <button className='bg-sn-main-blue h-8 w-[72px] text-white rounded-[10px] text-[14px]'>EDIT</button>
        </div>
      </div>
    </div>
  );
}

export default StickyEditProfileComponent