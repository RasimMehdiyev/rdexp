import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/helper/supabaseClient';


const ToggleSwitch = ({ userId, eventId }) => {
  const [toggleState, setToggleState] = useState(2); // Default to Pending

  useEffect(() => {
    // Fetch the current state from the database
    const fetchCurrentState = async () => {
      try {
        const { data, error } = await supabase
          .from('event_users')
          .select('is_attending')
          .eq('user_id', userId)
          .eq('event_id', eventId)
          .single();

        if (error) throw error;

        switch (data.is_attending) {
          case 'Accepted':
            setToggleState(1);
            break;
          case 'Declined':
            setToggleState(3);
            break;
          default:
            setToggleState(2); // Default to Pending
        }
      } catch (error) {
        console.error('Error fetching attendance status', error);
      }
    };

    fetchCurrentState();
  }, [userId, eventId]);

  const handleToggle = async (event) => {
    const value = parseInt(event.target.value, 10);
    event.stopPropagation();
    setToggleState(value);

    let attendanceStatus;
    switch (value) {
      case 1:
        attendanceStatus = 'Accepted';
        break;
      case 3:
        attendanceStatus = 'Declined';
        break;
      default:
        attendanceStatus = 'Pending';
    }

    // Update the database
    try {
      const { error } = await supabase
        .from('event_users')
        .update({ is_attending: attendanceStatus })
        .match({ user_id: userId, event_id: eventId });

      if (error) throw error;

    } catch (error) {
      console.error('Error updating attendance status', error);
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

  return (
    <div className="flex flex-col items-center relative">
      <div className='absolute font-interBond text-sm text-orange-700 bottom-[25px] left-[5px]'>attend?</div>
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
        <div
          className="absolute font-interBold text-md top-1/2 left-[40px] transform -translate-x-1/2 -translate-y-1/2 text-white"
          style={{ pointerEvents: 'none' }}
        >
          ✓
        </div>
      )}
      {toggleState === 3 && (
        <div
          className="absolute font-arialBold text-xs top-[13px] left-[16px] transform -translate-x-1/2 -translate-y-1/2 text-white"
          style={{ pointerEvents: 'none' }}
        >
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
