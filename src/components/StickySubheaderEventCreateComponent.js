import React from 'react';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';


const StickySubheaderEventCreateComponent = ({onSave,eventType}) => {
    const nagivate = useNavigate();

    const getPreviousPage = () => {
        nagivate(-1);
    }


  return (
    <div className="bg-sn-subheader-blue sticky top-16 shadow-md z-20"> 
      <div className="p-2 h-14 flex flex-row justify-between items-center">
        <div className='flex flex-row justify-between gap-1 items-center'>
            <img className='cursor-pointer' onClick={getPreviousPage} src={process.env.PUBLIC_URL + "/images/chevron-down.svg"} alt="" />
            <p className='text-[20px] font-russoOne text-white'>Game</p>
        </div>
        <div>
          <p className='text-[25px] font-russoOne text-white'>New {eventType}</p>
        </div>
        <div className='flex flex-row justify-between gap-4'>        
            <button className='bg-sn-main-orange h-8 w-[72px] text-white rounded-[10px] text-[14px]' onClick={onSave}>
              SAVE
            </button>
        </div>
      </div>
    </div>
  );
};

export default StickySubheaderEventCreateComponent;
