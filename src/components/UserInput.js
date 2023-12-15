import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { supabase } from '../lib/helper/supabaseClient';


const UserInput = ({ onAdd, users, isPlayer }) => {
  const [inputValue, setInputValue] = useState({ name: '', id: null });
  const [suggestions, setSuggestions] = useState([]);
  const [inputError, setInputError] = useState(false);
  const inputRef = useRef();
  const suggestionsRef = useRef();

  useEffect(() => {
    if (inputValue.name) {
      const filtered = users.filter(user => 
        user.full_name.toLowerCase().includes(inputValue.name.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [inputValue.name, users]);
  

  const handleInputChange = async (e) => {
    setInputValue({ ...inputValue, name: e.target.value });
    if (inputError) {
      setInputError(false); // Reset error state when user starts typing again
    }
  };

  const handleAddClick = async () => {
    const roleName = isPlayer ? 'Player' : 'Extra';
    try {
      const { data, error } = await checkConstraints(inputValue.name);
  
      if (error) {
        setInputError(`Error checking constraints: ${error.message}`);
        return;
      }
      const user = data.data[0];
      if (user && user.user_id != null) { 
        onAdd({ ...inputValue, id: user.user_id, number: user.user_number });
        setInputValue({ name: '', id: null }); // Reset inputValue
        setSuggestions([]);
      } else {
        setInputError(`This ${roleName} not found or does not meet criteria.`);
      }
    } catch (error) {
      setInputError(`Error checking constraints: ${error.message}`);
    } 
  };
  


  const handleSuggestionClick = (user, event) => {
    event.preventDefault();
    onAdd({ name: user.full_name, id: user.id, number:user.number }); // Add the user to the parent component
    setInputValue({ name: '', id: null }); // Reset input field and ID after selecting
    setSuggestions([]); // Clear suggestions after selecting
    setInputError(false);
  };

  const checkConstraints = async (fullName) => {
    try {
      const response = await supabase.rpc('check_user_role_constraints', {
        user_name_to_check: fullName,
        is_player: isPlayer,
      });
      return { data: response, error: null };
    } catch (error) {
      return { data: null, error: error };
    }
  };
  
  
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target) &&
          suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputRef, suggestionsRef]); // Add suggestionsRef as a dependency
  

  return (
    <div className="relative flex flex-col gap-1 items-start w-[90vw]">
      <div className="flex flex-row items-center" ref={inputRef}>
        <input
          className={`h-[6vh] pl-10 w-[80vw] rounded-10px border-2 ${inputError ? 'border-red-500 bg-red-100 text-red-500' : 'border-club-header-blue bg-white'} font-interReg placeholder:-translate-x-2`}
          placeholder="Enter user's name"
          value={inputValue.name}
          onChange={handleInputChange}
        />
        <div className="absolute left-3 top-2 pt-1">
          <FontAwesomeIcon icon={faUser} className={`absolute left-1 top-2.5 h-5  ${inputError ? 'text-red-500' : 'text-club-header-blue'}`} />
        </div>
        <button
          onClick={handleAddClick}
          className={`bg-club-header-blue ml-2 p-2 pl-3 pr-3 rounded-10px ${
            inputValue.name === '' ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={inputValue.name === ''}>
          <FontAwesomeIcon icon={faPlus} className="text-white" />
        </button>
      </div>
      {inputError && <p className="text-red-500 text-sm mt-2">{inputError}</p>}
      {suggestions.length > 0 && (
        <div className="absolute bg-white shadow-md rounded-md ml-2 w-[60vw] mt-12 z-10">
          {suggestions.map((user) => (
            <div 
              key={user.id} 
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={(e) => handleSuggestionClick(user, e)}
            >
              {user.full_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserInput;
