import React, { useEffect, useState } from 'react';
import {useNavigate } from 'react-router-dom';
import NewGamePageComponent from '../components/NewGameComponent';
import NewPracticeComponent from '../components/NewPracticeComponent';
import NewTBComponent from '../components/NewTBComponent';
import { supabase } from '../lib/helper/supabaseClient';
import StickySubheaderEventCreateComponent from '../components/StickySubheaderEventCreateComponent';

const NewGamePage = () => {
    const [eventTitle, setEventTitle] = useState('');
    const [selectedOption, setSelectedOption] = useState("game");

    const [generalInfo, setGeneralInfo] = useState({ date:"", time:"", location:"" });
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [selectedExtras, setSelectedExtras] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState([]);

    const navigate = useNavigate();

    const handleOnChange = async () => {
        if (selectedOption == "Game") {
            console.log("general info", generalInfo);
            console.log("players", selectedPlayers);
            console.log("extras", selectedExtras);
            console.log("team", selectedTeam);

            try {
                const userResponse = await supabase.auth.getUser();
                console.log("User:", userResponse);
                const user = userResponse.data.user;
                if (user) {
                    // Update general info => inserting column in event table
                    const { data, error } = await supabase
                        .from('event')
                        .insert([
                            { title: eventTitle, team: 'otherValue', datetime: "", location: "", type:"" },
                        ])
                        .select()
                    if (error) throw userError;
                    console.log("User data:", data);
                    
                }                       
                    
                            
            } catch (error) {
                console.error("Error uploading data", error);
            } finally {
                setLoading(false);
                navigate('/game/create');
            }
            } else {
                console.log("submit handling not developed yet")
            }
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
        const isLoggedIn = async ()  =>{
            const user = await supabase.auth.getUser();
            console.log(user)
            if(!user.data.user){
                navigate('/auth');
            }
        }
        isLoggedIn();
    },[])

    return (
        <div>
            <StickySubheaderEventCreateComponent onSave={handleOnChange} />
            <div className="pt-6 h-screen bg-sn-bg-light-blue flex flex-col px-5">
                <h1>New {selectedOption ? selectedOption : "game"}</h1>
                <input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} type="text" placeholder="Title" className="h-10 px-2 rounded-md border-sn-light-orange border-[1.5px] "/>
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
                            <label className="text-[14px]"htmlFor="game">Game</label>
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
                        {selectedOption === 'practice' && <NewPracticeComponent  eventTitle={eventTitle}/>}
                        {selectedOption === 'team building' && <NewTBComponent eventTitle={eventTitle} />}
            </div>
        </div>
      );   
}

export default NewGamePage;
