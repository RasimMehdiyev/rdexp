import React, { useState, useEffect } from 'react';
import { useCombobox } from 'downshift';

const LocationInput = ({ handleLocationInputChange }) => {
  const [inputItems, setInputItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    isOpen,
    inputValue,
    getMenuProps,
    getInputProps,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      setLoading(true);
      fetchAddresses(inputValue).then((addresses) => {
        setInputItems(addresses);
        setLoading(false);
      });
    },
  });

  const fetchAddresses = async (query) => {
    const apiKey = '22ff9dc36a8a460893811d86a9e2436c'; 
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        query
      )}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.results) {
      return data.results.map((result) => result.formatted);
    } else {
      return [];
    }
  };

  return (
    <div className='input-container'>
      
        <div className="realtive w-full">
            <img className="input-icon pt-4" src={process.env.PUBLIC_URL + "/images/map-pin.svg"} />
            <textarea
            {...getInputProps()}
            type="text"
            placeholder='Location'
            className="text-black p-3 border-2 pl-8 border-club-header-blue h-30 rounded-10px min-w-full m-auto"
            onChange={(e) => {
                // Handle location input change here
                onChange(e.target.value);}}
            maxLength={255}
            rows={4}
            />
        </div>
      <ul
        {...getMenuProps()}
        style={{
          listStyle: 'none',
          padding: 0,
          position: 'absolute',
          top: '100%', // Display below the input
          left: 0,
          zIndex: 1,
        }}
      >
        {isOpen &&
          (loading ? (
            <li>Loading...</li>
          ) : (
            inputItems.map((item, index) => (
              <li
                {...getItemProps({ item, index })}
                key={item}
                style={{
                  backgroundColor: selectedItem === item ? 'lightgray' : 'white',
                  fontWeight: selectedItem === item ? 'bold' : 'normal',
                }}
              >
                {item}
              </li>
            ))
          ))}
      </ul>
    </div>
  );
};

export default LocationInput;