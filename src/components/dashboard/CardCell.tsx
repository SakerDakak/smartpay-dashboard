import React from 'react';

interface CardCellProps {
  cardBrand?: string;
  lastFourDigits?: string;
}

/**
 * مكون لعرض بيانات البطاقة في خلية الجدول
 * يعرض نوع البطاقة وآخر 4 أرقام
 */
export const CardCell: React.FC<CardCellProps> = ({ cardBrand, lastFourDigits }) => {
  if (!cardBrand && !lastFourDigits) {
    return (
      <div className="text-grey-600 dark:text-grey-400 text-sm">
        غير متاح
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <span className="font-medium text-grey-900 dark:text-white">
        {cardBrand || ""}
      </span>
      {lastFourDigits && (
        <span className="text-xs text-grey-600 dark:text-grey-400 font-mono">
          **** **** **** {lastFourDigits}
        </span>
      )}
    </div>
  );
}; 