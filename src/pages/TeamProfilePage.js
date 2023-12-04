import { useEffect, useState } from 'react';
import { supabase } from '../lib/helper/supabaseClient';

import AboutComponent from '../components/teamprofile/AboutComponent.js';
import SettingsComponent from '../components/teamprofile/SettingsComponent.js';
import TeamManagementComponent from '../components/teamprofile/TeamManagementComponent.js';
import TeamProfileHeaderComponent from '../components/teamprofile/TeamProfileHeaderComponent.js';
import { useParams } from 'react-router-dom';
import LoadingPage from './LoadingPage.js';






// Functional component for the page
const TeamProfilePage = () => {
    const { clubId, teamId } = useParams();

    const [teamData, setTeamData] = useState(null);
    const [clubData, setClubData] = useState(null);
    const [teamSocialsData, setTeamSocialsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);
    const [tab, setTab] = useState(0);
    const [players, setPlayers] = useState([]);
    const [coach, setCoach] = useState(null);
    const [extras, setExtras] = useState([]);


    useEffect(() => {
        async function fetchData() {
            console.log("Fetching data team");
            try {
                const userResponse = await supabase.auth.getUser();
                const user = userResponse.data.user;

                const { data: user_data, error:  userError} = await supabase
                .from('users') 
                .select('*') 
                .eq('user_id', user.id) 
                .single();
                if (userError) throw userError;

                const { data: team_data, error: teamError } = await supabase
                    .from('team')
                    .select('*')
                    .eq('id', teamId)
                    .single();
                if (teamError) throw teamError;
                setTeamData(team_data);
                
                    
                const { data: clubData, error: clubError } = await supabase
                    .from('club')
                    .select('*')
                    .eq('id', clubId)
                    .single(); 
                if (clubError) throw clubError;
                setClubData(clubData);


                const { data: coach, error: coachError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', team_data.coach_id)
                    .single();
                if (coachError) throw coachError;

                const transformedCoach = {
                    name: coach.full_name,
                    isPlayer: false,
                };
                setCoach(transformedCoach);

                const { data: team_socials_data, error: teamSocialsError } = await supabase
                    .from('team_socials')
                    .select('*')
                    .eq('team_id', team_data.id)
                    .single();
                if (teamSocialsError) throw teamSocialsError;
                setTeamSocialsData(team_socials_data);

                const { data: team_roles_data, error: teamRolesError } = await supabase
                    .from('team_extraroles')
                    .select('*')
                    .eq('team_id', teamId)
                if (teamRolesError) throw teamRolesError;

                const transformedRoles = team_roles_data.map(role => ({
                    id: role.id,
                    name: role.role_title,
                    team: team_data.team_name,
                    isPlayer: false,
                    isMember: true
                }));
                setRoles(transformedRoles);


                const { data: team_players_data, error: teamPlayersError } = await supabase
                    .from('team_users')
                    .select('user_id')
                    .eq('team_id', teamId);

                
                if (teamPlayersError) throw teamPlayersError;

                const user_ids = team_players_data.map(player => player.user_id);
                const { data: players_data, error: playersError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('role_id', 2)
                    .in('id', user_ids);
                if (playersError) throw playersError;
                
                const transformedPlayers = players_data.map(player => ({
                    id: player.id,
                    name: player.full_name,
                    number: player.number,
                    team: team_data.team_name,
                    isPlayer: true,
                    isMember: true
                }));
                setPlayers(transformedPlayers);
    
             
                const { data: extras_data, error: extrasError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('role_id', 3)
                    .in('id', user_ids);
                if (extrasError) throw extrasError;

                const transformedExtras = extras_data.map(extra => ({
                    id: extra.id,
                    name: extra.full_name,
                    team: team_data.team_name,
                    isPlayer: false,
                    isMember: true
                }));
                setExtras(transformedExtras);


            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);


    // Helper function to render social media icons
    const renderSocialIcon = (handle, type, urlPattern, imgName) => {
        if (!handle) return null;
        return (
            <a href={`${urlPattern}/${handle}`} target="_blank" rel="noopener noreferrer">
                <img src={`${process.env.PUBLIC_URL}/images/${imgName}.svg`} alt={type} />
            </a>
        );
    };

    // Conditional rendering based on tab selection
    const renderTabContent = () => {
        switch (tab) {
            case 0:
                return (
                    <AboutComponent
                        email={teamData.email}
                        phone={teamData.phone_number}
                        address={clubData.location}
                        bio={clubData.description}
                    />
                );
            case 1:
                return (
                    <TeamManagementComponent
                        coach={coach}
                        players={players}
                        extras={extras}
                        setPlayers={setPlayers}
                        setExtras={setExtras}
                    />
                );
            case 2:
                return (
                    <SettingsComponent
                        roles={roles}
                        setRoles={setRoles}
                        teamId={teamId}
                    />
                );
            default:
                return null;
        }
    };
    
    if(loading) {
        return LoadingPage();
    }  
    else{
        return (
        <div className="w-screen h-screen py-4 bg-gradient-to-b from-sn-bg-light-blue from-40% to-white to-55% flex-col justify-start items-center flex">
            <TeamProfileHeaderComponent
                clubData={clubData}
                teamData={teamData} 
                teamSocialsData={teamSocialsData} 
                renderSocialIcon={renderSocialIcon}
            />
            <Tabs tab={tab} onTabChange={setTab} />
                {renderTabContent()}
        </div>
        );
    }
};

const Tab = ({ isActive, label, onClick }) => {
    return (
      <div
        className="basis-1/3 flex justify-center items-center cursor-pointer"
        onClick={onClick}
      >
        <div className={`w-[85px] rounded-lg flex justify-center items-center ${isActive ? 'bg-indigo-100' : ''}`}>
          <div className={`text-center text-xl font-interReg ${isActive ? 'text-blue-800' : 'text-neutral-300'}`}>
            {label}
          </div>
        </div>
      </div>
    );
  };
  
  const Tabs = ({ tab, onTabChange }) => {
    return (
      <div className="w-full border-b border-orange-500 flex justify-between items-center py-2">
        <Tab isActive={tab === 0} label="About" onClick={() => onTabChange(0)} />
        <Tab isActive={tab === 1} label="Members" onClick={() => onTabChange(1)} />
        <Tab isActive={tab === 2} label="Settings" onClick={() => onTabChange(2)} />
      </div>
    );
  };
  

export default TeamProfilePage;