import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NewGamePageComponent from '../components/NewGameComponent';
import NewPracticeComponent from '../components/NewPracticeComponent';
import NewTBComponent from '../components/NewTBComponent';
import { supabase } from '../lib/helper/supabaseClient';
import AuthenticationPage from './AuthenticationPage';
const NewGamePage = () => {
    const [eventTitle, setEventTitle] = useState('');
    const [selectedOption, setSelectedOption] = useState("");
    const [userData, setUserData] = useState({})
    // navigate
    const navigate = useNavigate();
    const handleRadioChange = (event) => {
      setSelectedOption(event.target.value);
    };

    useEffect(() => {
        //is user Logged in 
        const isLoggedIn = async ()  =>{
            const user = await supabase.auth.getUser();
            console.log(user)
            if(!user.data.user){
                navigate('/auth');
            }
        }
        isLoggedIn();
    },[])

    if (userData == {} || userData == null || userData.len == 0 || userData == undefined){
    return (
        <div className="pt-6 h-screen bg-sn-bg-light-blue flex flex-col px-5">
            <h1>New {selectedOption ? selectedOption : "Game"}</h1>
            <input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} type="text" placeholder="Title" className="h-10 px-2 rounded-md border-sn-light-orange border-[1.5px] "/>
                <div className="flex flex-row justify-between gap-4 pt-2">
                    <div className="flex flex-row justify-between gap-2">
                        <input
                                type="radio"
                                id="Game"
                                name="activity"
                                value="Game"
                                checked={selectedOption === "Game"}
                                onChange={handleRadioChange}
                                />
                        <label className="text-[14px]"htmlFor="Game">Game</label>
                    </div>
                    <div className="flex flex-row justify-between gap-2">
                                                <input
                                                type="radio"
                                                id="Practice"
                                                name="activity"
                                                value="Practice"
                                                checked={selectedOption === "Practice"}
                                                onChange={handleRadioChange}
                                                />
                                                <label className="text-[14px]" htmlFor="Practice">Practice</label>
                    </div>
                    <div className="flex flex-row justify-between gap-2">
                                                <input
                                                type="radio"
                                                id="Team Building"
                                                name="activity"
                                                value="Team Building"
                                                checked={selectedOption === "Team Building"}
                                                onChange={handleRadioChange}
                                                />
                                                <label className="text-[14px]" htmlFor="Team Building">Team Building</label>
                    </div>
                </div>
                    {(selectedOption === 'Game' || selectedOption === '') && <NewGamePageComponent eventTitle={eventTitle}/>}
                    {selectedOption === 'Practice' && <NewPracticeComponent  eventTitle={eventTitle}/>}
                    {selectedOption === 'Team Building' && <NewTBComponent eventTitle={eventTitle} />}
        </div>
        
      );

    }

      


    
}

export default NewGamePage;
