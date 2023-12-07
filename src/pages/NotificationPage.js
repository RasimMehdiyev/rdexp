import React, { useState, useEffect } from 'react';
import {supabase} from '../lib/helper/supabaseClient';
import { useNavigate } from 'react-router-dom';
import LoadingPage from './LoadingPage';

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

    if (loading) {
        return ( <LoadingPage></LoadingPage>)
    } else {
        return (
        <div className='h-full w-full flex flex-col gap-4'>
            <div className='text-xl font-russoOne text-game-blue'>Team invites</div>
            <div className='flex flex-col gap-4'>
                {teamInvites ?
                    teamInvites.map((teamInvite) => (
                    <div key={teamInvite.id }>
                        <div className='flex flex-col gap-1'>
                            <div className='text-sm font-interReg'>{teamInvite.id}</div>
                            <div className='text-sm font-interReg'>{teamInvite.team_name}</div>
                            <div className='text-sm font-interReg'>{teamInvite.club_name}</div>
                        </div>
                        <div className='flex flex-row gap-8'>
                            <button>Accept</button>
                            <button>Decline</button>
                        </div>
                    </div>
                    )) :
                    (<div className='text-sm font-interreg'>You have no team invite</div>)
                }
                
            </div>
            <div className='text-xl font-russoOne text-game-blue'>Event invites</div>
            <div className='flex flex-col gap-4'>
                {eventInvites ?                    
                    eventInvites.map((eventInvite) => (
                        <div key={eventInvite.id}>                        
                        <div className='flex flex-col gap-1 bg-sn-bg-light-blue rounded-md'>                            
                            <div className='text-sm font-interReg'>{eventInvite.title}</div>
                                <div className='text-sm font-interReg'>{eventInvite.datetime}</div>
                                <div className='text-sm font-interReg'>{eventInvite.location}</div>
                                <div className='text-sm font-interReg'>{eventInvite.type}</div>
                                <div className='text-sm font-interReg'>{eventInvite.team_name}</div>
                                {eventInvite.position_name &&
                                    <div className='text-sm font-interReg'>{eventInvite.position_name}</div>
                                }
                        </div>
                        <div className='flex flex-row gap-8'>
                            <button>Accept</button>
                            <button>Decline</button>
                        </div>
                        </div>
                    )
                    ) : (
                        <div className='text-sm font-interreg'>You have no event invite</div>
                    )
                }
                
            </div>
        </div>
    )
    }

    
}

export default NotificationPage;