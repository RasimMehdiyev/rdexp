import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPlus } from '@fortawesome/free-solid-svg-icons';

const UserInput = () => {
  return (
    <div className="flex flex-row gap-1 justify-start items-center w-[90vw]">
      <div className="relative">
        <input
          className="h-[6vh] pl-10 w-[80vw] rounded-10px border-2 border-game-blue font-interReg placeholder-text"
          placeholder="Enter user's name"
        />
        <div className="absolute left-3 top-2 pt-1">
          <FontAwesomeIcon icon={faUser} className="text-game-blue h-[3vh]" />
        </div>
      </div>

      <button className="bg-game-blue p-2 pl-3 pr-3  rounded-10px ml-auto">
        <FontAwesomeIcon icon={faPlus} className="text-white" />
      </button>
    </div>
  );
};

export default UserInput;