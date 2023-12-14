import React, { useState } from 'react';
import { UserGroupIcon } from '@heroicons/react/24/solid'
import ToggleSwitch from '../ToggleSwitch';

const EventCard = ({ type, eventName, teamName, eventTime, location, attendance, number_invitation, date }) => {



  const getBackgroundColor = () => {
    switch (type) {
      case 'practice':
        return 'bg-practice-orange';
      case 'game':
        return 'bg-game-blue';
      case 'tb':
        return 'bg-teambuilding-green';
      default:
        return 'bg-practice-orange';
    }
  };

  const getTypeImage = () => {
    switch (type) {
      case 'practice':
        return 'practice.svg';
      case 'game':
        return 'game.svg';
      case 'tb':
        return 'teambuilding.svg';
      default:
        return 'practice.svg';
    }
  };

  const typeImage = getTypeImage();

  return (
    <div className= "w-[360px]  rounded-[10px] mt-1 mb-4 ml-2 mr-2 flex-col bg-white justify-start items-start gap-[10px]  drop-shadow-[0_5px_5px_rgba(0,0,0,0.15)] ">
      <div className="title justify-start items-end">
        <div className={`team-name text-white text-xl font-bold font-['Inter'] mb-2 rounded-t-[10px] width-[100%] pl-2 pt-3 pb-3 ${getBackgroundColor()} `}>
            {type === 'team building' && (
              <img
                className="w-[25px] h-[26px] relative mr-4 inline-block"
                src={process.env.PUBLIC_URL + `/images/${typeImage}`}
                alt={type}
                style={{ filter: 'brightness(0) invert(1)', left: '4px' }}
              />
            )}
            {type !== 'team building' && (
              <img
                className="w-[25px] h-[26px] relative mr-4 inline-block ml-2"
                src={process.env.PUBLIC_URL + `/images/${typeImage}`}
                alt={type}
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            )}
            {eventName}
          </div>
          
        </div>
      <div className="details-section flex-col justify-start items-startflex w-full relative pl-4 pt-4 pb-4">
        <div className="location-section inline-flex gap-1.5 w-full">
          <div className="w-6 h-6 px-[2.62px] py-[0.67px] justify-center items-center flex">
            <img
              className="w-[17px] h-[17px] relative mb-2 text-[#485687]"
              src={process.env.PUBLIC_URL + "/images/pin.svg"}
              style={{ filter: '#485687', left: '-1px', top: '2px' }}
            />
          </div>
          <div className="location text-eventcard-text text-[15px] font-extralight font-['Inter']">{location}</div>
        </div>

        <div>
          <div className="time-attendees-section flex items-center w-full">
            <div className="time-section flex items-center gap-1.5">
              <img
                className="w-[17px] h-[17px] relative mb-2"
                src={process.env.PUBLIC_URL + "/images/clock.svg "}
                style={{ top: '2px' , left:'2px'}}
              />
              <div className="event-time text-eventcard-text text-[15px] font-extralight font-['Inter'] whitespace-nowrap">
                {eventTime}
              </div>
            </div>
          </div>
          <div className="attendees-count flex items-center gap-1.5">
            <img
              className="w-[17px] h-[17px] relative mb-2"
              src={process.env.PUBLIC_URL + "/images/team_card.svg"}
              style={{ left: '2px', top:'3px'}}

            />
            <div className="teamname text-eventcard-text text-[15px]  font-extralight font-['Inter'] whitespace-nowrap ">{teamName}: </div>
            <div className="attendence text-eventcard-text text-[15px] font-extralight font-['Inter'] whitespace-nowrap">
              {attendance}/{number_invitation}
            </div>
            <div className='absolute right-10'><ToggleSwitch/></div>
              
          </div>
        </div>       
        
        
      </div>
    </div>
  );
};

export default EventCard;
