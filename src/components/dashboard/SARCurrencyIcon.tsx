import React from 'react';
import Image from 'next/image';

interface SARCurrencyIconProps {
  className?: string;
  width?: number;
  height?: number;
}

/**
 * مكون لعرض رمز الريال السعودي
 */
export const SARCurrencyIcon: React.FC<SARCurrencyIconProps> = ({ 
  className = '',
  width = 16,
  height = 16
}) => {
  return (
    <Image 
      src="/assets/sar.svg"
      alt="ريال سعودي"
      width={width}
      height={height}
      className={`inline-block ${className} dark:invert`}
    />
  );
}; 