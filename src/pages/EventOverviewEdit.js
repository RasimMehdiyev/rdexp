import React, { useState, useEffect } from 'react';
import useEventData from '../hooks/useEventData';
import SynthleteLogo from '../components/SynthleteLogo';
import { supabase } from "../lib/helper/supabaseClient";
import { useNavigate } from 'react-router-dom';
import { MdDateRange, MdAccessTime, MdLocationOn, MdGroup } from 'react-icons/md';

import PlayerSetupBlock from '../components/PlayerSetupBlock';




const EventOverviewEdit = () => {
  const eventId = 1;
  const { eventDetails, teamName, teamPlayers, loading, error } = useEventData(eventId);
  const [initialLineup, setInitialLineup] = useState([]);
  const [Substitutes, setSubstitutes] = useState([]);
  const [selectedInitialPlayers, setSelectedInitialPlayers] = useState(Array(5).fill(''));
  const [selectedSubstitutePlayers, setSelectedSubstitutePlayers] = useState([]);
  
  const positionLabels = ['PG', 'SG', 'SF', 'PF', 'C']; //for basketball mvp



  useEffect(() => {
    setInitialLineup(teamPlayers.slice(0, 5));
    setSubstitutes(teamPlayers.slice(5, 7));
  }, [teamPlayers]);

  const handlePlayerClick = (index, type) => {
    setShowPlayerSelect({ index, type });
  };


  const handleInitialSelectChange = (event, index) => {
    const newSelectedPlayers = [...selectedInitialPlayers];
    newSelectedPlayers[index] = event.target.value;
    setSelectedInitialPlayers(newSelectedPlayers);
  };

  // Function to handle selection change for substitutes
  const handleSubstituteSelectChange = (event, index) => {
    const newSelectedPlayers = [...selectedSubstitutePlayers];
    newSelectedPlayers[index] = event.target.value;
    setSelectedSubstitutePlayers(newSelectedPlayers);
  };


  const handleSelectPlayer = (playerId, index, type) => {
    if (type === 'initial') {
      const newLineup = [...initialLineup];
      newLineup[index] = playerId;
      setInitialLineup(newLineup);
    } else if (type === 'substitute') {
      const newSubs = [...substitutes];
      newSubs[index] = playerId;
      setSubstitutes(newSubs);
    }
    setShowPlayerSelect({ index: null, type: null }); // Hide the dropdown after selection
  };

  const addPlayer = () => {
    const newPlayer = { name: '', status: 'Pending' }; // Adjust as necessary for your default values
    setSubstitutes([...Substitutes, newPlayer]);
  };

  const extras = [
    { role: 'Referee', name: 'Fred Thompson', status: 'Not sent yet' },
    // Add more extras
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;


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
          value={eventDetails.title || ''} 
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
        <span className="form-input bg-white border border-gray-300 rounded-lg text-neutral-600" style={{ maxWidth: '200px', padding: '0.5rem 1rem' }}>
          {teamName || 'Team not set'}
        </span>
      </div>

      <div className="mb-4 flex items-center">
        <MdDateRange className="text-sn-main-orange mr-3" size={24} />
        <input 
          type="date" 
          value={eventDetails.datetime ? eventDetails.datetime.split('T')[0] : ''} 
          className="form-input py-2 border border-gray-300 rounded-lg text-neutral-600"
          style={{ width: '130px' }} 
          
        />
      </div>

      <div className="mb-4 flex items-center">
        <MdAccessTime className="text-sn-main-orange mr-3" size={24} />
        <input 
          type="time" 
          value={eventDetails.datetime ? eventDetails.datetime.split('T')[1].substring(0, 5) : ''} 
          className="form-input py-2 border border-gray-300 rounded-lg text-neutral-600"
          style={{ width: '80px' }} 
          
        />
      </div>

      <div className="mb-4 flex items-center">
        <MdLocationOn className="text-sn-main-orange mr-3" size={24} />
        <input 
          type="text" 
          value={eventDetails.location || ''} 
          placeholder="Fill in location" 
          className="form-input border border-gray-300 rounded-lg text-neutral-600"
          style={{ maxWidth: '300px', padding: '0.5rem 1rem' }} 
          
        />
      </div>

        

      <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2 text-sn-main-blue font-russoOne">Initial Line-up</h3>
      {positionLabels.map((positionLabel, index) => (
        <PlayerSetupBlock
          key={index}
          label={positionLabel}
          selectedPlayerId={selectedInitialPlayers[index]}
          allPlayers={teamPlayers}
          onSelectPlayer={e => handleInitialSelectChange(e, index)}
          
        />
      ))}
    </div>

    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2 text-sn-main-blue font-russoOne">Substitutes</h3>
      {Substitutes.map((player, index) => (
        <PlayerSetupBlock
          key={index}
          label="SUB"
          selectedPlayerId={selectedSubstitutePlayers[index]}
          allPlayers={teamPlayers}
          onSelectPlayer={e => handleSubstituteSelectChange(e, index)}
          
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