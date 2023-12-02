import React from 'react';
import { MapPinIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom';


const TeamProfileHeaderComponent = ({ clubData, teamData, teamSocialsData, userTeamIds, renderSocialIcon }) => {

    const navigate = useNavigate();

    const currentTeamIndex = userTeamIds.findIndex(id => id === teamData.id);

    const goToTeam = (index) => {
        console.log("Go to team:", userTeamIds)
        if (index >= 0 && index < userTeamIds.length) {
            navigate(`/team-profile/${clubData.id}/${userTeamIds[index]}`);
        }
    };

    return (
        <>
        
            <div className="justify-center items-center gap-[53px] flex">
                <img src={`${process.env.PUBLIC_URL}/images/arrow-left.svg`} alt="Left Arrow" onClick={() => goToTeam(currentTeamIndex - 1)} />
                <div className="text-neutral-300 font-interReg text-xl">{teamData.team_name}</div>
                <img src={`${process.env.PUBLIC_URL}/images/arrow-right.svg`} alt="Right Arrow" onClick={() => goToTeam(currentTeamIndex + 1)} />
            </div>
                <div className="self-stretch h-[258px] p-2 flex-col justify-start items-center gap-2 flex">
                    {clubData.picture ? (
                            <img className="w-[142px] object-cover overflow-hidden h-[142px] rounded-full border-3 border-white" src={clubData.picture} />

                        ) : (
                            <img className="w-[142px] object-cover overflow-hidden h-[142px] rounded-full border-3 border-white" src={process.env.PUBLIC_URL + "/images/no_user.png"} />
                        )
                            
                    }
                    <div className="flex-col justify-start items-center gap-1 flex">
                        <div className="text-center text-blue-800 text-3xl font-russoOne">{teamData.team_name}</div>
                        
                    </div>
                    <div className="justify-center items-center gap-4 inline-flex">
                        <div className="w-[177.12px] h-4 relative">
                            <div className="w-[15.87px] h-4 px-[1.74px] py-[0.45px] left-0 top-0 absolute flex-col justify-center items-center inline-flex">
                                <MapPinIcon className='h-6 w-6'></MapPinIcon>
                            </div>
                            { clubData.stadium ? (
                                <div className="w-[177px] h-[15px] left-[0.12px] top-0 absolute text-center text-neutral-300 text-xs font-interReg uppercase">{clubData.stadium}</div>
                                ) : (
                                <div className="w-[177px] h-[15px] left-[0.12px] top-0 absolute text-center text-neutral-300 text-xs font-interReg uppercase">No stadium</div>
                            )
                            }
                        </div>
                    </div>
                    <div className="w-28 justify-between items-start inline-flex">
                        {renderSocialIcon(teamSocialsData.facebook_handle, "Facebook", "https://facebook.com", "facebook")}
                        {renderSocialIcon(teamSocialsData.instagram_handle, "Instagram", "https://instagram.com", "instagram")}
                        {renderSocialIcon(teamSocialsData.x_handle, "Twitter", "https://twitter.com", "twitter")}
                    </div>
                </div>
        </>
    );
};

export default TeamProfileHeaderComponent;



