import React, { useState } from 'react';
import SynthleteLogo from '../components/SynthleteLogo';
import { supabase } from "../lib/helper/supabaseClient";
import { useNavigate } from 'react-router-dom';
import { MdDateRange, MdAccessTime, MdLocationOn, MdGroup } from 'react-icons/md';

import PlayerSetupBlock from '../components/PlayerSetupBlock';


 // Function to get text color based on status
 const getStatusColor = (status) => {
  switch (status) {
    case 'Accepted':
      return 'text-green-500';
    case 'Pending':
      return 'text-yellow-500';
    case 'Declined':
      return 'text-red-500';
    default:
      return 'text-black'; 
  }
};

// Function to get border color based on status
const getStatusBorderColor = (status) => {
  switch (status) {
    case 'Accepted':
      return 'border-green-500';
    case 'Pending':
      return 'border-yellow-500';
    case 'Declined':
      return 'border-red-500';
    default:
      return 'border-black'; 
  }
};



const EventOverviewEdit = () => {
  const initialLineup = [
    { position: 'PG', name: 'Michael Johnson', status: 'Pending' },
    { position: 'SG', name: 'John Williams', status: 'Declined' },
    { position: 'SF', name: 'James Davis', status: 'Accepted' },
    { position: 'PF', name: 'Robert Wilson', status: 'Not sent yet' },
    { position: 'C', name: 'Benjamin Taylor', status: 'Not sent yet' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'text-status-accepted border-status-accepted'; // Use the custom color key from your Tailwind config
      case 'Pending':
        return 'text-status-pending border-status-pending'; // Use the custom color key from your Tailwind config
      case 'Declined':
        return 'text-status-declined border-status-declined'; // Use the custom color key from your Tailwind config
      default:
        return 'text-black border-black'; // Default case
    }
  }

  const [otherPlayers, setOtherPlayers] = useState([
    { name: 'Fred Thompson', status: 'Pending' },
    { name: 'Jan De Man', status: 'Pending' },
  ]);


  const addPlayer = () => {
    const newPlayer = { name: '', status: 'Pending' }; // Adjust as necessary for your default values
    setOtherPlayers([...otherPlayers, newPlayer]);
  };

  const extras = [
    { role: 'Referee', name: 'Fred Thompson', status: 'Not sent yet' },
    // Add more extras
  ];

  return (
    <div className="flex flex-col min-h-screen bg-sn-bg-light-blue font-interReg">
    <div className="bg-sn-main-blue text-white text-xl font-bold p-4 w-full flex justify-between items-center">
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-russoOne">Game</span>
        <div>
          <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">DELETE</button>
          <button className="bg-orange-500 text-white px-3 py-1 rounded">SAVE</button>
        </div>
      </div>

      <div className="p-4">
      <div className="flex justify-center mb-4">
      <input
          type="text"
          defaultValue="Game 1" 
          onChange={() => {}}
          className="text-2xl font-bold text-center text-sn-main-blue font-russoOne bg-white border border-gray-300 rounded-lg"
          style={{
            outline: 'none',
            boxShadow: 'none',
            padding: '0.5rem 1rem', // Adjust padding to your preference
          }}
        />
      </div> 

  
        <div className="mb-4 flex items-center">
          <MdGroup className="text-sn-main-orange mr-3" size={24} />
          <select 
            className="form-select bg-white border border-gray-300 rounded-lg text-neutral-600"
            style={{ maxWidth: '200px', padding: '0.5rem 1rem' }} // Set a max-width
          >
            <option>Team 1</option>
            <option>Team 2</option>
            <option>Team 3</option>
          </select>
        </div>

        <div className="mb-4 flex items-center">
          <MdDateRange className="text-sn-main-orange mr-3" size={24} />
          <input type="date" style={{ width: '130px' }} className="form-input py-2 border border-gray-300 rounded-lg text-neutral-600"/>
        </div>

        <div className="mb-4 flex items-center">
          <MdAccessTime className="text-sn-main-orange mr-3" size={24} />
          <input type="time" style={{ width: '70px' }} className="form-input py-2 border border-gray-300 rounded-lg text-neutral-600"/>
        </div>

        <div className="mb-4 flex items-center">
          <MdLocationOn className="text-sn-main-orange mr-3" size={24} />
          <input 
            type="text" 
            placeholder="Fill in location" 
            className="form-input border border-gray-300 rounded-lg text-neutral-600"
            style={{ maxWidth: '300px', padding: '0.5rem 1rem' }} // Set a max-width
          />
        </div>

        

        <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-sn-main-blue font-russoOne">Initial Line-up</h3>
        {initialLineup.map((player, index) => (
          <PlayerSetupBlock
            key={index}
            label={player.position} // Initial lineup uses the player's position
            name={player.name}
            status={player.status}
            getStatusColor={getStatusColor}
          />
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-sn-main-blue font-russoOne">Substitutes</h3>
        {otherPlayers.map((player, index) => (
          <PlayerSetupBlock
            key={index}
            label="SUB" // Substitutes use the "SUB" label
            name={player.name}
            status={player.status}
            getStatusColor={getStatusColor}
          />
        ))}
        <button 
          onClick={addPlayer} 
          className="mt-2 p-2 bg-white text-black rounded-lg"
        >
          Add Player
        </button>
      </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-sn-main-blue font-russoOne">Extras</h3>
          {extras.map((extra, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span className="font-semibold">{extra.role}</span>
              <select className="form-select px-3 py-2 bg-white border border-gray-300 rounded-lg">
                <option>{extra.name}</option>
                {/* Add more extra options here */}
              </select>
              <span>{extra.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventOverviewEdit;