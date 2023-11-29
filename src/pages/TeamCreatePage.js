import React from 'react'
import PersonTag from '../components/PersonTag.js';
import UserInput from '../components/UserInput.js';
import {Link} from 'react-router-dom'
import { supabase } from '../lib/helper/supabaseClient';
import { useState } from 'react';


const TeamCreatePage = () => {
  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState([]);
  const [extras, setExtras] = useState([]);
  const [teamID, setTeamID] = useState(localStorage.getItem('teamID')); // [team_id, team_name]
  const [users, setUsers] = useState([]); // [user_id, user_name]


  const handleTeamNameChange = (e) => {
    setTeamName(e.target.value);
  };

  const addPlayer = (playerName) => {
    const newPlayer = {
      name: playerName,
      number: "21", // You might want to generate or assign this
      isPlayer: true,
      isMember: false
    };
    setPlayers([...players, newPlayer]);
  };

  const addExtra = (extraName) => {
    const newExtra = {
      name: extraName,
      number: "EX", // or any appropriate value
      isPlayer: false,
      isMember: false
    };
    setExtras([...extras, newExtra]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ teamName, players, extras, teamID });
    // TODO: Save to database
    const [data , error] = supabase
    .from('team')
    .update(
      [
        {
          name: teamName,
        }
      ]
    )
    .eq('id', teamID)

    if (error) console.log(error);
    console.log(data);

    const [data2 , error2] = supabase
    .from('team_users')
    .insert(
      [
        {
          user_id: localStorage.getItem('userID'),
          team_id: teamID,
        }
      ]
    )
  };

  const deletePlayer = (playerName) => {
    setPlayers(players.filter(player => player.name !== playerName));
  };

  const deleteExtra = (extraName) => {
    setExtras(extras.filter(extra => extra.name !== extraName));
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-sn-bg-light-blue">
      <div >
      <div className='text-center'>
          <h1 className="pt-20 text-5xl text-game-blue">
            CREATE 
          </h1>
          <h1 className="pt-2 text-5xl text-game-blue">
            YOUR TEAM
          </h1>
          <input
            className="mt-5 h-[5vh] pl-2 w-[70vw] rounded-10px border-2 border-game-blue font-interReg placeholder-text"
            placeholder="Team name"
            value={teamName}
            onChange={handleTeamNameChange}
          />
        </div>

        <div className='pl-5'>
          <h1 className="pt-7 pb-4 text-3xl text-game-blue">
              Add players
          </h1>

          {players.map((player, index) => (
            <PersonTag key={index} {...player} onDelete={deletePlayer} />        
          ))}

          <UserInput onAdd={addPlayer} />
          <h1 className="pt-7 pb-4 text-3xl text-game-blue">
              Add extras
          </h1>


          {extras.map((extra, index) => (
            <PersonTag key={index} {...extra} onDelete={deleteExtra} />        
          ))}
          <UserInput onAdd={addExtra} />
        </div>
      </div>


      <div className="bg-sn-bg-light-blue flex flex-col justify-center align-items text-center pt-14 pl-[15%]">
        <button onClick={handleSubmit} className="bg-sn-main-orange text-2xl text-white font-interElight p-2 rounded-10px w-[70vw] h-16 ">
          SAVE
        </button>

        <Link to="/club/create/settings" className=" text-game-blue pt-10 underline underline-offset- font-interElight p-2 rounded-10px w-[70vw] h-12 pb-10 ">
          skip this step
        </Link>
      </div>

    </div>
  )
}

export default TeamCreatePage