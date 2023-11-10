import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/helper/supabaseClient";

const HeaderComponent = ({ isOpen, toggleSidebar }) => {
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

  return (
<header className='bg-sn-main-blue items-center flex flex-row px-5 justify-between h-14 z-50'> {/* Ensure z-index is high enough */}
    <img
        onClick={toggleRotate}
        className='cursor-pointer w-[36px] h-[35px]'
        src={process.env.PUBLIC_URL + "/images/burger_menu.svg"}
        alt="menu"
        style={{ transform: `rotate(${rotationDegree}deg)`, transition: 'transform 0.3s ease-in-out' }}
      />
      <Link className="flex justify-center items-center" to="/">
        <img className='cursor-pointer mt-10 ml-8' src={process.env.PUBLIC_URL + "/images/SYN.svg"} alt="home" />
      </Link>
      <Link to="/profile">
        <img className='cursor-pointer w-[36px] h-[35px]' src={process.env.PUBLIC_URL + "/images/user-circle-svgrepo-com.svg"} alt="profile" />
      </Link>
      {/* <img onClick={handleLogout} className='cursor-pointer w-[40px] h-[38px]' src={process.env.PUBLIC_URL + "/images/logout.svg"} alt="logout" /> */}
    </header>
  );
};

export default HeaderComponent;