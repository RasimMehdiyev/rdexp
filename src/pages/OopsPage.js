import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Oops = () => {
    const navigate = useNavigate();
    const [counter, setCounter] = useState(100); // State to keep track of the countdown

    useEffect(() => {
        const timer = setInterval(() => {
            setCounter((prevCounter) => {
                if (prevCounter === 1) {
                    clearInterval(timer); // Clear the interval when counter reaches 1
                    navigate('/'); // Redirect when the countdown is over
                }
                return prevCounter - 1; // Decrease the counter
            });
        }, 1000);

        return () => clearInterval(timer); // Clear the interval when the component unmounts
    }, [navigate]);

    return (
        <div className='w-full bg-[#42b3e3] gap-5 m-auto flex flex-col items-center h-screen font-Inter text-sn-lighter-orange'>
            <p className='text-3xl font-bold mb-1 flex flex-col justify-center items-center mt-16'>Oops!
                <br/>
                <span className='text-xl mt-2 font-normal'>Page doesn&apos;t exist</span> 
            </p>
            <img className='w-[70vw] mt-3' src={process.env.PUBLIC_URL + "/images/No_results_found_illustration_generated.jpg"} alt="" />
            <p className='text-xl mt-2 font-normal'>You will be redirected to the homepage in</p>
            <p className='text-4xl font-bold'>{counter}</p>
        </div>
    );
};

export default Oops;
