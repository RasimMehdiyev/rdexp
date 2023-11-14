import React, { useState } from "react";

const NewTBComponent = ({eventTitle}) => {
    const [title, setTitle] = useState(eventTitle);
    const [selectedOption, setSelectedOption] = useState("");
    const [teams, setTeams] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [teamNames, setTeamNames] = useState([]);
    




    return (
            <form  className="flex flex-col justify-center gap-2">
                <select onChange={(e) => setTeams(e.target.value)} className="h-7 mt-7 px-2 bg-white rounded-md border-sn-light-orange border-[1.5px]" name="teams" id="teams" placeholder="Choose team">
                    <option className="h-7 bg-white rounded-md" > Team 1</option>
                    <option className="h-7 bg-white rounded-md" > Team 2</option>
                    <option className="h-7 bg-white rounded-md" > Team 3</option>
                </select>
                <div className="flex-row flex justify-between ">
                    <span><input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="h-7 px-2 rounded-md border-sn-light-orange border-[1.5px]"/></span>
                    <span><input value={time} onChange={(e) => setTime(e.target.value)} type="time" className="h-7 px-2 rounded-md border-sn-light-orange border-[1.5px]"/></span>
                </div>
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" type="text" className="h-7 px-2 rounded-md border-sn-light-orange border-[1.5px]" />
                <button type="submit" className="h-[40px] w-[150px] m-auto mt-5 bg-sn-main-blue rounded-md text-white font-russoOne">Save</button>
            </form>
    );
}

export default NewTBComponent;