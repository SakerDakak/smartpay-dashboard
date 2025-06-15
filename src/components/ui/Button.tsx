import React, { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

// تعريف أنماط الزر المختلفة باستخدام class-variance-authority
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl transition-all focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed space-x-reverse space-x-2 transition-colors", 
  {
    variants: {
      variant: {
        primary: "bg-primary-gradient text-white shadow-md hover:shadow-lg focus:ring-primary-500",
        secondary: "bg-grey-100 dark:bg-grey-700 text-grey-700 dark:text-grey-300 hover:bg-grey-200 dark:hover:bg-grey-600 focus:ring-grey-500",
        danger: "bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500",
        warning: "bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500",
        success: "bg-success-500 text-white hover:bg-success-600 focus:ring-success-500",
        ghost: "bg-transparent hover:bg-grey-100 dark:hover:bg-grey-700 text-grey-700 dark:text-grey-300",
        link: "bg-transparent text-primary-600 dark:hover:bg-grey-700 dark:text-primary-400 hover:underline p-0 h-auto",
      },
      size: {
        sm: "py-1 px-3 text-sm",
        md: "py-2 px-4",
        lg: "py-3 px-6 text-lg",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    }
  }
);

// واجهة خصائص الزر
export interface ButtonProps 
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// مكون الزر
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <button
        className={twMerge(buttonVariants({ variant, size, className }), 'cursor-pointer')}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg 
            className="animate-spin -mr-1 ml-3 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {leftIcon && !isLoading && <span className='mx-2'>{leftIcon}</span>}
        {children}
        {rightIcon && <span className='mx-2'>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants }; 