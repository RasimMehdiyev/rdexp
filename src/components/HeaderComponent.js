import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/helper/supabaseClient";
import SynthleteSmallLogo from './SynthleteSmallLogo';

const HeaderComponent = ({ isOpen, toggleSidebar, setRightIsOpen , rightIsOpen }) => {
  const [userData, setUserData] = useState({});
  const [rotationDegree, setRotationDegree] = useState(0);

  // navigate
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await supabase.auth.getUser();
        if (user) {
          setUserData(user.data.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, []);

  // Handle user logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  // Toggle sidebar and rotate burger menu
  const toggleRotate = () => {
    toggleSidebar(!isOpen);
    setRotationDegree(prevDegree => prevDegree + 90);
  };

  const rightSideBarOpen = () => {
    setRightIsOpen(!rightIsOpen);
  }

  return (
    <header className='bg-sn-main-blue sticky top-0 items-center flex flex-row px-5 justify-between h-16 z-10'> {/* Ensure z-index is high enough */}
          <Link to="team-management/">
            <img className='cursor-pointer w-[60px] h-[59px] mb-[6px]' src={process.env.PUBLIC_URL + "/images/team.png"} alt="back" />
          </Link>
          <Link className="flex justify-center items-center" to="/">
            <SynthleteSmallLogo />
          </Link>
          <Link>
            <img onClick={rightSideBarOpen} className='cursor-pointer w-[36px] h-[35px] ' src={process.env.PUBLIC_URL + "/images/user-icon-svg.svg"} alt="profile" />
          </Link>
    </header>
  );
};

export default HeaderComponent;