import React from 'react';

interface DateFormatterProps {
  date: string | Date;
  format?: 'short' | 'medium' | 'long';
}

/**
 * مكون لعرض التاريخ بتنسيق موحد في جميع أنحاء التطبيق
 */
const DateFormatter: React.FC<DateFormatterProps> = ({ date, format = 'short' }) => {
  if (!date) return null;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // التحقق من صحة التاريخ
  if (isNaN(dateObj.getTime())) {
    return <span className="text-grey-400">-</span>;
  }
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  // تنسيق قصير (YYYY-MM-DD)
  if (format === 'short') {
    return <span>{`${year}-${month}-${day}`}</span>;
  }
  
  // تنسيق متوسط (يضيف الوقت)
  if (format === 'medium') {
    let hours = dateObj.getHours();
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'م' : 'ص';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    return <span>{`${year}-${month}-${day} | ${hours}:${minutes} ${ampm}`}</span>;
  }
  
  // تنسيق طويل (يضيف اليوم والوقت كاملاً)
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');
  return <span>{`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`}</span>;
};

export {DateFormatter}; 