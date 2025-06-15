import React from 'react';
import Image from 'next/image';
import { formatBase64Image } from '@/utils/imageUtils';

interface LogoImageProps {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
}

/**
 * مكون لعرض صورة الشعار بتنسيق موحد
 * يدعم الصور العادية وصور base64 مع معالجة أخطاء الصور
 */
export const LogoImage: React.FC<LogoImageProps> = ({ 
  src, 
  alt, 
  size = 10, 
  className = '' 
}) => {
  // معالجة مصدر الصورة وتنسيق base64  
  const processedSrc = formatBase64Image(src);

  if (processedSrc === "invalid_image_data") {
    // عرض الصورة البديلة مباشرة إذا كانت البيانات غير صالحة
    return (
      <div className={`w-${size} h-${size} bg-primary-500 rounded-full flex items-center justify-center border border-grey-300 ${className}`}>
        <span className="text-white text-xs font-bold">
          {alt.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }
  
  return (
    <div className={`relative w-${size} h-${size} overflow-hidden rounded-full border border-grey-200 dark:border-grey-700 ${className}`}>
      <Image
        src={processedSrc}
        alt={alt}
        fill
        sizes={`${size * 4}px`}
        className="object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null; // منع التكرار اللانهائي للمحاولات

          const parentDiv = target.parentElement;
          if (parentDiv) {
            // مسح محتوى العنصر الأب
            parentDiv.innerHTML = ''; 

            // تطبيق التنسيقات الجديدة على العنصر الأب
            parentDiv.className = `w-${size} h-${size} bg-primary-500 rounded-full flex items-center justify-center border border-grey-300 ${className}`;
            
            // إنشاء عنصر span لعرض الحرف الأول
            const span = document.createElement('span');
            span.className = "text-white text-xs font-bold";
            span.textContent = alt.charAt(0).toUpperCase();
            
            // إضافة span إلى العنصر الأب
            parentDiv.appendChild(span);
          }
        }}
      />
    </div>
  );
}; 