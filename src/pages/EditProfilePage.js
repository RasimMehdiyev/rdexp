import React,  { useEffect, useState } from "react";
import { supabase } from '../lib/helper/supabaseClient';
import { PencilIcon } from '@heroicons/react/24/solid'
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { Link, useNavigate } from 'react-router-dom';
import StickyEditProfileComponent from "../components/StickyEditProfileComponent";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PhoneInput from 'react-phone-input-2'

const EditProfilePage = () => {
    const [userData, setUserData] = useState({});
    const [role, setRole] = useState('');
    const [newBio, setNewBio] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [clickNumber, setClickNumber] = useState(0);

    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(true); // Add a loading state
    const [showNumber, setShowNumber] = useState(false);

    const [emailTextColor, setEmailTextColor] = useState('neutral-500');
    const [phoneTextColor, setPhoneTextColor] = useState('neutral-500');
    const [bioTextColor, setBioTextColor] = useState('neutral-500');

    const [placeholderPhoneNumber, setPlaceholderPhoneNumber] = useState('Phone');
    const [placeholderBio, setPlaceholderBio] = useState('Bio');
    

    // Set initial button state to disabled
    const [buttonEnabled, setButtonEnabled] = useState(false);
    const [buttonOpacity, setButtonOpacity] = useState('0.5');

    const [hasUserMadeChanges, setHasUserMadeChanges] = useState(false);

    

    // navigate
    const navigate = useNavigate();
    
    useEffect(() => {
        // Flipping to show number on first load
        const timer = setTimeout(() => setShowNumber(true), 1000);
        const timer2 = setTimeout(() => setShowNumber(false), 2000);
        return () => {
            clearTimeout(timer);
            clearTimeout(timer2);
        };
    }, []);
  
    const handleProfileClick = () => {
        setClickNumber(clickNumber + 1);
        if (clickNumber  % 3 == 0) {
            setShowNumber(false);
        } else {
            setShowNumber(true);
        }
    };

    const handleInputChange = (e) => {
        setNewEmail(e.target.value);
        setHasUserMadeChanges(true);
    };
    // Similar for other input fields
    

    const handleImageChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
        }
    };

    const updateButtonState = () => {
        const isValidEmail = newEmail ? validateEmail(newEmail) : false;

        if (!isValidEmail) {
            setEmailError(true);
        }
        else {
            setEmailError(false);
        }

        const allFieldsFilled = newEmail.trim() !== '' && newPhoneNumber.trim() !== '' && newNumber.trim() !== '';
    
        setButtonEnabled(isValidEmail && allFieldsFilled && hasUserMadeChanges);
        setButtonOpacity(isValidEmail && allFieldsFilled && hasUserMadeChanges ? 1 : 0.5);
    };
    

    useEffect(() => {
        updateButtonState();
    }, [newEmail, newPhoneNumber, newBio, newNumber]);

    useEffect(() => {
        const fetchData = async () => {
          console.log("Fetching data");
          try {
            const userResponse = await supabase.auth.getUser();
            const user = userResponse.data.user;
            
            if (user) {
                const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('user_id', user.id)
                .single();
                if (userError) throw userError;
                setUserData(userData);
                setRole(userData.role);
                setNewEmail(userData.email || '');
                setNewPhoneNumber(userData.phone_number || '');
                setNewNumber(userData.number || '');
                setNewBio(userData.bio || '');
                setPreviewImage(userData.profile_picture);
                setHasUserMadeChanges(false); // Reset user change tracking
            }
            else{
                navigate('/auth');
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
          finally {
            setLoading(false); 
            // setButtonEnabled(false);
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

    const validatePhoneNumber = (newPhoneNumber) => {
        // Regular expression for a valid phone number
        if (newPhoneNumber != '') {
            const phonePattern = /^[\d\+\-\s]+$/;
            return phonePattern.test(newPhoneNumber);
        } else return true;
        
    };
    
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
                toast.success('Profile updated successfully! Redirecting...', { position: "bottom-center", zIndex: 50});
                setTimeout(() => {
                    console.log("redirecting")
                  navigate('/profile');
                }, 3000); 
            }     
    
        } catch (error) {
            toast.error(error.error_description || error.message, { position: "bottom-center" });
        }

    };


    const handleBlur = () => {
        setEmailTextColor('black');

        if (emailError){
            toast.error("Please enter a valid email address.", {
                position: "bottom-center",
                zIndex: 50,
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light"
            });
        }
    }

    const handlePhoneBlur = () => {
        setPhoneTextColor('black');
        setPlaceholderPhoneNumber('Phone')
    }

    const handleBioBlur = () => {
        setBioTextColor('black');
        setPlaceholderBio('Bio')
    }

    
    if (loading) {
    } else {
        return (
            <div>
            <StickyEditProfileComponent 
                onSave={onSave}                 
                isButtonEnabled={buttonEnabled}
                buttonOpacity={buttonOpacity}
            />
            <div className="grow flex bg-indigo-100 flex-col items-center justify-start h-screen">
                <div className="grow p-4 flex-col justify-start items-center gap-4 inline-flex">
                    <div className={`profile-flipper ${showNumber ? 'show-number' : ''}`} onClick={handleProfileClick}>
                        <div className="profile-front"> 
                            
                                    {previewImage ? (
                                    <img className="w-[142px] h-[142px] rounded-full object-cover overflow-hidden" src={previewImage} alt="Preview" />
                                    ) : (
                                    <img className="w-[150px] h-[150px] rounded-full  object-cover overflow-hidden" src={process.env.PUBLIC_URL + "/images/no_user.png"} alt="No user" />
                                    )}
                                    <label htmlFor="profilePictureInput">
                                        <div className="w-[35px] h-[35px] left-[107px] top-[98px] absolute" onChange={(e) => (handleImageChange(e))}>
                                            <div className="w-[35px] h-[35px] left-[-3px] top-0 absolute bg-blue-600 rounded-full flex justify-center items-center cursor-pointer">
                                                <PencilIcon className="h-6 w-6 text-white"/>
                                            </div>
                                        </div>
                                    </label>
                                        <input
                                            type="file"
                                            id="profilePictureInput"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                        />
                                    
                        </div>
                        <div className="profile-back bg-sn-main-orange circle-number rounded-full font-russoOne shadow-md text-white mr-8">
                            {
                                userData.role_id == 2 ?    
                                <input
                                            type="text"
                                            className="text-white placeholder:text-5xl w-full placeholder:text-white border-none font-russoOne font-normal bg-sn-main-orange leading-normal text-center !text-5xl  rounded-full"
                                            placeholder={userData.number || 'Nr.'}
                                            value={newNumber}
                                            onChange={(e) => 
                                                {
                                                    setNewNumber(e.target.value);                                        
                                                    setHasUserMadeChanges(true);
                                            }
                                            }
                                        />
                                        :
                                <div></div>
                                }
                        </div>
                    </div>
                
                <div className="flex-col justify-start items-start gap-2 flex">
                    
                    <div className="flex-col justify-start items-start gap-1 flex">
                        <div className="px-4 justify-start items-start gap-2.5 inline-flex">
                            <div className="text-blue-600 text-xl font-russoOne">Contact details</div>
                        </div>
                        <div className={`w-[322px] h-12 pl-2 pr-4 py-3 mb-3 bg-white rounded-lg border-2 ${emailError ? 'border-red-500':'border-club-header-blue'}  justify-start items-center gap-2.5 inline-flex`}>
                            <EnvelopeIcon className={`h-5 w-5 text-club-header-blue ${emailError ? 'text-red-500' : ''}`}></EnvelopeIcon>
                            <div className="w-full h-auto basis-0 justify-start items-center flex">
                                <input
                                    className={`text-base text-${emailTextColor} ${emailError ? 'text-red-500' : 'text-black'} font-normal font-interReg leading-normal`}
                                    placeholder={userData.email}
                                    type="email"
                                    value={newEmail}
                                        onChange={(event) => {
                                            setNewEmail(event.target.value);
                                            setEmailError(''); 
                                            setHasUserMadeChanges(true);
                                        }
                                    } 
                                    onBlur={handleBlur}

                                    />
                            </div>
                        </div>
                        <PhoneInput
                            style={{ height: '3rem', marginBottom: '30px' }}
                            inputStyle={{ height: '100%', width:'100%' }}
                            className={`text-${phoneTextColor} phone-input border-2 rounded-lg border-club-header-blue`}
                            placeholder={placeholderPhoneNumber}
                            dropdownStyle={{ textAlign: 'left' }} 
                            value={newPhoneNumber}
                            onChange={(newPhoneNumber) => {
                                setNewPhoneNumber(newPhoneNumber);
                                setPhoneNumberError('');
                                setHasUserMadeChanges(true);
                            }}
                            onBlur={handlePhoneBlur}
                        />
                        
                        {(phoneNumberError != '') ? <div className="text-red-500">{phoneNumberError}</div>:<div></div>}        
                        
                    </div>                                          
                        
                    </div>
                    <div className="flex-col justify-start items-start gap-1 flex">
                        <div className="w-[178px] px-4 justify-start items-start gap-2.5 inline-flex">
                            <div className="text-blue-600 text-xl font-russoOne">About player</div>
                        </div>
                        <div className="w-[322px] px-4 py-1 bg-white rounded-lg border-2 border-club-header-blue  justify-start items-center inline-flex">
                            <div className="grow h-auto basis-0 justify-start items-center flex">
                                <textarea
                                    value={newBio}
                                    onChange={(event) => {setNewBio(event.target.value);                                                
                                        setHasUserMadeChanges(true);
                                    }}
                                    className={`text-${bioTextColor} font-normal font-interReg basis-0 grow`}
                                    // cols='30'
                                    rows='5'
                                    placeholder={placeholderBio}
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
