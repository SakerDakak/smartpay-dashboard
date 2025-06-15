import React from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import {
  FormWrapper,
  FormField,
  Button,
  ThemeSwitch,
  BackgroundEffects,
} from "../../components/ui";
import { useLoginForm } from "../../hooks/login/useLoginForm";

const LoginPage: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    formError,
    fieldErrors,
    isLoading,
    showForm,
    handleSubmit,
    isAuthenticated,
    isAuthLoading,
  } = useLoginForm();

  if (isAuthenticated && !isAuthLoading) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-grey-100 via-grey-50 to-white dark:from-grey-900 dark:via-grey-800 dark:to-grey-900 relative overflow-hidden transition-colors duration-250 will-change-auto">
      {/* تأثيرات الخلفية */}
      <BackgroundEffects />

      <div className="w-full max-w-2xl mx-auto px-4">
        <div
          className={`w-full flex items-center justify-center transition-all duration-250 ease-out transform
            ${showForm ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <FormWrapper
            title="مرحباً بعودتك"
            subtitle="الرجاء إدخال بياناتك لتسجيل الدخول."
            formError={formError}
            showLogo={true}
            logoSize={96}
            className="w-full px-8 py-10 sm:px-14 sm:py-14 md:px-16 md:py-16 bg-white/40 dark:bg-grey-800/30"
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-6 relative z-10 ar-form"
              dir="rtl"
              noValidate
              autoComplete="on"
            >
              <FormField
                type="email"
                label="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isLoading}
                error={fieldErrors.email}
                isRequired={true}
                autoComplete="username"
                className="text-lg"
                name="email"
              />

              <FormField
                type={showPassword ? "text" : "password"}
                label="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                error={fieldErrors.password}
                isRequired={true}
                autoComplete="current-password"
                className="text-lg"
                name="password"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none rounded-full text-grey-500 dark:text-grey-400 hover:text-grey-700 dark:hover:text-grey-300 p-2 hover:bg-grey-200/70 dark:hover:bg-grey-800/70 focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
                    aria-label={
                      showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                    }
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-6 h-6" />
                    ) : (
                      <EyeIcon className="w-6 h-6" />
                    )}
                  </button>
                }
              />

              <Button
                type="submit"
                disabled={isLoading}
                isLoading={isLoading}
                className="w-full py-4 px-6 mt-6 text-lg font-medium"
              >
                تسجيل الدخول
              </Button>
            </form>

            <div className="mt-10 flex flex-col items-center justify-center space-y-4">
              {/* زر تبديل الثيم */}
              <ThemeSwitch className="transform scale-120" />

              {/* حقوق النشر */}
              <p className="text-sm text-grey-500 dark:text-grey-400 mt-6">
                &copy; {new Date().getFullYear()} سمارت باي. جميع الحقوق محفوظة.
              </p>
            </div>
          </FormWrapper>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
