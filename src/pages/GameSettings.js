import React from 'react';
import PersonTag from '../components/PersonTag.js';
import RoleInput from '../components/RoleInput.js';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GameSettings = () => {
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  const addRole = (roleName) => {
    const newRole = {
      name: roleName,
      number: "null",
      isPlayer: false,
      isMember: true
    };
    setRoles([...roles, newRole]);
  };

  const saveData = () => {
    try {
      toast.success('Game settings saved!', { position: "top-center" });
      setTimeout(() => {
        console.log("redirecting")
        navigate('/');
      }, 3000);
    } catch (error) {
      toast.error('Error saving game settings!', { position: "top-center" });
    }
  }

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
          <h3 className="pb-7 p-3 mt-3 text-2xl font-interELight text-club-header-blue bg-white rounded-10px shadow-md h-[6vh]  ">
            Team 1
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
          <button onClick={saveData} className="bg-sn-main-orange text-xl mt-16 text-white font-interBold p-2 rounded-10px w-[70vw] h-16 mb-3">
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