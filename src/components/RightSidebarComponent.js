import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/helper/supabaseClient';
import { UserIcon, BellIcon, ArrowUturnRightIcon } from '@heroicons/react/24/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';



const RightSideBarComponent = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const sidebarRef = useRef(); // Ref for the sidebar

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
    toggleSidebar(); // Close sidebar after logging out
  };

  

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 right-0 bg-blue-700 mt-[64px] pl-2 pr-2 bg-white rounded-lg transform transition-transform duration-300 ease-in-out`}
      style={{ zIndex: 50 }} // You can set the zIndex to a value that suits your layout
    >
      <ul className='flex flex-col justify-center'>
        {/* Profile */}
        <Link onClick={toggleSidebar} to='/profile' className='flex items-center space-x-2 p-2 rounded-md justify-start'>
          <div className="bg-sn-main-blue rounded-full p-2 flex items-center justify-center w-8 h-8">
            <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-white"/> 
          </div>
          <span>My Profile</span>
        </Link>
        {/* Notifications */}
        <Link onClick={toggleSidebar} to='/notification' className='flex items-center space-x-2 p-2 rounded-md justify-start'>
          <div className="bg-sn-main-blue rounded-full p-2 flex items-center justify-center w-8 h-8">
            <FontAwesomeIcon icon={faBell} className="h-4 w-4 text-white"/> 
          </div>
          <span>Notifications</span>
        </Link>
        {/* Log Out */}
        <Link onClick={handleLogout} className='flex items-center space-x-2 p-2 rounded-md justify-start'>
          <div className="bg-sn-main-blue rounded-full p-2 flex items-center justify-center w-8 h-8">
            <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4 text-white"/> 
          </div>
          <span>Sign out</span>
        </Link>
      </ul>
    </div>
  );
};

export default RightSideBarComponent;
