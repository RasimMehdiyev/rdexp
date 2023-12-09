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
}) => {
  const isPasswordEmpty = password.trim() === '';

  return (
    <div className="relative w-full flex items-center">
      <input
        className={`flex-1 shadow-md placeholder-text text-[16px] pl-2 font-interReg h-12 rounded-lg border-2 border-club-header-blue
          ${!isPasswordMatch || passwordLengthError ? 'border-red-500' : 'border-club-header-blue'}
          ${!isPasswordMatch || passwordLengthError ? 'text-red-500' : ''}`}
        placeholder={placeholder}
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(event) => handlePasswordChange(event)}
        onBlur={handlePasswordBlur}
        maxLength={16}
      />
      { !isPasswordEmpty &&
        <button
          type="button"
          className="password-toggle-button absolute right-2 top-3"
          onClick={togglePasswordVisibility}
        >
          <FontAwesomeIcon className="text-club-header-blue" icon={showPassword ? faEye : faEyeSlash} />
        </button>
      }
    </div>
  );
};

export default PasswordInput;