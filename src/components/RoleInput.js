import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


const RoleInput = ({ onAdd }) => {
  const [role, setRole] = useState("");

  const handleInputChange = (e) => {
    setRole(e.target.value); 
  };

  const handleAddRole = () => {
    if(!role.trim()) return;
    onAdd(role); 
    setRole("");
  };

  return (
    <div className="flex flex-row gap-1 justify-start items-center w-[90vw]">
      <div className="relative">
        <input
          className="h-[6vh] w-[80vw] pl-5 rounded-10px border-2 border-game-blue font-interReg placeholder-text"
          placeholder="Enter new role"
          value={role}         
          onChange={handleInputChange}  
        />
      </div>

      <button 
        className="bg-game-blue p-2 pl-3 pr-3  rounded-10px ml-auto"
        onClick={handleAddRole}
      >
        <FontAwesomeIcon icon={faPlus} className="text-white" />
      </button>
    </div>
  );
};

export default RoleInput;
