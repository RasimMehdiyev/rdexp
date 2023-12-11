import React, { useState, useEffect, useRef } from 'react';
import GameOverviewComponent from '../components/GameOverviewComponent';
import NewPracticeTBComponent from '../components/NewPracticeTBComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/helper/supabaseClient';
import StickySubheaderGameOverviewComponent from '../components/StickySubheaderGameOverviewComponent';
import LoadingPage from './LoadingPage';

const EventOverview = () => {
    const { eventId } = useParams(); 
    const navigate = useNavigate();

    const [eventData, setEventData] = useState(null);
    const [eventTitle, setEventTitle] = useState('');
    const [selectedOption, setSelectedOption] = useState("game");
    const [loading, setLoading] = useState(false);
    const [generalInfo, setGeneralInfo] = useState({ date: "", time: "", location: "" });
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [inputCheck, setInputCheck] = useState(true);
    const [role, setRole] = useState('');

    const hasFetched = useRef(false);

    const handleOnChange = async () => {
                const eventId = generalInfo.eventid;
                navigate(`/event-overview/edit/${eventId}`);
            }
            
            
        
    

    const checkInput = () => {
        if (!generalInfo.date | !generalInfo.location | !generalInfo.time | !eventTitle | !selectedTeam) {
            return false;
        } else return true;
    }

    
  

    const handleRadioChange = (event) => {
        setSelectedOption(event.target.value);
    };

    useEffect(() => {
        console.log("new general info", generalInfo);
    }, [generalInfo]);

    useEffect(() => {
        console.log("new selected extras in parent", selectedExtras);
    }, [selectedExtras]);

    useEffect(() => {
        console.log("new selected players in parent", selectedPlayers);
    }, [selectedPlayers]);



    useEffect(() => {
        const isLoggedIn = async () => {
            const user = await supabase.auth.getUser();
            console.log(user)
            if (!user.data.user) {
                navigate('/auth');
            }
            else{
                let { data: userTableIdAndRole, error: tableIdError } = await supabase
                .from('users')
                .select('role_id')
                .eq("user_id", user.data.user.id)
                .single();
          
                console.log("This is the user table id and role");
                console.log(userTableIdAndRole);
                setRole(userTableIdAndRole.role_id);
            }
        }
        isLoggedIn();
    }, [role])
    

    useEffect(() => {
      const fetchEventDetails = async () => {
          setLoading(true);
          
          
          try {
              const { data: event, error } = await supabase
                  .from('event')
                  .select('id, title, datetime, location, team')
                  .eq('id', eventId) 
                  .single();
    
              if (error) {
                  console.error('Error fetching event:', error);
                  throw error;
              }
    
              console.log('Fetched event data:', event);
              if (event) {
                  const newGeneralInfo = {
                      date: event.datetime.slice(0, 10),
                      time: event.datetime.slice(11, 16),
                      location: event.location,
                      gameName: event.title,
                      eventid: event.id
                  };
                  setEventTitle(event.title);
                  // Fetch the team name
                  const { data: teamData, error: teamError } = await supabase
                      .from('team')
                      .select('team_name')
                      .eq('id', event.team)
                      .single();
    
                  if (teamError) {
                      console.error('Error fetching team name:', teamError);
                  } else {
                      // Append the team name and ID to the newGeneralInfo object
                      newGeneralInfo.teamName = teamData.team_name;
                      newGeneralInfo.teamId = event.team;
                  }
                   
                  // Now, set the generalInfo state with the newGeneralInfo object
                  setGeneralInfo(newGeneralInfo);
              }
          } catch (error) {
              console.error('Caught an error while fetching event details:', error);
          } finally {
              setLoading(false);
          }
      };
    
      fetchEventDetails();
    }, []);
    
    
    
    useEffect(() => {
      console.log("Selected Team in Parent:", selectedTeam);
    }, [selectedTeam]);
    

    if (loading) {
        return (<LoadingPage></LoadingPage>)
    } else {

      

      return (
        <div>
            {
                role == 1 ? <StickySubheaderGameOverviewComponent onSave={handleOnChange} />
                : <div></div>

            }
            <div className="pt-6 h-screen bg-sn-bg-light-blue flex flex-col px-5">
                <h1 className="font-russoOne text-sn-main-blue text-2xl">New Game</h1>
                {inputCheck ? (
                    <div />
                ) : (
                    <div className='text-sm text-red-500'>Please ensure that title event, date, time, team, and location are filled/selected</div>
                )}

                <input
                    value={eventTitle} // Use the gameName from generalInfo
                    onChange={(e) => setEventTitle(e.target.value)}
                    type="text"
                    placeholder="Title"
                    disabled="true"
                    className="h-10 px-2 rounded-md border-sn-light-orange border-[1.5px] font-russoOne"
                />

                {/* Render EditGameComponent */}
                <GameOverviewComponent
                    eventTitle={eventTitle}
                    generalInfo={generalInfo}
                    selectedTeam={selectedTeam}
                    onGeneralInfoChanges={setGeneralInfo}
                    onSelectedPlayerChanges={setSelectedPlayers}
                    onSelectedExtraChanges={setSelectedExtras}
                    onTeamChanges={setSelectedTeam}
                />
            </div>
        </div>
    );
}
}

export default EventOverview;