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
        <div className='flex-col gap-6'>
            <div className='text-xl font-russoOne text-game-blue'>Team invites</div>
            <div className='flex-col gap-4'>
                {teamInvites && teamInvites.map((teamInvite) => (
                    <div key={teamInvite.id } className='flex-col gap-4'>
                        <div className='text-sm font-interReg'>{teamInvite.id}</div>
                        <div className='text-sm font-interReg'>{teamInvite.title}</div>
                        <div className='text-sm font-interReg'>{teamInvite.datetime}</div>
                    </div>       
                )
                )}
            </div>
            <div className='text-xl font-russoOne text-game-blue'>Event invites</div>
            <div className='flex-col gap-4'>
                {eventInvites && eventInvites.map((eventInvite) => (
                    <div key={eventInvite.id } className='flex-col gap-4'>
                        <div className='text-sm font-interReg'>{eventInvite.id}</div>
                        <div className='text-sm font-interReg'>{eventInvite.title}</div>
                        <div className='text-sm font-interReg'>{eventInvite.datetime}</div>
                    </div>       
                )
                )}
            </div>
        </div>
    )
}

export default NotificationPage;