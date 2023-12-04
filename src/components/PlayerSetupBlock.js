import React from 'react';

const PlayerSetupBlock = ({ label, selectedPlayerId, allPlayers = [], onSelectPlayer, status }) => {
  const selectedPlayer = allPlayers.find(player => player.id === selectedPlayerId) || {};

  // Determine classes based on the status
  let statusClasses;
  let textClass;
  switch (status) {
    case 'Accepted':
      statusClasses = 'border-green-500';
      textClass = 'text-green-500';
      break;
    case 'Declined':
      statusClasses = 'border-red-500';
      textClass = 'text-red-500';
      break;
    case 'Pending':
    default:
      statusClasses = 'border-blue-500';
      textClass = 'text-blue-500';
      break;
    case 'Not sent yet':
    statusClasses = 'border-black'; 
    textClass = 'text-black';
    break;
  }

  // Default player name when none is selected
  const selectedPlayerName = selectedPlayer.full_name || 'Select a player';

  return (
    <div className="flex items-center mb-2">
      <div className="bg-position-blue text-white font-bold p-1 rounded-l text-center w-12 mr-3">
        {label}
      </div>
      <div className={`relative flex-grow`}>
        <select
          value={selectedPlayerId || ''}
          onChange={onSelectPlayer}
          className={`block appearance-none w-full bg-white ${statusClasses} rounded text-neutral-600 h-full p-2 pr-8 cursor-pointer`}
        >
          <option value="" disabled>{selectedPlayerName}</option>
          {allPlayers.map((player) => (
            <option key={player.id} value={player.id}>
              {player.full_name}
            </option>
          ))}
        </select>
        <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700`}>
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.576 0 0.436 0.445 0.408 1.197 0 1.615l-4.695 4.502c-0.533 0.481-1.408 0.481-1.941 0l-4.695-4.502c-0.408-0.418-0.436-1.17 0-1.615z"/>
          </svg>
        </div>
      </div>
      <span className={`ml-4 ${textClass} rounded-r`}>
        {status || 'Pending'}
      </span>
    </div>
  );
};

export default PlayerSetupBlock;
