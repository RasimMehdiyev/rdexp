import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SynthleteLogo from '../components/SynthleteLogo';
import { supabase } from "../lib/helper/supabaseClient";
import IsChrome from "../hooks/IsChrome";
import { ToastContainer, toast } from 'react-toastify';
import PasswordInput from '../components/PasswordInput.js';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const inputRef = useRef(null);
    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            toast.success('Login successful! Redirecting...', { position: "top-center" });
            setTimeout(() => {
              navigate('/');
            }, 3000);
        }catch(error){
          toast.error(error.error_description || error.message, { position: "top-center" });
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [passwordLengthError, setPasswordLengthError] = useState(false);
    const [passwordEdited, setPasswordEdited] = useState(false);

    const checkPasswordMatch = () => {
       
    };
    
    
      const handlePasswordChange = (event) => {
        setPasswordEdited(true);
        setPassword(event.target.value);
      };
    
    
      const handlePasswordBlur = () => {
        checkPasswordMatch();
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
            <form className='text-center gap-2 items-center flex flex-col justify-center' onSubmit={handleLogin}>
                <input ref={inputRef}  placeholder='Email' className='shadow-md text-[12px] pl-2 font-interReg  w-64 h-12 rounded-lg border-2 border-sn-main-orange' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <PasswordInput
                        isPasswordMatch={true}
                        passwordLengthError={passwordLengthError}
                        showPassword={showPassword}
                        handlePasswordChange={handlePasswordChange}
                        handlePasswordBlur={handlePasswordBlur}
                        togglePasswordVisibility={() => setShowPassword(!showPassword)}
                        password={password}
                        placeholder="Password"
                        placeholderColor="sn-main-orange"
                    />
                {/*<input ref={inputRef} placeholder="Password" className='shadow-md text-[12px]  pl-2 font-interReg  w-64 h-12 rounded-lg border-2 border-sn-main-orange' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />*/}
                <button className={`${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} text-white mt-5 w-64 h-16 bg-sn-main-orange font-russoOne rounded-10px`} type="submit">LOG IN</button>
                <p className='py-2 text-xs font-[Arial] text-sn-main-blue'>Do not have an account yet? <Link className='font-[Arial] font-bold underline text-sn-main-blue' to="/register">Register</Link></p>
            </form>
            <ToastContainer />
        </div>
    );
};

export default LoginPage;
