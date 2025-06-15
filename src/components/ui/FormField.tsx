import React, { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  isRequired?: boolean;
  containerClassName?: string;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  rightIcon,
  leftIcon,
  isRequired,
  containerClassName = '',
  className = '',
  id,
  ...props
}) => {
  // إنشاء معرف فريد للحقل إذا لم يتم تمريره
  const fieldId = id || `field-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={fieldId} className="block text-sm font-medium text-grey-700 dark:text-grey-300 mb-2">
          {label} {isRequired && <span className="text-danger-600">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-4 text-grey-500 dark:text-grey-400">
            {leftIcon}
          </div>
        )}
        
        <input
          id={fieldId}
          className={`block w-full px-5 py-3.5 rounded-xl border bg-white/50 dark:bg-grey-900/50 backdrop-blur-sm placeholder-grey-400 dark:placeholder-grey-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 shadow-sm text-grey-900 dark:text-white ${
            error ? 'border-danger-500 ring-danger-500' : 'border-grey-300/70 dark:border-grey-700/70'
          } ${leftIcon ? 'pr-12' : ''} ${rightIcon ? 'pl-12' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 ml-4 text-grey-500 dark:text-grey-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p id={`${fieldId}-error`} className="mt-1.5 text-xs text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
};

export { FormField }; 