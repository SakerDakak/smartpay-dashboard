import React, { InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  helperText?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  fullWidth?: boolean;
  isRequired?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { 
    className, 
    label, 
    error, 
    helperText, 
    leftAddon, 
    rightAddon, 
    fullWidth = true, 
    isRequired, 
    id,
    ...rest 
  } = props;
  
  // إنشاء معرف فريد للحقل إذا لم يتم تمريره
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  // بناء فئات CSS للإدخال
  const inputClasses = twMerge(
    "rounded-xl border py-3 px-4 text-grey-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all",
    "border-grey-300 dark:border-grey-700 bg-white/50 dark:bg-grey-800/60",
    error ? "border-danger-500 focus:ring-danger-500" : "",
    leftAddon ? "rounded-r-none" : "",
    rightAddon ? "rounded-l-none" : "",
    fullWidth ? "w-full" : "",
    className
  );
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {/* تسمية الحقل */}
      {label && (
        <label 
          htmlFor={inputId} 
          className="block mb-2 text-sm font-medium text-grey-700 dark:text-grey-300"
        >
          {label} {isRequired && <span className="text-danger-600">*</span>}
        </label>
      )}
      
      {/* مجموعة الإدخال مع الإضافات */}
      <div className={`${leftAddon || rightAddon ? 'flex' : ''}`}>
        {leftAddon && (
          <div className="inline-flex items-center rounded-l-xl border border-grey-300 dark:border-grey-700 rounded-r-none bg-white/50 dark:bg-grey-800/60 py-3 px-4 text-grey-800 dark:text-white">
            {leftAddon}
          </div>
        )}
        
        <input
          id={inputId}
          ref={ref}
          className={inputClasses}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          required={isRequired}
          {...rest}
        />
        
        {rightAddon && (
          <div className="inline-flex items-center rounded-r-xl border border-grey-300 dark:border-grey-700 rounded-l-none bg-white/50 dark:bg-grey-800/60 py-3 px-4 text-grey-800 dark:text-white">
            {rightAddon}
          </div>
        )}
      </div>
      
      {/* نص المساعدة */}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="mt-1 text-xs text-grey-500 dark:text-grey-400">
          {helperText}
        </p>
      )}
      
      {/* رسالة الخطأ */}
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input }; 