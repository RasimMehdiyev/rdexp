import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';


const PlayerInput = ({ onInputChange, errorMessage }) => {



  return (
    <div className="flex flex-row gap-1 justify-start items-center w-[90vw]">
      <div className="relative">
        <input
          className="h-[6vh] pl-10 w-[80vw] rounded-10px border-2 border-club-header-blue font-interReg placeholder-text"
          placeholder="Enter player's name"
          onChange={(e) => onInputChange(e.target.value)}
        />
        <div className="absolute left-3 top-2 pt-1">
          <FontAwesomeIcon icon={faUser} className="text-club-header-blue h-[3vh]" />
        </div>
        {errorMessage && <div className="font-russoOne leading-6 mt-2 text-red-500 text-sm">{errorMessage}</div>}
      </div>
    </div>

  );

};

export default PlayerInput;
