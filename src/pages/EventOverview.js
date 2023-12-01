import React, { useState } from 'react';
import SynthleteLogo from '../components/SynthleteLogo';
import { supabase } from "../lib/helper/supabaseClient";
import { useNavigate } from 'react-router-dom';
import { MdDateRange, MdAccessTime, MdLocationOn, MdGroup } from 'react-icons/md';
import { MdIcon } from 'react-icons/md';



const GameOverview = () => {
  // Mock data for the players and their statuses
  const initialLineup = [
    { position: 'PG', name: 'Michael Johnson', status: 'Pending' },
    { position: 'SG', name: 'John Williams', status: 'Pending' },
    { position: 'SF', name: 'James Davis', status: 'Pending' },
    { position: 'PF', name: 'Robert Wilson', status: 'Pending' },
    { position: 'C', name: 'Benjamin Taylor', status: 'Pending' },
  ];

  const otherPlayers = [
    { name: 'Fred Thompson', status: 'Pending' },
    { name: 'Jan De Man', status: 'Pending' },
  ];

  const extras = [
    { role: 'Referee', name: 'Fred Thompson', status: 'Pending' },
  ];

  // Replace with actual data fetching logic if necessary
  const teamName = "Team 1";
  const gameDate = "02-02-2024";
  const gameTime = "10:00";
  const gameLocation = "Location";

  // Navigate to the edit page (handle this function with actual navigation logic)
  const handleEdit = () => {
    // Navigate to edit page
  };

  return (
    <div className="flex flex-col min-h-screen bg-sn-bg-light-blue font-interReg">
      <div className="bg-sn-main-blue text-white text-xl font-bold p-4 w-full flex justify-between items-center">
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-russoOne">Game</span>
        <button onClick={handleEdit} className="bg-orange-500 text-white px-3 py-1 rounded">EDIT</button>
      </div>

      <div className="p-4">
        {/* Static Game Name */}
        <div className="flex justify-center mb-4">
          <span className="text-2xl font-bold text-center text-sn-main-blue font-russoOne">
            Game 1
          </span>
        </div>

        {/* Static Team Name */}
        <div className="mb-4 flex items-center">
          <MdGroup className="text-sn-main-orange mr-3" size={24} />
          <span className="py-2 text-neutral-600">{teamName}</span>
        </div>

        {/* Static Game Date */}
        <div className="mb-4 flex items-center">
          <MdDateRange className="text-sn-main-orange mr-3" size={24} />
          <span className="py-2 text-neutral-600">{gameDate}</span>
        </div>

        {/* Static Game Time */}
        <div className="mb-4 flex items-center">
          <MdAccessTime className="text-sn-main-orange mr-3" size={24} />
          <span className="py-2 text-neutral-600">{gameTime}</span>
        </div>

        {/* Static Game Location */}
        <div className="mb-4 flex items-center">
          <MdLocationOn className="text-sn-main-orange mr-3" size={24} />
          <span className="py-2 text-neutral-600">{gameLocation}</span>
        </div>

        {/* Static Initial Line-up */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-sn-main-blue font-russoOne">Initial Line-up</h3>
          {initialLineup.map((player, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span className="font-semibold">{player.position}</span>
              <span>{player.name}</span>
              <span>{player.status}</span>
            </div>
          ))}
        </div>

        {/* Static Other Players */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-sn-main-blue font-russoOne">Other Players</h3>
          {otherPlayers.map((player, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span>{player.name}</span>
              <span>{player.status}</span>
            </div>
          ))}
        </div>

        {/* Static Extras */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-sn-main-blue font-russoOne">Extras</h3>
          {extras.map((extra, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span className="font-semibold">{extra.role}</span>
              <span>{extra.name}</span>
              <span>{extra.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameOverview;
