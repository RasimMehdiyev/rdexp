import React from 'react'
import PasswordInput from '../components/PasswordInput'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '../lib/helper/supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import SynthleteLogo from '../components/SynthleteLogo';

export const ForgottenPasswordPage = () => {

    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [isPasswordMatch, setIsPasswordMatch] = React.useState(true);
    const [passwordLengthError, setPasswordLengthError] = React.useState(false);
    const [passwordColor, setPasswordColor] = React.useState('club-header-blue');
    const [buttonState, setButtonState] = React.useState(false);
    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        checkPasswordMatch(newPassword, confirmPassword);
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


    const checkButtonState = () => {
        if (password.length >= 8 && isPasswordMatch) {
            setButtonState(true);
        } else {
            setButtonState(false);
        }
    }

    const changeButtonState = () => {
        // make button disabled design
        if (buttonState) {
            return 'text-white bg-sn-main-orange mt-5 w-64 h-16 font-russoOne rounded-10px';
        } else {
            return 'text-white bg-sn-main-orange mt-5 w-64 h-16 font-russoOne rounded-10px opacity-50 cursor-not-allowed';
        }
    }

    useEffect(() => {
        checkButtonState();
    }, [password, confirmPassword]);

    const handleResetPassword = async (e) => {
        try{
          console.log(password)
          const {updatePassword, updatePasswordError} = await supabase.auth.updateUser({ password: password});
          if(updatePasswordError){
              throw updatePasswordError;
          }
          console.log(updatePassword);
      }catch(error){
          toast.error(error.message, {position: "top-center", autoClose: 3000,zIndex: 50});
      }
      finally{
          toast.success("Password changed successfully", {position: "top-center", autoClose: 3000,zIndex: 50});
          setTimeout(() => {
              navigate('/login');
          }, 3000);
      }
      }

        
  return (
    <div>
        <div className='min-h-screen bg-sn-bg-light-blue flex flex-col gap-12 justify-center items-center'>
          <SynthleteLogo />
            <form className='text-center gap-2 w-80 items-center flex flex-col justify-center'>
                        <PasswordInput
                                isPasswordMatch={isPasswordMatch}
                                passwordLengthError={passwordLengthError}
                                showPassword={showPassword}
                                handlePasswordChange={handlePasswordChange}
                                handlePasswordBlur={(e) => {handlePasswordBlur(e)}}
                                togglePasswordVisibility={() => setShowPassword(!showPassword)}
                                password={password}
                                placeholder="New Password"
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
                            placeholder="Confirm New Password"
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

                        <button className={`${changeButtonState()}`} onClick={handleResetPassword}>RESET</button>
            </form>
        </div>
        <ToastContainer/>
    </div>
  )
}
