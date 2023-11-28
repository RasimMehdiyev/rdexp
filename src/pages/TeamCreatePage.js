import React from 'react'
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PersonTag from '../components/PersonTag.js';

const TeamCreatePage = () => {
  return (
    <div className=" h-screen bg-sn-bg-light-blue">

      <div className='text-center'>
        <h1 className="pt-20 text-5xl text-game-blue">
          CREATE 
        </h1>
        <h1 className="pt-2 text-5xl text-game-blue">
          YOUR TEAM
        </h1>
        <input className="mt-5 h-[5vh] pl-2 w-[70vw] rounded-10px border-2 border-game-blue font-interReg" 
        placeholder="Team name"/>
      </div>

      <div className='pl-5'>
        <h1 className="pt-7 pb-4 text-3xl text-game-blue">
            Add players
        </h1>

        <PersonTag name="Mick Johnson" number="21" isPlayer={true} />
        <PersonTag name="Josh Davis" number="36" isPlayer={true} />
                    
      </div>


    </div>
  )
}

export default TeamCreatePage