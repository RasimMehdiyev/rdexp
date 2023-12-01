import React from 'react'
import PersonTag from '../components/PersonTag.js';
import RoleInput from '../components/RoleInput.js';
import {Link} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GameSettings = () => {


  return (
    <div className="h-screen flex flex-col justify-between bg-sn-bg-light-blue">

    <div>
        <div className='text-center flex flex-col justify-center items-center'>
            <h1 className="pt-20 text-5xl text-game-blue">
            GAME
            </h1>
            <h1 className="text-5xl text-game-blue">
            SETTINGS
            </h1>
            
            <h3 className="pb-7 mt-3 text-2xl font-interELight text-game-blue p-1 bg-white rounded-10px shadow-md h-[6vh] w-[70vw] ">
            Team 1
            </h3>
        </div>

        <div className='pl-5'>
            <h1 className="pt-7 text-3xl text-game-blue">
                Add roles
            </h1>
            <h3 className="pb-7 font-interELight text-game-blue">
            These roles are positions, distinct from players, that require someone to fill them during every game of the team.
            </h3>
            
            <PersonTag name="Referee" number="null" isPlayer={false} isMember={true} />
            <RoleInput/>
        </div>
    </div>


      <div className="bg-sn-bg-light-blue flex flex-col   align-items text-center pl-[15%]">
        <button className="bg-sn-main-orange text-2xl text-white font-interElight p-2 rounded-10px w-[70vw] h-16 ">
          SAVE
        </button>

        <Link className=" text-game-blue pt-10 underline underline-offset- font-interElight p-2 rounded-10px w-[70vw] h-12 pb-10 ">
          skip this step
        </Link>
      </div>

      <ToastContainer/>

    </div>
  )
}

export default GameSettings