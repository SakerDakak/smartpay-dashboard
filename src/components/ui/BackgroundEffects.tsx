import React from 'react';

interface BackgroundEffectsProps {
  className?: string;
}

export const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 z-0 overflow-hidden transition-opacity duration-250 ${className}`}>
      {/* أشكال هندسية عائمة - مختلفة في الوضعين */}
      <div className="absolute top-[5%] right-[15%] w-[32rem] h-[32rem] bg-primary-200/10 dark:bg-primary-600/5 rounded-full mix-blend-multiply dark:mix-blend-lighten blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-[30%] left-[15%] w-[36rem] h-[36rem] bg-primary-100/15 dark:bg-primary-700/5 rounded-full mix-blend-multiply dark:mix-blend-lighten blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
      <div className="absolute bottom-[20%] right-[15%] w-[40rem] h-[40rem] bg-primary-50/10 dark:bg-primary-500/5 rounded-full mix-blend-multiply dark:mix-blend-lighten blur-3xl animate-pulse" style={{ animationDuration: '10s' }}></div>
      
      {/* أنماط عشوائية للوضع الليلي - لا تحتاج إلى انتقال */}
      <div className="absolute inset-0 z-0 opacity-0 dark:opacity-20 pointer-events-none">
        <div className="absolute h-1.5 w-1.5 bg-primary-300 rounded-full top-[10%] left-[15%] shadow-primary animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute h-1.5 w-1.5 bg-primary-400 rounded-full top-[35%] left-[20%] shadow-primary animate-ping" style={{ animationDuration: '4s' }}></div>
        <div className="absolute h-1.5 w-1.5 bg-primary-300 rounded-full top-[65%] left-[25%] shadow-primary animate-ping" style={{ animationDuration: '2.5s' }}></div>
        <div className="absolute h-1.5 w-1.5 bg-primary-400 rounded-full top-[15%] left-[80%] shadow-primary animate-ping" style={{ animationDuration: '3.5s' }}></div>
        <div className="absolute h-1.5 w-1.5 bg-primary-300 rounded-full top-[45%] left-[75%] shadow-primary animate-ping" style={{ animationDuration: '4.5s' }}></div>
        <div className="absolute h-1.5 w-1.5 bg-primary-400 rounded-full top-[75%] left-[85%] shadow-primary animate-ping" style={{ animationDuration: '2.8s' }}></div>
      </div>
      
      {/* شبكة - تظهر فقط في الوضع النهاري */}
      <div className="absolute inset-0 z-0 bg-[url('/assets/grid-light.svg')] dark:opacity-0 opacity-20 bg-center transition-opacity duration-250"></div>
      
      {/* نجوم متحركة - تظهر فقط في الوضع الليلي */}
      <div className="absolute inset-0 z-0 bg-[url('/assets/stars.svg')] opacity-0 dark:opacity-10 bg-center transition-opacity duration-250"></div>
    </div>
  );
}; 