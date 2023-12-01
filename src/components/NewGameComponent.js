import React, { useEffect, useState } from "react";
import { supabase } from "../lib/helper/supabaseClient";
import LoadingPage from "../pages/LoadingPage";


const NewGamePageComponent = ({ eventTitle }) => {
    // const [title, setTitle] = useState(eventTitle);
    const [selectedOption, setSelectedOption] = useState("Game");
    const [team, setTeam] = useState();
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [teamNames, setTeamNames] = useState([]);
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [selectedID, setSelectedID] = useState('');
    const [volunteers, setVolunteers] = useState([]);
    const [extraRoles, setExtraRoles] = useState([]); // Use state for extraRoles    
    const [loading, setLoading] = useState(true);
    const [positions, setPositions] = useState([]);

    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [optionPlayers, setOptionPlayers] = useState([]);
    const [selectedExtras, setSelectedExtras] = useState([])
    const [optionExtras, setOptionExtras] = useState([]);

    useEffect(() => {
        // Update optionPlayers whenever selectedPlayers change
        console.log("selected players: ", selectedPlayers);
        const selectedPlayerNoPosition = selectedPlayers.map((player) => player.id)
        console.log("selected player no pos", selectedPlayerNoPosition);
        
        const updatedOptionPlayers = teamPlayers.filter(player => !selectedPlayerNoPosition.includes(player.id));
        console.log("updated option players", updatedOptionPlayers);
        setOptionPlayers(updatedOptionPlayers);
    }, [selectedPlayers]);

    

    const handlePlayerSelection = (playerId) => {
        // Toggle player selection
        if (selectedPlayers.includes(playerId)) {
        const updatedSelectedPlayers = selectedPlayers.filter(player => player !== playerId);
        setSelectedPlayers(updatedSelectedPlayers);
        } else {
        setSelectedPlayers([...selectedPlayers, playerId]);
        }
    };


    const submitEvent = () => {

        console.log("Title:", eventTitle);
        console.log("Type:", selectedOption);
        console.log("Team:", selectedID);
        console.log("Date:", date);
        console.log("Time:", time);
        console.log("Location:", location);
        console.log("Team Names:", teamNames);
        console.log("Team Players:", teamPlayers);
        console.log("Selected ID:", selectedID);
    }


    const getExtraRoles = async (teamID) => {
        console.log("team id", teamID);
        const { data: sup_extraRoles, error: extraRolesError } = await supabase
            .from('team_extraroles')
            .select('role_title,id')
            .eq('team_id', teamID);

        if (extraRolesError) throw extraRolesError;
        setExtraRoles(sup_extraRoles); // Set state here
    };

    const getVolunteers = async (teamID) => {
        let { data, error } = await supabase
        .rpc('get_team_users_by_role', {
            param_role_id: 3, 
            param_team_id: teamID,
        })
        if (error) console.error(error)
        else console.log("extras: ", data);
        setVolunteers(data);
    }

    useEffect(() => {
        const getTeams = async () => {
            let user = await supabase.auth.getUser();
            let userID = user.data.user.id;
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
                // getExtraRoles(team.team_id);
                if (teamError) throw teamError;
                let team_info = {}
                team_info['team_name'] = team_data.team_name;
                team_info['id'] = team_data.id;
                team_n.push(team_info);
            }
            setTeamNames(team_n);
        }
        getTeams();
        setLoading(false);
    }, [])

    useEffect(() => {
        console.log("Updated extraRoles:", extraRoles);
    }, [extraRoles]);



    const getPlayerOfTeam = async (teamID) => {
        
        let { data, error } = await supabase
        .rpc('get_team_users_by_role', {
            param_role_id: 2, 
            param_team_id: parseInt(teamID, 8)
        })
        if (error) console.error(error)
        else console.log("team players: ", data)
        setTeamPlayers(data);
        setOptionPlayers(data);
    }

    const getPositionsOfTeam = async (teamID) => {
        let { data, error } = await supabase
            .rpc('get_positions_for_team', {
                param_team_id: parseInt(teamID, 8)
        })
        if (error) console.error(error)
        else console.log("positions", data)
        setPositions(data);
    }    

    const handleChange = async (event) => {
        // Update the state with the selected option's id
        if (event.target.value != "No Selection") {
            setLoading(true);
            setSelectedID(event.target.value);
            await getPlayerOfTeam(event.target.value);
            await getExtraRoles(event.target.value);
            await getPositionsOfTeam(event.target.value);
            await getVolunteers(event.target.value);
            console.log('extraRoles:', extraRoles);
            console.log('positions:', positions);
            setLoading(false);
        } else {
            setSelectedID('');
            setTeamPlayers([]);
            setExtraRoles([]);
            setSelectedTeamName('');
        }
        
    };

    // const handlePlayerChange = (event) => {
    //     //handlePlayerSelection(event.target.value);
    //     console.log(event.target.value);
    //     console.log(teamPlayers);
    //     //console.log(document.getElementById('player_select').childNodes);
    // }

    const handlePlayerChange = (event, position) => {
        const playerId = event.target.value;

        
        if (playerId == 'No Selection') {
        // Find the existing player for the current position
            const existingPlayerIndex = selectedPlayers.findIndex((player) => player.position == position.position_name);
            
            if (existingPlayerIndex != -1) {
                // Remove the existing player if "No Selection" is chosen
                const updatedPlayers = [...selectedPlayers];
                updatedPlayers.splice(existingPlayerIndex, 1);
                
                setSelectedPlayers(updatedPlayers);
            }
            // If "No Selection" is chosen and the position is empty, nothing happens
        } else {            
            const selectedPlayer = teamPlayers.find((player) => player.id == playerId);            
            const playerWithPosition = { ...selectedPlayer, position: position.position_name };            
            const existingPlayerIndex = selectedPlayers.findIndex((player) => player.position == position.position_name);
            
            if (existingPlayerIndex !== -1) {                
                const updatedPlayers = [...selectedPlayers];
                updatedPlayers[existingPlayerIndex] = playerWithPosition;                
                setSelectedPlayers(updatedPlayers);
            } else {
                setSelectedPlayers((prevSelectedPlayers) => [...prevSelectedPlayers, playerWithPosition]);
            }
        }
    };


    if (loading) {
        return <LoadingPage />; // You can replace this with any loading spinner or indicator
    } else {

        return (
            <form className="flex bg-sn-bg-light-blue flex-col justify-center gap-2">
                <select onChange={handleChange} className="h-7 mt-7 px-2 bg-white rounded-md border-sn-light-orange border-[1.5px]" name="teams" id="teams" placeholder="Choose team">
                    <option className="h-7 w-[210px] bg-white rounded-md">{ selectedID ? teamNames.find(team => team.id == selectedID).team_name : 'No Selection'}</option>
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
                <div id='players' className="flex flex-col gap-1 mt-[32px]">
                    <h5 className="font-interSBold">Players</h5>
                    {positions.map((position) => (
                            <div className="flex flex-row justify-between items-center" key={position.position_abbreviation}>
                            <span>{position.position_name}</span>
                            <span>
                                <select
                                id={`player_select_${position.id}`}
                                onChange={(event) => handlePlayerChange(event, position)}
                                className="h-7 w-[210px] px-2 bg-white rounded-md border-sn-light-orange border-[1.5px]"
                                disabled={!selectedID}
                                >
                                <option className="h-7 w-[210px] bg-white rounded-md">
                                    {selectedPlayers.find(player => player.position == position.position_name) ?
                                        selectedPlayers.find(player => player.position == position.position_name).full_name : 'No Selection' }</option>
                                <option className="h-7 w-[210px] bg-white rounded-md">No Selection</option>
                                {optionPlayers.map((player) => (
                                    <option key={player.id} value={player.id} className="h-7 w-[210px] bg-white rounded-md">
                                    {player.full_name}
                                    </option>
                                ))}
                                </select>
                            </span>
                            </div>
                    ))}
                    
                </div>
                <div id='players' className="flex flex-col gap-1 mt-[32px]">
                    <h5 className="font-interSBold">Substitutes</h5>
                    <div className="flex flex-row gap-2 items-center">
                        <span>
                            <select className="h-7 px-2 w-[210px] bg-white rounded-md border-sn-light-orange border-[1.5px]" name="" id="" disabled={!selectedID}>
                                <option className="h-7 w-[210px] bg-white rounded-md">No Selection</option>
                                {
                                    teamPlayers.map((player) =>
                                    (
                                        <option key={player.id} value={player.id} className="h-7 w-[210px] bg-white rounded-md">
                                            {player.full_name}
                                        </option>
                                    ))
                                }
                            </select>
                        </span>
                        <span>
                            <img src={process.env.PUBLIC_URL + "/images/small-plus.svg"} alt="" />
                        </span>
                    </div>
                </div>
                <div id='extra-roles' className="flex flex-col gap-1 mt-[32px] bg-sn-bg-light-blue">
                    <h5 className="font-interSBold">Extra Roles</h5>
                    {extraRoles.map((extras) => (
                        <div key={extras.id} className="flex flex-row justify-between items-center">
                            <div>{extras.role_title}</div>
                            <div>
                                <select className="h-7 px-2 bg-white rounded-md border-sn-light-orange border-[1.5px]" name="" id="" disabled={!selectedID}>
                                    <option className="h-7 bg-white rounded-md" value="">No Selection</option>
                                    {
                                        volunteers.map((volunteer) => (
                                            <option key={volunteer.id} value={volunteer.id} className="h-7 bg-white rounded-md">
                                                {volunteer.full_name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
                {/* <button onClick={submitEvent}  className="h-[40px] w-[150px] m-auto mt-5 bg-sn-main-blue rounded-md text-white font-russoOne">Save</button> */}
                {selectedID && <p className="hidden">Selected ID: {selectedID}</p>}
            </form>

        );
    }
}

export default NewGamePageComponent;