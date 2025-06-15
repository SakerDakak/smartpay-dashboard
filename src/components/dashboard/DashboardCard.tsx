import React, { ReactNode } from 'react';

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  children: ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  icon,
  footer,
  className = '',
  children,
}) => {
  return (
    <div className={`bg-white/90 dark:bg-grey-800/60 backdrop-blur-xl rounded-xl md:rounded-2xl border border-grey-200/50 dark:border-grey-600/40 shadow-lg overflow-hidden transition-all duration-250 hardware-accelerated ${className}`}>
      
      {/* رأس البطاقة */}
      {(title || subtitle || icon) && (
        <div className="px-4 md:px-6 py-4 md:py-5 border-b border-grey-100/70 dark:border-grey-700/30 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            {title && <h3 className="text-base md:text-lg font-semibold text-grey-900 dark:text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-grey-500 dark:text-grey-400 mt-1">{subtitle}</p>}
          </div>
          {icon && <div className="text-primary-500 dark:text-primary-400">{icon}</div>}
        </div>
      )}
      
      {/* محتوى البطاقة */}
      <div className="p-4 md:p-4">
        {children}
      </div>
      
      {/* تذييل البطاقة (اختياري) */}
      {footer && (
        <div className="px-4 md:px-6 py-3 md:py-4 bg-grey-50/70 dark:bg-grey-800/70 border-t border-grey-100/70 dark:border-grey-700/30">
          {footer}
        </div>
      )}
    </div>
  );
};

export {DashboardCard}; 