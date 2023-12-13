import React, { useState } from "react";
import { useEffect } from "react";
import { supabase } from "../lib/helper/supabaseClient";
import LoadingPage from "../pages/LoadingPage";
import { MdDateRange, MdAccessTime, MdLocationOn, MdGroup } from 'react-icons/md';
import LocationInput from '../components/LocationInput.js';


const NewPracticeComponent = ({ eventTitle, onGeneralInfoChanges, onSelectedPlayerChanges, onTeamChanges }) => {
    const [title, setTitle] = useState(eventTitle);
    const [selectedOption, setSelectedOption] = useState("");
    const [teams, setTeams] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [teamNames, setTeamNames] = useState([]);
    const [selectedID, setSelectedID] = useState('');
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
        const getTeams = async () => {
            let user = await supabase.auth.getUser();
            let userID = user.data.user.id;
            console.log(userID);
            // fetch user from 'Users' table
            const { data: user_data, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('user_id', userID)
                .single();
    
            if (userError) throw userError;

            const { data: teams_list, error: teamsError } = await supabase
                .from('team')
                .select('*')
                .eq('coach_id', user_data.id)
    
            if (teamsError) throw teamsError;
            let team_n = []
            for (const team of teams_list) {
                const { data: team_data, error: teamError } = await supabase
                    .from('team')
                    .select('*')
                    .eq('id', team.id)
                    .single();
                if (teamError) throw teamError;
                let team_info = {}
                team_info['team_name'] = team_data.team_name;
                team_info['id'] = team_data.id;
                team_n.push(team_info);
            }
            setTeamNames(team_n);
            // get the id of the selected team from the dropdown
        
        }
        getTeams();
    }, [])

    const handleLocationInputChange= (value)=>{
       setLocation(value)
    }

    const handleTeamChange = async (event) => { //happens when team is selected
        // Update the state with the selected option's id
        if (event.target.value != "No Selection") {
            setLoading(true);
            setSelectedID(event.target.value);
            await getPlayerOfTeam(event.target.value);
                       
            setLoading(false);
        } else {
            setSelectedID('');
            onSelectedPlayerChanges([]);
        }
    };

    const getPlayerOfTeam = async (teamID) => {
        
        let { data, error } = await supabase
            .rpc('get_team_users_by_role', {
                param_role_id: 2,
                param_team_id: parseInt(teamID, 8)
            })
        if (error) console.error(error)
        else console.log("team players: ", data)
        onSelectedPlayerChanges(data);
        
    }
    useEffect(() => {
        onTeamChanges(selectedID);
    }, [selectedID]);
    
    useEffect(() => {
        onGeneralInfoChanges({ date: date, time: time, location: location });
    }, [date, time, location]);

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1; 
        let day = today.getDate();
    
        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;
    
        return `${year}-${month}-${day}`;
    };

    const getCurrentTime = () => {
        const today = new Date();
        const hours = today.getHours();
        const minutes = today.getMinutes();

        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
        return `${formattedHours}:${formattedMinutes}`;
    };

    const generateTimeOptions = () => {
        const currentTime = getCurrentTime();
        const [currentHour, currentMinute] = currentTime.split(':');
    
        const options = [];
        const startHour = date === getCurrentDate() ? parseInt(currentHour, 10) + 1 : parseInt(currentHour, 10);
    
        for (let hour = startHour; hour <= 23; hour++) {
            const maxMinute = hour === parseInt(currentHour, 10) ? currentMinute : 59;
            for (let minute = 0; minute <= maxMinute; minute++) {
                const formattedHour = String(hour).padStart(2, '0');
                const formattedMinute = String(minute).padStart(2, '0');
                const timeOption = `${formattedHour}:${formattedMinute}`;
                options.push(
                    <option
                        key={timeOption}
                        value={timeOption}
                        disabled={date === getCurrentDate() && timeOption < currentTime}
                    >
                        {timeOption}
                    </option>
                );
            }
        }
    
        return options;
    };

    if (loading) {
        return <LoadingPage />; // You can replace this with any loading spinner or indicator
    } else {
        return (
            <form className="flex flex-col justify-center gap-2">
                <div className="mb-2 flex items-center">
                    <MdGroup className="text-sn-main-orange mr-3" size={32} />
                    <select
                        onChange={handleTeamChange}
                        className="w-[150px] h-[40px] px-2 bg-white rounded-lg border-2 border-sn-main-orange"
                        name="teams"
                        id="teams"
                        placeholder="Choose team">
                        <option className="h-[40px] bg-white rounded-md">{ selectedID ? teamNames.find(team => team.id == selectedID).team_name : 'No Selection'}</option>
                        {
                            teamNames.map((team) => (
                                team.id == selectedID ?
                                    (<option key={team.id} value={team.id} className="hidden">
                                        {team.team_name}
                                    </option>) :
                                    (
                                    <option key={team.id} value={team.id} >
                                        {team.team_name}
                                    </option>
                                    )
                            ))
                        }
                    </select>
                </div>                

                <div className="mb-2 flex items-center"> 
                <MdDateRange className="text-sn-main-orange mr-3" size={32} />
                <input 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    type="date" 
                    className="form-input pl-3 pr-3 rounded-lg text-black h-[40px] w-[150px] border-2 border-sn-main-orange" 
                    min={getCurrentDate()} 
                />
                </div>

                <div className="mb-2 flex items-center"> 
                <MdAccessTime className="text-sn-main-orange mr-3" size={32} /> 
                {date !== getCurrentDate() ? (
                        <div className="mb-2 flex items-center">
                            <input
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                type="time"
                                className="form-input rounded-lg pl-3 pr-3 border-2 border-sn-main-orange text-black h-[40px] w-[150px]"
                            />
                        </div>
                    ) : (
                        <div className="mb-2 flex items-center">
                            <select
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="form-select rounded-lg pl-3 pr-3 border-2 border-sn-main-orange text-black h-[40px] w-[150px]"
                            >
                                {generateTimeOptions()}
                            </select>
                        </div>
                    )}
                </div>

                <div className="mb-2 flex items-center"> 

                <MdLocationOn className="text-sn-main-orange mr-3 w-[32px] h-[32px]" /> 
                <LocationInput onLocationChange={handleLocationInputChange} borderColor="sn-main-orange" isIconVisible={false} />
                
                </div>
            </form>
        );
    }
}

export default NewPracticeComponent;