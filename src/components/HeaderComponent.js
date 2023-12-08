import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/helper/supabaseClient";
import SynthleteSmallLogo from './SynthleteSmallLogo';

const HeaderComponent = ({ isOpen, toggleSidebar, setRightIsOpen , rightIsOpen }) => {
  const [userData, setUserData] = useState({});
  const [teamData, setTeamData] = useState({}); // [team_id, team_name]
  const [clubData, setClubData] = useState({}); // [club_id, club_name]
  const [loading, setLoading] = useState(true); // Add a loading state
  const [notificationCount, setNotificationCount] = useState(3); // Example test data

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


  const rightSideBarOpen = () => {
    setRightIsOpen(!rightIsOpen);
  }


  if (loading) {
    return(  
    <header className='bg-sn-main-blue sticky top-0 items-center flex flex-row px-5 justify-between h-16 z-20'> {/* Ensure z-index is high enough */}
      <Link className="flex justify-center ml-[39%] items-center" to="/">
        <SynthleteSmallLogo />
      </Link>
    </header> 
    )
    }
  return (
    <header className='bg-sn-main-blue sticky top-0 items-center flex flex-row px-5 justify-between h-16 z-20'> {/* Ensure z-index is high enough */}
            {
              clubData.picture ? (
                <Link to={`/team-profile/${clubData.id}/${teamData.team_id}`} className='flex flex-col items-center justify-center'>
                  <img className='cursor-pointer border-2 border-white object-cover overflow-hidden w-[40px] h-[40px] rounded-10px' src={clubData.picture} alt="team-profile" />
                </Link>
                ) : (
                <Link to="no-team/" className='flex flex-col items-center justify-center'>
                    <img className='bg-white cursor-pointer border-2 border-white object-cover overflow-hidden w-[40px] h-[40px] rounded-10px' src={process.env.PUBLIC_URL + "/images/Teams-1.svg"} alt="profile" />
                </Link>
                )
              }
          
          <Link className="flex justify-center items-center" to="/">
            <SynthleteSmallLogo />
          </Link>

          <Link className='flex flex-col justify-center items-center'>
          <button onClick={rightSideBarOpen} className="rounded-full items-center w-[35px] h-[35px] p-0 overflow-hidden">
          {
            userData.profile_picture ? (
              <img className='object-cover overflow-hidden border-2 rounded-full  border-white w-[35px] h-[35px]' src={userData.profile_picture} alt="profile" />
              ) : (
              <img className='object-cover overflow-hidden border-2 rounded-full  border-white w-[35px] h-[35px]' src={process.env.PUBLIC_URL + "/images/no_user.png"} alt="profile" />
              )
          }
          </button> 
          {notificationCount > 0 && (
            <div className="absolute bottom-2 right-3 w-5 h-5 bg-red-700 text-center items-center pt-[2px] pr-[1px] text-white text-xs rounded-full  font-interEBold" style={{ transform: 'translate(-25%, 25%)' }}>
              {notificationCount}
            </div>
          )}        
          </Link>
    </header>
  );
};

export default HeaderComponent;