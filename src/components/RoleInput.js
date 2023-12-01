import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const RoleInput = ({ onAdd }) => {
  const [roleName, setRoleName] = useState('');

  const handleInputChange = (e) => {
    setRoleName(e.target.value);
  };

  const handleAddClick = () => {
    if (roleName.trim()) {
      onAdd(roleName);
      setRoleName(''); // Reset input field after adding
    }
  };

  return (
    <div className="flex flex-row gap-1 justify-start items-center w-[90vw]">
      <div className="relative">
        <input
          className="h-[6vh] pl-5 w-[80vw] rounded-10px border-2 border-game-blue font-interReg placeholder-text"
          placeholder="Enter new role"
          value={roleName}
          onChange={handleInputChange}
        />
      </div>

      <button onClick={handleAddClick} className="bg-game-blue p-2 pl-3 pr-3 rounded-10px ml-auto">
        <FontAwesomeIcon icon={faPlus} className="text-white" />
      </button>
    </div>
  );
};

export default RoleInput;
