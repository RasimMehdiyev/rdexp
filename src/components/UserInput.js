import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faUser } from '@fortawesome/free-regular-svg-icons';

const UserInput = ({ onAdd, users }) => {
  const [inputValue, setInputValue] = useState({ name: '', id: null });
  const [suggestions, setSuggestions] = useState([]);
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

  const handleInputChange = (e) => {
    setInputValue({ ...inputValue, name: e.target.value });
  };

  const handleAddClick = () => {
    if (inputValue.name.trim()) {
      onAdd(inputValue);
      setInputValue({ name: '', id: null }); // Reset input field and ID after adding
      setSuggestions([]); // Clear suggestions after adding
    }
  };

  const handleSuggestionClick = (user, event) => {
    event.preventDefault();
    onAdd({ name: user.full_name, id: user.id, number:user.number }); // Add the user to the parent component
    setInputValue({ name: '', id: null }); // Reset input field and ID after selecting
    setSuggestions([]); // Clear suggestions after selecting
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
          className="h-[6vh] pl-10 w-[80vw] rounded-10px border-2 border-club-header-blue font-interReg placeholder:-translate-x-2"
          placeholder="Enter user's name"
          value={inputValue.name}
          onChange={handleInputChange}
        />
        <div className="absolute left-3 top-2 pt-1">
          <FontAwesomeIcon icon={faUser} className="absolute left-1 top-2.5 h-5 text-club-header-blue" />
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
