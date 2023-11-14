import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../lib/helper/supabaseClient";
import { useState } from 'react';
const SynthleteLogo = () => {
    
    const [logoState, setLogoState] = useState('');
    
    const getCurrentURL = () =>{
        return window.location.pathname;
    } 

    useEffect(() => {
        let currentURL = getCurrentURL();
        if (getCurrentURL() === '/auth') {
            setLogoState('Logo_Auth.svg')
        }else if (getCurrentURL() === '/login' || getCurrentURL() === '/register' || getCurrentURL() === '/login/' || getCurrentURL() === '/register/'){
            setLogoState('Logo_Login.svg')
            console.log(currentURL)
        }
    },[])

    return (
        <div>
            {
                logoState === 'Logo_Auth.svg' ? (
                    <img className='cursor-pointer ' src={process.env.PUBLIC_URL + "/images/Logo_Auth.svg"} />
                ) : (
                    <img className='cursor-pointer ' src={process.env.PUBLIC_URL + "/images/Logo_Login.svg"} />
                )
            }
        </div>
    );
};

export default SynthleteLogo;
