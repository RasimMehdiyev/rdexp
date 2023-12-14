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
        return 'bg-[#3de043]'; // Green background when on the left
      case 2:
        return 'bg-[#c2c2d1]'; // Default background color in the middle
      case 3:
        return 'bg-[#e35258]'; // Red background when on the right
      default:
        return 'bg-[#ebebf2]';
    }
  };

  const displayCheckmark = toggleState === 1; // Display checkmark when the button is green

  return (
    <div className="flex flex-col items-center relative p-2">
        <div className='absolute font-inter text-sm font-bold text-orange-700 bottom-[33px] left-[11px]'>attend?</div>
      <input
        type="range"
        name="points"
        onChange={handleToggle}
        min="1"
        step="1"
        max="3"
        value={toggleState}
        id="custom-toggle"
        className={`tgl appearance-none w-14 h-6 ${getBackgroundColor()} rounded-full p-0 cursor-pointer`}
        style={{
          '--thumb-size': '1.50rem',
          '--thumb-color': 'gray',
          '--thumb-border-radius': '50%',
        }}
      />
      {toggleState === 1 && (
        <div className="absolute font-inter text-md font-bold top-1/2 left-[48px] transform -translate-x-1/2 -translate-y-1/2 text-white">
          ✓
        </div>
      )}
      {toggleState === 3 && (
        <div className="absolute font-arial text-xs top-[20px] left-[24px] transform -translate-x-1/2 -translate-y-1/2 text-white">
          X
        </div>
      )}
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
