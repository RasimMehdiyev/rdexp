import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/helper/supabaseClient';
import { useNavigate } from 'react-router-dom';
import {useEffect} from 'react';

const RightSideBarComponent = ({ rightIsOpen , setRightIsOpen}) => {
  // Apply the transition class to the sidebar
  const sidebarClass = !rightIsOpen ? 'translate-x-full' : '-translate-x-0';
  const navigate = useNavigate();
  const sidebarRef = React.useRef(); // Ref for the sidebar

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
    
  }

  // Function to close the sidebar
  const closeSidebar = () => {
      setRightIsOpen(false);
    };
  // Handle click outside sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarRef, setRightIsOpen]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 right-0 w-[120px] bg-blue-700 mt-[64px] bg-white transform transition-transform duration-300 ease-in-out ${sidebarClass}`}
      style={{ zIndex: 50 }} // You can set the zIndex to a value that suits your layout
    >
      <ul className='flex flex-col justify-center items-center'>
        <Link onClick={closeSidebar} to='/profile'>
            <li className='w-[120px] items-center m-auto py-[4px] text-right pr-6 hover:bg-sn-light-blue h-[30px]'>My Profile</li>
        </Link >
        <Link onClick={closeSidebar} to='/notification'>
            <li className='w-[120px] items-center m-auto py-[4px] text-right pr-6 hover:bg-sn-light-blue h-[30px]'>Notifications</li>
        </Link>
        <Link onClick={closeSidebar} to='/auth'>
            <li onClick={handleLogout} className='w-[120px] items-center m-auto py-[4px] text-right pr-6 hover:bg-sn-light-blue h-[30px]'>Log out</li>
        </Link>
      </ul>
    </div>
  );
};

export default RightSideBarComponent;
