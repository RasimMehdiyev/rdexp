import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import PlayerDeletionModal from '../components/PlayerDeletionModal.js';

const PersonTag = ({ name, number, isPlayer }) => {

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
      <FontAwesomeIcon icon={faTrashAlt} className="ml-auto pr-2 text-game-blue text-2xl" onClick={openDeletionModal} />

      <PlayerDeletionModal isOpen={isDeletionModalOpen} closeModal={closeDeletionModal} />
    </div>
    
  );
};

export default PersonTag;