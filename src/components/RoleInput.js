import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


const RoleInput = ({ value, onAdd }) => {
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
          className="h-[6vh] w-[80vw] pl-5 rounded-10px border-2 border-club-header-blue font-interReg placeholder-text"
          placeholder="Enter new role"
          value={roleName}
          onChange={handleInputChange}
        />
      </div>

      <button onClick={handleAddClick} className="bg-club-header-blue p-2 pl-3 pr-3 rounded-10px ml-auto">
        <FontAwesomeIcon icon={faPlus} className="text-white" />
      </button>
    </div>
  );
};

export default RoleInput;
