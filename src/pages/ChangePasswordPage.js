import React, { useEffect } from 'react'
import PasswordInput from '../components/PasswordInput'
import { supabase } from '../lib/helper/supabaseClient';
import { useNavigate } from 'react-router-dom';
import StickyPasswordChange from '../components/StickyPasswordChange';



const ChangePasswordPage = () => {

    const [oldPassword, setOldPassword] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [isPasswordMatch, setIsPasswordMatch] = React.useState(true);
    const [passwordLengthError, setPasswordLengthError] = React.useState(false);
    const [passwordColor, setPasswordColor] = React.useState('club-header-blue');
    const [showOldPassword, setShowOldPassword] = React.useState(false);
    const [isOldPasswordMatch, setIsOldPasswordMatch] = React.useState(false);
    const [buttonState, setButtonState] = React.useState(false);
    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        checkPasswordMatch(newPassword, confirmPassword);
        checkOldNewPasswordMatch(newPassword, oldPassword);
    }

    const handlePasswordBlur = (e) => {
        const password = e.target.value;
        if (password.length < 8) {
            setPasswordLengthError(true);
            setPasswordColor('text-red-500');
        } else {
            setPasswordLengthError(false);
            setPasswordColor('club-header-blue');
        }
    }
    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        checkPasswordMatch(password, newConfirmPassword);
    }

    const checkOldNewPasswordMatch = (newPassword, oldPassword) => {
        setIsOldPasswordMatch(newPassword === oldPassword);
    }

    const checkPasswordMatch = (password, confirmPassword) => {
        setIsPasswordMatch(password === confirmPassword);
    }

    const handleConfirmPasswordBlur = (e) => {
        const confirmPassword = e.target.value;
        if (confirmPassword !== password) {
            setIsPasswordMatch(false);
        } else {
            setIsPasswordMatch(true);
        }
    }
    const handleOldPasswordChange = (e) => {
        const newOldPassword = e.target.value;
        setOldPassword(newOldPassword);
        checkOldNewPasswordMatch(password, newOldPassword);
    }

    const handleOldPasswordBlur = (e) => {
        const oldPassword = e.target.value;
        if (oldPassword.length < 8) {
            setPasswordLengthError(true);
            setPasswordColor('text-red-500');
        } else {
            setPasswordLengthError(false);
            setPasswordColor('club-header-blue');
        }
    }

    const handleOldPasswordMatch = (e) => {
        const newPassword = e.target.value;
        if (oldPassword.length > 0 && newPassword === oldPassword) {
            setIsOldPasswordMatch(true); // True if new password is the same as old
            setPasswordColor('text-red-500');
        } else {
            setIsOldPasswordMatch(false);
            setPasswordColor('club-header-blue');
        }
    }

    const checkButtonState = () => {
        if (password.length >= 8 && isPasswordMatch && oldPassword.length > 0 && !isOldPasswordMatch) {
            setButtonState(true);
        } else {
            setButtonState(false);
        }
    }

    const changeButtonState = () => {
        // make button disabled design
        if (buttonState) {
            return 'bg-sn-main-orange h-8 w-[72px] text-white rounded-[10px] text-[14px]';
        } else {
            return 'bg-sn-main-orange h-8 w-[72px] text-white rounded-[10px] text-[14px] opacity-50 cursor-not-allowed';
        }
    }

    useEffect(() => {
        checkButtonState();
    }, [password, confirmPassword, oldPassword, isOldPasswordMatch]);

        


  return (
    <div>
        <StickyPasswordChange buttonState={changeButtonState} newPassword={password}/>
        <div className='min-h-screen bg-sn-bg-light-blue flex flex-col gap-8 pt-20 items-center'>
            <p className='font-russoOne text-club-header-blue text-4xl'>Change Password</p>
            <form className='text-center gap-2 w-80 items-center flex flex-col justify-center'>
                        <PasswordInput
                                isPasswordMatch={isPasswordMatch}
                                passwordLengthError={passwordLengthError}
                                showPassword={showOldPassword}
                                handlePasswordChange={handleOldPasswordChange}
                                handlePasswordBlur={handleOldPasswordBlur}
                                togglePasswordVisibility={() => setShowOldPassword(!showOldPassword)}
                                password={oldPassword}
                                placeholder="Old Password"
                                placeholderColor={passwordColor}
                        />
                        <PasswordInput
                                isPasswordMatch={isPasswordMatch}
                                passwordLengthError={passwordLengthError}
                                showPassword={showPassword}
                                handlePasswordChange={handlePasswordChange}
                                handlePasswordBlur={(e) => {handlePasswordBlur(e);handleOldPasswordMatch(e)}}
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
                        )
                        }
                        {!isPasswordMatch && (
                            <p className='text-[10px] text-sm font-interReg leading-none text-red-500 font-bold'>Passwords do not match.</p>
                        )
                        }
                        {isOldPasswordMatch && (
                            <p className='text-[10px] text-sm font-interReg leading-none text-red-500 font-bold'>New password must be different from the old one.</p>
                        )
                        }

                        {/* <button className={`${changeButtonState()}`}>RESET</button> */}
            </form>
        </div>
    </div>


    
  )
}

export default ChangePasswordPage