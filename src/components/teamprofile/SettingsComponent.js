import RoleAdditionModal from '../RoleAdditionModal.js';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { supabase } from '../../lib/helper/supabaseClient';
import PersonTag from '../PersonTag.js';
import RoleInput from '../RoleInput.js';

const SettingsComponent = ({ roles, setRoles, teamId }) => {
    const [isRoleModalOpen, setRoleModalOpen] = useState(false);
    
    

const deleteRole = async (id) => {
    try {
        console.log(id)
        const { data, error } = await supabase
            .from('team_extraroles') 
            .delete()
            .match({ id }); 

        if (error) {
            throw error;
        }
        setRoles((currentRoles) => currentRoles.filter(role => role.id !== id));
    } catch (error) {
        console.error('Error deleting role:', error);
    }
};

    const addRole = async (role) => {
        try {
            // Create the new role object to be sent to the database
            const newRole = {
                
                team_id: teamId,
                role_title: role,
                // Add other role properties as needed
            };
    
            // Insert the new role into your Supabase 'team_extraroles' table
            const { data, error } = await supabase
                .from('team_extraroles')
                .insert([newRole]);
    
            if (error) {
                throw error;
            }
    
            // If the database insert is successful, update the local state
            setRoles(roles => [...roles, { 
                id: 600,
                name: role, 
                team: 'U(21)',
                isPlayer: false, 
                isMember: true,  
            }]);
            
            console.log('Role added successfully:', data);
        } catch (error) {
            console.error('Error adding role:', error);
        }
    };
    

    return (
        <div className="w-full py-4 bg-white flex-col justify-start items-center gap-6 inline-flex">
            <div className="self-stretch py-2 flex-col justify-start items-start gap-6 flex">
                <div className="self-stretch px-4 justify-start items-center gap-4 inline-flex">
                    <div className="text-blue-800 text-2xl font-russoOne leading-normal">Extra Roles</div>
                </div>
                <div className="self-stretch flex-col justify-start items-start gap-4 flex pl-4">
                    {roles.map((roles, index) => (
                        <PersonTag key={index} {...roles} onDelete={deleteRole} />        
                    ))}
                    <RoleInput onAdd={addRole} />
                </div>
            </div>
        </div>
    )
}



export default SettingsComponent;