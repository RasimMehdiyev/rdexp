import React, { useState, useEffect } from 'react';
import SynthleteLogo from '../components/SynthleteLogo';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/helper/supabaseClient";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PasswordInput from '../components/PasswordInput.js';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('+32');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [playerNumber, setPlayerNumber] = useState('');

    const navigate = useNavigate();

    const [allFieldsFilled, setAllFieldsFilled] = useState(false);
    useEffect(() => {
        setAllFieldsFilled(
            !!fullName &&
            !!email &&
            !!phoneNumber &&
            !!role &&
            !!password &&
            !!confirmPassword &&
            (role !== '2' || (!!playerNumber && /^\d{1,2}$/.test(playerNumber)))
        );
    }, [fullName, email, phoneNumber, role, password, confirmPassword, playerNumber]);

    const [passwordEdited, setPasswordEdited] = useState(false);
    const [confirmPasswordEdited, setConfirmPasswordEdited] = useState(false);
    const [passwordLengthError, setPasswordLengthError] = useState(false);
    const [passwordColor, setPasswordColor] = useState("club-header-blue");

    const checkPasswordMatch = () => {
        if (passwordEdited && confirmPasswordEdited && password !== confirmPassword) {
        toast.error("Passwords don't match. Please check and try again.", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
        });

        }
        
    };

    const handlePasswordChange = (event) => {
        setPasswordEdited(true);
        setPassword(event.target.value);
      };
    
      const handleConfirmPasswordChange = (event) => {
        setConfirmPasswordEdited(true);
        setConfirmPassword(event.target.value);
      };
    
      const handlePasswordBlur = () => {
        checkPasswordMatch();
        setPasswordLengthError(password.length < 8 && passwordEdited);
      };
    
      const handleConfirmPasswordBlur = () => {
        checkPasswordMatch();
      };

    const validateEmail = (inputEmail) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(inputEmail);
      };

      
        const [showPassword, setShowPassword] = useState(false);
        const [showConfirmPassword, setShowConfirmPassword] = useState(false);

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };

        const toggleConfirmPasswordVisibility = () => {
            setShowConfirmPassword(!showConfirmPassword);
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

      const renderPlayerSpecificField = () => {
        if (role === '2') { 
            return (
                <input
                    className='shadow-md placeholder-text ml-2 mt-5 placeholder:text-white placeholder:text-center placeholder:font-russoOne placeholder:font-bold font-bold text-white text-center bg-sn-main-orange w-12 h-12 rounded-full font-russoOne'
                    placeholder='Nr'
                    type="text"
                    pattern="\d{1,2}"
                    value={playerNumber}
                    onChange={(event) => {
                        const input = event.target.value;
                        if (/^\d{0,2}$/.test(input)) {
                            setPlayerNumber(input);
                        }
                    }}
                />
            );
        }
        return null;
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
                .insert([{ email:email, full_name: fullName, phone_number: phoneNumber, role_id: role, user_id: user.id , number: playerNumber}]);

            if (errorUsers) throw errorUsers;

            toast.success('Registration successful! Redirecting...', { position: "top-center" });
            setTimeout(() => {
                if (role === '1') {
                    navigate('/club/create/');
                } else {
                    navigate('/');
                }
            }, 1500);
        } catch (error) {
            toast.error(error.error_description || error.message, { position: "top-center" });
        }
    };
    const isDisabled = !fullName || !email || !role || !password || !confirmPassword || password !== confirmPassword;
    const isPasswordMatch = password === confirmPassword;
    return (
        <div className='min-h-screen  pt-10 pb-10 bg-sn-bg-light-blue flex flex-col gap-8 justify-center items-center'>
            <SynthleteLogo />
            <form className='text-center gap-2 w-80 items-center flex flex-col justify-center' onSubmit={handleSubmit}>
                    <input
                        className='placeholder:-translate-x-2 shadow-md placeholder-text p-2 font-interReg w-full h-12 rounded-lg border-2 border-club-header-blue'
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
                        maxLength={100} 
                    />
                    
                    <input
                    className={`placeholder:-translate-x-2 shadow-md placeholder-text p-2 font-interReg w-full h-12 rounded-lg border-2 
                    ${
                        emailError ? 'border-red-500' : 'border-club-header-blue'
                      } ${
                        emailError ? 'text-red-500' : '' 
                      }`}
                    placeholder='Email'
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    onBlur={handleBlur}
                    maxLength={254} 
                    />
                    
                    
                    <PhoneInput
                    style={{ height: '3rem', marginBottom: '30px' }}
                    inputStyle={{ height: '100%', width:'100%' }}
                    className='phone-input border-2 rounded-lg border-club-header-blue'
                    placeholder='Enter phone number'
                    dropdownStyle={{ textAlign: 'left' }} 
                    value={phoneNumber}
                    onChange={(newPhoneNumber) => setPhoneNumber(newPhoneNumber)}/>

                    <PasswordInput
                            isPasswordMatch={isPasswordMatch}
                            passwordLengthError={passwordLengthError}
                            showPassword={showPassword}
                            handlePasswordChange={handlePasswordChange}
                            handlePasswordBlur={handlePasswordBlur}
                            togglePasswordVisibility={() => setShowPassword(!showPassword)}
                            password={password}
                            placeholder="Password"
                            placeholderColor={passwordColor}
                    />

                    <PasswordInput
                        isPasswordMatch={isPasswordMatch}
                        passwordLengthError={passwordLengthError}
                        showPassword={showConfirmPassword}
                        handlePasswordChange={handleConfirmPasswordChange}
                        handlePasswordBlur={handleConfirmPasswordBlur}
                        togglePasswordVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                        password={confirmPassword}
                        placeholder="Confirm Password"
                        placeholderColor={passwordColor}
                    />


                    {passwordLengthError && (
                        <p className='text-[10px] text-sm font-interReg leading-none text-red-500 font-bold'>Password must be at least 8 characters.</p>
                    )}
                                    
                    <div className="flex items-center justify-start w-full">
                    <div className="relative w-full">
                        <select
                            className="text-black appearance-none mt-7 w-full h-12 px-4 mb-2 border-2 border-club-header-blue rounded-lg bg-white cursor-pointer pr-8"
                            value={role}
                            onChange={(event) => setRole(event.target.value)}
                        >
                            <option style={{ color: 'gray' }} className="font-interReg " value="" disabled selected>
                                Choose role
                            </option>
                            <option className="font-interReg" value="1">
                                Coach
                            </option>
                            <option className="font-interReg" value="2">
                                Player
                            </option>
                            <option className="font-interReg" value="3">
                                Volunteer
                            </option>
                        </select>
                        <div className="absolute right-2 top-1/2  flex items-center pr-2 pointer-events-none">
                            <FontAwesomeIcon icon={faChevronDown} className="text-club-header-blue" />
                        </div>
                    </div>
                    {renderPlayerSpecificField()}
                    </div>
                    <button
                         className={`text-white bg-club-header-blue  font-interBold text-xl w-[70vw] h-16 mt-16 rounded-10px ${
                            allFieldsFilled && isPasswordMatch && !emailError? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
                        }`}
                        type="submit"
                        disabled={!allFieldsFilled || !isPasswordMatch || emailError}>
                        SAVE
                    </button>
                <p className='py-2 text-xs text-sn-main-blue font-interReg'>Already have an account? <Link className='font-interReg font-bold text-sn-main-blue underline hover:text-[gray]' to="/login">Log in</Link></p>
            </form>
            <ToastContainer />
        </div>
    );
}

export default RegisterPage;