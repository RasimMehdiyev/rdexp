import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import PlayerDeletionModal from '../components/PlayerDeletionModal.js';

const PersonTag = ({ id, name, number, team, isPlayer, isMember, onDelete }) => {
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

  const handleDelete = () => {
    if (!isMember) {
      onDelete(name); 
    } else {
      openDeletionModal(); 
    }
  };

  return (
    <div className="flex items-center mb-5 bg-white shadow-md p-2 rounded-10px w-full">
      {isPlayer && (
        <div className="font-russoOne circle-number shadow-md bg-sn-main-orange text-white mr-8">{number}</div>
      )}
      <h5 className="font-interReg text-2xl cursor-pointer">{name} </h5>
      <FontAwesomeIcon icon={faTrashAlt} className="ml-auto pr-2 text-club-header-blue text-2xl" onClick={handleDelete} />
      {isMember && <PlayerDeletionModal isOpen={isDeletionModalOpen} closeModal={closeDeletionModal} onConfirm={onDelete} id={id} name={name} number={number ? number : 'x'} team={team} isPlayer={isPlayer}/>}
    </div>
  );
};

export default PersonTag;