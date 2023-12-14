import React, { useState, useEffect, useRef } from 'react';

const LocationInput = ({ onLocationChange, borderColor, isIconVisible, value ,placeholder}) => {
  const [inputValue, setInputValue] = useState(value || '');
  const autocompleteRef = useRef(null);

  useEffect(() => {
    const handlePlaceChanged = () => {
      if (autocompleteRef.current) {
        const place = autocompleteRef.current.getPlace();
        if (place && place.formatted_address) {
          setInputValue(place.formatted_address);
          onLocationChange(place.formatted_address);
        }
      }
    };

    const loadAutocomplete = () => {
      // eslint-disable-next-line no-undef
      const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('location-autocomplete'),
        { types: ['geocode'] }
      );
      autocomplete.addListener('place_changed', handlePlaceChanged);
      autocompleteRef.current = autocomplete;
    };

    if (window.google) {
      loadAutocomplete();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => loadAutocomplete();
      document.head.appendChild(script);
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onLocationChange]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    if (!event.target.value) {
      onLocationChange('');
    }
  };

  return (
    <div className='input-container w-full'>
      <div className="relative w-full">
        {isIconVisible && <img className="input-icon pt-4" src={process.env.PUBLIC_URL + "/images/map-pin.svg"} alt="map-pin" />}
        <input
          id="location-autocomplete"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`text-black font-interReg p-2 w-full border-2 pl-${isIconVisible ? '8' : '2'} border-${borderColor} h-30 rounded-10px m-auto `}
        />
      </div>
    </div>
  );
};

export default LocationInput;
