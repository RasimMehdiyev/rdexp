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
        const { data, error } = await supabase
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
        const { data, error } = await supabase
            .from('team')
            .select('team_name')
            .eq('id', teamId)
            .single();

        if (error) {
            throw error;
        }
        setTeamName(data ? data.team_name : '');
    };

    // Fetch players related to the team from the 'team_users' and 'users' tables
    const fetchTeamPlayers = async (teamId) => {
        const { data, error } = await supabase
            .from('team_users')
            .select(`
                user_id,
                users (id, full_name)
            `)
            .eq('team_id', teamId);

        if (error) {
            throw error;
        }

        // Map the data to extract user details
        return data.map(teamUser => teamUser.users);
    };

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
                setLoading(true);
    
                const event = await fetchEventDetails();
                setEventDetails(event);
    
                if (event && event.team_id) {
                    await fetchTeamName(event.team_id);
                    const playersData = await fetchTeamPlayers(event.team_id);
                    setTeamPlayers(playersData);
    
                    // Fetch attendance statuses for the event
                    const attendanceStatuses = await fetchAttendanceStatus(eventId);
                    // You'll need to add a new piece of state to hold this data
                    setPlayersAttendance(attendanceStatuses);
                }
    
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
    
        if (eventId) {
            fetchData();
        }
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
