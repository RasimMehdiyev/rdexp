import React, { useEffect } from 'react';
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
        }
    },[])

    return (
        <div>
            {
                logoState === 'Logo_Auth.svg' ? (
                    <div className='flex flex-col'>
                        <p className='text-logo'>SYNTHELETE</p>
                        <p className='text-logo-moto'>Elevate Your Game, Unite Your Team!</p>
                    </div>
                ) : (
                    <img className='cursor-pointer ' src={process.env.PUBLIC_URL + "/images/Logo_Login.svg"} />
                )
            }
        </div>
    );
};

export default SynthleteLogo;
