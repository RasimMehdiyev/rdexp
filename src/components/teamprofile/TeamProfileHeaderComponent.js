import React from 'react';
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
          {/* Navigation arrows and team name */}
          <div className="items-center gap-[53px] flex">
            <img src={`${process.env.PUBLIC_URL}/images/arrow-left.svg`} alt="Left Arrow" onClick={() => goToTeam(currentTeamIndex - 1)} />
            <div className="text-neutral-300 font-interReg text-xl">{teamData.team_name}</div>
            <img src={`${process.env.PUBLIC_URL}/images/arrow-right.svg`} alt="Right Arrow" onClick={() => goToTeam(currentTeamIndex + 1)} />
          </div>
      
          {/* Main content area */}
          <div className="pt-8 pb-5 flex-col items-center gap-5 flex">
            {/* Club picture */}
            {clubData.picture ? (
              <img className="w-[142px] object-cover overflow-hidden h-[142px] rounded-full border-4 bg-gray-100 border-white" src={clubData.picture} />
            ) : (
              <img className="w-[142px] object-cover overflow-hidden h-[142px] rounded-full border-4 bg-gray-100 border-white" src={process.env.PUBLIC_URL + "/images/no_user.png"} />
            )}
      
            {/* Team name display */}
            <div className="flex-col justify-start items-center gap-1 flex">
              <div className="text-center text-blue-800 text-3xl font-russoOne">{teamData.team_name}</div>
            </div>
      
            {/* Stadium information */}
            <div>
                {clubData.stadium ? (
                    <div className="text-center text-neutral-300 text-xs font-interReg uppercase">{clubData.stadium}</div>
                ) : (
                    <div className="text-center text-neutral-300 text-xs font-interReg uppercase">No stadium</div>
                )}
                {clubData.location ? (
                    <div className="text-center text-neutral-300 text-xs font-interReg uppercase">{clubData.location}</div>
                ) : (
                    <div className="text-center text-neutral-300 text-xs font-interReg uppercase">No location</div>
                )}
            </div>
            
      
            {/* Social media links */}
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



