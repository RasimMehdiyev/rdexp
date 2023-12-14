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
            <form className="flex bg-white flex-col justify-center gap-2 rounded-md px-2 py-2 mb-4">
                <div className="mb-2 flex items-center">
                    <MdGroup className="text-sn-main-orange mr-3" size={32} />
                    <div className="form-input w-full pl-3 pr-3 text-lg">{generalInfo?.teamName || 'No team selected'}</div>
                </div>

                <div className="mb-2 flex items-center">
                    <MdDateRange className="text-sn-main-orange mr-3" size={32} />
                    
                    <div className="form-input w-full pl-3 pr-3 text-lg">{date}</div>
                </div>

                <div className="mb-2 flex items-center">
                    <MdAccessTime className="text-sn-main-orange mr-3" size={32} />
                    
                    <div className="form-input w-full pl-3 pr-3 text-lg">{time}</div>
                </div>

                <div className="mb-2 flex items-center">
                    <MdLocationOn className="text-sn-main-orange mr-3" size={32} />
                    
                    <div className="form-input w-full pl-3 pr-3 text-lg">{location}</div>
                </div>                              
                <div id='players' className="flex flex-col mt-7 gap-2 mt-4">
                    <div className="text-2xl text-left text-sn-main-blue font-russoOne mb-2">Initial Line-up</div>
                    {positions.map((position) => (
                        <div className="flex flex-col gap-0 " key={position.position_abbreviation}>
                        <div className="flex flex-row items-center gap-1" >
                            <div className="bg-club-header-blue text-white font-bold p-1 rounded text-center w-12 ">
                                {position.position_abbreviation}                            
                            </div>
                            <div className="flex flex-col gap-0">
                                <div className="flex-grow relative">
                                    {selectedPlayers.find(player => player.position_id == position.id) ?
                                        (selectedPlayers.find(player => player.position_id == position.id).is_attending == 'Declined' ?
                                            (<div className="w-full px-2 text-red-500">
                                            {selectedPlayers.find(player => player.position_id == position.id).full_name}
                                            </div>)
                                            :
                                            (<div className="w-full px-2">
                                            {selectedPlayers.find(player => player.position_id == position.id).full_name}
                                            </div>)
                                        )
                                        :
                                        (<div className="w-full px-2 text-gray-500">
                                        No selection
                                        </div>
                                        )
                                    }                               
                                
                                    
                                </div>
                                
                            </div>
                        </div>
                        <div>
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
                        </div>
                    ))}
                </div>
                <div id='substitutes' className="flex flex-col mt-7">
                    <h5 className="text-2xl  text-sn-main-blue font-russoOne mb-2">Substitutes</h5>
                    <div className="flex flex-col gap-2 justify-center items-start">
                        {preSubstitutePlayers.map((substitute, index) => (
                            <div className="flex flex-col gap-0" key={index}>
                                <div className="flex gap-1 items-center w-full">
                                    <div className="bg-club-header-blue text-white font-bold p-1 rounded text-center w-12 mr-3">
                                        SUB
                                    </div>                                                                    
                                    {preSubstitutePlayers[index].is_attending == 'Declined' ?
                                        (<div className="w-full text-red-500">
                                        {preSubstitutePlayers[index].full_name}
                                        </div>)
                                        :
                                        (<div className="w-full ">
                                        {preSubstitutePlayers[index].full_name}
                                        </div>)
                                    }                                
                                                                       
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
                <div id='extra-roles' className="flex flex-col gap-1 mt-7">
                    <h5 className="text-2xl  text-left text-sn-main-blue font-russoOne mb-2">Extra Roles</h5>
                    {extraRoles.map((extraRole) => (
                        
                        <div className="flex flex-col gap-0 " key={extraRole.id}>
                        <div className="flex flex-row items-center gap-1" >
                            <span className="mr-3 max-w-128px text-club-header-blue text-lg" style={{ width: '128px', color: '#007bff', fontFamily: 'Inter Bold' }}>{extraRole.role_title}</span>
                            <div className="flex flex-col gap-0">
                                <div className="flex-grow relative">
                                    {selectedExtras.find(extra => extra.extraRole_id === extraRole.id) ?
                                        (selectedExtras.find(extra => extra.extraRole_id === extraRole.id).is_attending == 'Declined' ?
                                            (<div className="w-full px-2 text-red-500">
                                            {selectedExtras.find(extra => extra.extraRole_id === extraRole.id).full_name}
                                            </div>)
                                            :
                                            (<div className="w-full px-2">
                                            {selectedExtras.find(extra => extra.extraRole_id === extraRole.id).full_name}
                                            </div>)
                                        )
                                        :
                                        (<div className="w-full px-2 text-gray-500">
                                        No selection
                                        </div>
                                        )
                                    }                               
                                
                                    
                                </div>
                                
                            </div>
                        </div>
                        <div>
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
                        </div>
                    ))}
                </div>
                
            </form>

        );
    }
}

export default GameOverviewComponent;