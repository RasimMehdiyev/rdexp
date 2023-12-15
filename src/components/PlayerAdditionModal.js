import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { supabase } from '../lib/helper/supabaseClient';
import PersonTag from './PersonTagNotDeletable';
import { toast, ToastContainer } from 'react-toastify';


const PlayerAdditionModal = ({ isOpen, onClose, onSave, isPlayer, teamId}) => {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const [players, setPlayers] = useState([]); // [user_id, user_name]
  const [extras, setExtras] = useState([]); // [user_id, user_name]
  const [suggestions, setSuggestions] = useState([]); // [user_id, user_name
  const [isSelectionValid, setIsSelectionValid] = useState(false); // [user_id, user_name


  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
      setInputError(false);
      setSuggestions([]);
    }
  }, [isOpen]);

  useEffect(() => {
    // get all users with role_id 2 and 3
    const getAllPlayers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id,full_name, number, role_id');

        if (error) {
          console.error('Error fetching users:', error);
          return;
        }

        // setUsers(data);
        setExtras(data.filter(user => user.role_id === 3));
        setPlayers(data.filter(user => user.role_id === 2));
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    getAllPlayers();
  },[])


  useEffect(() => {
  },[players, extras])


  const handleInputChange = async (e) => {
    setInputValue(e.target.value);
    setIsSelectionValid(false);
    const { data, error } = await checkConstraints(inputValue);
    if (inputError) {
      setInputError(false); // Reset error state when user starts typing again
    }

    const filteredSuggestions = isPlayer 
    ? players.filter(player => player.full_name.toLowerCase().includes(inputValue.toLowerCase())) 
    : extras.filter(extra => extra.full_name.toLowerCase().includes(inputValue.toLowerCase()));

    setSuggestions(filteredSuggestions);
  };


  const handleSuggestionClick = (fullName) => {
    setInputValue(fullName);
    setSuggestions([]); // Clear suggestions after selection
    setIsSelectionValid(true);
  };

  const handleSave = async () => {
    const roleName = isPlayer ? 'Player' : 'Extra';
    try {
      const { data, error } = await checkConstraints(inputValue);
      if (error) {
        setInputError('This ' + roleName + ' is already part of the team. Please try someone else.');
      } else if (data) {

        if (data.exists){
          setInputError('This ' + roleName + ' is already part of the team. Please try someone else.');
        }
        else{
          onSave(data);
          setInputValue('');
          onClose();
          toast.success(roleName + ' added successfully!', { position: "top-center", zIndex: 50, autoClose: 3000 });
        }
      } else {
        setInputError('This '+ roleName +' not found or does not meet criteria.');
      }
    } catch (error) {
      setInputError('Error checking constraints: ' + error.message);
      // toast.error('Error checking constraints: ' + error.message, { position: "top-center", zIndex: 50, autoClose: 3000 });
    }
    finally{
      setInputValue('');

    }
  };

  const checkConstraints = async (fullName) => {
    try {
      const { data, error } = await supabase.rpc('check_user_addition_constraints', {
        team_id_to_check: teamId,
        user_name_to_check: fullName,
        is_player: isPlayer, 

      });

      return { data, error };
    } catch (error) {
      console.error('Error in checkConstraints:', error);
      return { error };
    }
  };
  


  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-11/12 sm:w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-blue-200 shadow-xl rounded-lg">
              <Dialog.Title as="h3" className="text-2xl leading-6 text-club-header-blue font-russoOne">
                {isPlayer ? 'ADD PLAYER' : 'ADD EXTRA'}
              </Dialog.Title>
              <div className="mt-4 relative">
                <FontAwesomeIcon icon={faUser} className={`absolute left-3.5 top-3.5 h-5 ${inputError ? 'text-red-500' : 'text-club-header-blue'}`} />
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  className={`pl-10 border-2 ${inputError ? 'border-red-500 bg-red-100 text-red-500' : 'border-club-header-blue bg-white '} h-12 w-full rounded-10px text-lg placeholder:-translate-x-2`}
                  placeholder={isPlayer ? "Enter player's name" : "Enter name"}
                />
                    {inputError && <p className="text-red-500 text-sm mt-2">{inputError}</p>}
              </div>
                {/* Suggestions List */}
                {suggestions.length > 0 && (
                  <div className="mt-2 max-h-40 overflow-auto z-20">
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index}                           
                        onClick={() => handleSuggestionClick(suggestion.full_name)}
                        className='py-2'
                      >
                        <PersonTag 
                          id={suggestion.id}
                          name={suggestion.full_name}
                          number={suggestion.number}
                          team={null}
                          isPlayer={isPlayer}
                        />
                      </div>

                    ))}
                  </div>
                )}
              <div className="mt-4">
                <button
                  type="button"
                  className={`inline-flex justify-center px-4 py-2 text-lg font-interELight text-white bg-club-header-blue rounded-10px w-full ${isSelectionValid ? '' : 'opacity-50 cursor-not-allowed'}`}
                  onClick={handleSave}
                  disabled={!isSelectionValid}
                >
                  SAVE
                </button>
              </div>
              <ToastContainer />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PlayerAdditionModal;
