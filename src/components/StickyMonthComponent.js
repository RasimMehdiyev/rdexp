import React from 'react'
import { Link } from 'react-router-dom'

export const StickyMonthComponent = ({currentMonth}) => {
    return (
        <div className="sticky top-16 z-10 bg-white py-2">
          <h2 className="text-4xl font-bold">{currentMonth}</h2>
        </div>
      );
}

export default StickyMonthComponent;
