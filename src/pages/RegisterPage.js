import React, { useState } from 'react';
import SynthleteLogo from '../components/SynthleteLogo2';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/helper/supabaseClient";
import axios from 'axios';

function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try{
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            navigate('/')
        }catch(error){
            alert(error.error_description || error.message);
        }
        const addPlayerURL = "https://neeixstjxyxdbquebgkc.supabase.co/rest/v1/rpc/add_player"
        const addCoachURL = "https://neeixstjxyxdbquebgkc.supabase.co/rest/v1/rpc/addCoach"

        if (role === 'Player' || role === 'player'){
            axios.post(addPlayerURL, {
                email: email,
                fullname: fullName,
                phonenumber: phoneNumber,
                password: password,
                team: null
            }, {
                headers: {
                    'apikey': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lZWl4c3RqeHl4ZGJxdWViZ2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU5OTQ1MjksImV4cCI6MjAxMTU3MDUyOX0.S9NLt_yf96o7gaNmNLYQiXqekZ2M55QhxYUWXeqZn5g",
                    "Content-Type": "application/json"
                }
            })
            .then((response) => {
                console.log(response)
            })        
        }
        else if (role === "Coach" || role === "coach")
        {
            axios.post(addCoachURL, {
                email: email,
                fullname: fullName,
                phoneNumber: phoneNumber
            },
            {
                headers: {
                    'apikey': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lZWl4c3RqeHl4ZGJxdWViZ2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTU5OTQ1MjksImV4cCI6MjAxMTU3MDUyOX0.S9NLt_yf96o7gaNmNLYQiXqekZ2M55QhxYUWXeqZn5g",
                    "Content-Type": "application/json"                
                }
            })
            .then((response) => {
                console.log(response)
            })
        } 

    };
    // if one of the necessary fields is empty, disable the submit button
    const isDisabled = !fullName || !email || !role || !password || !confirmPassword || password !== confirmPassword;
    const isPasswordMatch = password === confirmPassword;
    return (
        <div className='min-h-screen  bg-sn-light-blue flex flex-col justify-center items-center'>
            <h1 className='text-primary text-[60px] text-sn-main-blue leading-none tracking-tighter font-russoOne'>Register</h1>
            <br></br>
            <form className='text-center gap-5 items-center flex flex-col justify-center' onSubmit={handleSubmit}>
                    <input className='shadow-md text-[12px] pl-2 font-interReg w-64 h-12 rounded-lg border-2 border-orange' placeholder='Full Name' type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} />
                    <input className='shadow-md text-[12px] pl-2 font-interReg w-64 h-12 rounded-lg border-2 border-orange' placeholder='Email' type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                    <input className='shadow-md text-[12px] pl-2 font-interReg w-64 h-12 rounded-lg border-2 border-orange' placeholder='Phone number (Optional)' type="tel" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} />
                    <select className='shadow-md pl-2 font-interReg text-lf-dark-gray text-[12px] border-[black] w-64 h-12 rounded-lg border-2 border-orange' value={role} onChange={(event) => setRole(event.target.value)}>
                        <option className='font-interReg' value="">No Selection</option>
                        <option className='font-interReg' value="coach">Coach</option>
                        <option className='font-interReg' value="player">Player</option>
                        <option className='font-interReg' value="volunteer">Volunteer</option>
                    </select>
                    <input className='shadow-md pl-2 font-interReg w-64 h-12 rounded-lg border-2 border-orange' placeholder='Password' type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    <input className='shadow-md pl-2 font-interReg w-64 h-12 rounded-lg border-2 border-orange' placeholder='Confirm Password' type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                    {isPasswordMatch ? null : 
                        <p className='text-[10px] font-interReg leading-none text-[#ff0000d3] font-bold'>Passwords do not match!</p>
                    }
                <button className={`${(isDisabled) ? 'cursor-not-allowed' : 'cursor-pointer'} text-2xl text-white w-72 h-16 bg-orange font-russoOne rounded-10px`}  type="submit">Sign Up</button>
            </form>
            <p className='py-2 text-xs font-interReg'>Already have an account? <Link className='font-interReg font-bold underline hover:text-[gray]' to="/login">Log In</Link></p>
        </div>
    );
}

export default RegisterPage;
