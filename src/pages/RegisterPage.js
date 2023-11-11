import React, { useState } from 'react';
import SynthleteLogo from '../components/SynthleteLogo2';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/helper/supabaseClient";
import axios from 'axios';

function RegisterPage() {
    const [userID, setUserID] = useState('');
    const [userData, setUserData] = useState({})
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const { error } = await supabase.auth.signUp({ email, password });
            let user = await supabase.auth.getUser();
            user = user.data.user
            if (error) throw error;
            console.log(user)
            if (user) {
                const { error: errorUsers } = await supabase
                    .from('Users')
                    .insert([{ email: email, fullname: fullName, phone_number: phoneNumber, role: role, user_id: user.id }]);
        
                if (errorUsers) throw errorUsers;
                navigate('/');
            }
        } catch (error) {
            alert(error.error_description || error.message);
        }
        
        
     };
    // if one of the necessary fields is empty, disable the submit button
    const isDisabled = !fullName || !email || !role || !password || !confirmPassword || password !== confirmPassword;
    const isPasswordMatch = password === confirmPassword;
    return (
        <div className='min-h-screen  bg-sn-light-blue flex flex-col gap-4 justify-center items-center'>
            <SynthleteLogo />
            <form className='text-center gap-5 items-center flex flex-col justify-center' onSubmit={handleSubmit}>
                    <input className='shadow-md text-[12px] pl-2 font-interReg w-64 h-12 rounded-lg border-2 border-sn-main-orange' placeholder='Full Name' type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} />
                    <input className='shadow-md text-[12px] pl-2 font-interReg w-64 h-12 rounded-lg border-2 border-sn-main-orange' placeholder='Email' type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                    <input className='shadow-md text-[12px] pl-2 font-interReg w-64 h-12 rounded-lg border-2 border-sn-main-orange' placeholder='Phone number (Optional)' type="tel" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} />
                    <select className='shadow-md pl-2 font-interReg text-lf-dark-gray text-[12px] w-64 h-12 rounded-lg border-2 border-sn-main-orange' value={role} onChange={(event) => setRole(event.target.value)}>
                        <option className='font-interReg' value="">No Selection</option>
                        <option className='font-interReg' value="coach">Coach</option>
                        <option className='font-interReg' value="player">Player</option>
                        <option className='font-interReg' value="volunteer">Volunteer</option>
                    </select>
                    <input className='shadow-md pl-2 font-interReg w-64 h-12 rounded-lg border-2 border-sn-main-orange' placeholder='Password' type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    <input className='shadow-md pl-2 font-interReg w-64 h-12 rounded-lg border-2 border-sn-main-orange' placeholder='Confirm Password' type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                    {isPasswordMatch ? null : 
                        <p className='text-[10px] font-interReg leading-none text-[#ff0000d3] font-bold'>Passwords do not match!</p>
                    }
                <button className={`${(isDisabled) ? 'cursor-not-allowed' : 'cursor-pointer'} text-2xl text-white w-72 h-16 bg-sn-main-orange font-russoOne rounded-10px`}  type="submit">Sign Up</button>
            </form>
            <p className='py-2 text-xs font-interReg'>Already have an account? <Link className='font-interReg font-bold underline hover:text-[gray]' to="/login">Log In</Link></p>
        </div>
    );
}

export default RegisterPage;