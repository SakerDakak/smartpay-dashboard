import React from 'react';

// دالة لتحويل الأرقام العربية إلى إنجليزية
const convertArabicToEnglishNumbers = (str: string): string => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  return str.split('').map(char => {
    const index = arabicNumbers.indexOf(char);
    return index !== -1 ? englishNumbers[index] : char;
  }).join('');
};

interface PhoneInputProps {
  mobileValue: string;
  countryCodeValue: string | number;
  onMobileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCountryCodeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  mobilePlaceholder?: string;
  mobileId?: string;
  mobileName?: string;
  countryCodeId?: string;
  countryCodeName?: string;
  countryCodes?: { value: string | number; label: string }[];
  label?: string;
  isRequired?: boolean;
  error?: string | null;
  className?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  mobileValue,
  countryCodeValue,
  onMobileChange,
  onCountryCodeChange,
  mobilePlaceholder = '5xxxxxxxx',
  mobileId = 'mobile',
  mobileName = 'mobile',
  countryCodeId = 'country_code',
  countryCodeName = 'country_code',
  countryCodes = [{ value: '966', label: '+966' }],
  label = 'رقم الجوال',
  isRequired = false,
  error,
  className,
}) => {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={mobileId} className="block mb-2 text-sm font-medium text-grey-700 dark:text-grey-300">
          {label} {isRequired && <span className="text-danger-600">*</span>}
        </label>
      )}
      <div className="flex">
        <input
          type="text"
          id={mobileId}
          name={mobileName}
          value={mobileValue}
          onChange={(e) => {
            // تحويل الأرقام العربية إلى إنجليزية أولاً
            const convertedValue = convertArabicToEnglishNumbers(e.target.value);
            // ثم قبول الأرقام فقط
            const numericValue = convertedValue.replace(/[^0-9]/g, '');
            const newEvent = {
              ...e,
              target: {
                ...e.target,
                value: numericValue,
                name: mobileName,
              },
            } as React.ChangeEvent<HTMLInputElement>;
            onMobileChange(newEvent);
          }}
          placeholder={mobilePlaceholder}
          className="w-full rounded-r-xl border border-grey-300 dark:border-grey-700 bg-white/50 dark:bg-grey-800/60 py-3 px-4 text-grey-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          required={isRequired}
        />
        <select
          id={countryCodeId}
          name={countryCodeName}
          value={countryCodeValue}
          onChange={onCountryCodeChange}
          className="cursor-pointer rounded-r-none rounded-l-xl border border-grey-300 dark:border-grey-700 bg-white/50 dark:bg-grey-800/60 py-3 px-4 text-grey-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        >
          {countryCodes.map((code) => (
            <option key={code.value} value={code.value} style={{ direction: 'ltr' }}>
              {code.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
    </div>
  );
};

export { PhoneInput }; 