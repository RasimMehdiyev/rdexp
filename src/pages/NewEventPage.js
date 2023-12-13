import React, { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import NewGamePageComponent from '../components/NewGameComponent';
import NewPracticeTBComponent from '../components/NewPracticeTBComponent';


import { supabase } from '../lib/helper/supabaseClient';
import StickySubheaderEventCreateComponent from '../components/StickySubheaderEventCreateComponent';
import LoadingPage from './LoadingPage';
import { toast, ToastContainer } from 'react-toastify';


const NewGamePage = () => {
    const [eventTitle, setEventTitle] = useState('');
    const [selectedOption, setSelectedOption] = useState("Game");
    const [loading, setLoading] = useState(false);
    const [generalInfo, setGeneralInfo] = useState({ date: "", time: "", location: "" });
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [inputCheck, setInputCheck] = useState(true);
    const [userCheck, setUserCheck] = useState(true);
    const navigate = useNavigate();

    const handleOnChange = async () => {
        
        if (selectedOption == "Game" | selectedOption == "") {
            //setLoading(true);
            // console.log("event title", eventTitle);
            // console.log("selected option", selectedOption);
            // console.log("general info", generalInfo);
            // console.log("players", selectedPlayers);
            // console.log("extras", selectedExtras);
            // console.log("team", selectedTeam);

            const timestamp = `${generalInfo.date} ${generalInfo.time}:00+00`;
            // console.log("timestamp", timestamp);

            const toUploadPlayers = selectedPlayers.map((p) => ({ user_id: p.id, position_id: p.position_id }));
            const toUploadExtras = selectedExtras.map((ex) => ({ user_id: ex.id, extrarole_id: ex.extraRole_id }));

            // console.log("to upload players", toUploadPlayers);
            // console.log("to upload extras", toUploadExtras);

            if (checkInput()) setInputCheck(true);
            else {
                setInputCheck(false);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const userResponse = await supabase.auth.getUser();
                // console.log("User:", userResponse);
                const user = userResponse.data.user;
                if (user) {
                    // Update general info => inserting column in event table
                    const { eventData, errorEventData } = await supabase
                        .from('event')
                        .insert([
                            { title: eventTitle, team: selectedTeam, datetime: timestamp, location: generalInfo.location, type: selectedOption },
                        ])
                        .select()
                    if (errorEventData) throw errorEventData;
                    
                    let { data: eventDataID, errorEventDataID } = await supabase
                        .from('event')
                        .select('*')
                        .order('id', { ascending: false }) // Sort by id in descending order
                        .limit(1); // Limit the result to 1 row
                    if (errorEventDataID) console.error('Error fetching latest event:', errorEventDataID)
                    else {
                        // console.log("event data is", eventDataID);
                        const event_id = eventDataID[0].id;
                        const finalUploadPlayers = toUploadPlayers.map((p) => ({ ...p, event_id: event_id, is_attending: "Pending" }));
                        // console.log("finalUploadPlayers: ", finalUploadPlayers);
                        const finalUploadExtras = toUploadExtras.map((ex) => ({ ...ex, event_id: event_id, is_attending: "Pending" }));

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


                        toast.success('Event created successfully! Redirecting...', { position: "top-center", zIndex: 50});
                        setTimeout(() => {
                          navigate('/');
                        }, 3000); 
                    };                            
                }                    
                            
            } catch (error) {
                toast.error(error.error_description || error.message, { position: "top-center" });
            }
            finally {
                setLoading(false);
            }
        } else {
            setLoading(true);
            if (checkInput()) setInputCheck(true);
            else {
                setInputCheck(false);
                setLoading(false);
                return;
            }

            const timestamp = `${generalInfo.date} ${generalInfo.time}:00+00`;
            // console.log("timestamp", timestamp);

            const toUploadPlayers = selectedPlayers.map((p) => ({ user_id: p.id }));

            // console.log("to upload players", toUploadPlayers);
            try {
                const userResponse = await supabase.auth.getUser();
                // console.log("User:", userResponse);
                const user = userResponse.data.user;
                if (user) {
                    // Update general info => inserting column in event table
                    const { eventData, errorEventData } = await supabase
                        .from('event')
                        .insert([
                            { title: eventTitle, team: selectedTeam, datetime: timestamp, location: generalInfo.location, type: selectedOption },
                        ])
                        .select()
                    if (errorEventData) throw errorEventData;
                    
                    let { data: eventDataID, errorEventDataID } = await supabase
                        .from('event')
                        .select('*')
                        .order('id', { ascending: false }) // Sort by id in descending order
                        .limit(1); // Limit the result to 1 row
                    if (errorEventDataID) console.error('Error fetching latest event:', errorEventDataID)
                    else {
                        // console.log("event data is", eventDataID);
                        const event_id = eventDataID[0].id;
                        const finalUploadPlayers = toUploadPlayers.map((p) => ({ ...p, event_id: event_id, is_attending: "Pending" }));
                        // console.log("finalUploadPlayers: ", finalUploadPlayers);                        

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
                toast.success('Event created successfully! Redirecting...', { position: "top-center", zIndex: 50});
                setTimeout(() => {
                  navigate('/');
                }, 3000); 
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

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(()=>{
        setIsButtonDisabled(!checkInput());
    }, [generalInfo, eventTitle, selectedTeam])

    useEffect(() => {
        // console.log("new general info", generalInfo);
        checkInput();
    }, [generalInfo]);

    useEffect(() => {
        // console.log("new selected extras in parent", selectedExtras);
        
    }, [selectedExtras]);

    useEffect(() => {
        
        // console.log("new selected players in parent", selectedPlayers);
    }, [selectedPlayers]);

    useEffect(() => {
        checkInput();
        // console.log("new selected team", selectedTeam);
    }, [selectedTeam]);

    useEffect(() => {
        const isLoggedIn = async () => {
            const user = await supabase.auth.getUser();
            // console.log(user)
            if (!user.data.user) {
                navigate('/auth');
            }
        }

        const checkUser = async () => {          
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

                    if (user_data.role_id == 1) { //if he is a coach
                        setUserCheck(true); 
                    } else {
                        setUserCheck(false);
                    }

                }
            } catch (error) {
                // console.error(error)
                setUserCheck(false)
            }
        }
        isLoggedIn();
        checkUser();
        
    }, [])
    
    if (loading) {
        return (<LoadingPage></LoadingPage>)
    } else if (userCheck) {
        return (
            <div>
                <StickySubheaderEventCreateComponent onSave={handleOnChange} eventType={selectedOption ? selectedOption : "Game"} buttonEnabled={!isButtonDisabled} />
                <div className="pt-6 min-h-screen bg-almostwhite flex flex-col px-5 gap-2">
                    {inputCheck ? (
                        <div />
                    ) : (
                        <div className='text-sm text-red-500'>Please ensure that title event, date, time, team, and location are filled/selected</div>
                    )}

                    <h5 className="text-2xl text-sn-main-blue font-russoOne">Event Details</h5>

                    <input
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        type="text"
                        placeholder="Title"
                        className="text-2xl border-sn-main-orange text-blue bg-transparent border-2 rounded-lg py-2 px-2 w-full max-w-md font-interReg"
                    />
                    <div className="flex flex-row justify-between gap-4 pt-2 pb-4">
                        <div className="flex flex-row items-center gap-2">
                            <input
                                type="radio"
                                id="Game"
                                name="activity"
                                value="Game"
                                checked={selectedOption === "Game"}
                                onChange={handleRadioChange}
                                className="form-radio h-5 w-5 text-sn-main-blue"
                            />
                            <label className="text-base " htmlFor="Game">
                                Game
                            </label>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <input
                                type="radio"
                                id="Practice"
                                name="activity"
                                value="Practice"
                                checked={selectedOption === "Practice"}
                                onChange={handleRadioChange}
                                className="form-radio h-5 w-5 text-sn-main-blue"
                            />
                            <label className="text-base " htmlFor="Practice">
                                Practice
                            </label>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <input
                                type="radio"
                                id="TB"
                                name="activity"
                                value="TB"
                                checked={selectedOption === "TB"}
                                onChange={handleRadioChange}
                                className="form-radio h-5 w-5 text-sn-main-blue"
                            />
                            <label className="text-base " htmlFor="TB">
                                Team Building
                            </label>
                        </div>
                    </div>              
                    {(selectedOption === 'Game' || selectedOption === '') &&
                        <NewGamePageComponent
                            eventTitle={eventTitle}
                            onGeneralInfoChanges={setGeneralInfo}
                            onSelectedExtraChanges={setSelectedExtras}
                            onSelectedPlayerChanges={setSelectedPlayers}
                            onTeamChanges={setSelectedTeam}
                        />}
                    {selectedOption === 'Practice' &&
                        <NewPracticeTBComponent
                            eventTitle={eventTitle}
                            onGeneralInfoChanges={setGeneralInfo}                            
                            onSelectedPlayerChanges={setSelectedPlayers}
                            onTeamChanges={setSelectedTeam}
                        />}
                    {selectedOption === 'TB' &&
                        <NewPracticeTBComponent
                            eventTitle={eventTitle}
                            onGeneralInfoChanges={setGeneralInfo}                            
                            onSelectedPlayerChanges={setSelectedPlayers}
                            onTeamChanges={setSelectedTeam}
                        />}
                </div>
                <ToastContainer/>
            </div>
        );
    } else {
        return (<div>You do not have access to this page</div>)
    }
}

export default NewGamePage;
