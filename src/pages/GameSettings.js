import React from 'react'
import PersonTag from '../components/PersonTag.js';
import RoleInput from '../components/RoleInput.js';
import {Link} from 'react-router-dom'

const GameSettings = () => {
  return (
    <div className="h-screen flex flex-col justify-between bg-sn-bg-light-blue">

    <div>
        <div className='text-center'>
            <h1 className="pt-20 text-5xl text-game-blue">
            GAME
            </h1>
            <h1 className="pt-2 text-5xl text-game-blue">
            SETTINGS
            </h1>
        </div>

        <div className='pl-5'>
            <h1 className="pt-7 pb-4 text-3xl text-game-blue">
                Add roles
            </h1>
            <PersonTag name="Referee" number="null" isPlayer={false} />
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

    </div>
  )
}

export default GameSettings