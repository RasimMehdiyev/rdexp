import { useState, useEffect } from 'react';
import { supabase } from '../lib/helper/supabaseClient';

const useEventData = (eventId) => {
    const [eventDetails, setEventDetails] = useState({});
    const [teamName, setTeamName] = useState('');
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [playersAttendance, setPlayersAttendance] = useState({});

    // Fetch event details from the 'event' table
    const fetchEventDetails = async () => {
        const { data, erroar } = await supabase
            .from('event')
            .select('*')
            .eq('id', eventId)
            .single();


        if (error) {
            throw error;
        }
        return data;
    };

    // Fetch the team name based on the team_id
    const fetchTeamName = async (teamId) => {
        let { data: team, error } = await supabase
            .from('team')
            .select('team_name')
            .eq('id', 1)
            .single();

            console.log('Team name', team);
        if (error) {
            throw error;
        }
        setTeamName(data ? data.team_name : '');
    };

    const fetchTeamPlayers = async (team) => {
        console.log(`Fetching players for team ID: ${team}`);
        const { data, error } = await supabase
            .from('team_users')
            .select(`
                user_id,
                users (id, full_name)
            `)
            .eq('team', team);
    
        if (error) {
            console.error('Error fetching team players:', error);
            throw error;
        }
    
        console.log('Team players data:', data);
        return data.map(teamUser => teamUser.users);
    };
    

    console.log('Fetched team players:', teamPlayers);

    const fetchAttendanceStatus = async (eventId) => {
        const { data, error } = await supabase
            .from('event_users')
            .select('user_id, is_attending')
            .eq('event_id', eventId);
    
        if (error) {
            throw error;
        }
    
        // Convert the array to an object with user_id as key and is_attending as value
        return data.reduce((acc, current) => {
            acc[current.user_id] = current.is_attending;
            return acc;
        }, {});
    };
    

    

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(`Fetching data for event ID: ${eventId}`);
                setLoading(true);
    
                const event = await fetchEventDetails();
                console.log('Event details fetched:', event);
                setEventDetails(event);
    
                if (event && event.team) {
                    const teamNameData = await fetchTeamName(event.team);
                    console.log('Team name fetched:', teamNameData);
                    setTeamName(teamNameData.team_name);
                    
                    const playersData = await fetchTeamPlayers(event.team);
                    console.log('Team players fetched:', playersData);
                    setTeamPlayers(playersData);
    
                    const attendanceStatuses = await fetchAttendanceStatus(eventId);
                    console.log('Attendance statuses fetched:', attendanceStatuses);
                    setPlayersAttendance(attendanceStatuses);
                }
            } catch (error) {
                console.error('Error fetching event data:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [eventId]);
    

    return {
        eventDetails,
        teamName,
        teamPlayers,
        playersAttendance, 
        loading,
        error,
    };
};

export default useEventData;
