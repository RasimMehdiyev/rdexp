import React from "react";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/helper/supabaseClient';
import LoadingPage from "./LoadingPage";
import { Link, useNavigate } from 'react-router-dom';
import {PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'


const ProfilePage = () => {
    const [userData, setUserData] = useState({})
    const [loading, setLoading] = useState(true); // Add a loading state
    const navigate = useNavigate();
    const [showNumber, setShowNumber] = useState(false);


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
      setShowNumber(!showNumber);
  };


    useEffect(() => {
        const fetchData = async () => {
          console.log("Fetching data");
          try {
            const userResponse = await supabase.auth.getUser();
            const user = userResponse.data.user;
            console.log("User:", user);
            if (user) {
              // Initially, we don't know the user's role, so fetch from both tables.
              const { data: user_data, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('user_id', user.id)
                .single(); // Use single to get a single record or null   
              if (userError) throw userError;
              console.log("User data:", user_data);     
              setUserData(user_data);     
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
      
      
      if (loading) {
        return <LoadingPage />; // You can replace this with any loading spinner or indicator
      }
      else{
        return (
            <div className="bg-gradient-to-b from-sn-bg-light-blue from-40% to-white to-55% flex flex-col items-center justify-start h-screen">
                <div className="p-4 flex flex-col items-center gap-5">
                  <div className={`profile-flipper ${showNumber ? 'show-number' : ''}`} onClick={handleProfileClick}>
                      <div className="profile-front">
                          {userData.profile_picture ? (
                              <img className="object-cover h-[142px] w-[142px] rounded-full border-3 border-white" src={userData.profile_picture} alt="Profile" />
                          ) : (
                              <img className="object-cover h-[142px] w-[142px] rounded-full border-3 border-white" src={process.env.PUBLIC_URL + "/images/no_user.png"} alt="No user" />
                          )}
                      </div>
                          {                      
                            userData.role_id === 2 ?
                            <div className="profile-back bg-sn-main-orange rounded-full font-russoOne circle-number shadow-md text-white mr-8">
                              <div className="player-number text-5xl">{userData.number || 'No Number'}</div>
                            </div>
                            :
                            <div className="profile-back">
                            {userData.profile_picture ? (
                                <img className="object-cover h-[142px] w-[142px] rounded-full border-3 border-white" src={userData.profile_picture} alt="Profile" />
                            ) : (
                                <img className="object-cover h-[142px] w-[142px] rounded-full border-3 border-white" src={process.env.PUBLIC_URL + "/images/no_user.png"} alt="No user" />
                            )}
                        </div>
                          }
                  </div>
                    <div className="flex-col justify-start items-center gap-1 flex">
                        <div className="text-center text-blue-800 text-3xl font-russoOne leading-normal">{userData.full_name}</div>
                        <div className="text-center text-neutral-900 text-sm font-interEBold uppercase">{userData.role}</div>
                    </div>
                    <div className="mobile-email-box self-stretch justify-center items-center gap-4 inline-flex">
                        <div className="justify-center items-center gap-1 flex">
                            <EnvelopeIcon className="h-6 w-6"/>
                            <div className="text-center text-neutral-900 text-sm font-interReg">{userData.email}</div>
                        </div>
                        <div className="justify-center items-center gap-1 flex">
                            <div className="w-[18px] h-[18px] relative"><PhoneIcon className="h-5 w-5"></PhoneIcon></div>
                            {!userData.phone_number ? (
                            <div className="w-[150px] h-[10px] flex items-center justify-center">
                                <div className="text-center text-neutral-900 text-sm font-interReg">No phone number</div>
                            </div>
                            ) : (
                            <div className="text-center text-neutral-900 text-sm font-interReg">
                                {userData.phone_number}
                            </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="self-stretch px-2 py-4 flex-col justify-start items-center gap-2 flex">
                    <div className="self-stretch text-center text-neutral-900 text-xl font-interEBold">About</div>
                        <div className="w-[343px] text-left text-neutral-600 text-sm font-interReg">
                        {userData.bio ? (
                          <p>{userData.bio}</p>
                        ) : (
                          <p>No bio</p>
                        )}
                        </div>
                </div>
                
        </div>
          );
      }

  

}

export default ProfilePage;
