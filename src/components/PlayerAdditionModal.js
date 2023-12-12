import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { supabase } from '../lib/helper/supabaseClient';

const PlayerAdditionModal = ({ isOpen, onClose, onSave, isPlayer, teamId }) => {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);


  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
      setInputError(false);
    }
  }, [isOpen]);


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (inputError) {
      setInputError(false); // Reset error state when user starts typing again
    }
  };


  const handleSave = async () => {
    try {
      const { data, error } = await checkConstraints(inputValue);
      console.log(data, error)
      if (error) {
        setInputError('Error checking constraints: ' + error.message);
      } else if (data) {
        onSave(data);
        setInputValue('');
        onClose();
      } else {
        setInputError('Player not found or does not meet criteria.');
      }
    } catch (error) {
      setInputError('Error checking constraints: ' + error.message);
    }
    console.log(inputError)
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
      throw error;
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
                  className={`placeholder:-translate-x-3 pl-10 border ${inputError ? 'border-red-500' : 'border-club-header-blue'} ${inputError ? 'bg-red-100' : 'bg-white'} h-12 w-full rounded-10px text-lg ${inputError ? 'text-red-500' : 'text-club-header-blue'}`}
                  placeholder={isPlayer ? "Enter player's name" : "Enter name"}
                />
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className={`inline-flex justify-center px-4 py-2 text-lg font-interELight text-white bg-club-header-blue rounded-10px w-full ${inputValue ? '' : 'opacity-50 cursor-not-allowed'}`}
                  onClick={handleSave}
                  disabled={!inputValue}
                >
                  SAVE
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PlayerAdditionModal;
