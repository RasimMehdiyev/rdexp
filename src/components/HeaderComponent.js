import React from 'react';
import { supabase } from "../lib/helper/supabaseClient";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const  HeaderComponent = ({ isOpen, toggleSidebar }) => {
    let [userData, setUserData] = useState({})
    // navigate
    const navigate = useNavigate();
    // wait until the data is fetched and then render the page
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await supabase.auth.getUser();
                console.log(user)
                if (user){
                    setUserData(user.data.user)
                }
            }catch(error){
                console.log(error)
            }
        }
        fetchData();
    },[]);

    // handleLogout
    const handleLogout = async (e) => {
        e.preventDefault();
        await supabase.auth.signOut();
        console.log("Logged out")
        navigate('/auth')
    }


    return (
        <header className='bg-[#B7BDBE] pt-[20px] px-[14px] pb-0 flex flex-row justify-between'>
            <div className="flex flex-row gap-3 justify-normal h-[66px] w-[430px]">
                <img onClick={() => toggleSidebar(!isOpen)} className='cursor-pointer w-[40px] h-[40px]' src={process.env.PUBLIC_URL + "/images/burger_menu.svg"} alt="menu" />
                <img className='cursor-pointer w-[40px] h-[40px]' src={process.env.PUBLIC_URL + "/images/home.svg"} alt="home" />
                <img className='cursor-pointer w-[40px] h-[40px]' src={process.env.PUBLIC_URL + "/images/profile.svg"} alt="profile" />
                <img onClick={handleLogout} className='cursor-pointer w-[40px] h-[38px]' src={process.env.PUBLIC_URL + "/images/logout.svg"} alt="profile" />
            </div>
            <button className="flex flex-row gap-3 justify-normal h-[66px]">
                {/* <SynthleteLogo /> */}
                LOGO
            </button>
        </header>
    );
}

export default HeaderComponent;
