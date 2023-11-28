import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const RoleInput = () => {
  return (
    <div className="flex flex-row gap-1 justify-start items-center w-[90vw]">
      <div className="relative">
        <input
          className="h-[6vh] pl-2 w-[80vw] rounded-10px border-2 border-game-blue font-interReg placeholder-text"
          placeholder="Enter new role"
        />
        
      </div>

      <button className="bg-game-blue p-2 pl-3 pr-3  rounded-10px ml-auto">
        <FontAwesomeIcon icon={faPlus} className="text-white" />
      </button>
    </div>
  );
};

export default RoleInput;