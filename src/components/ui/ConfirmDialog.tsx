import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'error' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'موافق',
  cancelText = 'إلغاء',
  onConfirm,
  onCancel,
  type = 'warning',
}) => {
  if (!isOpen) return null;

  // تحديد الألوان حسب النوع
  const getColors = () => {
    switch (type) {
      case 'error':
        return {
          icon: 'text-danger-500',
          confirmBtn: 'bg-danger-600 hover:bg-danger-700',
        };
      case 'warning':
        return {
          icon: 'text-warning-500',
          confirmBtn: 'bg-warning-600 hover:bg-warning-700',
        };
      case 'info':
        return {
          icon: 'text-info-500',
          confirmBtn: 'bg-info-600 hover:bg-info-700',
        };
      default:
        return {
          icon: 'text-warning-500',
          confirmBtn: 'bg-warning-600 hover:bg-warning-700',
        };
    }
  };

  const { icon, confirmBtn } = getColors();

  return (
    <div className="fixed inset-0 z-[50] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* طبقة التعتيم الخلفية */}
        <div
          className="fixed inset-0 z-[-1] bg-grey-900/60 transition-opacity"
          aria-hidden="true"
          onClick={onCancel}
        ></div>

        {/* محاذاة مركزية عمودية */}
        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* محتوى الحوار */}
        <div
          className="inline-block transform overflow-hidden rounded-xl bg-white dark:bg-grey-800 text-right shadow-xl transition-all sm:my-8 sm:max-w-lg sm:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white dark:bg-grey-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-${type}-100 dark:bg-${type}-900/20 sm:mx-0 sm:h-10 sm:w-10`}>
                <ExclamationTriangleIcon
                  className={`h-6 w-6 ${icon}`}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right">
                <h3 className="text-lg leading-6 font-medium text-grey-900 dark:text-white">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-grey-500 dark:text-grey-400">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-grey-50 dark:bg-grey-900/30 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`w-full cursor-pointer inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${confirmBtn} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warning-500 sm:ml-3 sm:w-auto sm:text-sm`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
            <button
              type="button"
              className="mt-3 w-full cursor-pointer inline-flex justify-center rounded-md border border-grey-300 dark:border-grey-700 shadow-sm px-4 py-2 bg-white dark:bg-grey-800 text-base font-medium text-grey-700 dark:text-grey-300 hover:bg-grey-50 dark:hover:bg-grey-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-grey-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onCancel}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export {ConfirmDialog}; 