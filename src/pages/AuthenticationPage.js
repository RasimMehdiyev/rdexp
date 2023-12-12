import React from 'react';
import { Link } from 'react-router-dom';
import SynthleteLogo from '../components/SynthleteLogo';
import { supabase } from "../lib/helper/supabaseClient";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthenticationPage = () => {
    const navigate = useNavigate();

    // useEffect(() => {
    //     let user = supabase.auth.getUser();
    //     if (user) {
    //         navigate('/');
    //     }
    // },[]);

    return (
        <div className='gap-36 min-h-screen bg-sn-main-blue flex flex-col justify-center items-center'>
            <SynthleteLogo />
            <div className='flex flex-col gap-5'>
                <Link to="/login">
                    <button data-testid="login-button" className="text-xl text-white w-72 h-16 bg-sn-main-orange font-russoOne rounded-10px" type="submit">LOG IN</button>
                </Link>
                <Link to="/register">
                    <button data-testid="signup-button" className='text-xl text-sn-main-blue w-72 h-16 bg-white font-russoOne rounded-10px' type="submit">SIGN UP</button>
                </Link>
            </div>
        </div>
    );
};

export default AuthenticationPage;
