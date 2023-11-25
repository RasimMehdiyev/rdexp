import SynthleteLogo from '../components/SynthleteLogo';
import { supabase } from "../lib/helper/supabaseClient";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogRocket, { sessionURL } from 'logrocket'
import amplitude from 'amplitude-js'
import EventCard from "../components/EventCard";
import React from 'react';


const HomePage = () => {
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await supabase.auth.getUser();
                console.log(user)
                if (user.data.user){
                    setUserData(user.data.user)
                    LogRocket.identify(user.data.user.id, {
                        name: userData.full_name,
                        email: userData.email,
                        role: userData.role,
                      });

                      LogRocket.getSessionURL(sessionURL => {
                        amplitude.getInstance().logEvent('LogRocket', {'sessionURL': sessionURL });
                      });
                      console.log("SessionURL:", sessionURL)                      

                    console.log(userData)
                }
                else{
                    navigate('/auth');
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);

    const events = [
        {
            type: "game",
            eventName: "Game 1 against Antwerp the losing team with an extra long name that does not end",
            teamName: "Team A",
            eventTime: "14:00",
            location: "Brussels, Brusselstreet 45",
            attendance: "5",
            number_invitation: "20",
            date: "2023-04-11"
        },
        {
            type: "practice",
            eventName: "Condition training",
            teamName: "Team A",
            eventTime: "20:00",
            location: "Homecourt",
            attendance: "5",
            number_invitation: "20",
            date: "2023-05-20"
        },
        {
            type: "teambuilding",
            eventName: "drinking beers",
            teamName: "Team A",
            eventTime: "22:00",
            location: "Café basketball",
            attendance: "5",
            number_invitation: "20",
            date: "2023-05-11"
        },
        {
            type: "game",
            eventName: "Game 2",
            teamName: "Team A",
            eventTime: "14:00",
            location: "Brussels, Brusselstreet 45",
            attendance: "5",
            number_invitation: "20",
            date: "2023-04-13"
        },
        {
            type: "practice",
            eventName: "Condition training",
            teamName: "Team A",
            eventTime: "19:00",
            location: "Homecourt",
            attendance: "5",
            number_invitation: "20",
            date: "2023-05-20"
        }
    ];

    // Organize events by month and then by day
    const organizedEvents = events.reduce((acc, event) => {
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

    return (
        
        <div className="flex flex-col justify-center items-center">
          <br></br>
          {/* Upcoming Events */}
          {Object.entries(organizedEvents).map(([month, days]) => (
            <div key={month} className="font-russoOne text-sn-main-blue">
              <h2 className="text-4xl font-bold">{new Date(month).toLocaleString('default', { month: 'long' })}</h2>
              {Object.entries(days).map(([day, dayEvents]) => (
                <div key={day}>
                  <p className="text-2xl font-semibold">{`${new Date(`${month}-${day}`).toLocaleString('default', { weekday: 'short' })}. ${day}`}</p>
                  <div className="event-container">
                    {dayEvents
                      .sort((a, b) => a.eventTime.localeCompare(b.eventTime)) // Sort events by eventTime
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
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      );
};

export default HomePage;