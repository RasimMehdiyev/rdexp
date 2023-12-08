import React, { useEffect, useState } from 'react';
import EditGameComponent from '../components/EditGameComponent';
import NewPracticeTBComponent from '../components/NewPracticeTBComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/helper/supabaseClient';
import StickySubheaderEventCreateComponent from '../components/StickySubheaderEventCreateComponent';
import LoadingPage from './LoadingPage';

const EditGamePage = () => {
    const { eventId } = useParams(); // Retrieve eventId from the URL
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
    
    


    const handleOnChange = async () => {
        
        if (selectedOption == "game" | selectedOption == "") {
            setLoading(true);
            console.log("event title", eventTitle);
            console.log("selected option", selectedOption);
            console.log("general info", generalInfo);
            console.log("players", selectedPlayers);
            console.log("extras", selectedExtras);
            console.log("team", selectedTeam);

            const timestamp = `${generalInfo.date} ${generalInfo.time}:00+00`;
            console.log("timestamp", timestamp);

            const toUploadPlayers = selectedPlayers.map((p) => ({ user_id: p.id, position_id: p.position_id }));
            const toUploadExtras = selectedExtras.map((ex) => ({ user_id: ex.id, extrarole_id: ex.extraRole_id }));

            console.log("to upload players", toUploadPlayers);
            console.log("to upload extras", toUploadExtras);

            if (checkInput()) setInputCheck(true);
            else {
                setInputCheck(false);
                setLoading(false);
                return;
            }

            try {
                const userResponse = await supabase.auth.getUser();
                console.log("User:", userResponse);
                const user = userResponse.data.user;
                if (user) {
                    // Update general info => inserting column in event table
                    if (!generalInfo.date || !generalInfo.time || !generalInfo.location || !eventTitle || !selectedTeam) {
                    const { eventData, errorEventData } = await supabase
                        .from('event')
                        .insert([
                            { title: eventTitle, team: selectedTeam, datetime: timestamp, location: generalInfo.location, type: selectedOption },
                        ])
                        .select()
                    if (errorEventData) throw errorEventData;
                      }
                    let { data: eventDataID, errorEventDataID } = await supabase
                        .from('event')
                        .select('*')
                        .order('id', { ascending: false }) // Sort by id in descending order
                        .limit(1); // Limit the result to 1 row
                    if (errorEventDataID) console.error('Error fetching latest event:', errorEventDataID)
                    else {
                        console.log("event data is", eventDataID);
                        const event_id = eventDataID[0].id;
                        const finalUploadPlayers = toUploadPlayers.map((p) => ({ ...p, event_id: event_id, is_attending: "Pending" }));
                        console.log("finalUploadPlayers: ", finalUploadPlayers);
                        const finalUploadExtras = toUploadExtras.map((ex) => ({ ...ex, event_id: event_id, is_attending: "Pending" }));
                        console.log("finalUploadExtras: ", finalUploadExtras);

                        const { playersData, errorPlayersData } = await supabase
                            .from('event_users')
                            .insert(finalUploadPlayers)
                            .select()
                        if (errorPlayersData) throw errorPlayersData;
                        

                        const { extrasData, errorExtrasData } = await supabase
                            .from('event_users')
                            .insert(finalUploadExtras)
                            .select()
                        if (errorExtrasData) throw errorExtrasData;
                    };                            
                }                    
                            
            } catch (error) {
                console.error("Error uploading data", error);
            } finally {
                setLoading(false);
                navigate('/');

            }
        } else {
            setLoading(true);
            if (checkInput()) setInputCheck(true);
            else {
                setInputCheck(false);
                setLoading(false);
                return;
            }
            console.log("event title", eventTitle);
            console.log("selected option", selectedOption);
            console.log("general info", generalInfo);
            console.log("players", selectedPlayers);
            console.log("team", selectedTeam);

            const timestamp = `${generalInfo.date} ${generalInfo.time}:00+00`;
            console.log("timestamp", timestamp);

            const toUploadPlayers = selectedPlayers.map((p) => ({ user_id: p.id }));

            console.log("to upload players", toUploadPlayers);
            try {
                const userResponse = await supabase.auth.getUser();
                console.log("User:", userResponse);
                const user = userResponse.data.user;
                if (user) {
                    // Update general info => inserting column in event table
                    if (!generalInfo.date || !generalInfo.time || !generalInfo.location || !eventTitle || !selectedTeam) {
                    const { eventData, errorEventData } = await supabase
                        .from('event')
                        .insert([
                            { title: eventTitle, team: selectedTeam, datetime: timestamp, location: generalInfo.location, type: selectedOption },
                        ])
                        .select()
                    if (errorEventData) throw errorEventData;
                      }
                      if (!generalInfo.date || !generalInfo.time || !generalInfo.location || !eventTitle || !selectedTeam) {
                    let { data: eventDataID, errorEventDataID } = await supabase
                        .from('event')
                        .select('*')
                        .order('id', { ascending: false }) // Sort by id in descending order
                        .limit(1); // Limit the result to 1 row
                    if (errorEventDataID) console.error('Error fetching latest event:', errorEventDataID)}
                    else {
                        console.log("event data is", eventDataID);
                        const event_id = eventDataID[0].id;
                        const finalUploadPlayers = toUploadPlayers.map((p) => ({ ...p, event_id: event_id, is_attending: "Pending" }));
                        console.log("finalUploadPlayers: ", finalUploadPlayers);                        

                        const { playersData, errorPlayersData } = await supabase
                            .from('event_users')
                            .insert(finalUploadPlayers)
                            .select()
                        if (errorPlayersData) throw errorPlayersData;    
                    };                            
                }                  
            } catch (error) {
                console.error("Error uploading data", error);
            } finally {
                setLoading(false);
                navigate('/');
            }
            
            
        }
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
        }
        isLoggedIn();
    }, [])
    

    useEffect(() => {
      const fetchEventDetails = async () => {
          setLoading(true);
          console.log('Starting to fetch details for event with hardcoded ID: 1');
      
          try {
              const { data: event, error } = await supabase
                  .from('event')
                  .select('title, datetime, location, team')
                  .eq('id', 1) // Hardcoded event ID
                  .single();
  
              if (error) {
                  console.error('Error fetching event:', error);
                  throw error;
              }
  
              console.log('Fetched event data:', event);
              if (event) {
                  // Update eventTitle and generalInfo only if they are not already set
                  if (!eventTitle) setEventTitle(event.title);
                  if (!generalInfo.date || !generalInfo.time || !generalInfo.location) {
                      setGeneralInfo({
                          date: event.datetime.slice(0, 10),
                          time: event.datetime.slice(11, 16),
                          location: event.location,
                      });
                  }
  
                  // Fetch and update selectedTeam only if it's not already set
                  if (!selectedTeam.team_name) {
                      const { data: teamData, error: teamError } = await supabase
                          .from('team')
                          .select('team_name')
                          .eq('id', event.team)
                          .single();
  
                      if (teamError) {
                          console.error('Error fetching team name:', teamError);
                      } else {
                          setSelectedTeam({ id: event.team, team_name: teamData.team_name });
                      }
                  }
                  console.log("new selected team", selectedTeam);
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
            <StickySubheaderEventCreateComponent onSave={handleOnChange} />
            <div className="pt-6 h-screen bg-sn-bg-light-blue flex flex-col px-5">
                <h1 className="font-russoOne text-sn-main-blue text-2xl">New Game</h1>
                {inputCheck ? (
                    <div />
                ) : (
                    <div className='text-sm text-red-500'>Please ensure that title event, date, time, team, and location are filled/selected</div>
                )}

                <input
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    type="text"
                    placeholder="Title"
                    className="h-10 px-2 rounded-md border-sn-light-orange border-[1.5px] font-russoOne"
                />

                {/* Render EditGameComponent */}
                <EditGameComponent
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

export default EditGamePage;