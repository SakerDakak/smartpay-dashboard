import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

interface LogoutAlertProps {
  message: string;
  isOpen: boolean;
}

const LogoutAlert: React.FC<LogoutAlertProps> = ({ message, isOpen }) => {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    if (isOpen) {
      // عند فتح الإشعار، قم بتسجيل الخروج بعد 3 ثوان
      const timer = setTimeout(() => {
        logout();
        router.push('/login');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, logout, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-grey-800 max-w-md w-full p-6 rounded-xl shadow-lg border border-danger-300 dark:border-danger-700 transform transition-all">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-danger-100 dark:bg-danger-900/50 flex items-center justify-center text-danger-600 dark:text-danger-400">
            <ShieldExclamationIcon className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-danger-600 dark:text-danger-400">تسجيل خروج إجباري</h2>
          <p className="text-grey-700 dark:text-grey-300">{message}</p>
          <p className="text-sm text-grey-500 dark:text-grey-400">سيتم تسجيل خروجك خلال لحظات...</p>
        </div>
      </div>
    </div>
  );
};

export {LogoutAlert}; 