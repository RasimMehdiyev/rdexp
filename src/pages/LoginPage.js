import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SynthleteLogo from '../components/SynthleteLogo';
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/')
    };

    const isDisabled = !email || !password;


    return (
        <div className='m-auto p-10 mt-20  text-center'>
            <SynthleteLogo />
            <form className='text-center gap-5 items-center flex flex-col justify-center' onSubmit={handleLogin}>
                <input placeholder='Email' className='border-2 text-[12px] pl-2 font-[Arial] border-solid border-black w-64 h-10 rounded-lg' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="Password" className='text-[12px] border-2 pl-2 font-[Arial] border-solid border-black w-64 h-10 rounded-lg' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className={`${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} text-4xl border-black text-stroke font-black border-2 border-solid w-72 h-16 bg-primary`} type="submit">Log In</button>
            </form>
            <p className='py-2 text-xs font-[Arial]'>Do not have an account yet? <Link className='font-[Arial] font-bold underline hover:text-[gray]' to="/register">Register</Link></p>
        </div>
    );
};

export default LoginPage;
