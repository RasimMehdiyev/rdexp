import React, { useEffect, useState } from "react";
import { supabase } from "../lib/helper/supabaseClient";
import LoadingPage from "../pages/LoadingPage";
import { XMarkIcon } from '@heroicons/react/24/outline'
import { MdDateRange, MdAccessTime, MdLocationOn, MdGroup } from 'react-icons/md';
import LocationInput from '../components/LocationInput.js';


const EditGameComponent = ({
    eventTitle,
    onGeneralInfoChanges,
    onSelectedPlayerChanges,
    onSelectedExtraChanges,
    onTeamChanges,
    generalInfo,
    selectedTeam
}) => {
    const [date, setDate] = useState(generalInfo?.date || '');
    const [time, setTime] = useState(generalInfo?.time || '');
    const [location, setLocation] = useState(generalInfo?.location || '');
    const [initialLocation, setInitialLocation] = useState(generalInfo?.location || '');
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
    // const [newLocation, setNewLocation] = useState()
         
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => { // first thing that happens
        firstFetch(generalInfo.teamId);
        setLoading(false);
    }, [])

    const firstFetch = async (teamId) => { //happens when team is selected
        // Update the state with the selected option's id
        if (teamId) {
            setLoading(true);
            setSelectedID(teamId);
            await getPlayerOfTeam(teamId);
            await getExtraRoles(teamId);
            await getPositionsOfTeam(teamId);
            await getVolunteers(teamId);
            await getSelectedUsers();
            console.log('extraRoles:', extraRoles);
            console.log('positions:', positions);
            setLoading(false);
        } else {
            setSelectedID('');
            setTeamPlayers([]);
            setExtraRoles([]);
            
        }   
        
        
    };

    const getSelectedUsers = async () => { //getting extra roles depending on team
        let { data, error } = await supabase
        .rpc('get_event_users', {
            param_event_id: generalInfo.eventid
        })
        if (error) console.error(error)
        else console.log("user events rpc", data)      

        const substitutes = data
            .filter(user => user.role_id === 2 && user.position_id === 6)
            .map(user => ({
                full_name: user.full_name,
                id: user.user_tableid,
                is_attending: user.is_attending
            }));
            console.log("substitutes array:", substitutes);

        const players = data
            .filter(user => user.role_id === 2 && user.position_id !== null && user.position_id !== 6)
            .map(user => ({
                full_name: user.full_name,
                id: user.user_tableid,
                position_name: user.extra_role_name || 'Player',
                position_id: user.position_id,
                is_attending: user.is_attending
            }));

        console.log("Players array:", players);

            // Filter and map the extra roles
        const extras = data
        .filter(user => user.role_id === 3)
        .map(user => ({
            full_name: user.full_name,
            id: user.user_tableid,
            extra_role_name: user.extra_role_name,
            extraRole_id: user.extra_role_id,
            is_attending: user.is_attending
        }));

        console.log("extras array:", extras);      
        
        setSelectedUsers(data);
        setPreSubstitutePlayers(substitutes);
        setSelectedExtras(extras);
        setSelectedPlayers(players);
    };
    
    const getExtraRoles = async (teamId) => { //getting extra roles depending on team
        console.log("team id", teamId);
        const { data: sup_extraRoles, error: extraRolesError } = await supabase
            .from('team_extraroles')
            .select('role_title,id')
            .eq('team_id', teamId);

        if (extraRolesError) throw extraRolesError;
        setExtraRoles(sup_extraRoles); // Set state here
    };

    const getVolunteers = async (teamId) => { //getting volunteer depending on team
        let { data, error } = await supabase
        .rpc('get_team_users_by_role', {
            param_role_id: 3, 
            param_team_id: teamId,
        })
        if (error) console.error(error)
        else console.log("extras: ", data);
        setVolunteers(data);
        setOptionExtras(data);
    }

    const getPlayerOfTeam = async (teamId) => {
        
        let { data, error } = await supabase
        .rpc('get_team_users_by_role', {
            param_role_id: 2, 
            param_team_id: teamId
        })
        console.log(data.length)
        if (data.length == 0) {
            const { data: sup_players, error: playersError } = await supabase
            .from('team_users')
            .select('user_id, team_id')
            .eq('team_id', teamID);
            if (playersError) throw playersError;
            console.log("sup players", sup_players);
            data = sup_players;
        }
        if (error) console.error(error)
        else console.log("team players in game edit: ", data)
        setTeamPlayers(data);
        setOptionPlayers(data);
    }

    const getPositionsOfTeam = async (teamId) => {
        let { data, error } = await supabase
            .rpc('get_positions_for_team', {
                param_team_id: teamId
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
            const playerWithPosition = { ...selectedPlayer, position_name: position.position_name, position_id:position.id, is_attending:'Not sent yet' };            
            const existingPlayerIndex = selectedPlayers.findIndex((player) => player.position_id == position.id);

            const matchingUser = selectedUsers.find(user => user.user_tableid == playerWithPosition.id);

            // Update is_attending property in playerWithPosition
            if (matchingUser) {
            playerWithPosition.is_attending = matchingUser.is_attending;
            } 
            
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
            const extraWithRole = { ...selectedExtra, extraRole_id: extraRole.id, extraRole: extraRole.role_title, is_attending:'Not sent yet' };            
            const existingExtraIndex = selectedExtras.findIndex((extra) => extra.extraRole_id == extraRole.id);
            const matchingUser = selectedUsers.find(user => user.user_tableid == extraWithRole.id);

            // Update is_attending property in playerWithPosition
            if (matchingUser) {
            extraWithRole.is_attending = matchingUser.is_attending;
            } 
            
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
   
    const handleAddSubstitute = () => {
        setPreSubstitutePlayers(prev => [...prev, { full_name: "No Selection", id: -1, is_attending:'' }]);
    };
   
    const handleSubstituteChange = (index, playerId) => {
        let selectedPlayer = { full_name: "No Selection", id: -1, is_attending:'' };
        if (playerId != -1) {
            selectedPlayer = teamPlayers.find((player) => player.id == playerId);
        }
        const updatedSubstitute = [...preSubstitutePlayers];
        updatedSubstitute[index] = { full_name: selectedPlayer.full_name, id: selectedPlayer.id, is_attending:'Not sent yet' };
        
        const matchingUser = selectedUsers.find(user => user.user_tableid == updatedSubstitute[index].id);

        // Update is_attending property in playerWithPosition
        if (matchingUser) {
            updatedSubstitute[index].is_attending = matchingUser.is_attending;
        } 
        setPreSubstitutePlayers(updatedSubstitute);        
        
    };

    const handleLocationInputChange = (value) => {
        setLocation(value)
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
    
    useEffect(() => {
    onGeneralInfoChanges(prevState => {
        return { ...prevState, date:date, time:time, location:location };
        });
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
                        <div className="form-input w-full pl-3 pr-3 text-lg">{generalInfo?.teamName || 'No team selected'}</div>
                    </div>

                    <div className="mb-2 flex items-center"> 
                    <MdDateRange className="text-sn-main-orange mr-3" size={32} />
                    <input 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        type="date" 
                        className="form-input pl-3 pr-3 rounded-lg border-2 border-sn-main-orange text-black h-[40px] w-[150px]" 
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
                                className="form-input text-interReg rounded-lg pl-3 pr-3 border-2  border-sn-main-orange text-black h-[40px] w-[150px]"
                            />
                        </div>
                    ) : (
                        <div className="mb-2 flex items-center">
                            <select
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="form-select text-interReg rounded-lg pl-3 pr-3 border-2 border-sn-main-orange text-black h-[40px] w-[150px]"
                            >
                                {generateTimeOptions()}
                            </select>
                        </div>
                    )}

                    </div>
                    <div className="mb-2 flex items-center"> 
                    <MdLocationOn className="text-sn-main-orange mr-3 w-[32px] h-[32px]" /> 
                    <LocationInput onLocationChange={handleLocationInputChange} borderColor="sn-main-orange" isIconVisible={false} value={initialLocation}/>
                    {/*<input 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        placeholder="Location" 
                        type="text" 
                        className="form-input rounded-lg text-black w-full pl-3 pr-3" 
                        style={{ height: '40px', fontSize: '1rem' }} 
        />*/}
                    </div>                
                
                    <div id='players' className="flex flex-col gap-4 mt-10">
                        <h5 className="text-2xl text-left text-sn-main-blue font-russoOne mb-2">Initial Line-up</h5>
                        {positions.map((position) => (
                            <div className="flex flex-col gap-0" key={position.position_abbreviation}>
                                <div className="flex flex-row items-center mb-1" >
                                    <div className="bg-club-header-blue text-white font-bold p-1 rounded text-center w-12 mr-3">
                                        {position.position_abbreviation}
                                    </div>
                                    <div className="flex-grow">                                    
                                        {selectedPlayers.find(player => player.position_id === position.id) ?
                                            (selectedPlayers.find(player => player.position_id === position.id).is_attending == 'Declined' ?
                                                <select 
                                                    id={`player_select_${position.id}`}
                                                    onChange={(event) => handlePlayerChange(event, position)}
                                                    className="form-select w-full px-2 py-2  bg-white rounded-lg border-red-500 border text-red-500"
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
                                                :
                                                <select
                                                    id={`player_select_${position.id}`}
                                                    onChange={(event) => handlePlayerChange(event, position)}
                                                    className="form-select w-full px-2 py-2 h-12 bg-white rounded-lg border-2 border-club-header-blue"
                                                    disabled={!selectedID}
                                                >
                                                    <option value="">
                                                        {selectedPlayers.find(player => player.position_id === position.id) ?
                                                            selectedPlayers.find(player => player.position_id === position.id).full_name : 'No Selection'}
                                                    </option>
                                                    <option value={-1}>No Selection</option>
                                                    {optionPlayers.map((player) => (
                                                        <option key={player.id} value={player.id}>
                                                            {player.full_name}
                                                        </option>
                                                    ))}
                                                </select>
                                            )
                                            :
                                            (<select
                                                    id={`player_select_${position.id}`}
                                                    onChange={(event) => handlePlayerChange(event, position)}
                                                    className="form-select w-full px-2 py-2 h-12 bg-white rounded-lg text-gray-500 border-2 border-club-header-blue"
                                                    disabled={!selectedID}
                                                >
                                                    <option value="" className="text-black">
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
                                            )
                                        }
                                    </div>
                                    
                                </div>
                                {selectedPlayers.find(player => player.position_id === position.id) ?
                                    (selectedPlayers.find(player => player.position_id === position.id).is_attending == 'Declined' ?
                                        (<div className="w-full text-red-500 text-sm italic">
                                        {selectedPlayers.find(player => player.position_id === position.id).is_attending}
                                        </div>)
                                        :
                                        (<div className="w-full text-sm italic">
                                        {selectedPlayers.find(player => player.position_id === position.id).is_attending}
                                        </div>)
                                    )
                                    :
                                    (<div className="w-full text-gray-300">
                                    
                                    </div>
                                    )
                                } 
                            </div>
                        ))}
                    </div>
                    <div id='substitutes' className="flex flex-col gap-4 mt-10">
                        <div className="flex items-center mb-2 gap-2">
                            <h5 className="text-2xl text-sn-main-blue font-russoOne">Substitutes</h5>
                            <span onClick={handleAddSubstitute} className="cursor-pointer">
                                <img src={process.env.PUBLIC_URL + "/images/small-plus.svg"} alt="" className="w-6 h-6"/>
                            </span>
                        </div>


                        <div className="flex flex-col gap-2 justify-center items-start w-full">
                            {preSubstitutePlayers.map((substitute, index) => (
                                <div className="flex flex-col gap-0 w-full" key={index} >
                                    <div className="flex flex-row gap-2 w-full items-center">
                                        <div className="bg-club-header-blue text-white font-bold p-1 rounded text-center w-12 mr-3">
                                            SUB
                                        </div>
                                
                                        {preSubstitutePlayers[index].full_name != 'No Selection' ?
                                            (preSubstitutePlayers[index].is_attending == 'Declined' ?
                                                (<select
                                                    className="form-select w-full px-2 py-2 bg-white rounded-lg border border-red-500 text-red-500"
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
                                                </select> )
                                                :
                                                (<select
                                                    className="form-select w-full px-2 py-2 bg-white h-12 rounded-lg border-2 border-club-header-blue"
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
                                                    </select>)
                                                )
                                            :
                                            (
                                                <select
                                                    className="form-select w-full px-2 py-2 bg-white rounded-lg border-2 border-club-header-blue text-gray-500"
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
                                            )
                                        } 
                                        
                                        <XMarkIcon className="w-12 h-12 text-neutral-300 cursor-pointer ml-4"
                                            onClick={() => handleRemoveSubstitute(index)}></XMarkIcon>
                                    </div>
                                    {preSubstitutePlayers[index].is_attending == 'Declined' ?
                                        (<div className="w-full text-red-500 text-sm italic">
                                        {preSubstitutePlayers[index].is_attending}
                                        </div>)
                                        :
                                        (<div className="w-full text-sm italic">
                                        {preSubstitutePlayers[index].is_attending}
                                        </div>)
                                    }  
                                </div>
                            ))}
                        </div>
                    </div>
                    <div id='extra-roles' className="flex flex-col gap-4 mt-10">
                        <h5 className="text-2xl text-left text-sn-main-blue font-russoOne mb-2">Extra Roles</h5>
                        {extraRoles.map((extraRole) => (
                            <div className="flex flex-col gap-0" key={extraRole.id} > 
                                <div className="flex items-center mb-1">
                                    <span className="mr-3 text-club-header-blue" style={{ width: '128px', fontFamily: 'Inter Bold' }}>{extraRole.role_title}</span>
                                    
                                    {selectedExtras.find(extra => extra.extraRole_id === extraRole.id) ?
                                        (selectedExtras.find(extra => extra.extraRole_id === extraRole.id).is_attending == 'Declined' ?
                                            (<select
                                                className="form-select px-2 py-2 bg-white rounded-lg border border-red-500 flex-grow text-red-500"
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
                                            </select>)
                                            :
                                            (<select
                                                className="form-select px-2 py-2 h-12 bg-white rounded-lg text-black border-2 border-club-header-blue flex-grow"
                                                name="" 
                                                id="" 
                                                disabled={!selectedID}
                                                onChange={(event) => handleExtraChange(event, extraRole)}
                                            >
                                                <option value="" >
                                                    {selectedExtras.find(extra => extra.extraRole_id === extraRole.id) ?
                                                        selectedExtras.find(extra => extra.extraRole_id === extraRole.id).full_name : 'No Selection'}
                                                </option>
                                                <option value={-1}>No Selection</option>
                                                {optionExtras.map((volunteer) => (
                                                    <option key={volunteer.id} value={volunteer.id}>
                                                        {volunteer.full_name}
                                                    </option>
                                                ))}
                                            </select>)
                                        )
                                        :
                                        (<select
                                            className="form-select px-2 py-2 bg-white rounded-lg border-2 border-club-header-blue h-12 text-black flex-grow text-gray-500"
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
                                        )
                                    }
                                    
                                </div>
                                {selectedExtras.find(extra => extra.extraRole_id === extraRole.id) ?
                                    (selectedExtras.find(extra => extra.extraRole_id === extraRole.id).is_attending == 'Declined' ?
                                        (<div className="w-full text-red-500 text-sm italic">
                                        {selectedExtras.find(extra => extra.extraRole_id === extraRole.id).is_attending}
                                        </div>)
                                        :
                                        (<div className="w-full text-sm italic">
                                        {selectedExtras.find(extra => extra.extraRole_id === extraRole.id).is_attending}
                                        </div>)
                                    )
                                    :
                                    (<div className="w-full text-gray-300">
                                     
                                    </div>
                                    )
                                }
                            </div>
                        ))}
                    </div>                
                </form>

        );
    }
}

export default EditGameComponent;