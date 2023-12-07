import React, { useState, useEffect } from 'react';
import {supabase} from '../lib/helper/supabaseClient';
import {useNavigate} from 'react-router-dom';

const NotificationPage = () => {
    const [teamInvites, setTeamInvites] = useState([]);
    const [eventInvites, setEventInvites] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                
            } catch (error) {
                console.error(error);
                alert("Error happened, please reload the page.");
            } finally {
                setLoading(false);
            }
          
        };
        
        fetchData();
    }, []);

    return (
        <div>Notification Page</div>
    )
}

export default NotificationPage;