import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'grey' | 'white';
  className?: string;
  thickness?: 'thin' | 'regular' | 'thick';
  label?: string;
  fullPage?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
  thickness = 'regular',
  label,
  fullPage = false,
}) => {
  // تحديد حجم الدوران بناءً على حجم المكون
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };
  
  // تحديد سُمك الحدود
  const thicknesses = {
    thin: 'border',
    regular: 'border-2',
    thick: 'border-4',
  };
  
  // تحديد اللون
  const colors = {
    primary: 'border-primary-500',
    grey: 'border-grey-500',
    white: 'border-white',
  };
  
  // تجميع CSS classes
  const spinnerClasses = twMerge(
    'animate-spin rounded-full',
    sizes[size],
    thicknesses[thickness],
    `${colors[color]} border-t-transparent`,
    className
  );
  
  // إنشاء المكون الداخلي للدوران
  const spinnerElement = (
    <div 
      role="status" 
      className={fullPage ? 'flex flex-col items-center justify-center gap-3' : 'inline-block'}
    >
      <div className={spinnerClasses} />
      {label && (
        <span className={`text-${color === 'white' ? 'white' : `grey-${color === 'primary' ? '600' : '500'}`} ${fullPage ? 'text-sm' : 'sr-only'}`}>
          {label}
        </span>
      )}
      <span className="sr-only">جاري التحميل...</span>
    </div>
  );
  
  // إذا كان مطلوبًا عرض الدوران على كامل الصفحة
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-grey-900/70 dark:bg-grey-900/90 flex items-center justify-center z-50">
        {spinnerElement}
      </div>
    );
  }
  
  return spinnerElement;
};

export { Spinner }; 