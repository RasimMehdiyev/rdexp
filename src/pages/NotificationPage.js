import React, { useState, useEffect } from 'react';
import {supabase} from '../lib/helper/supabaseClient';
import {useNavigate} from 'react-router-dom';

const NotificationPage = () => {
    const [teamInvites, setTeamInvites] = useState([]);
    const [eventInvites, setEventInvites] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const userResponse = await supabase.auth.getUser();
                console.log("User:", userResponse);
                const user = userResponse.data.user;
                
                if (user) {                     
                    let { teamInviteData, teamInviteError } = await supabase
                        .rpc('get_team_user_invites', {
                            param_user_id: user.id
                        })
                    if (teamInviteError) console.error(teamInviteError)
                    else {
                        console.log("team invites: ", teamInviteData);
                        setTeamInvites(teamInviteData);
                    }
                    
                    let { data: eventUserInvites, eventUserInvitesError } = await supabase                    
                        .rpc('get_user_events', {
                            param_user_id: user.id
                        })
                    if (eventUserInvitesError) console.error(eventUserInvitesError)
                    else {
                        console.log("event invites: ", eventUserInvites);
                        setEventInvites(eventUserInvites);
                    }
                } else {
                    navigate("/auth");
                }

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