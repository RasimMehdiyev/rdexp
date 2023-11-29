import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faPlus } from "@fortawesome/free-solid-svg-icons";

const UserInput = ({ onAdd, users }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = React.useRef();

  useEffect(() => {
    if (inputValue) {
      const filtered = users.filter(user => 
        user.full_name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [inputValue, users]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddClick = () => {
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue('');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion,event) => {
    event.preventDefault();
    setInputValue(suggestion);
    setSuggestions([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputRef]);
  

  return (
    <div className="relative flex flex-col gap-1 items-start w-[90vw]">
      <div className="flex flex-row items-center">
        <input
          className="h-[6vh] pl-10 w-[80vw] rounded-10px border-2 border-game-blue font-interReg"
          placeholder="Enter user's name"
          value={inputValue}
          onChange={handleInputChange}
        />
        <div className="absolute left-3 top-2 pt-1">
          <FontAwesomeIcon icon={faUser} className="text-game-blue h-[3vh]" />
        </div>
        <button onClick={handleAddClick} className="bg-game-blue p-2 pl-3 pr-3 rounded-10px ml-auto">
          <FontAwesomeIcon icon={faPlus} className="text-white" />
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="absolute bg-white shadow-md rounded-md ml-2 w-[60vw] mt-2 z-10">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index} 
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={(e) => handleSuggestionClick(suggestion.full_name,e)}
            >
              {suggestion.full_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default UserInput;