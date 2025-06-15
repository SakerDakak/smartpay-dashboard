import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

/**
 * Hook لاستخدام سياق الثيم في المكونات
 * 
 * @returns {{ isDarkMode: boolean, toggleTheme: () => void }} كائن يحتوي على حالة الثيم ودالة التبديل
 * 
 * @example
 * ```tsx
 * const { isDarkMode, toggleTheme } = useTheme();
 * return (
 *   <button onClick={toggleTheme}>
 *     {isDarkMode ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
 *   </button>
 * );
 * ```
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('يجب استخدام useTheme داخل ThemeProvider');
  }
  
  return context;
}; 