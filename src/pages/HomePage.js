import SynthleteLogo from '../components/SynthleteLogo';
import { supabase } from "../lib/helper/supabaseClient";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
                if (user){
                    setUserData(user.data.user)
                }
            }catch(error){
                console.log(error)
            }
        }
        console.log(userData)
        fetchData();
    },[]);

    // handleLogout
    const handleLogout = async (e) => {
        e.preventDefault();
        await supabase.auth.signOut();
        console.log("Logged out")
        navigate('/auth')
    }
   
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <SynthleteLogo />

            <div className="bg-white rounded-lg p-8">
            {userData == null? <p>Nothing</p> : <p>Logged in as {userData.email}</p>} 
            </div>
            <div className="bg-white rounded-lg p-8">
                <button onClick={handleLogout} className="border-solid border-black">Log Out</button>
            </div>
        </div>
    );
}

export default HomePage;
