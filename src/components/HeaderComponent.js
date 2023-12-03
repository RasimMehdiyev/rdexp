import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from "../lib/helper/supabaseClient";
import SynthleteSmallLogo from './SynthleteSmallLogo';

const HeaderComponent = ({ isOpen, toggleSidebar, setRightIsOpen , rightIsOpen }) => {
  const [userData, setUserData] = useState({});
  const [teamData, setTeamData] = useState({}); // [team_id, team_name]
  const [clubData, setClubData] = useState({}); // [club_id, club_name]
  const [loading, setLoading] = useState(true); // Add a loading state

  // navigate
  const navigate = useNavigate();

    // get the club from team from user
    const getClub = async (userID) => {
      console.log("user id:", userID);
      const { data: team, error: teamError } = await supabase
      .from('team_users')
      .select('team_id')
      .eq('user_id', userID)
      if (teamError) throw teamError;      
      // console.log("team data:", team[0].team_id);     


      console.log(team)
    if (team[0] !== undefined){

          const { data: club, error: clubError } = await supabase
          .from('club_teams')
          .select('club_id')
          .eq('team_id', team[0].team_id)
          .single(); // Use single to get a single record or null
          if (clubError) throw clubError;
          // console.log("club data:", club);
          
      
          const { data: clubData, error: clubNameError } = await supabase
          .from('club')
          .select('name, picture')
          .eq('id', club.club_id)
          .single(); // Use single to get a single record or null
          if (clubNameError) throw clubNameError;
          // console.log("club picture:", clubData);
          setClubData(clubData);
          setTeamData(team);}
        }


  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      // console.log("Fetching data");
      try {
        const userResponse = await supabase.auth.getUser();
        const user = userResponse.data.user;
        // console.log("User:", user);
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

  

  const handleKeyDown = (event) => {
    // Check if the key is 'Enter' or 'Space'
    if (event.key === 'Enter' || event.key === ' ') {
      rightSideBarOpen();
    }
  };

  const rightSideBarOpen = () => {
    setRightIsOpen(!rightIsOpen);
  }

  if (loading) {
    return null; // You can replace this with any loading spinner or indicator
  }
  return (
    <header className='bg-sn-main-blue sticky top-0 items-center flex flex-row px-5 justify-between h-16 z-20'> 
            {
              clubData.picture ? (
                <Link to="/team-management/">
                  <img className='cursor-pointer border-2 border-white object-cover overflow-hidden w-[45px] h-[45px] rounded-10px' src={clubData.picture} alt="profile" />
                  {/* <p className="text-[8px] text-white font-russoOne font-400">My teams</p> */}
                </Link>


                ) : (
                <Link to="no-team/" className='flex flex-col items-center justify-center'>
                    <img className='bg-white cursor-pointer border-2 border-white object-cover overflow-hidden w-[50px] h-[50px] ' src={process.env.PUBLIC_URL + "/images/no-team.png"} alt="profile" />
                    {/* <p className="text-[8px] text-white font-russoOne font-400">No team</p> */}
                </Link>
                )
              }
          
          <Link className="flex justify-center items-center" to="/">
            <SynthleteSmallLogo />
          </Link>
          <Link className='flex flex-col justify-center items-center'>
          <button onClick={rightSideBarOpen} className="border-2 border-white rounded-full w-[50px] h-[50px] p-0 overflow-hidden">
            <img 
              src={userData.profile_picture} 
              alt="Open Sidebar" // Description of the action or image content
              className="object-cover w-full h-full"
            />
          </button>         
          </Link>
    </header>
  );
};

export default HeaderComponent;