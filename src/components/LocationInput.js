import React, { useState, useEffect } from 'react';
import { useCombobox } from 'downshift';

const LocationInput = () => {
  const [inputItems, setInputItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isOpen, inputValue, getMenuProps, getInputProps, getItemProps, selectedItem } = useCombobox({
    items: inputItems,
    onInputValueChange: ({ inputValue }) => {
      // Fetch and update the list of addresses based on user input
      setLoading(true);
      fetchAddresses(inputValue).then((addresses) => {
        setInputItems(addresses);
        setLoading(false);
      });
    },
  });

  const fetchAddresses = async (query) => {
    // Implement your address fetching logic here, for example, using an API like OpenCage
    // This is a simplified example; you'll need to replace it with your actual API calls
    const apiKey = '22ff9dc36a8a460893811d86a9e2436c';
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.results) {
      return data.results.map((result) => result.formatted);
    } else {
      return [];
    }
  };

  return (
    <div>
      <input {...getInputProps()} placeholder="Enter address" />
      <ul {...getMenuProps()} style={{ listStyle: 'none', padding: 0 }}>
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