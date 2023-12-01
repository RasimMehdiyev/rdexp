import React, { useState } from 'react';
import { supabase } from '../../lib/helper/supabaseClient';
import PlayerDeletionModal from '../PlayerDeletionModal.js';
import PersonTag from '../PersonTag.js';
import PlayerAdditionModal from '../PlayerAdditionModal.js';
import { XMarkIcon } from '@heroicons/react/24/outline';
import PersonTagNotDeletable from '../PersonTagNotDeletable.js';
import TeamProfilePage from '../../pages/TeamProfilePage.js';   

const TeamManagementComponent = ({ coach, players, extras, setPlayers, setExtras}) => {
    
    const [isAdditionModalOpen, setAdditionModalOpen] = useState(false);
    const [addingPlayer, setAddingPlayer] = useState(false);


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
                    {players.map((player, index) => (
                        <PersonTag key={index} {...player} onDelete={deletePlayer} />        
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
            {extras.map((extras, index) => (
                        <PersonTag key={index} {...extras} onDelete={deleteExtra} />        
                    ))}              
            </div>
            
            <PlayerAdditionModal 
                isOpen={isAdditionModalOpen} 
                closeModal={() => setAdditionModalOpen(false)} 
                isPlayer={addingPlayer} 
            />

        </div>
    )
}


export default TeamManagementComponent;