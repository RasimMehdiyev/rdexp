import React, { useState } from 'react';
import SynthleteLogo from '../components/SynthleteLogo';
import { Link } from 'react-router-dom';


function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission here
    };
    // if one of the necessary fields is empty, disable the submit button
    const isDisabled = !fullName || !email || !role || !password || !confirmPassword || password !== confirmPassword;
    const isPasswordMatch = password === confirmPassword;
    return (
        <div className='m-auto p-10  text-center'>
            <SynthleteLogo />
            <form className='text-center gap-5 items-center flex flex-col justify-center' onSubmit={handleSubmit}>
                    <input className='border-2 text-[12px] pl-2 font-[Arial] border-solid border-black w-64 h-10 rounded-lg' placeholder='Full Name' type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} />
                    <input className='border-2 text-[12px] pl-2 font-[Arial] border-solid border-black w-64 h-10 rounded-lg' placeholder='Email' type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                    <input className='border-2 text-[12px] pl-2 font-[Arial] border-solid border-black w-64 h-10 rounded-lg' placeholder='Phone number (Optional)' type="tel" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} />
                    <select className='pl-2 font-[Arial] text-[12px] border-2 border-solid border-[black] w-64 h-10 rounded-lg' value={role} onChange={(event) => setRole(event.target.value)}>
                        <option className='font-[Arial]' value="">No Selection</option>
                        <option className='font-[Arial]' value="coach">Coach</option>
                        <option className='font-[Arial]' value="player">Player</option>
                        <option className='font-[Arial]' value="volunteer">Volunteer</option>
                    </select>
                    <input className='border-2 pl-2 font-[Arial] border-solid border-black w-64 h-10 rounded-lg' placeholder='Password' type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    <input className='border-2 pl-2 font-[Arial] border-solid border-black w-64 h-10 rounded-lg' placeholder='Confirm Password' type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                    {isPasswordMatch ? null : 
                        <p className='text-[10px] font-[Arial] leading-none text-[#ff0000d3] font-bold'>Passwords do not match!</p>
                    }
                <button className={`${(isDisabled) ? 'cursor-not-allowed' : 'cursor-pointer'} text-4xl text-[white] w-72 h-16 bg-[#656A6B]`}  type="submit">Sign Up</button>
            </form>
            <p className='py-2 text-xs font-[Arial]'>Already have an account? <Link className='font-[Arial] font-bold underline hover:text-[gray]' to="/login">Log In</Link></p>
        </div>
    );
}

export default RegisterPage;
