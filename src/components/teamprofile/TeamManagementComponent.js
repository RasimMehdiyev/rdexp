import React, { useState } from 'react';
import { supabase } from '../../lib/helper/supabaseClient';
import PersonTag from '../PersonTag.js';
import PlayerAdditionModal from '../PlayerAdditionModal.js';
import PersonTagNotDeletable from '../PersonTagNotDeletable.js';



const TeamManagementComponent = ({ teamData, coach, players, extras, isCoach, setPlayers, setExtras, findUserIdByName, findUserNumberById, findUserRoleById }) => {
    const [addingPlayer, setAddingPlayer] = useState(false);
    const [isAdditionModalOpen, setAdditionModalOpen] = useState(false);
    
    const addUserToTeam = async (name, isPlayer) => {
        if (!name.trim()) {
            return isPlayer ? "Please enter a player's name" : 'Please enter a name';
        }
        
        try {
            
            const userId = await findUserIdByName(name);
            if (!userId) {
                // Condition 3: Player wasn't found
                return `${name} is not registered`;
            }
    
            const userRole = await findUserRoleById(userId);
            if(isPlayer && userRole !== 2) {
                // Condition 2: Player doesn't have role id 2
                return `${name} is not a player`;
            }

            if(!isPlayer && userRole !== 3) {
                // Condition 2: Player doesn't have role id 2
                return `${name} is not a extra`;
            }
    
            const isAlreadyInTeam = players.some(player => player.id === userId);
            if (isAlreadyInTeam) {
                // Condition 1: Player is already in the team
                return `${name} is already in the team`;
            }
    
            // Proceed to add the player to the team
            const number = await findUserNumberById(userId);
            
            const newMember = {
                team_id: teamData.id,
                user_id: userId,
                accepted: false
            };

            const { data, error } = await supabase
                .from('team_user_invite')
                .insert([newMember]);

            if(isPlayer){
                setPlayers(players => [...players, { 
                    id: userId, 
                    name: name,
                    number: number,
                    isPlayer: true, 
                    isMember: true,  
                }]); 
            }else{
                setExtras(extras => [...extras, { 
                    id: userId, 
                    name: name,
                    isPlayer: false, 
                    isMember: true,  
                }]); 
            }
        } catch (error) {
            console.error('Error in adding user:', error);
            return "An error occurred while adding the player";
        }
        return ""; // No error
    };
    

    const deleteUserFromTeam = async (id) => {
        try {
            const { error: deleteError } = await supabase
                .from('team_users')
                .delete()
                .match({ user_id: id });
    
            if (deleteError) throw deleteError;
            return id;
        } catch (err) {
            console.error('Error in deleting user:', err);
            return null;
        }
    };
    
    const deletePlayer = async (id) => {
        const userId = await deleteUserFromTeam(id);
        if (userId) {
            setPlayers(players.filter(player => player.id !== id));
        } else {
            console.error('Player not found');
        }
    };
    
    const deleteExtra = async (id) => {
        const userId = await deleteUserFromTeam(id);
        if (userId) {
            setExtras(extras.filter(extra => extra.id !== id));
        } else {
            console.error('Extra not found');
        }
    };
    return (
            <div className="w-full pl-6 pr-6 flex-col justify-start items-start inline-flex">
                {/* Coach Section */}
                <div className="self-stretch flex-col justify-start items-start flex">
                    <div className="self-stretch justify-start items-center inline-flex pt-5 pb-4">
                        <div className="text-blue-800 text-2xl font-russoOne leading-normal">Coach</div>
                    </div>
                    <div className="self-stretch flex-col justify-start items-start flex">
                        <PersonTagNotDeletable key={coach.id} {...coach} />
                    </div>
                    
    
                </div>
                {/* Players Section */}
                <div className="self-stretch flex-col justify-start items-start flex">
                    <div className="self-stretch justify-start items-center inline-flex pt-5 pb-4 gap-2.5">
                        <div className="text-blue-800 text-2xl font-russoOne leading-normal">Players</div>
                        {isCoach && (
                            <div className="h-8 bg-blue-800 rounded-[10px] justify-center items-center flex" onClick={() => { setAddingPlayer(true); setAdditionModalOpen(true); }}>
                                <img src={`${process.env.PUBLIC_URL}/images/plus-square.svg`} alt="Add Player" />
                            </div>
                        )}
                    </div>
                    <div className="self-stretch flex-col justify-start items-start flex gap-3">
                        {players.map((player) => (
                            isCoach 
                            ? <PersonTag key={player.id} {...player} team={teamData.team_name} onDelete={deletePlayer} />
                            : <PersonTagNotDeletable key={player.id} {...player} team={teamData.team_name} />
                        ))}
                    </div>
                </div>
                {/* Extras Section */}
                <div className="self-stretch flex-col justify-start items-start flex pb-10">
                    <div className="self-stretch justify-start items-center inline-flex pt-5 pb-4 gap-2.5">
                        <div className="text-blue-800 text-2xl font-russoOne">Extra</div>
                        {isCoach && (
                            <div className="h-8 bg-blue-800 rounded-[10px] justify-center items-center flex" onClick={() => { setAddingPlayer(false); setAdditionModalOpen(true); }}>
                                <img src={`${process.env.PUBLIC_URL}/images/plus-square.svg`} alt="Add Extra" />
                            </div>
                        )}
                    </div>
                    <div className="self-stretch flex-col justify-start items-start flex gap-3">
                        {extras.map((extra) => (
                            isCoach 
                            ? <PersonTag key={extra.id} {...extra} team={teamData.team_name} onDelete={deleteExtra} />
                            : <PersonTagNotDeletable key={extra.id} {...extra} team={teamData.team_name} />
                        ))}
                    </div>
                </div>
                
                
                <PlayerAdditionModal 
                    isOpen={isAdditionModalOpen} 
                    closeModal={() => setAdditionModalOpen(false)} 
                    onSave={addUserToTeam}
                    isPlayer={addingPlayer}


                />

            </div>
    )
}


export default TeamManagementComponent;