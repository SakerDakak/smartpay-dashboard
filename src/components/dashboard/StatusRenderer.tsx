import React from 'react';
import { StatusBadge } from '../ui';
import { AccountStatus } from '../../types/enums';
import { translateAccountStatus } from '../../utils/translations';

interface StatusRendererProps {
  status: AccountStatus;
}

/**
 * مكون مشترك لعرض حالة الحساب (نشط، محظور، محظور)
 * بتنسيق موحد في جميع أنحاء التطبيق
 */
const StatusRenderer: React.FC<StatusRendererProps> = ({ status }) => {
  let variant: 'success' | 'warning' | 'danger' = 'success';
  const label = translateAccountStatus(status);
  let className = '';
  
  switch (status) {
    case AccountStatus.Active:
      variant = 'success';
      className = 'text-success border-success/50 bg-success/5';
      break;
    case AccountStatus.PendingApproval:
      variant = 'warning';
      className = 'text-orange-400 bg-orange-600/5 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      break;
    case AccountStatus.Suspended:
      variant = 'danger';
      className = 'text-danger-700 bg-danger-600/5 dark:text-danger-400 border-danger-200 dark:border-danger-800';
      break;
  }
  
  return (
    <div className="flex items-center">
      <StatusBadge 
        variant={variant} 
        label={label} 
        size="sm"
        className={`border ${className} font-medium`}
      />
    </div>
  );
};

export {StatusRenderer}; 