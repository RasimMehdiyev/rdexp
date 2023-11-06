import React from 'react';
import { Link } from 'react-router-dom';

const SideBarComponent = ({ isOpen }) => {
  // Apply the transition class to the sidebar
  const sidebarClass = isOpen ? 'translate-x-0' : '-translate-x-full';

  return (
    <div
      className={`fixed top-0 left-0 w-[250px] bg-blue-700 mt-[80px] bg-white transform transition-transform duration-300 ease-in-out ${sidebarClass}`}
      style={{ zIndex: 10 }} // You can set the zIndex to a value that suits your layout
    >
      <ul className='flex flex-col justify-center items-center'>
        <Link to='/team-management'>
            <li className='w-[250px] m-auto mt-[20px] text-left pl-6 hover:bg-sn-light-blue h-[38px]'>Team management</li>
        </Link>
        <Link>
            <li className='w-[250px] m-auto mt-[20px] text-left pl-6 hover:bg-sn-light-blue h-[38px]'>Schedule</li>
        </Link>
        <Link>
            <li className='w-[250px] m-auto mt-[20px] text-left pl-6 hover:bg-sn-light-blue h-[38px]'>Announcements</li>
        </Link>
      </ul>
    </div>
  );
};

export default SideBarComponent;
