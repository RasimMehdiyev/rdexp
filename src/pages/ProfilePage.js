import React from "react";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/helper/supabaseClient';
import LoadingPage from "./LoadingPage";
import { Link, useNavigate } from 'react-router-dom';
import {PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'


const ProfilePage = () => {
    const [userData, setUserData] = useState({})
    const [loading, setLoading] = useState(true); // Add a loading state
    // navigate
    const navigate = useNavigate();

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
                .from('Users')
                .select('*')
                .eq('user_id', user.id)
                .single(); // Use single to get a single record or null   
              if (userError) throw userError;
              console.log("User data:", user_data);     
              setUserData(user_data);     
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
            <div className="bg-gradient-to-b from-sn-bg-light-blue from-40% to-white to-55% flex flex-col items-center justify-start h-screen">
                <div className="self-stretch h-auto p-2 flex-col justify-start items-center gap-5 mt-24 flex">
                    
                    {userData.profile_picture ? (
                        <img className="w-[142px] max-h-[142px] rounded-full border-3 border-white" src={userData.profile_picture} />

                    ) : (
                        <img className="max-w-[142px] max-h-[142px] rounded-full border-3 border-white" src={process.env.PUBLIC_URL + "/images/no_user.png"} />
                    )
                        
                    }
                    
                    <div className="flex-col justify-start items-center gap-1 flex">
                        <div className="text-center text-blue-800 text-3xl font-russoOne leading-normal">{userData.fullname}</div>
                        <div className="text-center text-neutral-900 text-sm font-interEBold uppercase">{userData.role}</div>
                    </div>
                    <div className="mobile-email-box self-stretch justify-center items-center gap-4 inline-flex">
                        <div className="justify-center items-center gap-1 flex">
                            <EnvelopeIcon className="h-6 w-6"/>
                            <div className="text-center text-neutral-900 text-sm font-interReg">{userData.email}</div>
                        </div>
                        <div className="justify-center items-center gap-1 flex">
                            <div className="w-[18px] h-[18px] relative"><PhoneIcon className="h-5 w-5"></PhoneIcon></div>
                            {!userData.phoneNumber ? (
                            <div className="w-[150px] h-[10px] flex items-center justify-center">
                                <div className="text-center text-neutral-900 text-sm font-interReg">No phone number</div>
                            </div>
                            ) : (
                            <div className="text-center text-neutral-900 text-sm font-interReg">
                                {userData.phoneNumber}
                            </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="self-stretch px-2 py-4 flex-col justify-start items-center gap-2 flex">
                    <div className="self-stretch text-center text-neutral-900 text-xl font-interEBold">About</div>
                        <div className="w-[343px] text-center text-neutral-600 text-sm font-interReg">
                            {userData.bio}
                        </div>
                </div>
                <div className="flex-col justify-start items-center gap-2 flex">
                    <Link to="/editProfile">
                    <div className="w-[322px] h-[33px] p-2.5 bg-orange-500 rounded justify-center items-center gap-2.5 inline-flex">
                        <div className="text-white text-sm font-normal font-interReg uppercase">Edit Profile</div>
                        </div>
                        </Link>
                    <button onClick={handleLogout} className="w-[322px] h-[33px] p-2.5 bg-zinc-300 rounded justify-center items-center gap-2.5 inline-flex">
                        <div className="text-neutral-900 text-sm font-normal font-interReg uppercase">Sign out</div>
                    </button>
                </div>
        </div>
          );
      }

  

}

export default ProfilePage;
