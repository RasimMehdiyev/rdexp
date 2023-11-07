import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NewGamePage = () => {
    const [title, setTitle] = useState('');
    const [selectedOption, setSelectedOption] = useState("");

    const handleRadioChange = (event) => {
      setSelectedOption(event.target.value);
    };

    return (
<div className="h-screen bg-[#E1E8FF]">
        <div className="flex flex-col justify-center gap-5 mx-6 items-center">
                    <h1 className="mt-8">New Event</h1>
                    <form action="POST" className="flex flex-col justify-center gap-2">
                        <input value={title} type="text" placeholder="Title" className="h-10 rounded-md border-sn-light-orange border-[1.5px] "/>
                        <div className="flex flex-row justify-between gap-4">
                            <div className="flex flex-row justify-between gap-2">
                                <input
                                    type="radio"
                                    id="game"
                                    name="activity"
                                    value="game"
                                    checked={selectedOption === "game"}
                                    onChange={handleRadioChange}
                                />
                                <label htmlFor="game">Game</label>
                            </div>
                            <div className="flex flex-row justify-between gap-2">
                                <input
                                type="radio"
                                id="practice"
                                name="activity"
                                value="practice"
                                checked={selectedOption === "practice"}
                                onChange={handleRadioChange}
                                />
                                <label htmlFor="practice">Practice</label>
                            </div>
                            <div className="flex flex-row justify-between gap-2">
                                <input
                                type="radio"
                                id="team-building"
                                name="activity"
                                value="team-building"
                                checked={selectedOption === "team-building"}
                                onChange={handleRadioChange}
                                />
                                <label htmlFor="team-building">Team Building</label>
                            </div>
                        </div>
                        <select className="h-10 mt-10 bg-white rounded-md border-sn-light-orange border-[1.5px]" name="teams" id="teams" placeholder="Choose team">
                            <option className="h-10" value="team1">Team 1</option>
                            <option className="h-10" value="team2">Team 2</option>
                            <option className="h-10" value="team3">Team 3</option>
                        </select>
                        <div className="flex-row flex gap-5">
                            <span><input type="date" className="h-10 rounded-md border-sn-light-orange border-[1.5px]"/></span>
                            <span><input type="time" className="h-10 rounded-md border-sn-light-orange border-[1.5px]"/></span>
                        </div>
                        <input placeholder="Location" type="text" className="h-10 rounded-md border-sn-light-orange border-[1.5px]" />
                    </form>
                </div>  
</div>
    );
}

export default NewGamePage;
