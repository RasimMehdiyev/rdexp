import React, { useState, useEffect, useRef } from 'react';
import GameOverviewComponent from '../components/OverviewGameComponent';
import OverviewPracticeTBComponent from '../components/OverviewPracticeTBComponent';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/helper/supabaseClient';
import StickySubheaderGameOverviewComponent from '../components/StickySubheaderGameOverviewComponent';
import LoadingPage from './LoadingPage';
import DeleteEventModal from '../components/DeleteEventModal';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
    const [userCheck, setUserCheck] = useState(true);
    const [role, setRole] = useState('');
    const hasFetched = useRef(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOnChange = async () => {
        const eventId = generalInfo.eventid;
        navigate(`/event-overview/edit/${eventId}`);
    }   

    const handleDelete = async () => {
        setIsModalOpen(true); // Open the modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Function to close the modal
    };


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

        const isUserInEvent = async (eventId, userId) => {
            try {
                // Retrieve the event_user row from the database based on eventId and userId
                const { data, error } = await supabase
                .from('event_users')
                .select('user_id')
                .eq('event_id', eventId)
                .eq('user_id', userId)
                .single();

                if (error) {
                console.error('Error fetching event user:', error.message);
                setUserCheck(false); // or throw an error
                }

                // Check if the user is associated with the event
                if (data !== null) {
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
                        isUserInEvent(eventId, user_data.id)
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
        console.log("user check has been set to", userCheck)
    }, [userCheck])

    if (loading) {
        return (<LoadingPage></LoadingPage>)
    } else if (userCheck) {    
      return (
        <div>
            {
                role == 1 ? <StickySubheaderGameOverviewComponent onSave={handleOnChange} onDelete={handleDelete}/>
                : <div></div>

            }
            <div className="pt-6 min-h-screen bg-almostwhite flex flex-col px-5">
                
                
            <div className="flex mb-4 text-3xl font-russoOne text-sn-main-blue">
            {eventTitle}
            </div>
            {generalInfo.type == 'game' | generalInfo.type == 'Game' ? (
                <GameOverviewComponent                    
                    generalInfo={generalInfo}
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
            {isModalOpen && (
                    <DeleteEventModal
                        isOpen={closeModal}
                        closeModal={closeModal}
                        onConfirm={handleDelete}
                        eventName={eventTitle}
                        id={generalInfo.eventid}
                    />
                )}
            <ToastContainer />
        </div>
        );
    } else {
        return (<div>You do not have access to this page</div>)
    }
}

export default EventOverview;