import React from 'react';
import Image from 'next/image';
import { useMerchantData } from '@/hooks/dashboard/transactions/useMerchantData';
import { Button } from '../ui';
import router from 'next/router';
import { formatBase64Image } from '@/utils/imageUtils';

interface MerchantCellProps {
  merchantId: string | undefined;
  fallbackBrandName?: string;
  fallbackName?: string;
  fallbackLogo?: string;
}

/**
 * دالة لتنسيق صور Base64 للاستخدام مع مكون Image
 */

/**
 * مكون لعرض بيانات التاجر في خلية الجدول
 * يعرض الشعار، اسم البراند، واسم التاجر
 */
export const MerchantCell: React.FC<MerchantCellProps> = ({ merchantId, fallbackName, fallbackBrandName }) => {
  const { merchant, loading, error } = useMerchantData(merchantId);

  // Fallback display logic
  const renderFallback = (name?: string, brandName?: string) => (
    <div className="flex items-center space-x-3 space-x-reverse">
      <div className="h-9 w-9 rounded-full bg-primary-500 flex items-center justify-center border border-grey-300 ml-2">
        <span className="text-white text-xs font-bold">
          {((brandName || name || '').charAt(0) || '?').toUpperCase()}
        </span>
      </div>
      <div className="flex flex-col mr-2">
        <span className="font-medium text-grey-900 dark:text-white">
          {brandName || ''}
        </span>
        <span className="text-xs text-grey-600 dark:text-grey-400">
          {name || 'غير معروف'}
        </span>
      </div>
    </div>
  );

  if (loading) { 
    return (
      <div className="flex items-center space-x-2 space-x-reverse">
        <div className="h-10 w-10 rounded-full bg-grey-200 dark:bg-grey-700 animate-pulse ml-2"></div>
        <div className="space-y-2">
          <div className="h-4 w-14 bg-grey-200 dark:bg-grey-700 rounded animate-pulse"></div>
          <div className="h-3 w-10 bg-grey-200 dark:bg-grey-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error || !merchant) {
    // Use the new renderFallback function
    return renderFallback(fallbackName, fallbackBrandName);
  }

  const processedSrc = formatBase64Image(merchant.logo);

  return (
    <Button variant="ghost" onClick={() => router.push(`/dashboard/merchants/${merchant.id}`)} title="عرض التاجر" aria-label={`عرض التاجر ${merchant.brand_name}`} className="m-0 p-0 focus:ring-0 focus:ring-offset-0 hover:bg-transparent hover:dark:bg-transparent">
      <div className="flex items-center space-x-3 space-x-reverse">
      {processedSrc !== "invalid_image_data" && merchant.logo ? (
        <div className="relative w-9 h-9 overflow-hidden rounded-full border border-grey-200 dark:border-grey-700">
          <Image 
            src={processedSrc} 
            alt={merchant.brand_name || merchant.name || 'logo'}
            fill
            sizes="36px"
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null; 
              const parentDiv = target.parentElement;
              if (parentDiv) {
                parentDiv.innerHTML = ''; 
                parentDiv.className = "w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center border border-grey-300";
                const span = document.createElement('span');
                span.className = "text-white text-xs font-bold";
                span.textContent = ((merchant.brand_name || merchant.name || '').charAt(0) || '?').toUpperCase();
                parentDiv.appendChild(span);
              }
            }}
          />
        </div>
      ) : (
        // Fallback when logo is invalid or not present
        renderFallback(merchant.name, merchant.brand_name)
      )}
      
      <div className="flex flex-col mr-2 text-right">
        <span className="font-medium text-grey-900 dark:text-white">
          {merchant.brand_name || ""}
        </span>
        <span className="text-xs text-grey-600 dark:text-grey-400">
          {merchant.name}
        </span>
      </div>
    </div>
    </Button>
  );
}; 