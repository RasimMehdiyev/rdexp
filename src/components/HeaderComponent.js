import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/helper/supabaseClient";
import SynthleteSmallLogo from './SynthleteSmallLogo';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

const HeaderComponent = ({ toggleSidebar }) => {
  const [userData, setUserData] = useState({});
  const [teamData, setTeamData] = useState({}); 
  const [clubData, setClubData] = useState({}); 
  const [loading, setLoading] = useState(true); 
  const profilePicRef = useRef(null);

  // navigate
  const navigate = useNavigate();

  const getClub = async (userID) => {
    try {
        const { data: team, error: teamError } = await supabase
            .from('team_users')
            .select('team_id')
            .eq('user_id', userID);

        if (teamError) throw teamError;
        if (team.length === 0) {
            console.error('No team found for user:', userID);
            return; // Exit the function if no team is found
        }

        const { data: club, error: clubError } = await supabase
            .from('club_teams')
            .select('club_id')
            .eq('team_id', team[0].team_id)
            .single(); // Use single to get a single record or null

        if (clubError) throw clubError;

        const { data: clubData, error: clubNameError } = await supabase
            .from('club')
            .select('id, name, picture')
            .eq('id', club.club_id)
            .single(); // Use single to get a single record or null
        console.log("Club data:", clubData);
        console.log("Team data:", team[0]);

        if (clubNameError) throw clubNameError;
        setClubData(clubData);
        setTeamData(team[0]); // Update to set the first element of team array
    } catch (error) {
        console.error("Error in getClub:", error);
    }
};


  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      // console.log("Fetching data");
      try {
        const userResponse = await supabase.auth.getUser();
        const user = userResponse.data.user;
        if (user) {
          // Initially, we don't know the user's role, so fetch from both tables.
          const { data: user_data, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', user.id)
            .single(); // Use single to get a single record or null   
          if (userError) throw userError;
          // console.log("User data:", user_data);     
          setUserData(user_data);  

          
          // After setting user data, call getClub function
          await getClub(user_data.id);
        }
        else{
            navigate('/auth');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      finally{
        setLoading(false); // Stop loading regardless of the outcome
      }

    };

    fetchData();
  }, []);

  if (loading) {
    return(  
    <header className='bg-sn-main-blue sticky top-0 items-center flex flex-row px-5 justify-between h-16 z-20'> {/* Ensure z-index is high enough */}
      <Link className="flex justify-center ml-[44%] items-center" to="/">
        <SynthleteSmallLogo />
      </Link>
    </header> 
    )
    }
  return (
    <header className='bg-sn-main-blue sticky top-0 items-center flex flex-row px-3 justify-between h-16 z-20'> {/* Ensure z-index is high enough */}
              {
              clubData ? (
                <Link to={`/team-profile/${clubData.id}/${teamData.team_id}`} className='flex flex-col items-center justify-center border-white border-1 rounded-lg'>
                  <img className='cursor-pointer border-2 border-white bg-white object-cover overflow-hidden w-[40px] h-[40px] rounded-10px' src={clubData.picture ? clubData.picture : process.env.PUBLIC_URL + "/images/sport-team.png"} alt="team-profile" />
                </Link>
                ) : (
                <Link to="no-team/" className='flex flex-col items-center justify-center border-white border-1 rounded-lg'>
                    <img className='bg-white cursor-pointer border-2 border-white object-cover overflow-hidden w-[40px] h-[40px] rounded-10px' src={process.env.PUBLIC_URL + "/images/sport-team.png"} alt="profile" />
                </Link>
                )
              }
          
          <Link className="flex justify-center items-center" to="/">
            <SynthleteSmallLogo />
          </Link>

          <Link className='flex flex-col justify-center items-center relative'>
            <button 
              onClick={() => {
                toggleSidebar();
              }}
              className="profile-dropdown rounded-full w-[50px] h-[50px] p-0 overflow-hidden bg-white">
              {
                userData.profile_picture ? (
                  <img className='object-cover overflow-hidden border-2 rounded-full border-white w-[50px] h-[50px]' src={userData.profile_picture} alt="profile" />
                ) : (
                  <img className='object-cover overflow-hidden border-2 rounded-full border-white w-[50px] h-[50px]' src={process.env.PUBLIC_URL + "/images/no_user.png"} alt="profile" />
                )
              }
            </button> 
            
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-lf-light-gray text-white text-xs rounded-full flex items-center justify-center border-2 border-white" 
                style={{ transform: 'translate(50%, 50%) translateX(-8px) translateY(-10px)' }}> {/* Adjusted transformation here */}
              <FontAwesomeIcon icon={faChevronDown} className="h-2 ml-[1px] mt-[1px] w-2 text-white" />
            </div>   
          </Link>
    </header>
  );
};

export default HeaderComponent;