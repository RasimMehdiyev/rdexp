import React, { useEffect } from 'react'
import PersonTag from '../components/PersonTag.js';
import RoleInput from '../components/RoleInput.js';
import {Link} from 'react-router-dom'
import { useState } from 'react';
import { supabase } from '../lib/helper/supabaseClient';

const GameSettings = () => {
  const [roles, setRoles] = useState([{ name: "Referee" }]); // Initial roles
  const [teamName, setTeamName] = useState('');

  const addRole = (roleName) => {
    const newRole = { name: roleName };
    setRoles([...roles, newRole]);
  };

  const deleteRole = (roleName) => {
    setRoles(roles.filter((role) => role.name !== roleName));
  }

  // getTeam id from local storage
  const getTeam = async () => { 
    const { data: team, error: teamError } = await supabase
    .from('team')
    .select('team_name')
    .eq('id', localStorage.getItem('teamID'))
    .single(); // Use single to get a single record or null
    if (teamError) throw teamError;
    console.log("team data:", team.id);
    setTeamName(team.team_name);
  }

  useEffect(() => {
      getTeam();
    },
  [])



  const handleSubmit = async (e) =>{
    e.preventDefault()
    try {
      // Map through each role and create an array of promises for insertion
      const roleInsertPromises = roles.map(role => {
        return supabase.from('team_extraroles').insert([
          {
            team_id: localStorage.getItem('teamID'),
            role_title: role.name,
          }
        ]);
      });
  
      // Await all the insertions
      const roleResults = await Promise.all(roleInsertPromises);
      roleResults.forEach(({ data, error }) => {
        if (error) {
          console.error('Error inserting role data:', error);
        } else {
          console.log('Role insertion successful:', data);
        }
      });
    } catch (error) {
      console.error('An error occurred during role insertion:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-between bg-sn-bg-light-blue">

    <div>
        <div className='text-center'>
            <h1 className="pt-20 text-5xl text-game-blue">
            GAME
            </h1>
            <h1 className="pt-2 text-5xl text-game-blue">
            SETTINGS
            </h1>
            <h3 className="pb-7 text-2xl font-interELight text-game-blue">
              {teamName}
            </h3>
        </div>

        <div className='pl-5'>
            <h1 className="pt-7 text-3xl text-game-blue">
                Add roles
            </h1>
            <h3 className="pb-7 font-interELight text-game-blue">
            These roles are positions, distinct from players, that require someone to fill them during every game of the team.
            </h3>
            
            {roles.map((role, index) => (
              <PersonTag key={index} {...role} onDelete={() => deleteRole(role.name)} />
            ))}          
        <RoleInput onAdd={addRole} />
        </div>
    </div>


      <div className="bg-sn-bg-light-blue flex flex-col   align-items text-center pl-[15%]">
        <button onClick={handleSubmit} className="bg-sn-main-orange text-2xl text-white font-interElight p-2 rounded-10px w-[70vw] h-16 ">
          SAVE
        </button>

        <Link className=" text-game-blue pt-10 underline underline-offset- font-interElight p-2 rounded-10px w-[70vw] h-12 pb-10 ">
          skip this step
        </Link>
      </div>

    </div>
  )
}

export default GameSettings