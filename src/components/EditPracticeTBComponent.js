import React, { useEffect, useState } from "react";
import { supabase } from "../lib/helper/supabaseClient";
import LoadingPage from "../pages/LoadingPage";
import { XMarkIcon } from '@heroicons/react/24/outline'
import { MdDateRange, MdAccessTime, MdLocationOn, MdGroup } from 'react-icons/md';
import LocationInput from '../components/LocationInput.js';


const EditPracticeTBComponent = ({
    eventTitle,
    onGeneralInfoChanges,
    onSelectedPlayerChanges,
    onSelectedExtraChanges,
    onTeamChanges,
    generalInfo,
    selectedTeam
}) => {
    // const [title, setTitle] = useState(eventTitle);
    const [selectedOption, setSelectedOption] = useState("Game");
    const [date, setDate] = useState(generalInfo?.date || '');
    const [time, setTime] = useState(generalInfo?.time || '');
    const [location, setLocation] = useState(generalInfo?.location || '');
    const [teamNames, setTeamNames] = useState([]);
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [selectedID, setSelectedID] = useState('');
    const [initialLocation, setInitialLocation] = useState(generalInfo?.location || '');
    //const [selectedID, setSelectedID] = useState(selectedTeam);
    const [volunteers, setVolunteers] = useState([]);
    const [extraRoles, setExtraRoles] = useState([]); // Use state for extraRoles    
    const [loading, setLoading] = useState(true);
    const [positions, setPositions] = useState([]);
    
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [optionPlayers, setOptionPlayers] = useState([]);
    const [selectedExtras, setSelectedExtras] = useState([])
    const [optionExtras, setOptionExtras] = useState([]);
    const [preSubstitutePlayers, setPreSubstitutePlayers] = useState([]);
    const [userEvents, setUserEvents] = useState([]);


    const teamName = generalInfo?.teamName || 'No team selected';
    const teamId = generalInfo?.teamId || '';
         


    useEffect(() => { // first thing that happens
        firstFetches(generalInfo.teamId);
        setLoading(false);
    }, [])

    const handleLocationInputChange = (value) => {
        setLocation(value)
      };



    const firstFetches = async (teamId) => { //happens when team is selected
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
                id: user.user_tableid
            }));
            console.log("substitutes array:", substitutes);


        const players = data
            .filter(user => user.role_id === 2 && user.position_id !== null && user.position_id !== 6)
            .map(user => ({
                full_name: user.full_name,
                id: user.user_tableid,
                position_name: user.extra_role_name || 'Player',
                position_id: user.position_id
            }));

            console.log("Players array:", players);

            // Filter and map the extra roles
        const extras = data
        .filter(user => user.role_id === 3)
        .map(user => ({
            full_name: user.full_name,
            id: user.user_tableid,
            extra_role_name: user.extra_role_name,
            extraRole_id: user.extra_role_id
        }));

        console.log("extras array:", extras);

        
        setPreSubstitutePlayers(substitutes);
        setSelectedExtras(extras);
        setSelectedPlayers(players);
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
        console.log("data length:",data.length)
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

    useEffect(() => {
        // Log the props to confirm they're being received correctly
        console.log('Props received in EditGameComponent:', { eventTitle, generalInfo, selectedTeam });
      
        setDate(generalInfo.date);
        setTime(generalInfo.time);
        setLocation(generalInfo.location);
        
}, [generalInfo, selectedTeam]);


    //   useEffect(() => {
    //     // Fetch the team name based on the selectedID
    //     const fetchTeamName = async () => {
    //       const { data, error } = await supabase
    //         .from('team')
    //         .select('team_name')
    //         .eq('id', selectedID)
    //         .single();
      
    //       if (error) {
    //         console.error('Error fetching team name:', error);
    //       } else {
    //         setSelectedTeam({ ...selectedTeam, team_name: data.team_name });
    //       }
    //     };
      
    //     if (selectedID) {
    //       fetchTeamName();
    //     }
    //   }, []);
      
    //   useEffect(() => {
    //     console.log('Received selectedTeam in EditGameComponent:', selectedTeam);
    //   }, [selectedTeam]);
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
                    
                    </div> 
            </form>

        );
    }
}

export default EditPracticeTBComponent;