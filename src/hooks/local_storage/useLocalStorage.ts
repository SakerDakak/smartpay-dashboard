import { useState, useEffect } from 'react';

/**
 * Hook للتعامل مع localStorage بطريقة آمنة ومرنة
 * 
 * @param key مفتاح التخزين في localStorage
 * @param initialValue القيمة الافتراضية إذا لم يتم العثور على بيانات مخزنة
 * @returns [قيمة مخزنة, دالة لتحديث القيمة]
 * 
 * @example
 * ```tsx
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 * ```
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // حالة لتخزين القيمة
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      // محاولة استرجاع القيمة من localStorage
      const item = window.localStorage.getItem(key);
      
      // إذا كانت القيمة غير موجودة، إرجاع القيمة الافتراضية
      if (item === null) {
        return initialValue;
      }
      
      // محاولة تحويل القيمة من JSON إذا كانت معقدة
      if (typeof initialValue === 'object') {
        return JSON.parse(item);
      }
      
      // إرجاع القيمة كما هي إذا كانت بسيطة
      return item as unknown as T;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  // تحديث localStorage عند تغيير الحالة
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      // تخزين القيمة في localStorage
      // تحويل إلى JSON فقط إذا كانت القيمة معقدة
      const valueToStore = typeof storedValue === 'object' 
        ? JSON.stringify(storedValue)
        : storedValue;
        
      window.localStorage.setItem(key, valueToStore as string);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  // دالة لتحديث القيمة المخزنة وتحديث localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // السماح باستخدام دالة أو قيمة مباشرة
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // تحديث الحالة
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(`Error updating localStorage key "${key}":`, error);
    }
  };
  
  return [storedValue, setValue];
} 