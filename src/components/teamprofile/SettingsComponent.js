import { supabase } from '../../lib/helper/supabaseClient';
import PersonTag from '../PersonTag.js';
import RoleInput from '../RoleInput.js';
import useTeamData from '../../hooks/useTeamData';
import { useParams } from 'react-router-dom';
import LoadingPage from '../../pages/LoadingPage';

const SettingsComponent = () => {
    const { teamId, clubId } = useParams();
    const { roles, setRoles, teamData, loading} = useTeamData(teamId, clubId);
    
    

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
                team_id: teamId,
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
    

    if(loading)
        return LoadingPage();
    else
        return (
            <div className="w-full py-4 bg-white flex-col justify-start items-center gap-6 inline-flex">
                <div className="self-stretch py-2 flex-col justify-start items-start gap-6 flex">
                    <div className="self-stretch px-4 justify-start items-center gap-4 inline-flex">
                        <div className="text-blue-800 text-2xl font-russoOne leading-normal">Extra Roles</div>
                    </div>
                    <div className="self-stretch flex-col justify-start items-start gap-4 flex pl-4">
                        {roles.map((role) => (
                            <PersonTag key={role.id} {...role} team={teamData.team_name} onDelete={deleteRole} />        
                        ))}
                        <RoleInput onAdd={addRole} />
                    </div>
                </div>
            </div>
        )
}



export default SettingsComponent;