import React, { useState } from 'react';
import { supabase } from '../../lib/helper/supabaseClient';
import PersonTag from '../PersonTag.js';
import PlayerAdditionModal from '../PlayerAdditionModal.js';
import PersonTagNotDeletable from '../PersonTagNotDeletable.js';
import useTeamData from '../../hooks/useTeamData';
import { useParams } from 'react-router-dom';
import LoadingPage from '../../pages/LoadingPage';


const TeamManagementComponent = () => {
    const { clubId, teamId } = useParams();
    const { teamData, coach, players, extras, setPlayers, setExtras, loading, findUserIdByName, findUserNumberById, findUserRoleById} = useTeamData(teamId, clubId);
    const [addingPlayer, setAddingPlayer] = useState(false);


    
    const [isAdditionModalOpen, setAdditionModalOpen] = useState(false);
    

    const addUserToTeam = async (name, isPlayer) => {
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
                team_id: teamId,
                user_id: userId,
            };

            const { data, error } = await supabase
                .from('team_users')
                .insert([newMember]);


            setPlayers(players => [...players, { 
                id: userId, 
                name: name,
                number: number,
                isPlayer: true, 
                isMember: true,  
            }]);
        } catch (error) {
            console.error('Error in adding user:', error);
            return "An error occurred while adding the player.";
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
    
    
    if(loading)
        return LoadingPage();
    else
        return (
            <div className="w-full py-4 bg-white flex-col justify-start items-center gap-6 inline-flex">
                {/* Coach Section */}
                <div className="self-stretch py-2 flex-col justify-start items-start gap-6 flex">
                    <div className="self-stretch px-4 justify-start items-center gap-4 inline-flex">
                        <div className="text-blue-800 text-2xl font-russoOne leading-normal">Coach</div>
                    </div>
                    <div className="self-stretch flex-col justify-start items-start gap-4 flex pl-4">
                    <PersonTagNotDeletable key={coach.id} {...coach} />
                    </div>
                    
    
                </div>
                {/* Players Section */}
                <div className="self-stretch py-2 flex-col justify-start items-start gap-6 flex">
                    <div className="self-stretch px-4 justify-start items-center gap-4 inline-flex">
                        <div className="text-blue-800 text-2xl font-russoOne leading-normal">Players</div>
                        <div className="h-8 bg-blue-800 rounded-[10px] justify-center items-center gap-2.5 flex" onClick={() => { setAddingPlayer(true); setAdditionModalOpen(true); }}>
                            <img src={`${process.env.PUBLIC_URL}/images/plus-square.svg`} alt="Add Player" />
                        </div>
                    </div>
                    <div className="self-stretch flex-col justify-start items-start gap-4 flex pl-4">
                        {players.map((player) => (
                            <PersonTag key={player.id} {...player} team={teamData.team_name} onDelete={deletePlayer} /> 
                        ))}
                    </div>
                </div>
                {/* Extras Section */}
                <div className="self-stretch px-4 justify-start items-center gap-4 inline-flex">
                    <div className="text-blue-800 text-2xl font-russoOne">Extra</div>
                    <div className="h-8 bg-blue-800 rounded-[10px] justify-center items-center gap-2.5 flex" onClick={() => { setAddingPlayer(false); setAdditionModalOpen(true); }}>
                        <img src={`${process.env.PUBLIC_URL}/images/plus-square.svg`} alt="Add Extra" />
                    </div>
                </div>
                <div className="self-stretch h-[103px] flex-col justify-start items-start gap-[19px] flex pl-4">                
                    {extras.map((extra) => (
                        <PersonTag key={extra.id} {...extra} team={teamData.team_name} onDelete={deleteExtra} />        
                    ))}              
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