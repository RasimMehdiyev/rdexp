import React, { useState, useEffect, useRef } from 'react';

const LocationInput = ({ onLocationChange, borderColor, isIconVisible, value }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const autocompleteRef = useRef(null);
  const googleMapsScriptId = 'google-maps-script'; // Unique ID for the script tag

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
      const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('location-autocomplete'),
        { types: ['geocode'] }
      );
      autocomplete.addListener('place_changed', handlePlaceChanged);
      autocompleteRef.current = autocomplete;
    };

    if (!document.getElementById(googleMapsScriptId) && !window.google) {
      const script = document.createElement('script');
      script.id = googleMapsScriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAbIeGNneNcbNWvjaa225b4v4zpU5B2TpU&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => loadAutocomplete();
      document.head.appendChild(script);
    } else if (window.google) {
      loadAutocomplete();
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onLocationChange]);

  useEffect(() => {
    setInputValue(value);
  }, [value, setInputValue]);

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
        <textarea
          id="location-autocomplete"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Location"
          rows={3}
          className={`text-black font-interReg p-2 w-full mb-2 border-2 pl-${isIconVisible ? '10' : '2'} border-${borderColor} h-30 rounded-10px m-auto `}
        />
      </div>
    </div>
  );
};

export default LocationInput;
