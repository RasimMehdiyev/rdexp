import React from 'react'
import {useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';


const StickyGameOverviewComponent = ({onSave,onDelete,eventType}) => {
    const nagivate = useNavigate();

    const getPreviousPage = () => {
        nagivate(-1);
    }

    const [isPressed, setIsPressed] = useState(false);

    const handleButtonClick = () => {
// Check the state before updating it
        setIsPressed(!isPressed); // Toggle the state
    };

    const handleClickOutside = (e) => {
      // Assuming the modal has a specific ID or class, check if the clicked element is outside the modal
      // Replace 'your-modal-id' with the actual ID or class of your modal
      if (!e.target.closest('#your-modal-id') && e.target.id !== 'delete') {
          setIsPressed(false);
      }
  };
  
  useEffect(() => {
      // Add event listener for mouse down
      document.addEventListener('mousedown', handleClickOutside);
  
      return () => {
          // Remove event listener on cleanup
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, []);
  


    const pressedStyle = isPressed ? {opacity:'0.5', boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)' } : {};

  return (
    <div className="bg-sn-subheader-blue sticky top-16 shadow-md z-20"> 
      <div className="p-2 h-16 flex flex-row justify-between items-center">
        <div className='flex flex-row justify-between gap-1 items-center'>
            <img className='cursor-pointer' onClick={getPreviousPage} src={process.env.PUBLIC_URL + "/images/chevron-down.svg"} alt="" />
            <p className='text-[20px] font-russoOne text-white'>Homepage</p>
        </div>

      <div className='flex flex-row justify-between gap-1'>
        <div className='flex flex-row justify-between gap-4'>       
            <button id='delete' className='bg-sn-main-orange h-8 w-[72px] text-white rounded-[10px] text-[14px]' style={pressedStyle} onClick={(e)=>{onDelete(e);handleButtonClick(e);handleClickOutside(e)}}>DELETE</button>
        </div>
        <div className='flex flex-row justify-between gap-4'>       
            <button className='bg-sn-main-blue h-8 w-[72px] text-white rounded-[10px] text-[14px]'  onClick={onSave}>EDIT</button>
        </div>
      </div>
      </div>
    </div>
  );
}

export default StickyGameOverviewComponent