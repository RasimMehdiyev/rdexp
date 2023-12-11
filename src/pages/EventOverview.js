import React, { useState, useEffect, useRef } from 'react';
import GameOverviewComponent from '../components/OverviewGameComponent';
import OverviewPracticeTBComponent from '../components/OverviewPracticeTBComponent';
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

    const hasFetched = useRef(false);

    const handleOnChange = async () => {
        const eventId = generalInfo.eventid;
        navigate(`/event-overview/edit/${eventId}`);
    }   

    useEffect(() => {
        const isLoggedIn = async () => {
            const user = await supabase.auth.getUser();
            console.log(user)
            if (!user.data.user) {
                navigate('/auth');
            }
        }
        isLoggedIn();
    }, [])
    
    useEffect(() => {
      const fetchEventDetails = async () => {
          setLoading(true);
                    
          try {
              const { data: event, error } = await supabase
                  .from('event')
                  .select('id, title, datetime, location, team, type')
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
                      eventid: event.id,
                      type: event.type
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

    if (loading) {
        return (<LoadingPage></LoadingPage>)
    } else {     

      return (
        <div>
            <StickySubheaderGameOverviewComponent onSave={handleOnChange} />
            <div className="pt-6 h-screen bg-sn-bg-light-blue flex flex-col px-5">
                
                
            <div className="flex justify-center mb-4">
            <input
                value={eventTitle}
                disabled={true}
                type="text"
                style={{
                    fontSize: '1.875rem', // equivalent to text-3xl
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: '#007bff', // Replace with the exact hex code for 'text-sn-main-blue'
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '.5rem', // equivalent to rounded-lg
                    padding: '.5rem 1rem', // equivalent to py-2 px-4
                    width: '100%',
                    maxWidth: '28rem', // equivalent to max-w-md
                    fontFamily: '"Russo One", sans-serif' // Ensure Russo One font is loaded
                }}
            />
        </div>
            {generalInfo.type == 'game' ? (
                <GameOverviewComponent
                    eventTitle={eventTitle}
                    generalInfo={generalInfo}
                    selectedTeam={selectedTeam}
                    onGeneralInfoChanges={setGeneralInfo}
                    onSelectedPlayerChanges={setSelectedPlayers}
                    onSelectedExtraChanges={setSelectedExtras}
                    onTeamChanges={setSelectedTeam}
                    className="bg-white border border-gray-300 rounded-lg p-4"
                />
            ) : (
                <OverviewPracticeTBComponent
                eventTitle={eventTitle}
                generalInfo={generalInfo}
                selectedTeam={selectedTeam}
                onGeneralInfoChanges={setGeneralInfo}
                onSelectedPlayerChanges={setSelectedPlayers}
                onSelectedExtraChanges={setSelectedExtras}
                onTeamChanges={setSelectedTeam}
                className="bg-white border border-gray-300 rounded-lg p-4"
                />
            )}
            </div>
        </div>
    );
}
}

export default EventOverview;