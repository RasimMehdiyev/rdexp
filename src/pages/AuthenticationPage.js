import React from 'react';
import { Link } from 'react-router-dom';
import SynthleteLogo from '../components/SynthleteLogo';

const AuthenticationPage = () => {
    return (
        <div className='m-auto mt-24 p-10 text-center'>
            <SynthleteLogo />
            <div className='flex flex-col gap-5'>
                <Link to="/login">
                    <button className="text-4xl border-black text-stroke font-black border-2 border-solid w-72 h-16 bg-primary" type="submit">Log In</button>
                </Link>
                <Link to="/register">
                    <button className='text-4xl text-[white] w-72 h-16 bg-[#656A6B]' type="submit">Sign Up</button>
                </Link>
            </div>
        </div>
    );
};

export default AuthenticationPage;
