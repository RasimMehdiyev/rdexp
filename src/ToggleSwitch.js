import React, { useState } from 'react';

const ToggleSwitch = ({ onToggle }) => {
  const [toggleState, setToggleState] = useState(2);

  const handleToggle = (event) => {
    const value = parseInt(event.target.value, 10);
    setToggleState(value);
    if (onToggle) {
      onToggle(value);
    }
  };

  const getBackgroundColor = () => {
    switch (toggleState) {
      case 1:
        return 'bg-[#06b80f]'; // Green background when on the left
      case 2:
        return 'bg-[#ebebf2]'; // Default background color in the middle
      case 3:
        return 'bg-[#d9434a]'; // Red background when on the right
      default:
        return 'bg-[#ebebf2]';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="range"
        name="points"
        onChange={handleToggle}
        min="1"
        step="1"
        max="3"
        value={toggleState}
        id="custom-toggle"
        className={`tgl appearance-none focus:outline-none w-9 h-4 ${getBackgroundColor()} rounded-full p-0 cursor-pointer`}
        style={{
          '--thumb-size': '1rem',
          '--thumb-color': 'gray',
          '--thumb-border-radius': '50%',
        }}
      />
      <style>
        {`
          #custom-toggle::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: var(--thumb-size);
            height: var(--thumb-size);
            background-color: var(--thumb-color);
            border-radius: var(--thumb-border-radius);
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

export default ToggleSwitch;
