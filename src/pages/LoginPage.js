import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SynthleteLogo from '../components/SynthleteLogo';
import { supabase } from "../lib/helper/supabaseClient";


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            navigate('/')
        }catch(error){
            alert(error.error_description || error.message);
        }
    };
    useEffect(() => {
        const session = supabase.auth.getSession();
        setUser(session?.user ?? null);
        console.log(session)
    }, [])

    const isDisabled = !email || !password;


    return (
        <div className='min-h-screen bg-sn-bg-light-blue flex flex-col gap-12 justify-center items-center'>
            <SynthleteLogo />
            <form className='text-center gap-5 items-center flex flex-col justify-center' onSubmit={handleLogin}>
                <input placeholder='Email' className='shadow-md text-[12px] pl-2 font-interReg  w-64 h-12 rounded-lg border-2 border-sn-main-orange' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="Password" className='shadow-md text-[12px]  pl-2 font-interReg  w-64 h-12 rounded-lg border-2 border-sn-main-orange' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className={`${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} text-2xl text-white w-72 h-16 bg-sn-main-orange font-russoOne rounded-10px`} type="submit">Log In</button>
                <p className='py-2 text-xs font-[Arial] text-sn-main-blue'>Do not have an account yet? <Link className='font-[Arial] font-bold underline text-sn-main-blue' to="/register">Register</Link></p>
            </form>
        </div>
    );
};

export default LoginPage;
