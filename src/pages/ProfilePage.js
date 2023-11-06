import React from "react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/helper/supabaseClient';
import LoadingPage from "./LoadingPage";
// get current logged in user from supabase
// const { user } = useUser();


const ProfilePage = () => {
    let [userData, setUserData] = useState({})
    // let urlCoach = 'https://neeixstjxyxdbquebgkc.supabase.co/rest/v1/Coach?userID=eq.'
    // let urlPlayer = 'https://neeixstjxyxdbquebgkc.supabase.co/rest/v1/Player?userID=eq.'
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
      

      if (loading) {
        return <LoadingPage />; // You can replace this with any loading spinner or indicator
      }else{
        return (
            <div className="bg-gradient-to-b from-indigo to-white flex flex-col items-center justify-center h-screen">
            <div className="w-[375px] h-[595px] flex-col justify-start items-center inline-flex">
            <div className="self-stretch h-[237px] p-2 flex-col justify-start items-center gap-2 flex">
                <img className="w-[142px] h-[142px] rounded-full border-4 border-white" src="https://via.placeholder.com/142x142" />
                <div className="flex-col justify-start items-center gap-1 flex">
                    <div className="text-center text-blue-800 text-3xl font-russoOne leading-normal">{userData.fullName}</div>
                    <div className="text-center text-neutral-900 text-sm font-interEBold uppercase">{role}</div>
                </div>
                <div className="self-stretch justify-center items-center gap-4 inline-flex">
                    <div className="justify-center items-center gap-1 flex">
                        <div className="text-center text-neutral-900 text-sm font-interReg">{userData.email}</div>
                    </div>
                    <div className="justify-center items-center gap-1 flex">
                        <div className="w-[18px] h-[18px] relative"></div>
                        <div className="text-center text-black text-sm font-interReg">+12 345 567 89</div>
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
                <div className="w-[322px] h-[33px] p-2.5 bg-zinc-300 rounded justify-center items-center gap-2.5 inline-flex">
                    <div className="text-neutral-900 text-sm font-normal font-interReg uppercase">Sign out</div>
                </div>
            </div>
              </div>
            </div>
          );
      }

  
}

export default ProfilePage;
