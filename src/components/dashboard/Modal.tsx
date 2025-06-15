import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 mt-20">
      <div className={`bg-white dark:bg-grey-800 rounded-lg shadow-xl overflow-hidden w-full ${sizeClasses[size]}`}>
        <div className="flex items-center justify-between p-4 border-b border-grey-200 dark:border-grey-700">
          <h3 className="text-xl font-semibold text-grey-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-grey-500 hover:text-grey-700 dark:text-grey-400 dark:hover:text-grey-200"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 