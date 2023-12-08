import React, { useState, useEffect } from 'react';
import SynthleteLogo from '../components/SynthleteLogo';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/helper/supabaseClient";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('+32');
    const [role, setRole] = useState('0');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');

    const navigate = useNavigate();

    const validateEmail = (inputEmail) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(inputEmail);
      };
    
      const handleBlur = () => {
        if (email.trim() === '') {
          setEmailError('');
        } else if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            toast.error("Please enter a valid email address.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
        } else {
          setEmailError('');
        }
      };


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (role === '0') {
            toast.error('Please select a valid role.');
            return;
        }

        try {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            let user = await supabase.auth.getUser();
            user = user.data.user

            const { error: errorUsers } = await supabase
                .from('users')
                .insert([{ email:email, full_name: fullName, phone_number: phoneNumber, role_id: role, user_id: user.id }]);

            if (errorUsers) throw errorUsers;

            toast.success('Registration successful! Redirecting...', { position: "top-center" });
            setTimeout(() => {
                if (role === '1') {
                    navigate('/club/create/');
                } else {
                    navigate('/');
                }
            }, 3000);
        } catch (error) {
            toast.error(error.error_description || error.message, { position: "top-center" });
        }
    };
    const isDisabled = !fullName || !email || !role || !password || !confirmPassword || password !== confirmPassword;
    const isPasswordMatch = password === confirmPassword;
    return (
        <div className='min-h-screen pt-10 pb-10 bg-sn-bg-light-blue flex flex-col gap-8 justify-center items-center'>
            <SynthleteLogo />
            <form className='text-center gap-2 w-80 items-center flex flex-col justify-center' onSubmit={handleSubmit}>
                    <input
                        className='shadow-md text-[12px] pl-2 font-interReg w-full h-12 rounded-lg border-2 border-club-header-blue'
                        placeholder='Full Name'
                        type="text"
                        value={fullName}
                        onChange={(event) => {
                            const capitalizedFullName = event.target.value
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ');

                            setFullName(capitalizedFullName);
                        }}
                    />
                    
                    <input
                    className={`shadow-md text-[12px] pl-2 font-interReg w-full h-12 rounded-lg border-2 ${
                        emailError ? 'border-red-500' : 'border-club-header-blue'
                      } ${
                        emailError ? 'text-red-500' : '' 
                      }`}
                    placeholder='Email'
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    onBlur={handleBlur}
                    />
                    

                    <PhoneInput
                    style={{ height: '3rem' }}
                    inputStyle={{ height: '100%', width:'100%' }}
                    className='phone-input border-2 rounded-lg border-club-header-blue'
                    placeholder='Enter phone number'
                    value={phoneNumber}
                    onChange={(newPhoneNumber) => setPhoneNumber(newPhoneNumber)}
                    />
                    
                    <input className='shadow-md pl-2 font-interReg w-full h-12 mt-5 rounded-lg border-2 border-club-header-blue' placeholder='Password' type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    <input className='shadow-md pl-2 font-interReg w-full h-12 rounded-lg border-2 border-club-header-blue' placeholder='Confirm Password' type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                    {isPasswordMatch ? null : 
                        <p className='text-[10px] font-interReg leading-none text-[#ff0000d3] font-bold'>Passwords do not match!</p>
                    }

                    <select className='shadow-md pl-2 font-interReg text-lf-dark-gray text-[12px] w-full h-9 mt-5 rounded-lg border-2 border-club-header-blue' value={role} onChange={(event) => setRole(event.target.value)}>
                        <option className='font-interReg' value="0">Choose role</option>
                        <option className='font-interReg' value='1'>Coach</option>
                        <option className='font-interReg' value="2">Player</option>
                        <option className='font-interReg' value="3">Volunteer</option>
                    </select>
                <button className={`${(isDisabled) ? 'cursor-not-allowed' : 'cursor-pointer'} text-white w-full h-16 mt-10 bg-club-header-blue font-russoOne rounded-10px`}  type="submit">SIGN UP</button>
                <p className='py-2 text-xs text-sn-main-blue font-interReg'>Already have an account? <Link className='font-interReg font-bold text-sn-main-blue underline hover:text-[gray]' to="/login">Log in</Link></p>
            </form>
            <ToastContainer />
        </div>
    );
}

export default RegisterPage;