import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/helper/supabaseClient';
import { useNavigate } from 'react-router-dom';

const RightSideBarComponent = ({ rightIsOpen }) => {
  // Apply the transition class to the sidebar
  const sidebarClass = !rightIsOpen ? 'translate-x-full' : '-translate-x-0';
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  }

  return (
    <div
      className={`fixed top-0 right-0 w-[120px] bg-blue-700 mt-[64px] bg-white transform transition-transform duration-300 ease-in-out ${sidebarClass}`}
      style={{ zIndex: 50 }} // You can set the zIndex to a value that suits your layout
    >
      <ul className='flex flex-col justify-center items-center'>
        <Link to='/profile'>
            <li className='w-[120px] items-center m-auto py-[4px] text-right pr-6 hover:bg-sn-light-blue h-[30px]'>My Profile</li>
        </Link>
        <Link to='/profile/edit'>
            <li className='w-[120px] items-center m-auto py-[4px] text-right pr-6 hover:bg-sn-light-blue h-[30px]'>Edit profile</li>
        </Link>
        <Link to='/auth'>
            <li onClick={handleLogout} className='w-[120px] items-center m-auto py-[4px] text-right pr-6 hover:bg-sn-light-blue h-[30px]'>Log out</li>
        </Link>
      </ul>
    </div>
  );
};

export default RightSideBarComponent;
