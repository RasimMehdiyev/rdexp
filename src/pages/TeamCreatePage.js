import React from 'react'
import { faUser} from "@fortawesome/free-regular-svg-icons";
import { faPlus} from "@fortawesome/free-solid-svg-icons";
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

        <div className="flex items-center w-[90vw]">

          <div className="relative">
            <input
              className="h-[6vh] pl-10 w-[80vw] rounded-10px border-2 border-game-blue font-interReg"
              placeholder="Enter user's name"
            />
            <div className="absolute left-3 top-2 pt-1">
              <FontAwesomeIcon icon={faUser} className="text-game-blue h-[3vh]" />
            </div>
          </div>

          <button className=" bg-game-blue p-2 pl-3 pr-3 rounded-10px  ml-auto">
              <FontAwesomeIcon icon={faPlus} className="text-white" />
          </button>

        </div>
                    
      </div>


    </div>
  )
}

export default TeamCreatePage