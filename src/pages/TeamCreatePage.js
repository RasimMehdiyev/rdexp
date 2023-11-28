import React from 'react'
import { faUser} from "@fortawesome/free-regular-svg-icons";
import { faPlus} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PersonTag from '../components/PersonTag.js';
import UserInput from '../components/UserInput.js';
import {Link} from 'react-router-dom'


const TeamCreatePage = () => {
  return (
    <div className=" h-screen  bg-sn-bg-light-blue">

      <div className='text-center'>
        <h1 className="pt-20 text-5xl text-game-blue">
          CREATE 
        </h1>
        <h1 className="pt-2 text-5xl text-game-blue">
          YOUR TEAM
        </h1>
        <input className="mt-5 h-[5vh] pl-2 w-[70vw] rounded-10px border-2 border-game-blue font-interReg placeholder-text" 
        placeholder="Team name"/>
      </div>

      <div className='pl-5'>
        <h1 className="pt-7 pb-4 text-3xl text-game-blue">
            Add players
        </h1>

        <PersonTag name="Mick Johnson" number="21" isPlayer={true} isMember={false} />
        <PersonTag name="Josh Davis" number="36" isPlayer={true} isMember={false}/>

        <UserInput />

        <h1 className="pt-7 pb-4 text-3xl text-game-blue">
            Add extras
        </h1>

        <PersonTag name="Jessica Smith" number="null" isPlayer={false} isMember={false} />

        <UserInput />

      </div>

      <div className="bg-sn-bg-light-blue flex flex-col justify-center align-items text-center pt-14 pl-[15%]">
        <button className="bg-sn-main-orange text-2xl text-white font-interElight p-2 rounded-10px w-[70vw] h-16 ">
          SAVE
        </button>

        <Link to="/club/create/settings" className=" text-game-blue pt-10 underline underline-offset- font-interElight p-2 rounded-10px w-[70vw] h-12 pb-10 ">
          skip this step
        </Link>

      </div>

    </div>
  )
}

export default TeamCreatePage