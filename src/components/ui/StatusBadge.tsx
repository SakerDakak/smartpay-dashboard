import React from 'react';
import { twMerge } from 'tailwind-merge';

type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

export interface StatusBadgeProps {
  variant?: StatusVariant;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant = 'default',
  label,
  size = 'md',
  className,
}) => {
  const variants = {
    success: 'bg-success-50 text-success-500 dark:bg-success-900/20 dark:text-success-400',
    warning: 'bg-warning-50 text-warning-500 dark:bg-warning-900/20 dark:text-warning-400',
    danger: 'bg-danger-50 text-danger-500 dark:bg-danger-900/20 dark:text-danger-400',
    info: 'bg-primary-50 text-primary-500 dark:bg-primary-900/20 dark:text-primary-400',
    default: 'bg-grey-100 text-grey-500 dark:bg-grey-800 dark:text-grey-400',
  };

  const sizes = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-5 py-1.5 text-base',
  };

  const baseClasses = 'inline-block rounded-full font-medium';
  const statusClasses = twMerge(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );

  return (
    <span className={statusClasses}>
      {label}
    </span>
  );
};

export { StatusBadge }; 