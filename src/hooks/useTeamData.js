import { useState, useEffect } from 'react';
import { supabase } from '../lib/helper/supabaseClient';


const useTeamData = (teamId, clubId) => {
    const [userData, setUserData] = useState({});
    const [teamData, setTeamData] = useState({});
    const [clubData, setClubData] = useState({});
    const [coach, setCoach] = useState({});
    const [teamSocialsData, setTeamSocialsData] = useState({});
    const [roles, setRoles] = useState([]);
    const [players, setPlayers] = useState([]);
    const [extras, setExtras] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    const fetchUser = async (userId) => {
        const { data, error } = await supabase.from('users').select('*').eq('user_id', userId).single();
        if (error) throw error;
        return data;
    };

    const fetchTeam = async (teamId) => {
        const { data, error } = await supabase.from('team').select('*').eq('id', teamId).single();
        if (error) throw error;
        return data;
    };

    const fetchClub = async (clubId) => {
        const { data, error } = await supabase.from('club').select('*').eq('id', clubId).single();
        if (error) throw error;
        return data;
    };

    const fetchCoach = async (coachId) => {
        const { data, error } = await supabase.from('users').select('*').eq('id', coachId).single();
        if (error) throw error;
        return {
            name: data.full_name,
            isPlayer: false,
        };
    };

    const fetchTeamSocials = async (teamId) => {
        const { data, error } = await supabase.from('team_socials').select('*').eq('team_id', teamId).single();
        if (error) throw error;
        return data;
    };

    const fetchTeamRoles = async (teamId) => {
        const { data, error } = await supabase.from('team_extraroles').select('*').eq('team_id', teamId);
        if (error) throw error;
        return data.map(role => ({
            id: role.id,
            name: role.role_title,
            isPlayer: false,
            isMember: true,
        }));
    };

    const fetchTeamPlayers = async (teamId) => {
        const { data, error } = await supabase.from('team_users').select('user_id').eq('team_id', teamId);
        if (error) throw error;
        const userIds = data.map(player => player.user_id);
        const { data: players, error: playersError } = await supabase.from('users').select('*').eq('role_id', 2).in('id', userIds);
        if (playersError) throw playersError;
        return players.map(player => ({
            id: player.id,
            name: player.full_name,
            number: player.number,
            isPlayer: true,
            isMember: true,
        }));
    };

    const fetchExtras = async (teamId) => {
        const { data, error } = await supabase.from('team_users').select('user_id').eq('team_id', teamId);
        if (error) throw error;
        const userIds = data.map(player => player.user_id);
        const { data: extras, error: extrasError } = await supabase.from('users').select('*').eq('role_id', 3).in('id', userIds);
        if (extrasError) throw extrasError;
        return extras.map(extra => ({
            id: extra.id,
            name: extra.full_name,
            isPlayer: false,
            isMember: true,
        }));
    };


    
    const findUserIdByName = async (userName) => {
        try {
            console.log("User:", userName)
            const { data, error } = await supabase
                .from('users')
                .select('id')
                .ilike('full_name', userName); // Use ilike for case-insensitive match
    
            if (error) throw error;
    
            if (data && data.length === 1) {
                return data[0].id;
            } else {
                console.log('No user or multiple users found with this name.');
                return null;
            }
        } catch (error) {
            console.error('Error finding user ID by name:', error);
            return null;
        }
    };
    
    
    

    const findUserNumberById = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('number') // Replace 'phone_number' with your actual column name
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data ? data.number : null; // Adjust the property name as per your schema
        } catch (error) {
            console.error('Error finding user number by ID:', error);
            return null;
        }
    };

    const findUserRoleById = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('role_id') // Replace 'phone_number' with your actual column name
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data ? data.role_id : null; // Adjust the property name as per your schema
        } catch (error) {
            console.error('Error finding user role by ID:', error);
            return null;
        }
    };

    
    useEffect(() => {
        if (!teamId || !clubId) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const userResponse = await supabase.auth.getUser();
                const userId = userResponse.data.user.id;

                const [userData, teamData, clubData] = await Promise.all([
                    fetchUser(userId),
                    fetchTeam(teamId),
                    fetchClub(clubId),
                ]);

                setUserData(userData);
                setTeamData(teamData);
                setClubData(clubData);

                const coachData = await fetchCoach(teamData.coach_id);
                setCoach(coachData);

                const [teamSocialsData, rolesData, playersData, extrasData] = await Promise.all([
                    fetchTeamSocials(teamId),
                    fetchTeamRoles(teamId),
                    fetchTeamPlayers(teamId),
                    fetchExtras(teamId)
                ]);

                setTeamSocialsData(teamSocialsData);
                setRoles(rolesData);
                setPlayers(playersData);
                setExtras(extrasData);

            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [teamId, clubId]);

    return {userData, setUserData, teamData, setTeamData, clubData, setClubData, coach, setCoach, teamSocialsData, setTeamSocialsData, roles, setRoles, players, setPlayers, extras, setExtras, loading, error, findUserIdByName, findUserNumberById, findUserRoleById};
};

export default useTeamData;