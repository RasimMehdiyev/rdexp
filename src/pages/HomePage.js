import SynthleteLogo from '../components/SynthleteLogo';
import { supabase } from "../lib/helper/supabaseClient";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from "../components/EventCard"

const HomePage = () => {
    let [userData, setUserData] = useState({})
    // navigate
    const navigate = useNavigate();
    // wait until the data is fetched and then render the page
    useEffect(() => {
        const fetchData = async () => {
            console.log("Fetching data")
            try {
                console.log("Trying")
                const user = await supabase.auth.getUser();
                console.log(user)
                if (user.data.user){
                    setUserData(user.data.user)
                    console.log(userData)
                }
                else{
                    navigate('/auth');
                }

            } catch (error) {
                console.log(error)
            }
        }
        console.log(userData)
        fetchData();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center">
            {/* Upcoming Events */}
            {/* Render the EventCard component */}
            <EventCard
            type="game"
            eventName="Game 1 against Antwerp the losing team"
            teamName="Team A"
            eventTime="14:00"
            location="Brussels, Brusselstreet 45"
            attendance="5"
            number_invitiation="20"
            />
            <EventCard
            type="practice"
            eventName="Condition training"
            teamName="Team A"
            eventTime="20:00"
            location="Homecourt"
            attendance="5"
            number_invitiation="20"
            />
            <EventCard
            type="teambuilding"
            eventName="drinking beers"
            teamName="Team A"
            eventTime="22:00"
            location="Café basketball"
            attendance="5"
            number_invitiation="20"
            />
        
        </div>

        
    );
}

export default HomePage;
