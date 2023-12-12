import React, { useEffect } from 'react'
import PersonTag from '../components/PersonTag.js';
import UserInput from '../components/UserInput.js';
import {Link,useNavigate,useLocation} from 'react-router-dom'
import { supabase } from '../lib/helper/supabaseClient';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const TeamCreatePage = () => {
  const navigate = useNavigate();
  

  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState([]);
  const [extras, setExtras] = useState([]);
  const [teamID, setTeamID] = useState(localStorage.getItem('teamID')); // [team_id, team_name]
  const [users, setUsers] = useState([]); // [user_id, user_name]

  const handleTeamNameChange = (e) => {
    setTeamName(e.target.value);
  };

  const addPlayer = (player) => {
    if (players.some(p => p.name === player.name)) {
      toast.warning('Player already exists!', { position: "top-center" });
      return;
    }

    const newPlayer = {
      id: player.id,
      name: player.name,
      number: player.number, // Make sure this is the correct value you want to display
      isPlayer: true,  // Make sure to pass these properties if they are needed in PersonTag
      isMember: false  // Make sure to pass these properties if they are needed in PersonTag
    };
    setPlayers([...players, newPlayer]);
  };
  
  
  const addExtra = (extra) => {
    const newExtra = {
      id: extra.id,
      name: extra.name,
      number: "EX", // or any appropriate value
      isPlayer: false,
      isMember: false
    };
    setExtras([...extras, newExtra]);
  };
  
  
  const getAllPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name,number');

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      setUsers(data);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  useEffect(() => {
    getAllPlayers();
  }, []);

  // Log users after the state has been updated
  useEffect(() => {
    console.log('Updated users:', users);
  }, [users]);


  
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log({ teamName, players, extras, teamID });
  
    // First, update the team name
    try {
      const { data: updateData, error: updateError } = await supabase
        .from('team')
        .update({ team_name: teamName })
        .eq('id', teamID);
  
      if (updateError) throw updateError;


      // add coach (authorized user to the team)
      const { data: coachData, error: coachError } = await supabase
        .from('team_users')
        .insert([
          {
            user_id: localStorage.getItem('userID'),
            team_id: teamID,
          }
        ]);

      // If team update is successful, proceed to add players
      const insertPromises = players.map(player => {
        return supabase
          .from('team_users')
          .insert([
            {
              user_id: player.id,
              team_id: teamID,
            }
          ]);
      });
  
      const results = await Promise.all(insertPromises);
      results.forEach(({ data, error }) => {
        if (error) {
          console.error('Error inserting data:', error);
        } else {
          console.log('Insertion successful:', data);
        }
      });

      toast.success('Team created successfully! Redirecting...', { position: "top-center", zIndex: 50});
      setTimeout(() => {
          console.log("redirecting")
        navigate('/club/create/settings');
      }, 3000); 
    } catch (error) {
      toast.error(error.error_description || error.message, { position: "top-center" });
    }
   
  };
  

  const deletePlayer = (playerName) => {
    setPlayers(players.filter(player => player.name !== playerName));
  };

  const deleteExtra = (extraName) => {
    setExtras(extras.filter(extra => extra.name !== extraName));
  };

  return (
    <div className="flex flex-col min-h-screen bg-sn-bg-light-blue">
      <div className="flex-grow">
      <div className='text-center'>
          <h1 className="pt-20 text-5xl text-club-header-blue">
            CREATE 
          </h1>
          <h1 className="pt-2 text-5xl text-club-header-blue">
            YOUR TEAM
          </h1>
          <input
            className="mt-5 h-12 p-2 w-[60vw] rounded-10px border-2 border-club-header-blue font-interReg placeholder-text"
            placeholder="Team name"
            value={teamName}
            onChange={handleTeamNameChange}
            maxLength={30}
          />
        </div>

        <div className='pl-5'>
          <h1 className="pt-7 text-3xl text-club-header-blue">
              Add players
          </h1>
          <h3 className="pb-4 text-sm font-interELight text-club-header-blue">
              Build your team by adding at least one player.
            </h3>

          {players.map((player, index) => (
            <PersonTag key={index} {...player} onDelete={deletePlayer} />        
          ))}

          <UserInput onAdd={addPlayer} users={users} />
          <h1 className="pt-7 pb-4 text-3xl text-club-header-blue">
              Add extras
          </h1>


          {extras.map((extra, index) => (
            <PersonTag key={index} {...extra} onDelete={deleteExtra} />        
          ))}
          <UserInput onAdd={addExtra} users={users} />
        </div>
      </div>


      <div className="flex-shrink-0 text-center mb-10 flex flex-col items-center">
          <button
            onClick={handleSubmit}
            className={`bg-sn-main-orange text-white mt-16 font-interBold text-xl p-2 rounded-10px w-[70vw] h-16 ${
              (teamName.length === 0 || players.length === 0) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
            disabled={teamName.length === 0 || players.length === 0}>
            SAVE
        </button>

        <Link to="/club/create/settings" className=" text-club-header-blue pt-5 underline underline-offset- font-interElight p-2 rounded-10px w-[70vw] h-12 ">
          skip this step
        </Link>
      </div>
      <ToastContainer/>
    </div>
  )
}

export default TeamCreatePage