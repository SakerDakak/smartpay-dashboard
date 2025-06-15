import React, { ReactNode } from 'react';
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

type AlertType = 'error' | 'warning' | 'success' | 'info';

interface AlertMessageProps {
  type: AlertType;
  title: string;
  message?: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
  className?: string;
  children?: ReactNode;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  type = 'error',
  title,
  message,
  actionText,
  actionLink,
  onAction,
  className = '',
  children,
}) => {
  const router = useRouter();

  const getIconAndColors = () => {
    switch (type) {
      case 'error':
        return {
          Icon: XCircleIcon,
          iconColor: 'text-danger-500',
          titleColor: 'text-danger-500',
          messageColor: 'text-grey-600 dark:text-grey-400',
        };
      case 'warning':
        return {
          Icon: ExclamationTriangleIcon,
          iconColor: 'text-warning-500',
          titleColor: 'text-warning-600',
          messageColor: 'text-grey-600 dark:text-grey-400',
        };
      case 'success':
        return {
          Icon: CheckCircleIcon,
          iconColor: 'text-success-500',
          titleColor: 'text-success-600',
          messageColor: 'text-grey-600 dark:text-grey-400',
        };
      case 'info':
        return {
          Icon: InformationCircleIcon,
          iconColor: 'text-info-500',
          titleColor: 'text-info-600',
          messageColor: 'text-grey-600 dark:text-grey-400',
        };
      default:
        return {
          Icon: XCircleIcon,
          iconColor: 'text-danger-500',
          titleColor: 'text-danger-500',
          messageColor: 'text-grey-600 dark:text-grey-400',
        };
    }
  };

  const { Icon, iconColor, titleColor, messageColor } = getIconAndColors();

  const handleAction = () => {
    if (onAction) {
      onAction();
    } else if (actionLink) {
      router.push(actionLink);
    }
  };

  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="mb-4">
        <Icon className={`h-16 w-16 mx-auto ${iconColor}`} />
      </div>
      <p className={`text-xl font-semibold mb-2 ${titleColor}`}>{title}</p>
      {message && <p className={`${messageColor} mb-6`}>{message}</p>}
      {children}
      {(actionText && (onAction || actionLink)) && (
        <button
          onClick={handleAction}
          className="px-6 py-2.5 cursor-pointer bg-primary-gradient text-white rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export { AlertMessage }; 