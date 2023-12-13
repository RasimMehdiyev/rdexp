import { supabase } from '../../lib/helper/supabaseClient';
import PersonTag from '../PersonTag.js';
import PersonTagNotDeletable from '../PersonTagNotDeletable.js';
import RoleInput from '../RoleInput.js';
const SettingsComponent = ( {roles, setRoles, teamData, isCoach}) => {  
    
    

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
            const newRole = {
                team_id: teamData.id,
                role_title: role,
            };
            const { data, error } = await supabase
                .from('team_extraroles')
                .insert([newRole])
                .select();
            if (error) {
                throw error;
            }
            setRoles(roles => [...roles, { 
                id: data[0].id,
                name: role, 
                isPlayer: false, 
                isMember: true  
            }]);
        } catch (error) {
            console.error('Error adding role:', error);
        }
    };
    return (
        <div className="w-full pl-5 pr-5 flex-col justify-start items-start inline-flex">
            <div className="self-stretch flex-col justify-start items-start flex">
                <div className="self-stretch justify-start items-center gap-4 inline-flex pt-5 pb-4">
                    <div className="text-blue-800 text-2xl font-russoOne leading-normal">Extra Roles</div>
                </div>
                <div className="self-stretch flex-col justify-start items-start gap-3 flex">
                    {roles.map((role) => (
                        isCoach 
                        ? <PersonTag key={role.id} {...role} team={teamData.team_name} onDelete={deleteRole} />
                        : <PersonTagNotDeletable key={role.id} {...role} team={teamData.team_name} />
                    ))}
                    {isCoach && <RoleInput onAdd={addRole} />}
                </div>
            </div>
        </div>
    );
}



export default SettingsComponent;