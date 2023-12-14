import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const StickySubheaderProfileComponent = () => {
    const nagivate = useNavigate();

    const getPreviousPage = () => {
        nagivate(-1);
    }


  return (
    <div className="bg-sn-subheader-blue sticky top-16 shadow-md z-20"> 
      <div className="p-2 h-16 flex flex-row justify-between items-center">
        <div className='flex flex-row justify-between gap-1 items-center'>
            <img className='cursor-pointer' onClick={getPreviousPage} src={process.env.PUBLIC_URL + "/images/chevron-down.svg"} alt="" />
        </div>
        <p className='text-[20px] ml-10 font-russoOne text-white'>Profile</p>
        <Link to="profile/edit">
          <div className='flex flex-row justify-between gap-4'>       
              <button className='bg-sn-main-blue h-8 w-[72px] text-white rounded-[10px] text-[14px]'>EDIT</button>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default StickySubheaderProfileComponent