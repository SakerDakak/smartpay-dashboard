import React from 'react';
import Image from 'next/image';
import { Button } from './Button';

interface ImageUploadFieldProps {
  label: string;
  name: string;
  id: string;
  fileRef: React.RefObject<HTMLInputElement>;
  preview: string | null;
  currentFileName?: string;
  error?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onRemove: () => void;
  accept?: string;
  helpText?: string;
  removeButtonText?: string;
  selectOrDragText?: string;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  name,
  id,
  fileRef,
  preview,
  currentFileName,
  error,
  onChange,
  onDrop,
  onDragOver,
  onRemove,
  accept = "image/*",
  helpText = "PNG, JPG حتى 1MB",
  removeButtonText = "إزالة الصورة",
  selectOrDragText = "انقر لاختيار صورة أو اسحب وأفلت ملف هنا"
}) => {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-grey-700 dark:text-grey-300">
        {label} <span className="text-danger-600">*</span>
      </label>
      <div
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          error
            ? 'border-danger-500 dark:border-danger-600'
            : 'border-grey-300 dark:border-grey-700 hover:border-primary-500 dark:hover:border-primary-500'
        }`}
        onClick={() => fileRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <input
          type="file"
          name={name}
          id={id}
          ref={fileRef}
          accept={accept}
          onChange={onChange}
          className="hidden"
        />
        {preview ? (
          <div className="flex flex-col items-center">
            <Image
              src={preview}
              alt={`${label} Preview`}
              width={128}
              height={128}
              className="w-32 h-32 object-cover rounded-lg mb-2"
            />
            {currentFileName && (
              <span className="text-sm text-grey-600 dark:text-grey-400">
                {currentFileName}
              </span>
            )}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation(); // منع النقر على الـ div الرئيسي
                onRemove();
              }}
            >
              {removeButtonText}
            </Button>
          </div>
        ) : (
          <div className="py-4">
            <svg
              className="mx-auto h-12 w-12 text-grey-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-grey-600 dark:text-grey-400">
              {selectOrDragText}
            </p>
            {helpText && <p className="mt-1 text-xs text-grey-500 dark:text-grey-500">{helpText}</p>}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
    </div>
  );
};

export { ImageUploadField }; 