import React, { useState, useEffect } from 'react';
import {supabase} from '../lib/helper/supabaseClient';
import { useNavigate } from 'react-router-dom';
import LoadingPage from './LoadingPage';

const NotificationPage = () => {
    const [teamInvites, setTeamInvites] = useState([]);
    const [eventInvites, setEventInvites] = useState([]);
    const [tableUser, setTableUser] = useState();
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
                    let { data: tableUser, tableUserError } = await supabase
                        .from('users')
                        .select('id')
                        .eq('user_id', user.id)
                        .single()
                    if (tableUserError) console.error(tableUserError)
                    else {
                        console.log("table user: ", tableUser);
                        setTableUser(tableUser);
                    }

                    let { data: teamInviteData, teamInviteError } = await supabase
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

    const updateTeamInviteLoadingStatus = (id, loadingStatus) => {
        setTeamInvites(prevInvites => {
            return prevInvites.map(invite => {
                if (invite.id == id) {
                return { ...invite, loading: loadingStatus };
                }
                return invite;
            });
        });
    };

    const updateEventInviteLoadingStatus = (id, loadingStatus) => {
        setEventInvites(prevInvites => {
            return prevInvites.map(invite => {
                if (invite.id == id) {
                return { ...invite, loading: loadingStatus };
                }
                return invite;
            });
        });
    };

    const removeTeamInviteById = (id) => {
        const updatedInvites = teamInvites.filter((element) => element.id != id);
        // Optionally, you can set the state or update the array as needed
        setTeamInvites(updatedInvites);
        // console.log(updatedElements); // Log the updated array
    };

    const removeEventInviteById = (id) => {
        const updatedInvites = eventInvites.filter((element) => element.id != id);
        // Optionally, you can set the state or update the array as needed
        setEventInvites(updatedInvites);
        // console.log(updatedElements); // Log the updated array
    };

    const handleTeamInvite = async (id, team_id, isAccept) => {
        updateTeamInviteLoadingStatus(id, true);
        console.log("handling team invite:", id, isAccept);

        try {
            const { updateError } = await supabase
                .from('team_user_invite')
                .update({ accepted: isAccept })
                .eq('id', id)
            if (isAccept) {
                const { insertData, insertError } = await supabase
                .from('team_users')
                .insert([
                    { user_id: tableUser.id, team_id: team_id },
                ])
                .select()
                
                window.location.reload();
            }            
            updateTeamInviteLoadingStatus(id, false);
            removeTeamInviteById(id);
            
        } catch (error) {
            console.error(error);
            alert("Something wrong happened. If it persists, please kindly wait while the devs fix it");
            
            navigate('/notifications');
        }       
        
    }

    const handleEventInvite = async (id, isAccept) => {
        updateEventInviteLoadingStatus(id, true);
        console.log("handling event invite:", id, isAccept);

        const is_attending = isAccept ? "Accepted" : "Declined";
        try {
            const { updateData, error } = await supabase
            .from('event_users')
            .update({ is_attending: is_attending })
            .eq('id', id)
            .select()
            
            updateEventInviteLoadingStatus(id, false);
            removeEventInviteById(id);
        } catch (error) {
            console.error(error);
            alert("Something wrong happened. If it persists, please kindly wait while the devs fix it");
            
            navigate('/notifications');
        }
        
    }

    if (loading) {
        return ( <LoadingPage></LoadingPage>)
    } else {
        return (
        <div className='h-full w-full flex flex-col gap-4'>
            <div className='text-xl font-russoOne text-game-blue'>Team invites</div>
            <div className='flex flex-col gap-4'>
                {teamInvites.length > 0 ?
                    teamInvites.map((teamInvite) => (
                        <div key={teamInvite.id}>
                            {teamInvite.loading ? (<LoadingPage></LoadingPage>) :
                                (
                                <div>
                                    <div className='flex flex-col gap-1 bg-sn-bg-light-blue rounded-md'>
                                        <div className='text-sm font-interReg'>{teamInvite.team_name}</div>
                                        <div className='text-sm font-interReg'>{teamInvite.club_name}</div>
                                    </div>
                                    <div className='flex flex-row gap-8'>
                                        <button className='rounded-sm' onClick={() => handleTeamInvite(teamInvite.id, teamInvite.team_id, true)}>Accept</button>
                                        <button className='rounded-sm' onClick={() => handleTeamInvite(teamInvite.id, teamInvite.team_id, false)}>Decline</button>
                                    </div>
                                </div>
                                )
                            }
                        
                        </div>
                    )) :
                    (<div className='text-sm font-interreg'>You have no team invite</div>)
                }
                
            </div>
            <div className='text-xl font-russoOne text-game-blue'>Event invites</div>
            <div className='flex flex-col gap-4'>
                {eventInvites.length > 0 ?                    
                    eventInvites.map((eventInvite) => (
                        <div key={eventInvite.id}>
                            {eventInvite.loading ? (<LoadingPage></LoadingPage>) :
                                (
                                    <div>
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
                                        <button className='rounded-sm' onClick={() => handleEventInvite(eventInvite.id, true)}>Accept</button>
                                        <button className='rounded-sm' onClick={() => handleEventInvite(eventInvite.id, false)}>Decline</button>
                                    </div>
                                    </div>
                            )}                        
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