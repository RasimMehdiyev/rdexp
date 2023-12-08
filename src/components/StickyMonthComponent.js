import React from 'react'
import { Link } from 'react-router-dom'

export const StickyMonthComponent = ({currentMonth}) => {
    return (
        <div className="sticky top-16 z-10 bg-white drop-shadow-[0_0px_5px_rgba(255,255,255,0.7)] py-2">
          <h2 className="text-3xl text-gray-700 font-bold ml-2">{currentMonth}</h2>
        </div>
      );
}

export default StickyMonthComponent;
