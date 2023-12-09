import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SynthleteLogo from '../components/SynthleteLogo';
import { supabase } from "../lib/helper/supabaseClient";
import { ToastContainer, toast } from 'react-toastify';
import PasswordInput from '../components/PasswordInput.js';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailBorderColor, setEmailBorderColor] = useState('border-sn-main-orange');
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const inputRef = useRef(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            toast.success('Login successful! Redirecting...', { position: "top-center" });
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (error) {
            setEmailBorderColor('border-red-500'); 
            setPasswordColor('red-500');
            toast.error(error.error_description || error.message, { position: "top-center" });
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [passwordLengthError, setPasswordLengthError] = useState(false);
    const [passwordEdited, setPasswordEdited] = useState(false);
    const [passwordColor, setPasswordColor] = useState("sn-main-orange");

    const checkPasswordMatch = () => {
        // Your password match logic
    };

    const handlePasswordChange = (event) => {
        setPasswordEdited(true);
        setPassword(event.target.value);
    };

    const handlePasswordBlur = () => {
        checkPasswordMatch();
        setPasswordColor('sn-main-orange');

    };

    useEffect(() => {
        // Your existing useEffect logic
    }, [])

    const isDisabled = !email || !password;

    const validateEmail = (inputEmail) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(inputEmail);
    };

    const handleBlur = () => {
        if (email.trim() === '') {
            setEmailError('');
            setEmailBorderColor('border-sn-main-orange'); // Reset email border color on blur
        } else if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            setEmailBorderColor('border-red-500'); // Set email border color to red on error
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
            setEmailBorderColor('border-sn-main-orange'); 
        }
    };

    return (
        <div className='min-h-screen bg-sn-bg-light-blue flex flex-col gap-12 justify-center items-center'>
            <SynthleteLogo />
            <form className='text-center gap-2 items-center flex flex-col justify-center' onSubmit={handleLogin}>
                <input
                    className={`shadow-md placeholder-text pl-2 font-interReg w-full h-12 rounded-lg border-2 
                        ${emailBorderColor} ${
                    emailError ? 'text-red-500' : ''
                }`}
                    placeholder='Email'
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    onBlur={handleBlur}
                    maxLength={254}
                />
                <PasswordInput
                    isPasswordMatch={true}
                    passwordLengthError={passwordLengthError}
                    showPassword={showPassword}
                    handlePasswordChange={handlePasswordChange}
                    handlePasswordBlur={handlePasswordBlur}
                    togglePasswordVisibility={() => setShowPassword(!showPassword)}
                    password={password}
                    placeholder="Password"
                    placeholderColor={passwordColor}
                />
                <button className={`${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} text-white mt-5 w-64 h-16 bg-sn-main-orange font-russoOne rounded-10px`} type="submit">LOG IN</button>
                <p className='py-2 text-xs font-[Arial] text-sn-main-blue'>Do not have an account yet? <Link className='font-[Arial] font-bold underline text-sn-main-blue' to="/register">Register</Link></p>
            </form>
            <ToastContainer />
        </div>
    );
};

export default LoginPage;