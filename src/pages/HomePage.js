import { supabase } from "../lib/helper/supabaseClient";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogRocket, { sessionURL } from 'logrocket'
import amplitude from 'amplitude-js'
import EventCard from "../components/EventCard";
import React from 'react';
import LoadingPage from './LoadingPage';
import StickyMonthHeader from '../components/StickyMonthComponent';

const HomePage = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchedEvents, setFetchedEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isCoach, setIsCoach] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentMonth(entry.target.getAttribute('data-month'));
          }
        });
      },
      { threshold: 0.6 } // Adjust the threshold to when you want the month to switch
    );
  
    // Observe each month section
    document.querySelectorAll('.month-section').forEach((section) => {
      observer.observe(section);
    });
  
    // Clean up observer
    return () => observer.disconnect();
  }, []);
  


  const getEvents = async (uuid) => {
    try {
      let { data: userTableIdAndRole, error: tableIdError } = await supabase
        .from('users')
        .select('id, role_id')
        .eq("user_id", uuid)
        .single();
  
      console.log("This is the user table id and role");
      console.log(userTableIdAndRole);
  
      if (tableIdError) {
        console.error(tableIdError);
        return; // Stop execution if there's an error
      }
  
      if (!userTableIdAndRole) {
        console.warn("User table ID and role not available.");
        setFetchedEvents([]);
        return; // Stop execution if userTableIdAndRole is not defined
      }
  
      // Fetch team ID
      let { data: teamData, error: teamError } = await supabase
        .from('team_users')
        .select('team_id')
        .eq("user_id", userTableIdAndRole.id);
  
      console.log("this is the team of the user");
      console.log(teamData);
  
      if (teamError) {
        console.error(teamError);
        return; // Stop execution if there's an error
      }

      // Set isCoach based on user's role
      setIsCoach(userTableIdAndRole.role_id === 1);
      
      if (userTableIdAndRole.role_id === 1) {
        if (Array.isArray(teamData) && teamData.length > 0) {
          let { data, error } = await supabase
            .rpc('get_event_attendees_team', {
              team_ids: teamData.map(team => team.team_id)
            });
  
          if (error) console.error(error);
          else console.log("event data: ", data);
          setFetchedEvents(data);
        } else {
          console.warn("User is not part of any team");
          setFetchedEvents([]);
        }
      } else {
        let { data, error } = await supabase
          .rpc('get_event_attendees', {
            user_uuid: uuid
          });
        console.log("Events: ");
        if (error) console.error(error);
        else console.log("event data: ", data);
        setFetchedEvents(data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const openCard = (index,event) =>{
    event.preventDefault();
    console.log("open card");
    console.log(index);
    navigate('/event-overview/' + index);
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await supabase.auth.getUser();
        console.log("User: ")
        console.log(user);
        if (user.data.user) {
          setUserData(user.data.user)
          LogRocket.identify(user.data.user.id, {
            name: userData.full_name,
            email: userData.email,
            role: userData.role,
          });

          LogRocket.getSessionURL(sessionURL => {
            amplitude.getInstance().logEvent('LogRocket', { 'sessionURL': sessionURL });
          });
          console.log("SessionURL:", sessionURL);

          await getEvents(user.data.user.id);

        } else {
          navigate('/auth');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Stop loading regardless of the outcome
      }
    }

    console.log("Home page fetches starting now");
    fetchData();

  }, [navigate]);
  console.log("fetched events", fetchedEvents);


  const transformedEvents = fetchedEvents.map(event => {
    // Extracting date and time from the dateTime string
    const eventDateTime = new Date(event.datetime);
    const date = eventDateTime.toISOString().split('T')[0];
    const time = eventDateTime.toTimeString().slice(0, 5); // Extracting hh:mm
  
    // Creating a new event object with the desired structure
    return {
      type: event.type.toLowerCase(), // Convert to lowercase as per your example
      eventName: event.title,
      teamName: event.team_name,
      eventTime: time,
      location: event.location,
      id: event.event_id,
      attendance: event.total_attendees.toString(), // Assuming total_attendees is a number
      number_invitation: "20", // You can set this value as needed
      date: date,
    };
  });

  // Organize events by month and then by day
const organizedEvents = transformedEvents.reduce((acc, event) => {
  // Check if the event has a valid dateTime property
  const month = event.date.slice(0, 7); // Extracting yyyy-mm to represent a month
  const day = event.date.slice(8, 10); // Extracting dd to represent a day

  if (!acc[month]) {
    acc[month] = {};
  }

  if (!acc[month][day]) {
    acc[month][day] = [];
  }

  acc[month][day].push(event);

  return acc;
}, {});

const [filter, setFilter] = useState('all'); // Default filter is 'all'
const [showFilterOptions, setShowFilterOptions] = useState(false);

const handleFilterChange = (newFilter) => {
  setFilter(newFilter);
  setShowFilterOptions(false); // Hide the filter options after selecting an option
};
  if (loading) {
    return <LoadingPage />;
  } else
  // Check if fetchedEvents is empty
  if (fetchedEvents.length == 0) {
    return (
      
      <div className="mt-[-80px] bg-almostwhite">
        {isCoach && ( 
          <div className="flex flex-col justify-center items-center h-screen font-Inter text-sn-main-orange">
            <p className="text-3xl font-bold mb-1">You haven&apos;t</p>
            <p className="text-3xl font-bold mb-1">added any events yet.</p>
            <p className="text-xl mt-2">When you do, they will</p>
            <p className="text-xl">be displayed here.</p>

            {/* Plus Button */}
            <div className="mt-5">
              <button
                className="bg-sn-light-orange text-white rounded-10px  text-3xl shadow-sm flex items-center justify-center"
                style={{ width: '60px', height: '60px' }}  
                onClick={() => navigate('/game/create')}
              >
                +
              </button>
            </div>   
          </div>
        )}
        {!isCoach &&(
          <div className="flex flex-col justify-center items-center h-screen font-Inter text-sn-main-orange">
            <p className="text-3xl font-bold mb-1">There are no</p>
            <p className="text-3xl font-bold mb-1">events yet.</p>
            <p className="text-xl mt-2">When your coach adds events</p>
            <p className="text-xl">be displayed here.</p>
          </div>
        )}
      </div>


    )
  }

else {
  return (
    <div className="flex flex-col  items-center bg-almostwhite h-screen">
      {/* Upcoming Events */}
      {Object.entries(organizedEvents).map(([month, days]) => (
        <div key={month} className="font-russoOne text-sn-main-blue month-section">
          <div></div>
          <StickyMonthHeader currentMonth={new Date(month).toLocaleString('en-US', { month: 'long' })} />
          {Object.entries(days).map(([day, dayEvents]) => (
            <div key={day}>
              {/* Check if there are events for this day based on the filter */}
              {dayEvents.some((event) => filter === 'all' || event.type === filter) && (
              
                <p className="text-md font-interBold text-gray-700 ml-2">{`${new Date(`${month}-${day}`).toLocaleString('en-US', { weekday: 'long' })} ${day}`}</p>
              )}
              <div className="event-container">
                {dayEvents
                  .filter((event) => filter === 'all' || event.type === filter)
                  .sort((a, b) => (a.dateTime != null && b.dateTime != null ? a.dateTime.localeCompare(b.dateTime) : 0))
                  .map((event, index) => (
                    <div key={index} onClick={(e) => openCard(event.id , e)} className="event-card">
                      <EventCard
                        type={event.type}
                        eventName={event.eventName}
                        teamName={event.teamName}
                        eventTime={event.eventTime}
                        location={event.location}
                        attendance={event.attendance}
                        number_invitation={event.number_invitation}
                      />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ))}

        
        {/* Plus Button */}
        
        {isCoach && (
          <div className="fixed top-[69px] right-[65px] z-20">
            <button
              className="bg-sn-light-orange text-white rounded-10px  text-3xl shadow-sm flex items-center justify-center"
              style={{ width: '36px', height: '36px' }}  
              onClick={() => navigate('/game/create')}
            >
              +
            </button>
          </div>
        )}

        

        {/* Filter Button */}
        <div className="fixed top-[69px] right-[20px] z-20">
          <button
            className="bg-sn-light-orange text-white rounded-10px text-3xl p-[4px] shadow-sm flex items-center justify-center"
            style={{ width: '36px', height: '36px' }}
            onClick={() => setShowFilterOptions(!showFilterOptions)}
          >
            <img
              src={process.env.PUBLIC_URL + "/images/filter.svg"}
              alt="Filter Icon"
              style={{filter: 'brightness(0) invert(1)' }}
            />
          </button>
          {/* Filter Options */}
          {showFilterOptions && (
            <div className="absolute mt-1 right-[-3px] bg-white rounded-md shadow-md p-4 bg-[#DDD] w-[140px]">
              <p
                className={`cursor-pointer ${filter === 'all' ? 'text-sn-light-orange font-bold' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                All
              </p>
              <p
                className={`cursor-pointer ${filter === 'practice' ? 'text-sn-light-orange font-bold' : ''}`}
                onClick={() => handleFilterChange('practice')}
              >
                Practice
              </p>
              <p
                className={`cursor-pointer ${filter === 'game' ? 'text-sn-light-orange font-bold' : ''}`}
                onClick={() => handleFilterChange('game')}
              >
                Game
              </p>
              <p
                className={`cursor-pointer ${filter === 'team building' ? 'text-sn-light-orange font-bold' : ''}`}
                onClick={() => handleFilterChange('team building')}
              >
                Team building
              </p>

            </div>
          )}
        </div>


      </div>
    );
  }
};

export default HomePage;
