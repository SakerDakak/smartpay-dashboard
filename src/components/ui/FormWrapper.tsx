import React, { ReactNode } from "react";
import Image from "next/image";
import { useTheme } from "@/hooks/theme/useTheme";

interface FormWrapperProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  formError?: string | null;
  logoSize?: number;
  showLogo?: boolean;
  maxWidth?: string;
  className?: string;
}

const FormWrapper: React.FC<FormWrapperProps> = ({
  title,
  subtitle,
  children,
  formError,
  logoSize = 65,
  showLogo = true,
  maxWidth = "max-w-xl",
  className,
}) => {
  // استخدام hook الثيم
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`bg-white/90 dark:bg-grey-800/60 backdrop-blur-xl p-8 sm:p-10 rounded-3xl w-full ${maxWidth} 
      border border-grey-200/80 dark:border-grey-600/40 
      shadow-[0_10px_50px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_50px_-12px_rgba(0,0,0,0.8)] 
      relative overflow-hidden will-change-auto hardware-accelerated ${
        className || ""
      }`}
    >
      {/* تأثير بقع ضوء داخل البطاقة */}
      <div className="absolute -top-32 -right-16 w-64 h-64 bg-primary-300/20 dark:bg-primary-400/15 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-16 w-64 h-64 bg-primary-200/20 dark:bg-primary-500/15 rounded-full blur-3xl"></div>

      {/* رأس النموذج مع الشعار والعنوان */}
      {(showLogo || title || subtitle) && (
        <div className="text-center mb-8 relative">
          {showLogo && (
            <div className="mb-6 inline-block relative">
              <div
                className="absolute inset-0 bg-primary-400/30 dark:bg-primary-500/20 blur-md rounded-full scale-150 z-0 animate-pulse"
                style={{ animationDuration: "3s" }}
              ></div>
              <Image
                src={
                  isDarkMode ? "/logo/logo-white.png" : "/logo/logo-color.png"
                }
                alt="smartpay Logo"
                width={logoSize}
                height={logoSize}
                className="mx-auto relative z-10"
                priority
              />
            </div>
          )}

          {title && (
            <h1 className="text-3xl font-bold text-grey-900 dark:text-white mb-2">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="text-grey-600 dark:text-grey-400 text-lg">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* رسالة الخطأ للنموذج إذا وجدت */}
      {formError && (
        <div className="p-3.5 rounded-lg bg-danger-50/90 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 text-center backdrop-blur-sm mb-4">
          <p className="text-sm font-medium text-danger-600 dark:text-danger-300">
            {formError}
          </p>
        </div>
      )}

      {/* محتوى النموذج */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export { FormWrapper };
