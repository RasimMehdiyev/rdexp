import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NewGamePage = () => {
    const [title, setTitle] = useState('');
    const [selectedOption, setSelectedOption] = useState("");
    const [teams, setTeams] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    

    const testForm = () => {
        // test if the values are being set
        console.log(title);
        console.log(selectedOption);
        console.log(teams);
        console.log(date);
        console.log(time);
        console.log(location);
    }

    const handleRadioChange = (event) => {
      setSelectedOption(event.target.value);
    };

    return (
        <div className="h-screen bg-[#E1E8FF]">
                <div className="flex flex-col justify-center gap-5 mx-6 items-center">
                            <h1 className="mt-8">New Event</h1>
                            <form onSubmit={testForm} className="flex flex-col justify-center gap-2">
                                <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Title" className="h-10 px-2 rounded-md border-sn-light-orange border-[1.5px] "/>
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
                                <select value={teams} onChange={(e) => setTeams(e.target.value)} className="h-8 mt-7 px-2 bg-white rounded-md border-sn-light-orange border-[1.5px]" name="teams" id="teams" placeholder="Choose team">
                                    <option className="h-8 bg-white rounded-md" > Team 1</option>
                                    <option className="h-8 bg-white rounded-md" > Team 2</option>
                                    <option className="h-8 bg-white rounded-md" > Team 3</option>
                                </select>
                                <div className="flex-row flex justify-between ">
                                    <span><input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="h-8 px-2 rounded-md border-sn-light-orange border-[1.5px]"/></span>
                                    <span><input value={time} onChange={(e) => setTime(e.target.value)} type="time" className="h-8 px-2 rounded-md border-sn-light-orange border-[1.5px]"/></span>
                                </div>
                                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" type="text" className="h-8 px-2 rounded-md border-sn-light-orange border-[1.5px]" />
                                <div id='players' className="flex flex-col gap-1 mt-[32px]">
                                    <h5 className="font-interSBold">Players</h5>
                                    <div className="flex flex-row justify-between items-center">
                                        <span>Point Guard</span>
                                        <span>
                                            <select className="h-8 px-2 bg-white rounded-md border-sn-light-orange border-[1.5px]" name="" id="">
                                                <option className="h-8 bg-white rounded-md" value="">Player 1</option>
                                                <option className="h-8 bg-white rounded-md" value="">Player 2</option>
                                            </select>
                                        </span>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <span>Strong Guard</span>
                                        <span>
                                            <select className="h-8 px-2 bg-white rounded-md border-sn-light-orange border-[1.5px]" name="" id="">
                                                <option className="h-8 bg-white rounded-md" value="">Player 1</option>
                                                <option className="h-8 bg-white rounded-md" value="">Player 2</option>
                                            </select>
                                        </span>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <span>Strong Forward</span>
                                        <span>
                                            <select className="h-8 px-2 bg-white rounded-md border-sn-light-orange border-[1.5px]" name="" id="">
                                                <option className="h-8 bg-white rounded-md" value="">Player 1</option>
                                                <option className="h-8 bg-white rounded-md" value="">Player 2</option>
                                            </select>
                                        </span>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <span>Power Forward</span>
                                        <span>
                                            <select className="h-8 px-2 bg-white rounded-md border-sn-light-orange border-[1.5px]" name="" id="">
                                                <option className="h-8 bg-white rounded-md" value="">Player 1</option>
                                                <option className="h-8 bg-white rounded-md" value="">Player 2</option>
                                            </select>
                                        </span>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <span>Center</span>
                                        <span>
                                            <select className="h-8 px-2 bg-white rounded-md border-sn-light-orange border-[1.5px]" name="" id="">
                                                <option className="h-8 bg-white rounded-md" value="">Player 1</option>
                                                <option className="h-8 bg-white rounded-md" value="">Player 2</option>
                                            </select>
                                        </span>
                                    </div>
                                </div>
                                <div id='players' className="flex flex-col gap-1 mt-[32px]">
                                    <h5 className="font-interSBold">Substitutes</h5>
                                    <div className="flex flex-row gap-2 items-center">
                                        <span>
                                            <select className="h-8 px-2 bg-white rounded-md border-sn-light-orange border-[1.5px]" name="" id="">
                                                <option className="h-8 bg-white rounded-md" value="">Player 1</option>
                                                <option className="h-8 bg-white rounded-md" value="">Player 2</option>
                                            </select>
                                        </span>
                                        <span>
                                            <img src={process.env.PUBLIC_URL + "/images/small-plus.svg"} alt="" />
                                        </span>
                                    </div>
                                </div>
                                <div id='extra-roles' className="flex flex-col gap-1 mt-[32px]">
                                    <h5 className="font-interSBold">Extra Roles</h5>
                                    <div className="flex flex-row justify-between items-center">
                                        <span>Time Keeper</span>
                                        <span>
                                            <select className="h-8 px-2 bg-white rounded-md border-sn-light-orange border-[1.5px]" name="" id="">
                                                <option className="h-8 bg-white rounded-md" value="">Player 1</option>
                                                <option className="h-8 bg-white rounded-md" value="">Player 2</option>
                                            </select>
                                        </span>
                                    </div>
                                    <div className="flex flex-row justify-between items-center">
                                        <span>Referee</span>
                                        <span>
                                            <select className="h-8 px-2 bg-white rounded-md border-sn-light-orange border-[1.5px]" name="" id="">
                                                <option className="h-8 bg-white rounded-md" value="">Player 1</option>
                                                <option className="h-8 bg-white rounded-md" value="">Player 2</option>
                                            </select>
                                        </span>
                                    </div>
                                </div>
                                <button type="submit" className="h-[40px] w-[150px] m-auto mt-5 bg-sn-main-blue rounded-md text-white font-russoOne">Save</button>
                            </form>

                        </div>  
        </div>
    );
}

export default NewGamePage;
