import React, { useState, useEffect, useRef } from 'react';
import EditGameComponent from '../components/EditGameComponent';
import EditPracticeTBComponent from '../components/EditPracticeTBComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/helper/supabaseClient';
import StickySubheaderEventCreateComponent from '../components/StickySubheaderEventCreateComponent';
import LoadingPage from './LoadingPage';

const EventOverviewEdit = () => {
    
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
    const [userCheck, setUserCheck] = useState(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(()=>{
        setIsButtonDisabled(!checkInput());
    }, [generalInfo, eventTitle, selectedTeam])

    const handleOnDelete= async () => {
            if(generalInfo.eventid)
            {
                try {
                    const { error } = await supabase
                    .from('event')
                    .delete()
                    .eq('id', generalInfo.eventid)
                } catch (error) {
                    console.error(error);
                }
            }
            navigate('/');


    }

    const handleOnChange = async () => {
        
        if (generalInfo.type == "game" | generalInfo.type == "") {
            setLoading(true);
            console.log("event title", eventTitle);
            console.log("selected option", selectedOption);
            console.log("general info", generalInfo);
            console.log("players", selectedPlayers);
            console.log("extras", selectedExtras);
            console.log("team", selectedTeam);

            // const timezoneOffsetMinutes = new Date().getTimezoneOffset();
            // const timezoneOffsetHours = timezoneOffsetMinutes / 60;
            // console.log(timezoneOffsetMinutes);
            // console.log(timezoneOffsetHours);
            // // Format the offset to include the sign and pad with zeros
            // const formattedTimezoneOffset = `${timezoneOffsetHours >= 0 ? '+' : '-'}${Math.abs(timezoneOffsetHours)
            // .toString()
            // .padStart(2, '0')}`;

            const timestamp = `${generalInfo.date} ${generalInfo.time}:00+00`;

            //const timestamp = `${generalInfo.date} ${generalInfo.time}:00+00`;
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
            
            //all the same up till here
            try {
                const userResponse = await supabase.auth.getUser();
                console.log("User:", userResponse);
                const user = userResponse.data.user;
                if (user) {
                  const { data: updatedEvent, error: updateError } = await supabase
                  .from('event')
                  .update({
                      title: eventTitle,
                      datetime: timestamp, // Ensure this is in the correct format
                      location: generalInfo.location,
                      team: generalInfo.teamId, 
                      type: generalInfo.type // Make sure this is the correct event type you want to set
                  })
                  .eq('id', generalInfo.eventid);
          
                  if (updateError) throw updateError;
                
                  console.log("Updated event:", updatedEvent);
                


                  let { data: existingUsers, error: existingUsersError } = await supabase
                        .from('event_users')
                        .select('user_id, is_attending')
                        .eq('event_id', generalInfo.eventid);

                    if (existingUsersError) {
                        console.error('Error retrieving existing users:', existingUsersError);
                        throw existingUsersError;
                    } else {
                        console.log('Existing event users retrieved:', existingUsers);
                    }

                    // Convert existing users to a map for easy lookup
                    const existingUsersMap = new Map(existingUsers.map(user => [user.user_id, user.is_attending]));
                    console.log('Existing users map:', Array.from(existingUsersMap.entries()));

                    // Step 2: Determine the is_attending status for new records
                    const combinedUsers = [...toUploadPlayers, ...toUploadExtras].map(user => ({
                        ...user,
                        event_id: generalInfo.eventid,
                        is_attending: existingUsersMap.has(user.user_id) ? existingUsersMap.get(user.user_id) : "Pending"
                    }));
                    console.log('Combined users with is_attending status:', combinedUsers);

                    const usersToDelete = existingUsers.filter(user => !combinedUsers.some(cu => cu.user_id === user.user_id));
                      console.log('Users to delete:', usersToDelete);

                      for (const user of usersToDelete) {
                          const { error: deleteError } = await supabase
                              .from('event_users')
                              .delete()
                              .eq('user_id', user.user_id)
                              .eq('event_id', generalInfo.eventid);

                          if (deleteError) {
                              console.error(`Error deleting user ${user.user_id}:`, deleteError);
                              throw deleteError;
                          } else {
                              console.log(`Deleted user ${user.user_id} from event ${generalInfo.eventid}`);
                          }
                      }

                      // Step 4: Insert or Update 'event_users' records
                      for (const user of combinedUsers) {
                          if (existingUsersMap.has(user.user_id)) {
                              // Update existing user
                              const { error: updateError } = await supabase
                                  .from('event_users')
                                  .update({ position_id: user.position_id, extrarole_id: user.extrarole_id })
                                  .eq('user_id', user.user_id)
                                  .eq('event_id', generalInfo.eventid);
                              
                              if (updateError) {
                                  console.error(`Error updating user ${user.user_id}:`, updateError);
                                  throw updateError;
                              } else {
                                  console.log(`Updated user ${user.user_id} for event ${generalInfo.eventid}`);
                              }
                          } else {
                              // Insert new user
                              const { error: insertError } = await supabase
                                  .from('event_users')
                                  .insert([user]);

                              if (insertError) {
                                  console.error(`Error inserting new user ${user.user_id}:`, insertError);
                                  throw insertError;
                              } else {
                                  console.log(`Inserted new user ${user.user_id} to event ${generalInfo.eventid}`);
                              }
                          }
                      }
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
            console.log("selected option", generalInfo.type);
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
                    const { data: updatedEvent, error: updateError } = await supabase
                    .from('event')
                    .update({
                        title: eventTitle,
                        datetime: `${generalInfo.date}T${generalInfo.time}:00+00`, // Ensure this is in the correct format
                        location: generalInfo.location,
                        team: generalInfo.teamId, 
                        type: generalInfo.type // Make sure this is the correct event type you want to set
                    })
                    .eq('id', generalInfo.eventid);                          
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
                    checkUser(newGeneralInfo.teamId, newGeneralInfo.eventid);
                }
            } catch (error) {
                console.error('Caught an error while fetching event details:', error);
            } finally {
                setLoading(false);
            }
        };

        const isUserCoachOfTeam = async (teamId, userId) => {
            try {
            // Retrieve the team from the database based on teamId
            const { data, error } = await supabase
                .from('team')
                .select('coach_id')
                .eq('id', teamId)
                .single();

            if (error) {
                console.error('Error fetching team:', error.message);
                setUserCheck(false);
            }

            // Check if the coach of the team is equal to the provided userId
            if (data && data.coach_id == userId) {
                setUserCheck(true);
            } else {
                setUserCheck(false);
            }
            } catch (error) {
            console.error('Error:', error.message);
            setUserCheck(false);
            }
        };  

        const checkUser = async (teamId, eventId) => {          
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

                    if (user_data.role_id == 1) { //if he is a coach
                        isUserCoachOfTeam(teamId, user_data.id) 
                    } else {
                        setUserCheck(false);
                    }

                }
            } catch (error) {
                console.error(error)
                setUserCheck(false)
            }
        }

        fetchEventDetails();
    }, []);
    
    
    
    useEffect(() => {
      console.log("Selected Team in Parent:", selectedTeam);
    }, [selectedTeam]);
    


    if (loading) {
        return (<LoadingPage></LoadingPage>)
    } else if (userCheck){    
        return (
            <div className="flex flex-col min-h-screen bg-almostwhite font-interReg">
              <StickySubheaderEventCreateComponent onSave={handleOnChange} onDelete={handleOnDelete} eventType={generalInfo.type} buttonEnabled={!isButtonDisabled}/>

                <div className="p-4">
                {inputCheck ? (
                  <div />
                ) : (
                  <div className='text-sm text-red-500'>Please ensure that title event, date, time, team, and location are filled/selected</div>
                )}

                <h5 className="text-2xl text-left text-sn-main-blue font-russoOne  mt-5 mb-3">Event Details</h5>
          
                <div className="flex justify-center mb-4">
                    <input
                        value={eventTitle} // Use the gameName from generalInfo
                        onChange={(e) => setEventTitle(e.target.value)}
                        type="text"
                        placeholder="Title"
                        className="text-2xl bg-white rounded-lg border-2 border-sn-main-orange py-2 px-2 w-full max-w-md font-interReg h-12" // Adjusted font, size, and width
                        maxLength={50}
                    />
                </div>
          
                {generalInfo.type == 'game' | generalInfo.type == 'Game' ? (
                    <EditGameComponent
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
                    <EditPracticeTBComponent
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
    } else {
        return (<div>You have no access</div>)
    }
}

export default EventOverviewEdit;