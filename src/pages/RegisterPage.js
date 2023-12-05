import React, { useState } from 'react';
import SynthleteLogo from '../components/SynthleteLogo';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/helper/supabaseClient";
import axios from 'axios';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function RegisterPage() {
    const [userID, setUserID] = useState('');
    const [userData, setUserData] = useState({})
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('+32');
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
                    .from('users')
                    .insert([{ email: email, full_name: fullName, phone_number: phoneNumber, role_id: role, user_id: user.id }])
                    .select();
                if (errorUsers) throw errorUsers;
                if (role === '1') {
                navigate('/club/create/');
                }else{
                    navigate('/');
                }
            }
        } catch (error) {
            alert(error.error_description || error.message);
        }
        
        
     };
    // if one of the necessary fields is empty, disable the submit button
    const isDisabled = !fullName || !email || !role || !password || !confirmPassword || password !== confirmPassword;
    const isPasswordMatch = password === confirmPassword;
    return (
        <div className='min-h-screen pt-10 pb-10 bg-sn-bg-light-blue flex flex-col gap-8 justify-center items-center'>
            <SynthleteLogo />
            <form className='text-center gap-2 w-80 items-center flex flex-col justify-center' onSubmit={handleSubmit}>
                    <input className='shadow-md text-[12px] pl-2 font-interReg w-full h-12 rounded-lg border-2 border-sn-main-orange' placeholder='Full Name' type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} />
                    <input className='shadow-md text-[12px] pl-2 font-interReg w-full h-12 rounded-lg border-2 border-sn-main-orange' placeholder='Email' type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                    <PhoneInput
                    style={{ height: '3rem' }}
                    inputStyle={{ height: '100%', width:'100%' }}
                    className='phone-input border-2 rounded-lg border-sn-main-orange'
                    placeholder='Enter phone number'
                    value={phoneNumber}
                    onChange={(newPhoneNumber) => setPhoneNumber(newPhoneNumber)}
                    />
                    
                    <input className='shadow-md pl-2 font-interReg w-full h-12 mt-5 rounded-lg border-2 border-sn-main-orange' placeholder='Password' type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    <input className='shadow-md pl-2 font-interReg w-full h-12 rounded-lg border-2 border-sn-main-orange' placeholder='Confirm Password' type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                    {isPasswordMatch ? null : 
                        <p className='text-[10px] font-interReg leading-none text-[#ff0000d3] font-bold'>Passwords do not match!</p>
                    }

                    <select className='shadow-md pl-2 font-interReg text-lf-dark-gray text-[12px] w-full h-9 mt-5 rounded-lg border-2 border-sn-main-orange' value={role} onChange={(event) => setRole(event.target.value)}>
                        <option className='font-interReg' value="0">Choose role</option>
                        <option className='font-interReg' value='1'>Coach</option>
                        <option className='font-interReg' value="2">Player</option>
                        <option className='font-interReg' value="3">Volunteer</option>
                    </select>
                <button className={`${(isDisabled) ? 'cursor-not-allowed' : 'cursor-pointer'} text-white w-full h-16 mt-10 bg-sn-main-orange font-russoOne rounded-10px`}  type="submit">SIGN UP</button>
                <p className='py-2 text-xs text-sn-main-blue font-interReg'>Already have an account? <Link className='font-interReg font-bold text-sn-main-blue underline hover:text-[gray]' to="/login">Log in</Link></p>
            </form>
        </div>
    );
}

export default RegisterPage;