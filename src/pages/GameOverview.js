import React, { useState } from 'react';
import SynthleteLogo from '../components/SynthleteLogo';
import { supabase } from "../lib/helper/supabaseClient";
import { useNavigate } from 'react-router-dom';
import { MdDateRange, MdAccessTime, MdLocationOn, MdGroup } from 'react-icons/md';




const GameOverview = () => {
  // Mock data for the players and their statuses
  const initialLineup = [
    { position: 'PG', name: 'Michael Johnson', status: 'Accepted' },
    { position: 'PG', name: 'John Williams', status: 'Pending' },
    // Add the rest of the initial lineup
  ];

  const otherPlayers = [
    { name: 'Fred Thompson', status: 'Pending' },
    // Add more other players
  ];

  const extras = [
    { role: 'Referee', name: 'Fred Thompson', status: 'Pending' },
    // Add more extras
  ];

  return (
    <div className="flex flex-col h-screen bg-sn-bg-light-blue font-interReg">
      <div className="bg-sn-main-blue text-white text-xl font-bold p-4 w-full flex justify-between items-center">
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-russoOne">Game</span>
        <div>
          <button className="bg-red-500 text-white px-3 py-1 rounded mr-2">DELETE</button>
          <button className="bg-orange-500 text-white px-3 py-1 rounded">SAVE</button>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 font-russoOne">Game 1</h2>

        <div className="mb-4 flex items-center">
          <MdGroup className="text-sn-main-orange mr-3" size={24} />
          <select className="form-select block w-full py-2 bg-white border border-gray-300 rounded-lg text-neutral-600">
            <option>Team 1</option>
            {/* Add more team options here */}
          </select>
        </div>

        <div className="mb-4 flex items-center">
          <MdDateRange className="text-sn-main-orange mr-3" size={24} />
          <input type="date" style={{ width: '150px' }} className="form-input py-2 border border-gray-300 rounded-lg text-neutral-600"/>
        </div>

        <div className="mb-4 flex items-center">
          <MdAccessTime className="text-sn-main-orange mr-3" size={24} />
          <input type="time" style={{ width: '80px' }} className="form-input py-2 border border-gray-300 rounded-lg text-neutral-600"/>
        </div>

        <div className="mb-4 flex items-center">
          <MdLocationOn className="text-sn-main-orange mr-3" size={24} />
          <input type="text" placeholder="Sports center" className="form-input w-full py-2 border border-gray-300 rounded-lg text-neutral-600"/>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 font-russoOne">Initial Line-up</h3>
          {initialLineup.map((player, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span className="font-semibold">{player.position}</span>
              <select className="form-select px-3 py-2 bg-white border border-gray-300 rounded-lg">
                <option>{player.name}</option>
                {/* Add more player options here */}
              </select>
              <span>{player.status}</span>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 font-russoOne">Other Players</h3>
          {otherPlayers.map((player, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <select className="form-select px-3 py-2 bg-white border border-gray-300 rounded-lg">
                <option>{player.name}</option>
                {/* Add more player options here */}
              </select>
              <span>{player.status}</span>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 font-russoOne">Extras</h3>
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

export default GameOverview;