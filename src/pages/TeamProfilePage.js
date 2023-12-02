import AboutComponent from '../components/teamprofile/AboutComponent.js';
import SettingsComponent from '../components/teamprofile/SettingsComponent.js';
import TeamManagementComponent from '../components/teamprofile/TeamManagementComponent.js';
import TeamProfileHeaderComponent from '../components/teamprofile/TeamProfileHeaderComponent.js';
import { useParams } from 'react-router-dom';
import LoadingPage from './LoadingPage.js';
import useTeamData from '../hooks/useTeamData';
import { useState } from 'react';


const TeamProfilePage = () => {
    const { clubId, teamId } = useParams();
    const { userData, teamData, clubData, coach, teamSocialsData, roles, players, extras, loading, error } = useTeamData(teamId, clubId);
    const [tab, setTab] = useState(0);

    // Helper function to render social media icons
    const renderSocialIcon = (handle, type, urlPattern, imgName) => {
        if (!handle) return null;
        return (
            <a href={`${urlPattern}/${handle}`} target="_blank" rel="noopener noreferrer">
                <img src={`${process.env.PUBLIC_URL}/images/${imgName}.svg`} alt={type} />
            </a>
        );
    };

    // Conditional rendering based on tab selection
    const renderTabContent = () => {
        switch (tab) {
            case 0:
                return (
                    <AboutComponent/>
                );
            case 1:
                return (
                    <TeamManagementComponent/>
                );
            case 2:
                return (
                    <SettingsComponent/>
                );
            default:
                return null;
        }
    };
    
    if(loading) {
        return LoadingPage();
    }  
    else{
        return (
        <div className="w-screen h-screen py-4 bg-gradient-to-b from-indigo-100 via-white to-white flex-col justify-start items-center flex">
            <TeamProfileHeaderComponent
                clubData={clubData}
                teamData={teamData} 
                teamSocialsData={teamSocialsData} 
                renderSocialIcon={renderSocialIcon}
            />
            <Tabs tab={tab} onTabChange={setTab} />
                {renderTabContent()}
        </div>
        );
    }
};

const Tab = ({ isActive, label, onClick }) => {
    return (
      <div
        className="basis-1/3 flex justify-center items-center cursor-pointer"
        onClick={onClick}
      >
        <div className={`w-[85px] rounded-lg flex justify-center items-center ${isActive ? 'bg-indigo-100' : ''}`}>
          <div className={`text-center text-xl font-interReg ${isActive ? 'text-blue-800' : 'text-neutral-300'}`}>
            {label}
          </div>
        </div>
      </div>
    );
  };
  
  const Tabs = ({ tab, onTabChange }) => {
    return (
      <div className="w-full border-b border-orange-500 flex justify-between items-center py-2">
        <Tab isActive={tab === 0} label="About" onClick={() => onTabChange(0)} />
        <Tab isActive={tab === 1} label="Members" onClick={() => onTabChange(1)} />
        <Tab isActive={tab === 2} label="Settings" onClick={() => onTabChange(2)} />
      </div>
    );
  };
  

export default TeamProfilePage;