import React from 'react'
import {useNavigate} from 'react-router-dom';


const StickyEditTeamComponent = ({onSave, isDisabled}) => {
    const nagivate = useNavigate();

    const getPreviousPage = () => {
        nagivate(-1);
    }

    const buttonClasses = isDisabled 
        ? 'bg-sn-main-orange h-8 w-[72px] text-white rounded-[10px] text-[14px] opacity-50 cursor-not-allowed' 
        : 'bg-sn-main-orange h-8 w-[72px] text-white rounded-[10px] text-[14px]';


  return (
    <div className="bg-sn-subheader-blue sticky top-16 shadow-md z-20"> 
      <div className="p-2 h-16 flex flex-row justify-between items-center">
        <div className='flex flex-row justify-between gap-1 items-center'>
            <img className='cursor-pointer' onClick={getPreviousPage} src={process.env.PUBLIC_URL + "/images/chevron-down.svg"} alt="" />
            <p className='text-[20px] font-russoOne text-white'>Team Profile</p>
        </div>
        <div className='flex flex-row justify-between gap-4'>       
            <button                         
              onClick={onSave} 
              disabled={isDisabled}
              className={buttonClasses}>SAVE</button>
        </div>
      </div>
    </div>
  );
}

export default StickyEditTeamComponent