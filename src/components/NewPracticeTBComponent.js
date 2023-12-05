import React, { useState } from "react";
import { useEffect } from "react";
import { supabase } from "../lib/helper/supabaseClient";
import LoadingPage from "../pages/LoadingPage";

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
                .from('team_users')
                .select('*')
                .eq('user_id', user_data.id)
    
            if (teamsError) throw teamsError;
            let team_n = []
            for (const team of teams_list) {
                const { data: team_data, error: teamError } = await supabase
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

    const handleChange = async (event) => { //happens when team is selected
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

    if (loading) {
        return <LoadingPage />; // You can replace this with any loading spinner or indicator
    } else {
        return (
            <form className="flex flex-col justify-center gap-2">
                <select onChange={handleChange} className="h-7 mt-7 px-2 bg-white rounded-md border-sn-light-orange border-[1.5px]" name="teams" id="teams" placeholder="Choose team">
                    <option className="h-7 w-[210px] bg-white rounded-md">{selectedID ? teamNames.find(team => team.id == selectedID).team_name : 'No Selection'}</option>
                    {
                        teamNames.map((team) => (
                            <option key={team.id} value={team.id} className="h-7 w-[210px] bg-white rounded-md">
                                {team.team_name}
                            </option>
                        ))
                    }
                </select>

                <div className="flex-row flex justify-between ">
                    <span><input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="h-7 px-2 rounded-md border-sn-light-orange border-[1.5px]" /></span>
                    <span><input value={time} onChange={(e) => setTime(e.target.value)} type="time" className="h-7 px-2 rounded-md border-sn-light-orange border-[1.5px]" /></span>
                </div>
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" type="text" className="h-7 px-2 rounded-md border-sn-light-orange border-[1.5px]" />
            </form>
        );
    }
}

export default NewPracticeComponent;