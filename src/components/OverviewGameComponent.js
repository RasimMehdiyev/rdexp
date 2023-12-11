import React, { useEffect, useState } from "react";
import { supabase } from "../lib/helper/supabaseClient";
import LoadingPage from "../pages/LoadingPage";
import { XMarkIcon } from '@heroicons/react/24/outline'
import { MdDateRange, MdAccessTime, MdLocationOn, MdGroup } from 'react-icons/md';


const GameOverviewComponent = ({
    generalInfo    
}) => {
    const [date, setDate] = useState(generalInfo?.date || '');
    const [time, setTime] = useState(generalInfo?.time || '');
    const [location, setLocation] = useState(generalInfo?.location || '');
    const [extraRoles, setExtraRoles] = useState([]); // Use state for extraRoles    
    const [loading, setLoading] = useState(true);
    const [positions, setPositions] = useState([]);
    
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [selectedExtras, setSelectedExtras] = useState([])
    const [preSubstitutePlayers, setPreSubstitutePlayers] = useState([]);
        
    useEffect(() => { // first thing that happens
        firstFetches(generalInfo.teamId);
        setLoading(false);
    }, [])

    const firstFetches = async (teamId) => { //happens when team is selected
        // Update the state with the selected option's id
        if (teamId) {
            setLoading(true);           
            await getExtraRoles(teamId);
            await getPositionsOfTeam(teamId);            
            await getSelectedUsers();
            console.log('extraRoles:', extraRoles);
            console.log('positions:', positions);
            setLoading(false);
        } else {
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

    const getExtraRoles = async (teamId) => { //getting extra roles depending on team
        console.log("team id", teamId);
        const { data: sup_extraRoles, error: extraRolesError } = await supabase
            .from('team_extraroles')
            .select('role_title,id')
            .eq('team_id', teamId);

        if (extraRolesError) throw extraRolesError;
        setExtraRoles(sup_extraRoles); // Set state here
    };

    const getPositionsOfTeam = async (teamId) => {
        let { data, error } = await supabase
            .rpc('get_positions_for_team', {
                param_team_id: teamId
        })
        if (error) console.error(error)
        else console.log("positions", data)
        setPositions(data);
    }  
   
    if (loading) {
        return <LoadingPage />; // You can replace this with any loading spinner or indicator
    } else {

        return (
            <form className="flex bg-sn-bg-light-blue flex-col justify-center gap-2">
                <div className="mb-2 flex items-center">
                    <MdGroup className="text-sn-main-orange mr-3" size={32} />
                    <input
                        type="text"
                        readOnly
                        value={generalInfo?.teamName || 'No team selected'}
                        style={{ height: '40px' }}
                        className="form-input block w-full max-w-xs pl-3 pr-3 text-lg border border-blue-500 rounded-lg text-gray-500 bg-white"
                        disabled={true}
                    />
                </div>

                <div className="mb-2 flex items-center">
                    <MdDateRange className="text-sn-main-orange mr-3" size={32} />
                    <input 
                        value={date}
                        type="date"
                        className="form-input border border-blue-500 rounded-lg text-gray-500 bg-white"
                        style={{ width: '130px', height: '40px', fontSize: '1rem' }}
                        disabled={true}
                    />
                </div>

                <div className="mb-2 flex items-center">
                    <MdAccessTime className="text-sn-main-orange mr-3" size={32} />
                    <input 
                        value={time}
                        type="time"
                        className="form-input border border-blue-500 rounded-lg text-gray-500 bg-white"
                        style={{ width: '110px', height: '40px', fontSize: '1rem' }}
                        disabled={true}
                    />
                </div>

                <div className="mb-2 flex items-center">
                    <MdLocationOn className="text-sn-main-orange mr-3" size={32} />
                    <input 
                        value={location}
                        type="text"
                        placeholder="Location"
                        className="form-input border max-w-xs border-blue-500 rounded-lg text-gray-500 bg-white w-full pl-3 pr-3"
                        style={{ height: '40px', fontSize: '1rem' }}
                        disabled={true}
                    />
                </div>                              
                    <div id='players' className="flex flex-col gap-1 mt-4">
                    <h5 className="text-2xl font-bold text-left text-sn-main-blue font-russoOne mb-2">Initial Line-up</h5>
                    {positions.map((position) => (
                        <div className="flex flex-row items-center mb-1" key={position.position_abbreviation}>
                            <div className="bg-position-blue text-white font-bold p-1 rounded text-center w-12 mr-3">
                                {position.position_abbreviation}
                            </div>
                            <div className="flex-grow relative">
                                <select
                                    id={`player_select_${position.id}`}
                                    className="form-select w-full px-2 py-2 bg-white rounded-lg border border-blue-500 text-gray-500 appearance-none"
                                    disabled={true}
                                >
                                    <option value="">
                                        {selectedPlayers.find(player => player.position_id === position.id) ?
                                            selectedPlayers.find(player => player.position_id === position.id).full_name : 'No Selection'}
                                    </option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    {/* Placeholder for dropdown icon */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div id='substitutes' className="flex flex-col mt-4">
                    <h5 className="text-2xl font-bold text-sn-main-blue font-russoOne mb-2">Substitutes</h5>
                    <div className="flex flex-col gap-2 justify-center items-start">
                        {preSubstitutePlayers.map((substitute, index) => (
                            <div key={index} className="flex gap-4 items-start w-full">
                                <div className="bg-position-blue text-white font-bold p-1 rounded text-center w-12 mr-3">
                                    SUB
                                </div>
                                <div className="flex-grow relative">
                                    <select
                                        className="form-select w-full px-2 py-2 bg-white rounded-lg border border-blue-500 text-gray-500 appearance-none"
                                        name={`substituteSelect_${index}`}
                                        disabled={true}
                                        id={`substituteSelect_${index}`}
                                        value={substitute.id}
                                    >
                                        <option value="">
                                            {preSubstitutePlayers[index].full_name || 'No Selection'}
                                        </option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        {/* Placeholder for dropdown icon */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div id='extra-roles' className="flex flex-col gap-1 mt-4 bg-sn-bg-light-blue">
                    <h5 className="text-2xl font-bold text-left text-sn-main-blue font-russoOne mb-2">Extra Roles</h5>
                    {extraRoles.map((extraRole) => (
                        <div key={extraRole.id} className="flex items-center mb-1">
                            <span className="text-black mr-3" style={{ width: '128px', color: '#007bff', fontFamily: 'Russo One' }}>{extraRole.role_title}</span>
                            <div className="flex-grow relative">
                                <select
                                    className="form-select w-full px-2 py-2 bg-white rounded-lg border border-blue-500 text-gray-500 appearance-none"
                                    name="" 
                                    id="" 
                                    disabled={true}
                                >
                                    <option value="">
                                        {selectedExtras.find(extra => extra.extraRole_id === extraRole.id) ?
                                            selectedExtras.find(extra => extra.extraRole_id === extraRole.id).full_name : 'No Selection'}
                                    </option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    {/* Placeholder for dropdown icon */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
            </form>

        );
    }
}

export default GameOverviewComponent;