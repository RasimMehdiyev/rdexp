import React, { useEffect } from 'react'
import PersonTag from '../components/PersonTag.js';
import RoleInput from '../components/RoleInput.js';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {supabase} from '../lib/helper/supabaseClient';

const GameSettings = () => {
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();
  const [teamID, setTeamID] = useState('');
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState({});

  const addRole = (roleName) => {
    // Check for duplicates
    if (roles.some(role => role.name === roleName)) {
      toast.warning('Role already exists!', { position: "top-center" });
      return;
    }

    const newRole = {
      name: roleName,
      number: "null",
      isPlayer: false,
      isMember: true
    };
    setRoles([...roles, newRole]);
  };

  const getTeam = async () => {
    try {
      const teamID = localStorage.getItem('teamID');
      setTeamID(teamID);
      const { data: team, error: teamError } = await supabase
        .from('team')
        .select('team_name')
        .eq('id', teamID);
      if (teamError) throw teamError;
      setTeamName({'id': teamID, 'team_name': team[0].team_name});
    } catch (error) {
      toast.error('Error getting team!', { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTeam();
  }, []);

  const saveData = async () => {
    try {
      if (roles.length === 0) {
        toast.warning('Please add at least one role!', { position: "top-center" });
        return;
      }

      // Save data to database
      const insertPromises = roles.map(role => {
        return supabase
          .from('team_extraroles')
          .insert([{ role_title: role.name, team_id: teamID }])
      });

      await Promise.all(insertPromises);
      toast.success('Game settings saved!', { position: "top-center" });
      setTimeout(() => {
        navigate('/');
      }, 3000); 
    } catch (error) {
      toast.error('Error saving game settings!', { position: "top-center" });
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-sn-bg-light-blue">

      <div className="flex-grow">
        <div className='text-center flex flex-col justify-center items-center'>
          <h1 className="pt-20 text-5xl text-club-header-blue">
            GAME
          </h1>
          <h1 className="text-5xl text-club-header-blue">
            SETTINGS
            </h1>
            <h3 className="flex flex-row justify-center pb-7 mt-3 text-2xl font-interELight text-club-header-blue p-1 bg-white rounded-10px shadow-md h-[6vh] w-[70vw] ">
              {
                loading ? (
                        <p className="spinner-club mt-[10px] items-center"></p>
                        )
                        :
                        (
                          <p>{teamName.team_name}</p>
                        )
              }
              
            </h3>
        </div>

        <div className='pl-5'>
          <h1 className="pt-7 text-3xl text-club-header-blue">
            Add roles
          </h1>
          <h3 className="pb-7 font-interELight text-club-header-blue">
            These roles are positions, distinct from players, that require someone to fill them during every game of the team.
          </h3>

          {roles.map((role, index) => (
            <PersonTag key={index} name={role.name} number={role.number} isPlayer={role.isPlayer} isMember={role.isMember} />
          ))}
          <RoleInput onAdd={addRole} />
        </div>
      </div>

        <div className="flex-shrink-0 text-center mb-10 flex flex-col items-center">
          <button onClick={saveData} 
          className={`bg-sn-main-orange text-xl mt-16 text-white font-interBold p-2 rounded-10px w-[70vw] h-16 mb-3 ${
            roles.length === 0 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
          disabled={roles.length === 0}>
            SAVE
          </button>

          <Link className="text-club-header-blue underline underline-offset- font-interElight p-2 rounded-10px w-[70vw] h-12">
            skip this step
          </Link>
      </div>
      <ToastContainer />

    </div>
  )
}

export default GameSettings;