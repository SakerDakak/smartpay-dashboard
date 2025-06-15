import React, { useState, useEffect } from 'react';
import { Button } from './Button';

interface TextEditorProps {
  defaultValue: string;
  label?: string;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  loading?: boolean;
  onChange?: (value: string) => void;
  onSave?: (value: string) => Promise<void>;
  initialVisibleChars?: number;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  defaultValue = '',
  label,
  placeholder = 'ابدأ الكتابة هنا...',
  minRows = 10,
  maxRows = 20,
  loading = false,
  onChange,
  onSave,
  initialVisibleChars = 200,
}) => {
  const [value, setValue] = useState<string>(defaultValue);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  useEffect(() => {
    setValue(defaultValue);
    setIsExpanded(false);
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setValue(defaultValue);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true);
      try {
        await onSave(value);
        setIsEditing(false);
      } catch (error) {
        console.error('Error saving content:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const displayText = () => {
    if (isEditing || isExpanded || value.length <= initialVisibleChars) {
      return value;
    }
    return `${value.substring(0, initialVisibleChars)}...`;
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-3 text-sm font-medium text-grey-700 dark:text-grey-300">
          {label}
        </label>
      )}

      <div className="relative">
        {isEditing ? (
          <>
            <textarea
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
              rows={minRows}
              className="w-full p-4 border rounded-xl border-grey-300 dark:border-grey-700 bg-white/50 dark:bg-grey-800/60 text-grey-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-y"
              style={{ minHeight: `${minRows * 1.5}rem`, maxHeight: `${maxRows * 1.5}rem` }}
              disabled={loading || isSaving}
            />
            <div className="flex flex-col sm:flex-row justify-end mt-4 space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={loading || isSaving}
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSave}
                isLoading={isSaving}
                disabled={loading}
              >
                حفظ
              </Button>
            </div>
          </>
        ) : (
          <>
            <div 
              className="w-full p-4 min-h-40 border rounded-xl border-grey-300 dark:border-grey-700 bg-white/50 dark:bg-grey-800/60 text-grey-800 dark:text-white overflow-auto whitespace-pre-wrap"
              style={{ 
                maxHeight: isExpanded ? 'none' : '15rem',
                overflowY: 'auto' 
              }}
            >
              {displayText() || <span className="text-grey-500">{placeholder}</span>}
            </div>
            <div className="flex justify-end items-start mt-4 gap-x-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleStartEditing}
                disabled={loading}
              >
                تعديل
              </Button>
              {value.length > initialVisibleChars && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={toggleExpand}
                  disabled={loading}
                >
                  {isExpanded ? 'عرض أقل' : 'عرض المزيد'}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 