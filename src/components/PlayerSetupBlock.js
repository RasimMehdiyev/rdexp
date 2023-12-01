// PlayerSetupBlock.js

import React from 'react';

const PlayerSetupBlock = ({ label, name, status, getStatusColor }) => {
  return (
    <div className="flex items-center mb-2">
      <div className="bg-blue-600 text-white font-bold p-1 rounded text-center w-12 mr-3">
        {label}
      </div>
      <select 
        className="form-select bg-white border border-gray-300 rounded-lg text-neutral-600 ml-2"
        style={{ width: 'max-content', padding: '0.5rem 1rem' }}
        defaultValue={name}
      >
        <option value={name}>{name}</option>
        
      </select>
      <span className={`ml-4 ${getStatusColor(status)}`}>{status}</span>
    </div>
  );
};

export default PlayerSetupBlock;
