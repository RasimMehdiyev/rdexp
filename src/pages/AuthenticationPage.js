import React from 'react';
import { Link } from 'react-router-dom';
import SynthleteLogo from '../components/SynthleteLogo';

const AuthenticationPage = () => {
    return (
        <div className='min-h-screen  bg-sn-main-blue flex flex-col justify-center items-center'>
            <div><SynthleteLogo /></div>
            <div className='flex flex-col gap-5'>
                <Link to="/login">
                    <button data-testid="login-button" className="text-2xl text-white w-72 h-16 bg-orange font-russoOne rounded-10px" type="submit">Log In</button>
                </Link>
                <Link to="/register">
                    <button data-testid="signup-button" className='text-2xl text-sn-main-blue w-72 h-16 bg-white font-russoOne rounded-10px' type="submit">Sign Up</button>
                </Link>
            </div>
        </div>
    );
};

export default AuthenticationPage;
