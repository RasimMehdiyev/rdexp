import React, { useEffect, useState } from "react";
import { supabase } from "../lib/helper/supabaseClient";
import LoadingPage from "../pages/LoadingPage";
import { XMarkIcon } from '@heroicons/react/24/outline'
import { MdDateRange, MdAccessTime, MdLocationOn, MdGroup } from 'react-icons/md';
import LocationInput from '../components/LocationInput.js';


const NewGamePageComponent = ({ eventTitle, onGeneralInfoChanges, onSelectedPlayerChanges, onSelectedExtraChanges, onTeamChanges }) => {
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
    const [preSubstitutePlayers, setPreSubstitutePlayers] = useState([]);

    useEffect(() => { // first thing that happens
        try {
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
        } catch (error) {
            console.error(error)
        }
        
    }, [])

    const handleTeamChange = async (event) => { //happens when team is selected
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
            setPreSubstitutePlayers([]);
            setSelectedExtras([]);
            setSelectedPlayers([]);
            setLoading(false);
        } else {
            setSelectedID('');
            setTeamPlayers([]);
            setExtraRoles([]);
            setSelectedTeamName('');
        }        
    };

    const getExtraRoles = async (teamID) => { //getting extra roles depending on team
        console.log("team id", teamID);
        const { data: sup_extraRoles, error: extraRolesError } = await supabase
            .from('team_extraroles')
            .select('role_title,id')
            .eq('team_id', teamID);

        if (extraRolesError) throw extraRolesError;
        setExtraRoles(sup_extraRoles); // Set state here
    };

    const getVolunteers = async (teamID) => { //getting volunteer depending on team
        let { data, error } = await supabase
        .rpc('get_team_users_by_role', {
            param_role_id: 3, 
            param_team_id: teamID,
        })
        if (error) console.error(error)
        else console.log("extras: ", data);
        setVolunteers(data);
        setOptionExtras(data);
    }

    const getPlayerOfTeam = async (teamID) => {
        
        let { data, error } = await supabase
        .rpc('get_team_users_by_role', {
            param_role_id: 2, 
            param_team_id: teamID
        })
        if (error) console.error(error)
        else console.log("team players: ", data)
        setTeamPlayers(data);
        setOptionPlayers(data);
    }

    const getPositionsOfTeam = async (teamID) => {
        let { data, error } = await supabase
            .rpc('get_positions_for_team', {
                param_team_id: teamID
        })
        if (error) console.error(error)
        else console.log("positions", data)
        setPositions(data);
    }   

    const handlePlayerChange = (event, position) => {
        const playerId = event.target.value;

        
        if (playerId == -1) {
        // Find the existing player for the current position
            const existingPlayerIndex = selectedPlayers.findIndex((player) => player.position_id == position.id);
            
            if (existingPlayerIndex != -1) {
                // Remove the existing player if "No Selection" is chosen
                const updatedPlayers = [...selectedPlayers];
                updatedPlayers.splice(existingPlayerIndex, 1);
                
                setSelectedPlayers(updatedPlayers);
            }
            // If "No Selection" is chosen and the position is empty, nothing happens
        } else {            
            const selectedPlayer = teamPlayers.find((player) => player.id == playerId);            
            const playerWithPosition = { ...selectedPlayer, position_name: position.position_name, position_id:position.id };            
            const existingPlayerIndex = selectedPlayers.findIndex((player) => player.position_id == position.id);
            
            if (existingPlayerIndex !== -1) {                
                const updatedPlayers = [...selectedPlayers];
                updatedPlayers[existingPlayerIndex] = playerWithPosition;                
                setSelectedPlayers(updatedPlayers);
            } else {
                setSelectedPlayers((prevSelectedPlayers) => [...prevSelectedPlayers, playerWithPosition]);
            }
        }
    };

    const handleExtraChange = (event, extraRole) => {
        const extraId = event.target.value;

        
        if (extraId == -1) {
        // Find the existing player for the current position
            const existingExtraIndex = selectedExtras.findIndex((extra) => extra.extraRole_id == extraRole.id);
            
            if (existingExtraIndex != -1) {
                // Remove the existing player if "No Selection" is chosen
                const updatedExtras = [...selectedExtras];
                updatedExtras.splice(existingExtraIndex, 1);
                
                setSelectedExtras(updatedExtras);
            }
            // If "No Selection" is chosen and the position is empty, nothing happens
        } else {            
            const selectedExtra = volunteers.find((extra) => extra.id == extraId);            
            const extraWithRole = { ...selectedExtra, extraRole_id: extraRole.id, extraRole: extraRole.role_title };            
            const existingExtraIndex = selectedExtras.findIndex((extra) => extra.extraRole_id == extraRole.id);
            
            if (existingExtraIndex !== -1) {                
                const updatedExtras = [...selectedExtras];
                updatedExtras[existingExtraIndex] = extraWithRole;                
                setSelectedExtras(updatedExtras);
            } else {
                setSelectedExtras((prevSelectedExtras) => [...prevSelectedExtras, extraWithRole]);
            }
        }
    };

    useEffect(() => {
        // Update optionPlayers whenever selectedPlayers change
        console.log("selected players: ", selectedPlayers);
        onSelectedPlayerChanges(selectedPlayers);
        const selectedPlayerNoPosition = selectedPlayers.map((player) => player.id)       
        
        const updatedOptionPlayers = teamPlayers.filter(player => !selectedPlayerNoPosition.includes(player.id));        
        setOptionPlayers(updatedOptionPlayers);
    }, [selectedPlayers]);

    useEffect(() => {
        // Update optionPlayers whenever selectedPlayers change
        console.log("selected extras: ", selectedExtras);
        onSelectedExtraChanges(selectedExtras);
        const selectedExtraNoRole = selectedExtras.map((extra) => extra.id)      
        
        const updatedOptionExtras = volunteers.filter(extra => !selectedExtraNoRole.includes(extra.id));
        setOptionExtras(updatedOptionExtras);
    }, [selectedExtras]);

    useEffect(() => {
        onTeamChanges(selectedID);
    }, [selectedID]);

    useEffect(() => {
        onGeneralInfoChanges({date:date, time:time, location:location});
    }, [date, time, location]);
   

    const handleAddSubstitute = () => {
        setPreSubstitutePlayers(prev => [...prev, { full_name: "No Selection", id: -1 }]);
    };    
    
    const handleSubstituteChange = (index, playerId) => {
        let selectedPlayer = { full_name: "No Selection", id: -1 };
        if (playerId != -1) {
            selectedPlayer = teamPlayers.find((player) => player.id == playerId);
        }
        const updatedSubstitute = [...preSubstitutePlayers];
        updatedSubstitute[index] = { full_name: selectedPlayer.full_name, id: selectedPlayer.id };
        
        setPreSubstitutePlayers(updatedSubstitute);        
        
    };
    
    useEffect(() => {
        // Update selectedPlayer whenever preSubstitutePlayer change
        setSelectedPlayers((prevSelected) => {
            // Remove players with position "substitute"
            const updatedSelected = prevSelected.filter(
            (player) => player.position !== "substitute"
            );

            // Add players from preSubstitutePlayer with id not equal to -1
            preSubstitutePlayers.forEach((substitute) => {
            if (substitute.id !== -1) {
                updatedSelected.push({ ...substitute, position: "substitute", position_id: 6 });
            }
            });

            return updatedSelected;
        });
    }, [preSubstitutePlayers]);

    const handleRemoveSubstitute = (indexToRemove) => {        
        setPreSubstitutePlayers((prev) => prev.filter((_, index) => index !== indexToRemove));
        
    };

    const handleLocationInputChange = (value) => {
        setLocation(value)
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
                                <option key={team.id} value={team.id} >
                                    {team.team_name}
                                </option>
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
                    className="form-input pl-3 pr-3 rounded-lg border-2 border-sn-main-orange text-black h-[40px] w-[150px]" 
                    
                />
                </div>

                <div className="mb-2 flex items-center"> 
                <MdAccessTime className="text-sn-main-orange mr-3" size={32} /> 
                <input 
                    value={time} 
                    onChange={(e) => setTime(e.target.value)} 
                    type="time" 
                    className="form-input rounded-lg pl-3 pr-3 border-2 border-sn-main-orange text-black h-[40px] w-[150px]" 
                    
                />
                </div>

                <div className="mb-2 w-full flex items-center"> 
                <MdLocationOn className="text-sn-main-orange mr-3 w-[32px] h-[32px]" /> 
                
                <LocationInput onLocationChange={handleLocationInputChange} borderColor="sn-main-orange" isIconVisible={false} />
                
                </div>                
                
                <div id='players' className="flex flex-col gap-4 mt-4">
                        <h5 className="text-2xl text-left text-sn-main-blue font-russoOne mb-2">Initial Line-up</h5>
                        {positions.map((position) => (
                            <div className="flex flex-col gap-0" key={position.position_abbreviation}>
                                <div className="flex flex-row items-center mb-1" >
                                    <div className="bg-position-blue text-white font-bold p-1 rounded text-center w-12 mr-3">
                                        {position.position_abbreviation}
                                    </div>
                                    <div className="flex-grow">                                    
                                        <select
                                            id={`player_select_${position.id}`}
                                            onChange={(event) => handlePlayerChange(event, position)}
                                            className="form-select w-full px-2 py-2 bg-white rounded-lg"
                                            disabled={!selectedID}
                                        >
                                            <option value="" className="text-black" >
                                                {selectedPlayers.find(player => player.position_id === position.id) ?
                                                    selectedPlayers.find(player => player.position_id === position.id).full_name : 'No Selection'}
                                            </option>
                                            <option value={-1} className="text-black">No Selection</option>
                                            {optionPlayers.map((player) => (
                                                <option key={player.id} value={player.id} className="text-black">
                                                    {player.full_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                </div>
                                
                            </div>
                        ))}
                </div>
                <div id='substitutes' className="flex flex-col gap-4 mt-4">
                    <div className="flex items-center mb-2 gap-2">
                        <h5 className="text-2xl text-sn-main-blue font-russoOne">Substitutes</h5>
                        <span onClick={handleAddSubstitute} className="cursor-pointer">
                            <img src={process.env.PUBLIC_URL + "/images/small-plus.svg"} alt="" className="w-6 h-6"/>
                        </span>
                    </div>

                    <div className="flex flex-col gap-2 justify-center items-start">
                        {preSubstitutePlayers.map((substitute, index) => (
                            <div className="flex flex-col gap-0" key={index} >
                                <div className="flex flex-row gap-2 items-center">
                                    <div className="bg-position-blue text-white font-bold p-1 rounded text-center w-12 mr-3">
                                        SUB
                                    </div>                            
                                    <select
                                        className="form-select w-full px-2 py-2 bg-white rounded-lg"
                                        name={`substituteSelect_${index}`}
                                        id={`substituteSelect_${index}`}
                                        value={substitute.id}
                                        onChange={(e) => handleSubstituteChange(index, e.target.value)}
                                    >
                                        <option value="" className="text-black">
                                            {preSubstitutePlayers[index].full_name || 'No Selection'}
                                        </option>
                                        <option className="text-black" value={-1}>No Selection</option>
                                        {optionPlayers.map((player) => (
                                            <option key={player.id} value={player.id} className="text-black">
                                                {player.full_name}
                                            </option>
                                        ))}
                                    </select>
                                    
                                    <XMarkIcon className="w-12 h-12 text-neutral-300 cursor-pointer ml-4"
                                        onClick={() => handleRemoveSubstitute(index)}></XMarkIcon>
                                </div>
                                
                            </div>
                        ))}
                    </div>
                </div>
                <div id='extra-roles' className="flex flex-col gap-4 mt-4">
                    <h5 className="text-2xl text-left text-sn-main-blue font-russoOne mb-2">Extra Roles</h5>
                    {extraRoles.map((extraRole) => (
                        <div className="flex flex-col gap-0" key={extraRole.id} > 
                            <div className="flex items-center mb-1">
                                <span className="text-black mr-3" style={{ width: '128px', color: '#007bff', fontFamily: 'Russo One' }}>{extraRole.role_title}</span>
                                
                                <select
                                    className="form-select px-2 py-2 bg-white rounded-lg flex-grow"
                                    name="" 
                                    id="" 
                                    disabled={!selectedID}
                                    onChange={(event) => handleExtraChange(event, extraRole)}
                                >
                                    <option value="" className="text-black">
                                        {selectedExtras.find(extra => extra.extraRole_id === extraRole.id) ?
                                            selectedExtras.find(extra => extra.extraRole_id === extraRole.id).full_name : 'No Selection'}
                                    </option>
                                    <option value={-1} className="text-black">No Selection</option>
                                    {optionExtras.map((volunteer) => (
                                        <option key={volunteer.id} value={volunteer.id} className="text-black">
                                            {volunteer.full_name}
                                        </option>
                                    ))}
                                </select>
                                
                            </div>
                            
                        </div>
                    ))}
                </div>
            </form>

        );
    }
}

export default NewGamePageComponent;