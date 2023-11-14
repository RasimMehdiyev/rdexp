import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NewGamePageComponent from '../components/NewGameComponent';
import NewPracticeComponent from '../components/NewPracticeComponent';
import NewTBComponent from '../components/NewTBComponent';

const NewGamePage = () => {
    const [eventTitle, setTitle] = useState('');
    const [selectedOption, setSelectedOption] = useState("");


    const handleRadioChange = (event) => {
      setSelectedOption(event.target.value);
    };

    return (
        <div className="pt-6 h-screen bg-sn-bg-light-blue flex flex-col px-5">
            <h1>New {selectedOption ? selectedOption : "Game"}</h1>
            <input value={eventTitle} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Title" className="h-10 px-2 rounded-md border-sn-light-orange border-[1.5px] "/>
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
                    {(selectedOption === 'Game' || selectedOption === '') && <NewGamePageComponent />}
                    {selectedOption === 'Practice' && <NewPracticeComponent />}
                    {selectedOption === 'Team Building' && <NewTBComponent eventTitle={eventTitle} />}
        </div>
        
      );
      


    
}

export default NewGamePage;
