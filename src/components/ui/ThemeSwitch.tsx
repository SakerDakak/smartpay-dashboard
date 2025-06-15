import React, { useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/hooks/theme/useTheme';

interface ThemeSwitchProps {
  className?: string;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
  className = '',
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  // استخدام حالة محلية للانتقال السلس
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const handleToggle = () => {
    setIsTransitioning(true);
    toggleTheme();
    
    // إعادة تعيين حالة الانتقال بعد الانتهاء
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };
  
  return (
    <div 
      onClick={handleToggle}
      className={`bg-gradient-to-r from-grey-100/80 to-white/80 dark:from-grey-800/80 dark:to-grey-900/80 backdrop-blur-md border border-grey-200/50 dark:border-grey-700/50 rounded-full p-1.5 shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transition-all duration-250 ease-in-out relative group will-change-transform hardware-accelerated ${className} ${isTransitioning ? 'pointer-events-none' : ''}`}
    >
      <div className="w-14 h-7 relative flex items-center rounded-full">
        {/* الثيم النهاري */}
        <div className={`absolute left-1 top-1/2 -translate-y-1/2 transform transition-all duration-250 ease-in-out ${isDarkMode ? 'opacity-30 scale-75' : 'opacity-100 scale-100'} hardware-accelerated`}>
          <SunIcon className="w-5 h-5 text-primary-500" />
        </div>
        
        {/* الثيم الليلي */}
        <div className={`absolute right-1 top-1/2 -translate-y-1/2 transform transition-all duration-250 ease-in-out ${!isDarkMode ? 'opacity-30 scale-75' : 'opacity-100 scale-100'} hardware-accelerated`}>
          <MoonIcon className={`w-5 h-5 ${isDarkMode ? 'text-primary-400' : 'text-gray-400'}`} />
        </div>
        
        {/* المؤشر المتحرك */}
        <div className={`w-5 h-5 rounded-full bg-primary-gradient absolute transform transition-all duration-250 ease-in-out z-20 ${isDarkMode ? 'right-1' : 'left-1'} shadow-primary-soft will-change-transform hardware-accelerated`}></div>
        
        {/* توهج عند الهوفر */}
        <div className="absolute inset-0 bg-primary-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in-out"></div>
      </div>
    </div>
  );
};

export { ThemeSwitch }; 