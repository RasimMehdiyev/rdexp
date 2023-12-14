import React from 'react'
import {useNavigate} from 'react-router-dom';
import {supabase} from '../lib/helper/supabaseClient';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StickyPasswordChange = ({buttonState , newPassword}) => {
    const nagivate = useNavigate();

    const getPreviousPage = () => {
        // console.log('previous page');
        nagivate(-1);
    }

    const handleSave = async () => {
        try{
            const {updatePassword, updatePasswordError} = await supabase.auth.updateUser({ password: newPassword});
            if(updatePasswordError){
                throw updatePasswordError;
            }
            console.log(updatePassword);
        }catch(error){
            toast.error(error.message, {position: "top-center", autoClose: 3000,zIndex: 50});
        }
        finally{
            toast.success("Password changed successfully", {position: "top-center", autoClose: 3000,zIndex: 50});
            nagivate('/profile');
        }
    }



  return (
    <>
      <div className="bg-sn-subheader-blue sticky top-16 shadow-md z-20"> 
        <div className="p-2 h-14 flex flex-row justify-between items-center">
          <div className='flex flex-row justify-between gap-1 items-center'>
              <img className='cursor-pointer' onClick={getPreviousPage} src={process.env.PUBLIC_URL + "/images/chevron-down.svg"} alt="" />
              <p className='text-[20px] font-russoOne text-white'>Profile</p>
          </div>
          <div className='flex flex-row justify-between gap-4'>       
              <button  className={buttonState()} onClick={handleSave}>SAVE</button>
          </div>
        </div>
        <ToastContainer/>
    </div>
    </>

  );
};

export default StickyPasswordChange