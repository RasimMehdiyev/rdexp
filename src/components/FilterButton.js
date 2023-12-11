import React, { useState } from 'react';

// Exporting the FilterButton component
const FilterButton = ({ setShowFilterOptions, showFilterOptions, filter, handleFilterChange }) => {
  return (
    <div className="fixed top-[69px] right-[20px] z-20">
      <button
        id="filter-button"
        className="bg-sn-light-orange text-white rounded-10px text-3xl p-[4px] shadow-sm flex items-center justify-center"
        style={{ width: '36px', height: '36px' }}
        onClick={() => setShowFilterOptions(!showFilterOptions)}
      >
        <img
          src={process.env.PUBLIC_URL + "/images/filter.svg"}
          alt="Filter Icon"
        />
      </button>
      {/* Filter Options */}
      {showFilterOptions && (
        <div className="absolute mt-1 right-[-3px] bg-white rounded-md shadow-md p-4 bg-[#DDD] w-[140px]">
          <p
            className={`cursor-pointer ${filter === 'all' ? 'text-sn-light-orange font-bold' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All
          </p>
          <p
            className={`cursor-pointer ${filter === 'practice' ? 'text-sn-light-orange font-bold' : ''}`}
            onClick={() => handleFilterChange('practice')}
          >
            Practice
          </p>
          <p
            className={`cursor-pointer ${filter === 'game' ? 'text-sn-light-orange font-bold' : ''}`}
            onClick={() => handleFilterChange('game')}
          >
            Game
          </p>
          <p
            className={`cursor-pointer ${filter === 'team building' ? 'text-sn-light-orange font-bold' : ''}`}
            onClick={() => handleFilterChange('team building')}
          >
            Team building
          </p>
        </div>
      )}
    </div>
  );
};

export default FilterButton;  // Export the FilterButton component as the default export
