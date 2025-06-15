import React from 'react';

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value?: string | number | null | React.ReactNode;
  children?: React.ReactNode;
  dir?: 'ltr' | 'rtl';
  highlight?: boolean;
}

const InfoItem: React.FC<InfoItemProps> = 
  ({ icon: Icon, label, value, children, dir = 'rtl', highlight = false }) => (
  <div className="flex items-start py-3">
    <div className="flex-shrink-0 ml-4">
      <div className={`w-10 h-10 rounded-lg ${highlight ? 'bg-warning-100 dark:bg-warning-900/30' : 'bg-primary-50 dark:bg-primary-900/20'} flex items-center justify-center`}>
        <Icon className={`h-5 w-5 ${highlight ? 'text-warning-500 dark:text-warning-400' : 'text-primary-500 dark:text-primary-400'}`} /> 
      </div>
    </div>
    <div dir={dir} className="flex-grow min-w-0">
      <h4 className="text-sm font-medium text-grey-500 dark:text-grey-400 mb-0.5 truncate">{label}</h4>
      {value !== undefined && value !== null ? (
        typeof value === 'string' || typeof value === 'number' ?
        <p className="text-grey-800 dark:text-white break-words">{String(value)}</p> : value
      ) : children}
    </div>
  </div>
);

export { InfoItem }; 