import React from "react";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/helper/supabaseClient';
import LoadingPage from "./LoadingPage";
import { PencilIcon } from '@heroicons/react/24/solid'
import { Link, useNavigate } from 'react-router-dom';

const EditProfilePage = () => {
    const [userData, setUserData] = useState({});
    
    const [role, setRole] = useState('');

    const [newBio, setNewBio] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhoneNumber, setNewPhoneNumber] = useState('');

    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [emailError, setEmailError] = useState('');

    const [loading, setLoading] = useState(true); // Add a loading state
    // navigate
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          console.log("Fetching data");
          try {
            const userResponse = await supabase.auth.getUser();
            console.log("User:", userResponse);
            const user = userResponse.data.user;
            
            if (user) {
              // Initially, we don't know the user's role, so fetch from both tables.
              const { data: coachData, error: coachError } = await supabase
                .from('Coach')
                .select('*')
                .eq('userID', user.id)
                .single(); // Use single to get a single record or null
    
              if (coachData) {
                setUserData(coachData);
                setRole("Coach");
              } else {
                console.log("Coach Error:", coachError);
                const { data: playerData, error: playerError } = await supabase
                  .from('Player')
                  .select('*')
                  .eq('userID', user.id)
                  .single(); // Use single to get a single record or null
    
                if (playerData) {
                  setUserData(playerData);
                  setRole("Player");
                } else {
                  console.log("Player Error:", playerError);
                }
              }
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
    
    const handleSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();

        if (!validateEmail(newEmail)) {
            setEmailError('Email is not valid.');
            return;
        }

    // Validate phone number
        if (!validatePhoneNumber(newPhoneNumber)) {
            setPhoneNumberError('Phone number is not valid.');
            return;
        }

        console.log("submit handled");
        console.log("bio: ", newBio);
        console.log("email: ", newEmail);
        console.log("phone number: ", newPhoneNumber);

        try {
            const userResponse = await supabase.auth.getUser();
            console.log("User:", userResponse);
            const user = userResponse.data.user;
            if (role == 'Coach' || role == 'Player') {
                if (newBio != '') {
                    const { data: bioData, error: bioError } = await supabase
                    .from(role)
                    .update({ bio: newBio })
                    .eq('userID', user.id)
                    .select()
                }
                if (newEmail != '') {
                    const { data: emailData, error: emailError } = await supabase
                    .from(role)
                    .update({ email: newEmail })
                    .eq('userID', user.id)
                    .select()
                }
                if (newPhoneNumber != '') {
                    const { data: phoneData, error: phoneError } = await supabase
                    .from(role)
                    .update({ phoneNumber: newPhoneNumber })
                    .eq('userID', user.id)
                    .select()
                }
            } else { console.error("role unknown"); }                           
                
                        
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
            navigate('/profile');
        }

    };

    
    /**
     * TODO:
     * - Put the inputs in a form
     * - Handle submit form, test it first if needed
     * - Update data using JSX
     * 
    */
    if (loading) {
        return <LoadingPage />; // You can replace this with any loading spinner or indicator
    } else {
        return (
    <div className="grow flex bg-indigo-100 flex-col items-center justify-start h-screen">
        <div className="grow p-4 flex-col justify-start items-center gap-4 inline-flex">
        <div className="w-[329px] justify-center items-start gap-2.5 inline-flex">
            <div className="w-[142px] h-[142px] relative">
                {userData.profilePicture ? (
                    <img className="w-[142px] h-[142px] rounded-full border-4 border-white" src={userData.profilePicture} />

                ) : (
                    <img className="w-[142px] h-[142px] rounded-full border-4 border-white" src={process.env.PUBLIC_URL + "/images/no_user.png"} />
                )}                      
                
                <div className="w-[35px] h-[35px] left-[107px] top-[98px] absolute">                        
                    <div className="w-[35px] h-[35px] left-[-3px] top-0 absolute bg-zinc-300 rounded-full flex justify-center items-center">
                    <PencilIcon className="h-6 w-6" />   
                    </div>                        
                </div>
            </div>
        </div>
        <form onSubmit={handleSubmit}>
        <div className="flex-col justify-start items-start gap-2 flex">
            <div className="flex-col justify-start items-start gap-1 flex">
                <div className="w-[178px] px-4 justify-start items-start gap-2.5 inline-flex">
                    <div className="text-black text-base font-normal font-interReg leading-normal">About yourself</div>
                </div>
                <div className="w-[322px] px-4 py-1 bg-white rounded-md border border-orange-500 justify-start items-center inline-flex">
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
            <div className="flex-col justify-start items-start gap-1 flex">
                <div className="px-4 justify-start items-start gap-2.5 inline-flex">
                    <div className="text-black text-base font-normal font-interReg leading-normal">Email</div>
                </div>
                <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-orange-500 justify-start items-center gap-2.5 inline-flex">
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
            </div>
            <div className="flex-col justify-start items-start gap-1 flex">
                <div className="px-4 justify-start items-start gap-2.5 inline-flex">
                    <div className="text-black text-base font-normal font-interReg leading-normal">Phone number</div>
                </div>
                <div className="w-[322px] h-8 pl-5 pr-4 py-3 bg-white rounded-md border border-orange-500 justify-start items-center gap-2.5 inline-flex">
                    <div className="grow h-auto basis-0 justify-start items-center flex">                            
                        <input
                            className="text-neutral-500 text-base font-normal font-interReg leading-normal"
                            placeholder={userData.phoneNumber}
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
        <div className="flex-col justify-end items-center gap-2 flex">
            <button
                className="w-[322px] h-[33px] p-2.5 bg-orange-500 rounded justify-center items-center gap-2.5 inline-flex"
                type="submit">
                <div className="text-white text-sm font-normal font-interReg uppercase">save profile</div>
            </button>
            <Link to="/profile">
            <div className="w-[322px] h-[33px] p-2.5 bg-zinc-300 rounded justify-center items-center gap-2.5 inline-flex">
                <div className="text-neutral-900 text-sm font-normal font-interReg uppercase">cancel</div>
            </div>
            </Link>
        </div>
        </form>
        </div>
    </div>  
    );
    }

    
}

export default EditProfilePage;
