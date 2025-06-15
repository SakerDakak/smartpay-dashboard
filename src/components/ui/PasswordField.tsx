import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface PasswordFieldProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  helpText?: string;
  isError?: boolean;
  error?: string | null;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder = '••••••••',
  label,
  required = false,
  helpText,
  isError = false,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-grey-700 dark:text-grey-300"
        >
          {label} {required && <span className="text-danger-600">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border ${
            isError || error
              ? 'border-danger-500 dark:border-danger-600'
              : 'border-grey-300 dark:border-grey-700'
          } bg-white/50 dark:bg-grey-800/60 py-3 px-4 pe-12 text-grey-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
          required={required}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 left-0 pl-3 flex items-center text-grey-500 dark:text-grey-400 hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <EyeIcon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
      {helpText && !error && (
        <p className="mt-1 text-xs text-grey-500 dark:text-grey-400">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-danger-600 dark:text-danger-400">{error}</p>
      )}
    </div>
  );
};

export { PasswordField }; 