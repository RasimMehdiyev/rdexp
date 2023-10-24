import React from 'react';
import {useState} from 'react';
import { Link } from 'react-router-dom';

const Start = () => {

    return (
        <div className='flex flex-col justify-center items-center gap-[20px]'>
            <h1 className="text-[50px] my-[100px]  text-center">Get started</h1>
            <Link to="/create-team">
                <button className="text-[20px] w-80 h-20 bg-lf-dark-gray text-center" type="submit">Create your <br/> first team</button>
            </Link>
            <Link to="/join-team">
                <button className='text-[20px] w-80 h-20 bg-lf-dark-gray text-center' type="submit">Join an <br/> existing team</button>
            </Link>
        </div>
    );
}

export default Start;