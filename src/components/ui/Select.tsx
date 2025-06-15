import React, { SelectHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string | null;
  helperText?: string;
  fullWidth?: boolean;
  isRequired?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const { 
    className, 
    label, 
    options, 
    error, 
    helperText, 
    fullWidth = true,
    isRequired,
    id,
    ...rest 
  } = props;
  
  // إنشاء معرف فريد للحقل إذا لم يتم تمريره
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
  
  // بناء فئات CSS للقائمة المنسدلة
  const selectClasses = twMerge(
    "rounded-xl border py-3 px-4 text-grey-800 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all",
    "border-grey-300 dark:border-grey-700 bg-white/50 dark:bg-grey-800/60",
    "appearance-none bg-no-repeat bg-[right_0.75rem_center]",
    error ? "border-danger-500 focus:ring-danger-500" : "",
    fullWidth ? "w-full" : "",
    className
  );
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {/* تسمية الحقل */}
      {label && (
        <label 
          htmlFor={selectId}
          className="block mb-2 text-sm font-medium text-grey-700 dark:text-grey-300"
        >
          {label} {isRequired && <span className="text-danger-600">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          className={selectClasses}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          required={isRequired}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* أيقونة السهم للقائمة المنسدلة */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pr-3 text-grey-500">
          <svg 
            className="h-5 w-5 transform rotate-90" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      </div>
      
      {/* نص المساعدة */}
      {helperText && !error && (
        <p id={`${selectId}-helper`} className="mt-1 text-xs text-grey-500 dark:text-grey-400">
          {helperText}
        </p>
      )}
      
      {/* رسالة الخطأ */}
      {error && (
        <p id={`${selectId}-error`} className="mt-1 text-xs text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export { Select }; 