import React, { useState } from "react";
import { useEffect } from "react";
import { supabase } from "../lib/helper/supabaseClient";

const NewPracticeComponent = ({eventTitle}) => {
    const [title, setTitle] = useState(eventTitle);
    const [selectedOption, setSelectedOption] = useState("");
    const [teams, setTeams] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [teamNames, setTeamNames] = useState([]);
    const [selectedID, setSelectedID] = useState('');

    
    const handleRadioChange = (event) => {
        setSelectedOption(event.target.value);
      };
  
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

            const {data: teams_list, error: teamsError} = await supabase
                .from('team_users')
                .select('*')
                .eq('user_id', user_data.id)
    
            if (teamsError) throw teamsError;
            let team_n = []
            for (const team of teams_list) {
                const {data: team_data, error: teamError} = await supabase
                    .from('team')
                    .select('*')
                    .eq('id', team.team_id)
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

    const handleChange = async (event) => {
        // setTeams
        setTeams(event.target.value);
        // Update the state with the selected option's id
      };

    const handlePlayerChange = (event) => {
        console.log(event.target.value);
        console.log(teamPlayers);
        console.log(document.getElementById('player_select').childNodes);
    }


    return (
                            <form className="flex flex-col justify-center gap-2">
                                <select onChange={handleChange} className="h-7 mt-7 px-2 bg-white rounded-md border-sn-light-orange border-[1.5px]" name="teams" id="teams" placeholder="Choose team">
                                <option className="h-7 w-[210px] bg-white rounded-md">No Selection</option>
                                    {
                                        teamNames.map((team) => (
                                            <option key={team.id} value={team.id} className="h-7 w-[210px] bg-white rounded-md">
                                                {team.team_name}
                                            </option>
                                        ))
                                    }
                                </select>
                                <span><p>Date</p> <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="h-7 px-2 rounded-md border-sn-light-orange border-[1.5px]"/></span>
                                <div className="flex-row flex justify-between ">
                                    <span><p>Start time</p> <input value={time} onChange={(e) => setTime(e.target.value)} type="time" className="h-7 px-2 rounded-md border-sn-light-orange border-[1.5px]"/></span>
                                    <span><p>End time</p> <input value={time} onChange={(e) => setTime(e.target.value)} type="time" className="h-7 px-2 rounded-md border-sn-light-orange border-[1.5px]"/></span>
                                </div>
                                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" type="text" className="h-7 px-2 rounded-md border-sn-light-orange border-[1.5px]" />
                                <button type="submit" className="h-[40px] w-[150px] m-auto mt-5 bg-sn-main-blue rounded-md text-white font-russoOne">Save</button>
                            </form>
    );
}

export default NewPracticeComponent;