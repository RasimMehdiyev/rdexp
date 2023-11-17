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
                if (user.data.user){
                    setUserData(user.data.user)
                    console.log(userData)
                }
                else{
                    navigate('/auth');
                }

            }catch(error){
                console.log(error)
            }
        }
        console.log(userData)
        fetchData();
    },[]);
    
        return (
            <div className="flex flex-col justify-center items-center ">
                {/* Upcoming Events */}
                <div className="mt-[30px] w-[325px] h-[150px] flex flex-col  bg-lf-dark-gray">
                    <p className="p-[12px]">Upcoming events</p>
                    <div className='p-[12px] flex flex-col justify-center items-center'>
                        <p className='text-[gray]'>No upcoming events</p>
                        <a href='#' className='underline'>Add events</a>
                    </div>
                </div>
                <div className="mt-[30px] w-[325px] h-[150px] flex flex-col  bg-lf-dark-gray">
                    <p className="p-[12px]">Announcements</p>
                    <div className='p-[12px] flex flex-col justify-center items-center'>
                        <p className='text-[gray]'>No Announcements</p>
                        <a href="#" className='underline'>Add announcement</a>
                    </div>
                </div>
            </div>
        );
    

    
}

export default HomePage;
