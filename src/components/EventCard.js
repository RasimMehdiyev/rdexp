import React from 'react';

const EventCard = ({ type, eventName, teamName, eventTime, location, attendance, number_invitation, date}) => {
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

  // Define a function to get the appropriate image based on the type
  const getTypeImage = () => {
    switch (type) {
      case 'practice':
        return 'practice.svg';
      case 'game':
        return 'game.svg';
      case 'teambuilding':
        return 'teambuilding.svg';
      default:
        return 'practice.svg'; // Replace with the default image if type is not recognized
    }
  };

  // Render the image inline with the event name
  const typeImage = getTypeImage();

  return (
    <div className={`w-[368px] p-4 rounded-[10px] mt-1 mb-4 flex-col justify-start items-start gap-[10px] inline-flex drop-shadow-[0_5px_8px_rgba(0,0,0,0.3)] ${getBackgroundColor()}`}>
      {/* Event Name Section */}
      <div className="title justify-start items-end">
        <div className="team-name text-white text-xl font-bold font-['Inter']">
          <img
            className="w-[25px] h-[26px] relative mr-4 inline-block"
            src={process.env.PUBLIC_URL + `/images/${typeImage}`}
            alt={type}
            style={{ filter: 'brightness(0) invert(1)', top: '-2px' }} // Add this style for white color
          />
          {eventName}
        </div>
      </div>

      {/* Details Section */}
      <div className="details-section flex-col justify-start items-startflex w-full relative">
        {/* Location Section */}
        <div className="location-section inline-flex gap-1.5 w-full">
          <div className="w-6 h-6 px-[2.62px] py-[0.67px] justify-center items-center flex">
            <img
              className="w-[22px] h-[23px] relative mb-2"
              src={process.env.PUBLIC_URL + "/images/pin.svg"}
              style={{left:'-1px'}}
            />
          </div>
          <div className="location text-white text-[15px] font-extralight font-['Inter']">{location}</div>
        </div>

        {/* Time and Attendees Section */}
        <div>
          <div className="time-attendees-section flex items-center w-full">
            <div className="time-section flex items-center gap-1.5">
              <img
                className="w-[22px] h-[23px] relative mb-2"
                src={process.env.PUBLIC_URL + "/images/clock.svg "}
              />
              <div className="event-time text-white text-[15px] font-extralight font-['Inter'] whitespace-nowrap">
                {eventTime}
              </div>
            </div>
          </div>
          <div className="attendees-count flex items-center gap-1.5">
            <img
              className="w-[22px] h-[23px] relative mb-2"
              src={process.env.PUBLIC_URL + "/images/user-check.svg"}
              style={{left:'1px'}}
            />
            <div className="teamname text-white text-[15px]  font-['Inter'] whitespace-nowrap font-bold">{teamName}: </div>
            <div className="attendence text-white text-[15px] font-extralight font-['Inter'] whitespace-nowrap">
              {attendance}/{number_invitation}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
