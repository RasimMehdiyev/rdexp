import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import PlayerDeletionModal from '../components/PlayerDeletionModal.js';

const PersonTag = ({ name, number, isPlayer, isMember }) => {

//isMember being true means trashIcon is pressed for a player 
//that's already part of that team (i.e. from the team management page) 
//which results in the confirmation modal popping up
//isMember being false means the trashIcon is pressed for a player 
//that isn't part of that team (i.e. from the team creation page) 
//and hence can't be removed from displa
  const [isDeletionModalOpen, setDeletionModalOpen] = useState(false);

  const openDeletionModal = () => {
    setDeletionModalOpen(true);
  };

  const closeDeletionModal = () => {
    setDeletionModalOpen(false);
  };

  return (
    <div className="flex items-center mb-5 bg-white shadow-md p-2 rounded-10px w-[90vw]">
      {isPlayer && (
        <div className="font-russoOne circle-number shadow-md bg-sn-main-orange text-white mr-8">{number}</div>
      )}
      <h5 className="font-interReg text-2xl cursor-pointer">{name}</h5>
      <FontAwesomeIcon icon={faTrashAlt} className="ml-auto pr-2 text-game-blue text-2xl" onClick={isMember ? openDeletionModal : undefined} />

      {isMember && <PlayerDeletionModal isOpen={isDeletionModalOpen} closeModal={closeDeletionModal} />}
    </div>
  );
};

export default PersonTag;