import React, { useState } from "react";
import { useEffect } from "react";
import { supabase } from "../lib/helper/supabaseClient";
import LoadingPage from "../pages/LoadingPage";
import { MdDateRange, MdAccessTime, MdLocationOn, MdGroup } from 'react-icons/md';

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
                <div className="mb-2 flex items-center">
    <MdGroup className="text-sn-main-orange mr-3" size={32} />
    <select onChange={handleChange} className="form-input border border-blue-500 rounded-lg text-black w-full max-w-xs px-2 py-2 text-lg bg-white">
        <option value="">{selectedID ? teamNames.find(team => team.id === selectedID).team_name : 'No Selection'}</option>
        {teamNames.map((team) => (
            <option key={team.id} value={team.id}>{team.team_name}</option>
        ))}
    </select>
</div>


    <div className="mb-2 flex items-center">
        <MdDateRange className="text-sn-main-orange mr-3" size={32} />
        <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="form-input border border-blue-500 rounded-lg text-black" style={{ width: '150px', height: '40px', fontSize: '1rem' }} />
    </div>

    <div className="mb-2 flex items-center">
        <MdAccessTime className="text-sn-main-orange mr-3" size={32} />
        <input value={time} onChange={(e) => setTime(e.target.value)} type="time" className="form-input border border-blue-500 rounded-lg text-black" style={{ width: '110px', height: '40px', fontSize: '1rem' }} />
    </div>

    <div className="mb-2 flex items-center">
        <MdLocationOn className="text-sn-main-orange mr-3" size={32} />
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" type="text" className="form-input border max-w-xs border-blue-500 rounded-lg text-black w-full px-2 py-2 text-lg" />
    </div>
            </form>
        );
    }
}

export default NewPracticeComponent;