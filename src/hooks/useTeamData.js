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
    const [isCoach, setIsCoach] = useState(false);
    const [userTeamIds, setUserTeamIds] = useState([]);


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
        try {
            const { data, error } = await supabase
                .from('team_socials')
                .select('*')
                .eq('team_id', teamId);
            if (error) {
                throw error;
            }
            if (data && data.length > 0) {
                return data[0];
            } else {
                return {
                    facebook_handle: null,
                    instagram_handle: null,
                    twitter_handle: null,
                };
            }
        } catch (error) {
            console.error('Error fetching team socials:', error);
            throw error;
        }
    };
    
    

    const fetchTeamRoles = async (teamId) => {
        try {
            const { data, error } = await supabase
                .from('team_extraroles')
                .select('*')
                .eq('team_id', teamId);
    
            if (error) {
                throw error;
            }
            return data.map(role => ({
                id: role.id,
                name: role.role_title,
                isPlayer: false,
                isMember: true,
            }));
        } catch (error) {
            console.error('Error fetching team roles:', error);
            throw error;
        }
    };
    

    const fetchTeamPlayers = async (teamId) => {
        try {
            const { data, error } = await supabase
                .from('team_users')
                .select('user_id')
                .eq('team_id', teamId);
    
            if (error) throw error;
            const userIds = data.map(player => player.user_id);
            const { data: players, error: playersError } = await supabase
                .from('users')
                .select('*')
                .eq('role_id', 2)
                .in('id', userIds);
    
            if (playersError) throw playersError;
            return players.map(player => ({
                id: player.id,
                name: player.full_name,
                number: player.number,
                isPlayer: true,
                isMember: true,
            }));
        } catch (error) {
            console.error('Error fetching team players:', error);
            throw error;
        }
    };
    

    const fetchExtras = async (teamId) => {
        try {
            const { data, error } = await supabase
                .from('team_users')
                .select('user_id')
                .eq('team_id', teamId);
    
            if (error) throw error;
        
            const userIds = data.map(extra => extra.user_id);
            const { data: extras, error: extrasError } = await supabase
                .from('users')
                .select('*')
                .eq('role_id', 3)
                .in('id', userIds);

            if (extrasError) throw extrasError;
            return extras.map(extra => ({
                id: extra.id,
                name: extra.full_name,
                isPlayer: false,
                isMember: true,
            }));
        } catch (error) {
            console.error('Error fetching team extras:', error);
            throw error;
        }
    };
    

    const fetchUserTeamIds = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('team_users')
                .select('team_id')
                .eq('user_id', userId);

            if (error) throw error;
            return data.map(item => item.team_id);
        } catch (error) {
            console.error('Error fetching user team IDs:', error);
            return [];
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

                const userTeams = await fetchUserTeamIds(userData.id); // Fetch user's team IDs
                setUserTeamIds(userTeams)
                

                const [teamSocialsData, roles, players, extras] = await Promise.all([
                    fetchTeamSocials(teamId),
                    fetchTeamRoles(teamId),
                    fetchTeamPlayers(teamId),
                    fetchExtras(teamId)
                ]);

                setTeamSocialsData(teamSocialsData);
                setRoles(roles);
                setPlayers(players);
                setExtras(extras);
                setIsCoach(teamData.coach_id === userData.id);
                

            } catch (error) {
                setError(error);
                console.error('Error fetching team data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [teamId, clubId]);

    return {userData, setUserData, teamData, setTeamData, clubData, setClubData, coach, setCoach, teamSocialsData, setTeamSocialsData, roles, setRoles, players, setPlayers, extras, setExtras, isCoach, setIsCoach, userTeamIds, loading, setLoading, error};
};

export default useTeamData;