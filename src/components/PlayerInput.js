import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';


const PlayerInput = ({ onInputChange, errorMessage, isPlayer}) => {



  return (
    <div className="flex flex-row gap-1 justify-start items-center w-[90vw]">
      <div className="relative">
        <input
          className="h-[6vh] pl-10 w-[80vw] rounded-10px border-2 border-game-blue font-interReg placeholder-text"
          placeholder={isPlayer ? "Enter player's name" : "Enter name"}
          onChange={(e) => onInputChange(e.target.value)}
        />
        <div className="absolute left-3 top-2 pt-1">
          <FontAwesomeIcon icon={faUser} className="text-game-blue h-[3vh]" />
        </div>
        {errorMessage && <div className="font-russoOne text-2xl leading-6 mt-2 text-red-500 text-sm">{errorMessage}</div>}
      </div>
    </div>

  );

};

export default PlayerInput;
