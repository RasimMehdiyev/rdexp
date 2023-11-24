import React from 'react';

const EventCard = ({ type, eventName, teamName, eventTime, location, attendance, number_invitiation }) => {
  // Define a function to determine the background color based on the type
  const getBackgroundColor = () => {
    switch (type) {
      case 'practice':
        return 'bg-practice-orange';
      case 'game':
        return 'bg-game-blue'; // Replace with the desired color for type2
      case 'teambuilding':
        return 'bg-teambuilding-green'; // Replace with the desired color for type3
      default:
        return 'bg-practice-orange'; // Default color if type is not recognized
    }
  };

  return (
    <div className={`w-[368px] h-[197px] p-4 rounded-[10px] mt-4 flex-col justify-start items-start gap-[25px] inline-flex drop-shadow-[0_5px_8px_rgba(0,0,0,0.3)] ${getBackgroundColor()}`}>
      {/* Event Name Section */}
      <div className="title justify-start items-end gap-[5px]">
        <div className="team-name h-[26px] text-white text-xl font-bold font-['Inter'] mb-2">{teamName}: {eventName}</div>

      </div>
      

      {/* Details Section */}
      <div className="details-section flex-col justify-start items-start gap-3 flex mt-auto w-full">
        <div className="attendees-count flex items-center gap-1.5">
          <img
            className="w-[22px] h-[23px] relative mb-2"
            src={process.env.PUBLIC_URL + "/images/user-check.svg"}
          />
          <div className="attendence w-[80px] h-[30px] text-white text-[15px] font-extralight font-['Inter'] whitespace-nowrap">{attendance}/{number_invitiation}</div>
        </div>
        {/* Location Section */}
        <div className="location-section inline-flex gap-1.5 w-full">
          <div className="w-6 h-6 px-[2.62px] py-[0.67px] justify-center items-center flex">
            <img
              className="w-[22px] h-[23px] relative mb-1"
              src={process.env.PUBLIC_URL + "/images/pin.svg"}
            />
          </div>
          <div className="location w-full h-[30px] text-white text-[15px] font-extralight font-['Inter']">{location}</div>
        </div>

        {/* Time and Attendees Section */}
        <div className="time-attendees-section flex  items-center w-full">
          <div className="time-section flex items-center gap-1.5">
            <img
              className="w-[22px] h-[23px] relative mb-2"
              src={process.env.PUBLIC_URL + "/images/clock.svg "}
            />
            <div className="event-time w-[80px] h-[30px] text-white text-[15px] font-extralight font-['Inter'] whitespace-nowrap">{eventTime}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
