import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number | ReactNode;
  icon?: ReactNode;
  change?: {
    value: string | number;
    type: 'increase' | 'decrease';
  };
  className?: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  className = '',
  isLoading = false,
}) => {
  return (
    <div className={`bg-white/90 dark:bg-grey-800/60 backdrop-blur-xl p-6 rounded-2xl border border-grey-200/50 dark:border-grey-600/40 shadow-lg transition-all duration-250 hardware-accelerated ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-grey-500 dark:text-grey-400">{title}</p>
          
          {isLoading ? (
            <div className="mt-2 h-8 w-24 bg-grey-200 dark:bg-grey-700 rounded animate-pulse"></div>
          ) : (
            <h3 className="text-2xl font-bold mt-2 text-grey-900 dark:text-white text-right">{value}</h3>
          )}
          
          {change && !isLoading && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                change.type === 'increase'
                  ? 'text-success dark:text-success'
                  : 'text-danger-600 dark:text-danger-400'
              }`}>
                {change.type === 'increase' ? '↑' : '↓ -'} {change.value}
              </span>
              <span className="text-xs text-grey-500 dark:text-grey-400 mr-1">منذ الشهر الماضي</span>
            </div>
          )}
          
          {change && isLoading && (
            <div className="mt-2 h-4 w-32 bg-grey-200 dark:bg-grey-700 rounded animate-pulse"></div>
          )}
        </div>
        
        {icon && (
          <div className={`p-3 rounded-full bg-primary-50/70 dark:bg-primary-900/30 text-primary-500 dark:text-primary-400 ${isLoading ? 'opacity-70' : ''}`}>
            {icon}
          </div>
        )}
      </div>
      
      {/* إضافة وميض زخرفي في الزاوية */}
      <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl"></div>
    </div>
  );
};

export {StatCard}; 