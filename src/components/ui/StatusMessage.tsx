import React, { ReactNode } from 'react';
import {
  ExclamationCircleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

type StatusType = 'error' | 'warning' | 'success' | 'info';

export interface StatusMessageProps {
  type: StatusType;
  message: string | ReactNode;
  className?: string;
  onClose?: () => void;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
  type = 'error',
  message,
  className = '',
  onClose,
}) => {
  const getIconAndClasses = () => {
    switch (type) {
      case 'error':
        return {
          Icon: XCircleIcon,
          containerClass: 'bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400',
        };
      case 'warning':
        return {
          Icon: ExclamationCircleIcon,
          containerClass: 'bg-warning-50 dark:bg-warning-900/20 text-warning-700 dark:text-warning-400',
        };
      case 'success':
        return {
          Icon: CheckCircleIcon,
          containerClass: 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400',
        };
      case 'info':
        return {
          Icon: InformationCircleIcon,
          containerClass: 'bg-info-50 dark:bg-info-900/20 text-info-700 dark:text-info-400',
        };
      default:
        return {
          Icon: XCircleIcon,
          containerClass: 'bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400',
        };
    }
  };

  const { Icon, containerClass } = getIconAndClasses();

  return (
    <div className={`p-4 rounded-lg flex items-start justify-between ${containerClass} ${className}`}>
      <div className="flex items-start">
        <Icon className="h-5 w-5 mt-0.5 ml-2 flex-shrink-0" />
        <div>{message}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="إغلاق"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default StatusMessage; 