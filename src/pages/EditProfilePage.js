import React,  { useEffect, useState } from "react";
import { supabase } from '../lib/helper/supabaseClient';
import LoadingPage from "./LoadingPage";
import { PencilIcon } from '@heroicons/react/24/solid'
import { Link, useNavigate } from 'react-router-dom';
import StickySubheaderComponent from "../components/StickySubheaderComponent";
import StickyEditProfileComponent from "../components/StickyEditProfileComponent";

const EditProfilePage = () => {
    const [userData, setUserData] = useState({});
    
    const [role, setRole] = useState('');

    const [newBio, setNewBio] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');

    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
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

    const validatePhoneNumber = (newPhoneNumber) => {
        // Regular expression for a valid phone number
        if (newPhoneNumber != '') {
            const phonePattern = /^[\d\+\-\s]+$/;
            return phonePattern.test(newPhoneNumber);
        } else return true;
        
    };
    
    const onSave = async (event) => {
        console.log("handling save in edit prof page");
        setLoading(true);
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
        

        console.log("submit handled");
        console.log("bio: ", newBio);
        console.log("email: ", newEmail);
        console.log("phone number: ", newPhoneNumber);
        console.log("new image:", previewImage);

        try {
            const userResponse = await supabase.auth.getUser();
            console.log("User:", userResponse);
            const user = userResponse.data.user;
            if (user) {
                // Update the user's profile
                const { data: user_data, error: userError } = await supabase
                    .from('users')
                    .update({
                        bio: newBio,
                        email: newEmail,
                        phone_number: newPhoneNumber,
                        profile_picture: previewImage
                    })
                    .eq('user_id', user.id)
                    .single();
                if (userError) throw userError;
                console.log("User data:", user_data);
                setUserData(user_data);
            }                       
                
                        
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
            navigate('/profile');
        }

    };

    
    if (loading) {
        return <LoadingPage />; // You can replace this with any loading spinner or indicator
    } else {
        return (
            <div>
            <StickyEditProfileComponent onSave={onSave}/>
            <div className="grow flex bg-indigo-100 flex-col items-center justify-start h-screen">
                <div className="grow p-4 flex-col justify-start items-center gap-4 inline-flex">
                <div className="w-[329px] justify-center items-start gap-2.5 inline-flex">
                    <div className="w-[142px] h-[142px] relative cursor-pointer">
                        {/* {userData.profile_picture ? (
                            <img className="w-[142px] h-[142px] rounded-full object-cover overflow-hidden" src={userData.profile_picture} />

                        ) : (
                            <img className="w-[142px] h-[142px] rounded-full border-4 border-white" src={process.env.PUBLIC_URL + "/images/no_user.png"} />
                        )}                      
                        
                        <div className="w-[35px] h-[35px] left-[107px] top-[98px] absolute">                        
                            <div className="w-[35px] h-[35px] left-[-3px] top-0 absolute bg-blue-600 rounded-full flex justify-center items-center">
                            <PencilIcon className="h-6 w-6 text-white" />   
                            </div>                        
                        </div> */}
                        <label htmlFor="profilePictureInput">
                            {previewImage ? (
                            <img className="w-[142px] h-[142px] rounded-full object-cover overflow-hidden" src={previewImage} alt="Preview" />
                            ) : (
                            <img className="w-[142px] h-[142px] rounded-full border-4 border-white" src={process.env.PUBLIC_URL + "/images/no_user.png"} alt="No user" />
                            )}

                            <div className="w-[35px] h-[35px] left-[107px] top-[98px] absolute">
                            <div className="w-[35px] h-[35px] left-[-3px] top-0 absolute bg-blue-600 rounded-full flex justify-center items-center">
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
                        <div className="px-4 justify-start items-start gap-2.5 inline-flex">
                            <div className="text-blue-600 text-xl font-russoOne">Contact details</div>
                        </div>
                        <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-blue-600  justify-start items-center gap-2.5 inline-flex">
                            <div className="grow h-auto basis-0 justify-start items-center flex">
                                <input
                                    className='text-neutral-500 text-base font-normal font-interReg leading-normal'
                                    placeholder={userData.email}
                                    type="email"
                                    value={newEmail}
                                        onChange={(event) => {
                                            setNewEmail(event.target.value);
                                            setEmailError(''); }
                                    } />
                            </div>
                        </div>
                        {(emailError != '') ? <div className="text-red-500">{emailError}</div>:<div></div>}
                        <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-blue-600 justify-start items-center gap-2.5 inline-flex">
                            <div className="grow h-auto basis-0 justify-start items-center flex">                            
                                <input
                                    className="text-neutral-500 text-base font-normal font-interReg leading-normal"
                                    placeholder={userData.phone_number}
                                    type="tel"
                                    value={newPhoneNumber}
                                            onChange={(event) => {
                                                setNewPhoneNumber(event.target.value);
                                                setPhoneNumberError('');
                                            }} />
                            </div>
                        </div>
                        {(phoneNumberError != '') ? <div className="text-red-500">{phoneNumberError}</div>:<div></div>}        
                        
                    </div>                                          
                        
                    </div>
                    <div className="flex-col justify-start items-start gap-1 flex">
                        <div className="w-[178px] px-4 justify-start items-start gap-2.5 inline-flex">
                            <div className="text-blue-600 text-xl font-russoOne">Bio</div>
                        </div>
                        <div className="w-[322px] px-4 py-1 bg-white rounded-md border border-blue-600  justify-start items-center inline-flex">
                            <div className="grow h-auto basis-0 justify-start items-center flex">
                                <textarea
                                    value={newBio}
                                    onChange={(event) => setNewBio(event.target.value)}
                                    className="grow basis-0 text-neutral-500 text-sm font-normal font-interReg"
                                    placeholder={userData.bio}
                                    />
                            </div>
                        </div>
                    </div>        
                </div>
                
                
                </div>
            </div>  
            
    );
    }

    
}

export default EditProfilePage;
