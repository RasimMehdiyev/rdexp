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
    const [selectedOption, setSelectedOption] = useState("game");
    const [loading, setLoading] = useState(false);
    const [generalInfo, setGeneralInfo] = useState({ date: "", time: "", location: "" });
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [inputCheck, setInputCheck] = useState(true);
    const navigate = useNavigate();

    const handleOnChange = async () => {
        
        if (selectedOption == "game" | selectedOption == "") {
            //setLoading(true);
            console.log("event title", eventTitle);
            console.log("selected option", selectedOption);
            console.log("general info", generalInfo);
            console.log("players", selectedPlayers);
            console.log("extras", selectedExtras);
            console.log("team", selectedTeam);

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
                console.log("User:", userResponse);
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
                console.log("User:", userResponse);
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
        console.log("new selected team", selectedTeam);
    }, [selectedTeam]);

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
    
    if (loading) {
        return (<LoadingPage></LoadingPage>)
    } else {

        return (
            <div>
                {
                    loading ? <div></div> :
                        <StickySubheaderEventCreateComponent onSave={handleOnChange} />
                }
                <div className="pt-6 h-screen bg-sn-bg-light-blue flex flex-col px-5">
                    <h1>New {selectedOption ? selectedOption : "game"}</h1>
                    {inputCheck? (<div/>):
                    (
                        toast.error('Please ensure that title event, date, time, team, and location are filled/selected', { position: "top-center" })
                    )}
                    
                    <input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} type="text" placeholder="Title" className="h-10 px-2 rounded-md border-sn-light-orange border-[1.5px] " />
                    <div className="flex flex-row justify-between gap-4 pt-2">
                        <div className="flex flex-row justify-between gap-2">
                            <input
                                type="radio"
                                id="Game"
                                name="activity"
                                value="game"
                                checked={selectedOption === "game"}
                                onChange={handleRadioChange}
                            />
                            <label className="text-[14px]" htmlFor="game">Game</label>
                        </div>
                        <div className="flex flex-row justify-between gap-2">
                            <input
                                type="radio"
                                id="Practice"
                                name="activity"
                                value="practice"
                                checked={selectedOption === "practice"}
                                onChange={handleRadioChange}
                            />
                            <label className="text-[14px]" htmlFor="practice">Practice</label>
                        </div>
                        <div className="flex flex-row justify-between gap-2">
                            <input
                                type="radio"
                                id="Team Building"
                                name="activity"
                                value="team building"
                                checked={selectedOption === "team building"}
                                onChange={handleRadioChange}
                            />
                            <label className="text-[14px]" htmlFor="team building">Team Building</label>
                        </div>
                    </div>
                
                    {(selectedOption === 'game' || selectedOption === '') &&
                        <NewGamePageComponent
                            eventTitle={eventTitle}
                            onGeneralInfoChanges={setGeneralInfo}
                            onSelectedExtraChanges={setSelectedExtras}
                            onSelectedPlayerChanges={setSelectedPlayers}
                            onTeamChanges={setSelectedTeam}
                        />}
                    {selectedOption === 'practice' &&
                        <NewPracticeTBComponent
                            eventTitle={eventTitle}
                            onGeneralInfoChanges={setGeneralInfo}                            
                            onSelectedPlayerChanges={setSelectedPlayers}
                            onTeamChanges={setSelectedTeam}
                        />}
                    {selectedOption === 'team building' &&
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
    }
}

export default NewGamePage;
