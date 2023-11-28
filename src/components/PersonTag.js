import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const PersonTag = ({ name, number, isPlayer }) => {
  return (
    <div className="flex items-center mb-5 bg-white shadow-md p-2 rounded-10px w-[90vw]">
      {isPlayer && (
        <div className="font-russoOne circle-number shadow-md bg-sn-main-orange text-white mr-8">{number}</div>
      )}
      <h5 className="font-interReg text-2xl cursor-pointer">{name}</h5>
      <FontAwesomeIcon icon={faTrashAlt} className="ml-auto pr-2 text-game-blue text-2xl" />
    </div>
  );
};

export default PersonTag;