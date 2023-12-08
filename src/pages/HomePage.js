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
    let { data: userTableIdAndRole, error: tableIdError } = await supabase
      .from('users')
      .select('id, role_id')
      .eq("user_id", uuid)
      .single();
  
    console.log("This is the user table id and role");
    console.log(userTableIdAndRole);
  
    // Fetch team ID
    let { data: teamData, error: teamError } = await supabase
      .from('team_users')
      .select('team_id')
      .eq("user_id", userTableIdAndRole.id);
  
    console.log("this is the team of the user");
    console.log(teamData);
  
    if (tableIdError || teamError) {
      console.error(tableIdError);
      console.error(teamError);
    } else {
      if (userTableIdAndRole.role_id == 1) {
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
    }
  };
  

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

  // Check if fetchedEvents is empty
  if (fetchedEvents === undefined || fetchedEvents === null) {
    return (
      <div className="mt-[-80px]">
        <div className="flex flex-col justify-center items-center h-screen font-Inter text-sn-main-orange">
          <p className="text-3xl font-bold mb-1">You haven&apos;t</p>
          <p className="text-3xl font-bold mb-1">added any events yet.</p>
          <p className="text-xl mt-2">When you do, they will</p>
          <p className="text-xl">be displayed here.</p>
        </div>
        
        {/* Button Container */}
        <div className="fixed top-20 right-7">
          {/* Plus Button */}
          <button
            className="bg-sn-light-orange text-white rounded-10px p-4 text-3xl shadow-md border-[3px] border-white flex items-center justify-center"
            style={{ width: '60px', height: '60px' }}  
            onClick={() => console.log('Button clicked')}
          >
            +
          </button>
        </div>
      </div>

    )
  }

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
    return <LoadingPage />; // You can replace this with any loading spinner or indicator
  } else {
    return (
      
      <div className="flex flex-col justify-center items-center">
        {/* Upcoming Events */}
        {Object.entries(organizedEvents).map(([month, days]) => (
          <div key={month} className="font-russoOne text-sn-main-blue month-section">
            <div></div>
            <StickyMonthHeader currentMonth={new Date(month).toLocaleString('en-US', { month: 'long' })} />
            {/* <h2 className="text-4xl font-bold">{new Date(month).toLocaleString('default', { month: 'long' })}</h2> */}
            {Object.entries(days).map(([day, dayEvents]) => (
              <div key={day}>
                <p className="text-md font-interBold text-gray-700 ml-2">{`${new Date(`${month}-${day}`).toLocaleString('en-US', { weekday: 'long' })} ${day}`}</p>
                <div className="event-container">
                  {
                    dayEvents
                    .filter((event) => filter === 'all' || event.type === filter) // Filter events based on selectedFilter
                      .sort((a, b) => {
                        if (a.dateTime != null && b.dateTime != null) {
                          a.dateTime.localeCompare(b.dateTime)                        
                        }
                      }) // Sort events by dateTime
                      .map((event, index) => (
                        <div key={index} className="event-card">
                          {/* Render your EventCard component here */}
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
                      ))
                    }
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Plus Button */}
        <div className="fixed top-[72px] right-[65px] z-20">
          <button
            className="bg-sn-light-orange text-white rounded-10px  text-3xl shadow-sm flex items-center justify-center"
            style={{ width: '36px', height: '36px' }}  
            onClick={() => console.log('Button clicked')}
          >
            +
          </button>
        </div>

        {/* Filter Button */}
        <div className="fixed top-[72px] right-[20px] z-20">
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
            <div className="absolute mt-1 right-[-3px] bg-white rounded-md shadow-md p-4 bg-[#DDD]">
              <p
                className={`cursor-pointer ${filter === 'all' ? 'text-sn-light-orange font-bold' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                All
              </p>
              <p
                className={`cursor-pointer ${filter === 'training' ? 'text-sn-light-orange font-bold' : ''}`}
                onClick={() => handleFilterChange('training')}
              >
                Training
              </p>
              <p
                className={`cursor-pointer ${filter === 'game' ? 'text-sn-light-orange font-bold' : ''}`}
                onClick={() => handleFilterChange('game')}
              >
                Game
              </p>
              <p
                className={`cursor-pointer ${filter === 'teambuilding' ? 'text-sn-light-orange font-bold' : ''}`}
                onClick={() => handleFilterChange('teambuilding')}
              >
                Teambuilding
              </p>

            </div>
          )}
        </div>


      </div>
    );
  }
};

export default HomePage;
