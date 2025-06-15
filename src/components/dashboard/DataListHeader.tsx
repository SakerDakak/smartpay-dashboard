import React from 'react';

interface DataListHeaderProps {
  title: string;
  subtitle?: string;
}

/**
 * مكون مشترك لعرض عنوان ووصف صفحات عرض البيانات
 * مثل صفحات المشرفين والتجار وغيرها
 */
const DataListHeader: React.FC<DataListHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-grey-900 dark:text-white">
        {title}
      </h1>
      {subtitle && (
        <p className="text-grey-600 dark:text-grey-400 mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export {DataListHeader}; 