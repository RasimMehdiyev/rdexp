import React from 'react';
import SynthleteLogo from './SynthleteLogo';
import { supabase } from "../lib/helper/supabaseClient";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBarComponent from './SideBarComponent';

const  HeaderComponent = ({ isOpen, toggleSidebar }) => {
    let [userData, setUserData] = useState({})
    // navigate
    const navigate = useNavigate();
    // wait until the data is fetched and then render the page
    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching data")
            try {
                console.log("Trying")
                const user = await supabase.auth.getUser();
                console.log(user)
                if (user){
                    setUserData(user.data.user)
                }
            }catch(error){
                console.log(error)
            }
        }
        console.log(userData)
        fetchData();
    },[]);

    // handleLogout
    const handleLogout = async (e) => {
        e.preventDefault();
        await supabase.auth.signOut();
        console.log("Logged out")
        navigate('/auth')
    }
    // Open sidebar on click
    let brgIsDisabled = false;
    const brgDisable = (brgIsDisabled) => {
        if (brgIsDisabled === false){
            brgIsDisabled = true;
        }
        else{
            brgIsDisabled = false;
        }
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