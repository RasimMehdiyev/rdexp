import React from "react";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/helper/supabaseClient';
import LoadingPage from "./LoadingPage";
import { Link, useNavigate } from 'react-router-dom';
import {PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
// get current logged in user from supabase
// const { user } = useUser();


const ProfilePage = () => {
    let [userData, setUserData] = useState({})

    let [role, setRole] = useState('')
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
          } catch (error) {
            console.error("Error fetching data:", error);
          }
          finally {
            setLoading(false); // Stop loading regardless of the outcome
          }
        };
    
        fetchData();
      }, []);
      
      const handleLogout = async (e) => {
        e.preventDefault();
        await supabase.auth.signOut();
        console.log("Logged out")
        navigate('/auth')
    }




      if (loading) {
        return <LoadingPage />; // You can replace this with any loading spinner or indicator
      }else{
        return (
            <div className="bg-gradient-to-b from-indigo-100 from-40% to-white to-55% flex flex-col items-center justify-center h-screen">
                <div className="self-stretch h-[237px] p-2 flex-col justify-start items-center gap-5 flex">
                    
                    {userData.profilePicture ? (
                        <img className="w-[142px] h-[142px] rounded-full border-4 border-white" src={userData.profilePicture} />

                    ) : (
                        <img className="w-[142px] h-[142px] rounded-full border-4 border-white" src={process.env.PUBLIC_URL + "/images/no_user.png"} />
                    )
                        
                    }
                    
                    <div className="flex-col justify-start items-center gap-1 flex">
                        <div className="text-center text-blue-800 text-3xl font-russoOne leading-normal">{userData.fullName}</div>
                        <div className="text-center text-neutral-900 text-sm font-interEBold uppercase">{role}</div>
                    </div>
                    <div className="self-stretch justify-center items-center gap-4 inline-flex">
                        <div className="justify-center items-center gap-1 flex">
                          <EnvelopeIcon className="h-6 w-6"/>
                            <div className="text-center text-neutral-900 text-sm font-interReg">{userData.email}</div>
                        </div>
                        <div className="justify-center items-center gap-1 flex">
                            <div className="w-[18px] h-[18px] relative"><PhoneIcon className="h-5 w-5"></PhoneIcon></div>
                            {!userData.phoneNumber ? (
                            <div className="w-[150px] h-[10px] bg-gray-100 flex items-center justify-center">
                                <span className="text-center text-gray-500 text-sm font-interReg">No phone number</span>
                            </div>
                            ) : (
                            <div className="text-center text-black text-sm font-interReg">
                                {userData.phoneNumber}
                            </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="self-stretch h-[242px] px-2 py-4 flex-col justify-start items-center gap-2 flex">
                    <div className="self-stretch text-center text-neutral-900 text-xl font-interEBold">About</div>
                        <div className="w-[343px] text-center text-neutral-600 text-sm font-interReg">
                            {userData.bio}
                        </div>
                </div>
                <div className="flex-col justify-start items-center gap-2 flex">
                    <div className="w-[322px] h-[33px] p-2.5 bg-orange-500 rounded justify-center items-center gap-2.5 inline-flex">
                        <div className="text-white text-sm font-normal font-interReg uppercase">Edit Profile</div>
                    </div>
                    <button onClick={handleLogout} className="w-[322px] h-[33px] p-2.5 bg-zinc-300 rounded justify-center items-center gap-2.5 inline-flex">
                        <div className="text-neutral-900 text-sm font-normal font-interReg uppercase">Sign out</div>
                    </button>
                </div>
        </div>
          );
      }

  

}

export default ProfilePage;
