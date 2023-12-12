import React,  { useEffect, useState } from "react";
import { supabase } from '../lib/helper/supabaseClient';
import { PencilIcon } from '@heroicons/react/24/solid'
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom';
import StickyEditProfileComponent from "../components/StickyEditProfileComponent";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PhoneInput from "react-phone-input-2";

const EditProfilePage = () => {
    const [userData, setUserData] = useState({});
    const [role, setRole] = useState('');
    const [newBio, setNewBio] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [newNumber, setNewNumber] = useState('');

    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [emailTextColor, setEmailTextColor] = useState('neutral-500');
    const [phoneTextColor, setPhoneTextColor] = useState('neutral-500');
    const [bioTextColor, setBioTextColor] = useState('neutral-500');
    const [placeholderEmail, setPlaceholderEmail] = useState(userData.email);
    const [previewImage, setPreviewImage] = useState(null);
    const [buttonOpacity, setButtonOpacity] = useState('0.5');
    const [buttonEnabled, setButtonEnabled] = useState(false);
    const [loading, setLoading] = useState(true); // Add a loading state
    // navigate
    const navigate = useNavigate();
    
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        //console.log("handling img change, file is:", file);
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            //console.log("image", reader.result)
            setPreviewImage(reader.result);
           
        };
        reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
          console.log("Fetching data");
          try {
            const userResponse = await supabase.auth.getUser();
            console.log("User:", userResponse);
            const user = userResponse.data.user;
            
            if (user) {
                const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('user_id', user.id)
                .single();
                if (userError) throw userError;
                console.log("User data:", userData);
                setUserData(userData);
                setRole(userData.role);
                setNewNumber(userData.number);
                setNewBio(userData.bio);
                setNewEmail(userData.email);
                setNewPhoneNumber(userData.phone_number);
                setPreviewImage(userData.profile_picture);
            }
            else{
                navigate('/auth');
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
          finally {
            setLoading(false); // Stop loading regardless of the outcome
          }
        };
    
        fetchData();
    }, []);

    const validateEmail = (newEmail) => {
        // Regular expression for a valid email address
        if (newEmail != '') {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(newEmail);
        } else return true;
        
    };


    const handleBlur = () => {
        setEmailTextColor("black");
        if(emailError)
        {
            toast.error("Please enter a valid email address.", {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        
        setPlaceholderEmail("Email")
    };

    const handlePhoneBlur=() =>{
        setPhoneTextColor("black");
        updateButtonState();
    }

    const handleBioBlur=() =>{
        setBioTextColor("black");
        updateButtonState();
    }

    const updateButtonState = () => {
        if (!validateEmail(newEmail)) {
            setEmailError(true);
        }
        else
        {
            setEmailError(false);
        }

        const allFieldsFilled = newEmail.trim() !== '' && newPhoneNumber.trim() !== '' && newNumber.trim() !== '';
       
        setButtonEnabled( allFieldsFilled || !emailError);
        setButtonOpacity( allFieldsFilled && !emailError ? 1 : 0.5);
    };

    useEffect(() => {
        // Assuming updateButtonState uses newPhoneNumber, we call it here to ensure
        // it uses the most up-to-date state.
        updateButtonState();
      }, [newPhoneNumber, updateButtonState]);
    
    const onSave = async (event) => {
       // setLoading(true);
        event.preventDefault();
        
        if (!validateEmail(newEmail) | !validatePhoneNumber(newPhoneNumber)) {
            if (!validateEmail(newEmail)) {
                setEmailError('Email is not valid.');                
            } else {
                setEmailError('');
            }
            // Validate phone number
            if (!validatePhoneNumber(newPhoneNumber)) {
                setPhoneNumberError('Phone number is not valid.');
            } else {
                setPhoneNumberError('');
            }
            setLoading(false)
            return;
        }
    

        try {
            const userResponse = await supabase.auth.getUser();
            console.log("User line 122:", userResponse);
            const user = userResponse.data.user;


            if (user) {
                // Update the user's profile
                const { data: user_data, error: userError } = await supabase
                    .from('users')
                    .update({
                        bio: newBio,
                        email: newEmail,
                        phone_number: newPhoneNumber,
                        profile_picture: previewImage,
                        number: newNumber
                    })
                    .eq('user_id', user.id)
                    .single();
                if (userError) throw userError;
                toast.success('Profile updated successfully! Redirecting...', { position: "top-center", zIndex: 50});
                setTimeout(() => {
                    console.log("redirecting")
                  navigate('/profile');
                }, 3000); 
            }     
    
        } catch (error) {
            toast.error(error.error_description || error.message, { position: "top-center" });
        }

    };

    
    if (loading) {
    } else {
        return (
            <div>
            <StickyEditProfileComponent buttonOpacity={buttonOpacity} isButtonEnabled={buttonEnabled} onSave={onSave}/>
            <div className="grow flex bg-indigo-100 flex-col items-center justify-start h-screen">
                <div className="grow p-4 flex-col justify-start items-center gap-4 inline-flex">
                <div className="w-[329px] justify-center items-start gap-2.5 inline-flex">
                    <div className="relative">
                        
                        <label htmlFor="profilePictureInput">
                            {previewImage ? (
                            <img className="w-[142px] h-[142px] rounded-full object-cover overflow-hidden cursor-pointer" src={previewImage} alt="Preview" />
                            ) : (
                            <img className="w-[150px] h-[150px] rounded-full cursor-pointer object-cover overflow-hidden" src={process.env.PUBLIC_URL + "/images/no_user.png"} alt="No user" />
                            )}

                            <div className="w-[35px] h-[35px] left-[107px] top-[98px] absolute">
                            <div className="w-[35px] h-[35px] left-[-3px] top-0 absolute bg-blue-600 rounded-full flex justify-center items-center cursor-pointer">
                                <PencilIcon className="h-6 w-6 text-white" />
                            </div>
                            </div>
                        </label>
                        <input
                            type="file"
                            id="profilePictureInput"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                            
                        />
                    </div>
                </div>
                
                <div className="flex-col justify-start items-start gap-2 flex">
                    
                    <div className="flex-col justify-start items-start gap-1 flex">
                        <div className=" justify-start items-start gap-2.5 inline-flex">
                            <div className="text-blue-600 text-xl font-russoOne">Contact details</div>
                        </div>
                        <div className={`w-[322px] h-12 pl-5 pr-4 py-3 mb-2 bg-white rounded-lg border-2 ${
                            emailError  ? 'border-red-500' : 'border-club-header-blue'
                        } justify-start items-center gap-2.5 inline-flex`}>
                            
                            <EnvelopeIcon className={`h-5 w-5  text-club-header-blue ${
                                        emailError ? 'text-red-500' : ''}`}></EnvelopeIcon>
                            <div className="w-full h-auto basis-0 justify-start items-center flex ">
                                <input
                                    className={`text-${emailTextColor} p-2 text-base font-normal font-interReg leading-normal  ${
                                        emailError ? 'text-red-500' : 'text-black'
                                    }`}
                                    placeholder={placeholderEmail}
                                    type="email"
                                    value={newEmail}
                                    onChange={(event) => {
                                        setNewEmail(event.target.value);
                                        //setEmailError('');
                                        updateButtonState();
                                        
                                    }} 
                                    onBlur={handleBlur}
                                />
                            </div>
                        </div>
                        
                        <PhoneInput
                            style={{ height: '3rem', marginBottom: '30px' }}
                            inputStyle={{ height: '100%', width:'100%' }}
                            className={`text-${phoneTextColor} phone-input border-2 rounded-lg border-club-header-blue`}
                            placeholder={userData.phone_number}
                            dropdownStyle={{ textAlign: 'left' }} 
                            value={newPhoneNumber}
                            onChange={(newPhoneNumber) => {
                                setNewPhoneNumber(newPhoneNumber); // Update the phone number
                                if (typeof updateButtonState === 'function') {
                                updateButtonState(); // Update the state of the button
                                }
                            }}
                        />

       
                        
                    </div>                                          
                        
                    </div>
                    <div className="flex-col justify-start items-start gap-1 flex">
                        <div className="flex-row flex items-center">
                            <div className="w-[178px] justify-start items-start inline-flex">
                                <div className="text-blue-600 text-xl font-russoOne">About player</div>
                            </div>
                            {
                                userData.role_id == 2 ?                         
                                <div className="flex items-center gap-2.5 mb-2">
                                    <input
                                        type="text"
                                        onChange={(event) => { setNewNumber(event.target.value) }}
                                        value={newNumber}
                                        className="text-neutral-500 text-base font-normal leading-normal w-14 h-14 pl-4 pr-4 bg-white rounded-full border-2 border-club-header-blue"
                                        placeholder={userData.number ? userData.number : 'Nr.'}
                                    />
                                  
                                </div>
                                : <div></div>
                            }
                        </div>
                        <div className="w-[322px] px-4 py-1 mt-2 bg-white rounded-lg border-2 border-club-header-blue  justify-start items-center inline-flex">
                            <div className="grow h-auto basis-0 justify-start items-center flex">
                                <textarea
                                    value={newBio}
                                    onChange={(event) => setNewBio(event.target.value)}
                                    className={`text-${bioTextColor} grow basis-0  font-normal font-interReg"`} cols="30" rows="5" maxLength={255}
                                    placeholder={userData.bio ? userData.bio : 'Information about yourself...'}
                                    onBlur={handleBioBlur}
                                    />
                            </div>
                        </div>
                    </div>        
                </div>
                
                </div>
                <ToastContainer />
            </div>  
            
    );
    }

    
}

export default EditProfilePage;
