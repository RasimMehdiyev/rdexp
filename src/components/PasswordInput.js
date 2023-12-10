import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const PasswordInput = ({
  isPasswordMatch,
  passwordLengthError,
  showPassword,
  handlePasswordChange,
  handlePasswordBlur,
  togglePasswordVisibility,
  password,
  placeholder,
  placeholderColor, // New prop for the placeholder color
}) => {
  const isPasswordEmpty = password.trim() === '';

  
  const borderClass = !isPasswordMatch || passwordLengthError
    ? 'border-red-500'
    : `border-${placeholderColor}`;

  return (
    <div className="relative w-full flex items-center">
      <input
        className={`flex-1 shadow-md placeholder-text text-[16px] pl-2 font-interReg h-12 rounded-lg border-2
          ${borderClass}
          ${!isPasswordMatch || passwordLengthError ? 'text-red-500' : `text-${placeholderColor}`}
          placeholder-${placeholderColor}`}
        placeholder={placeholder}
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(event) => handlePasswordChange(event)}
        onBlur={handlePasswordBlur}
        maxLength={16}
      />
      {!isPasswordEmpty && (
        <button
          type="button"
          className="password-toggle-button absolute right-2 top-3"
          onClick={togglePasswordVisibility}
        >
          <FontAwesomeIcon
            className={`${!isPasswordMatch || passwordLengthError ? 'text-red-500' : `text-${placeholderColor}`}`}
            icon={showPassword ? faEye : faEyeSlash}
          />
        </button>
      )}
    </div>
  );
};

export default PasswordInput;