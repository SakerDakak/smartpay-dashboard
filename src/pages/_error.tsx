import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { XCircleIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Button, ThemeSwitch } from '../components/ui';
import { BackgroundEffects } from '../components/ui/BackgroundEffects';
import DashboardLayout from '../layouts/DashboardLayout';
import type { NextPage, NextPageContext } from 'next';

interface CombinedErrorPageProps {
  statusCode: number;
}

const CombinedErrorPage: NextPage<CombinedErrorPageProps> = ({ statusCode }) => {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // يمكنك عرض شاشة تحميل بسيطة هنا أو null
    // لتجنب أي محتوى قد يسبب عدم تطابق قبل تحميل العميل بالكامل
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-grey-100 via-grey-50 to-white dark:from-grey-900 dark:via-grey-800 dark:to-grey-900" />;
  }

  const isDashboardRoute = router.asPath.startsWith('/dashboard');

  const generalTitle = statusCode === 404 ? "الصفحة غير موجودة" : "حدث خطأ ما";
  const generalMessage =
    statusCode === 404
      ? "عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها."
      : `عذراً، حدث خطأ غير متوقع على الخادم (الرمز: ${statusCode}). يرجى المحاولة مرة أخرى لاحقًا أو الاتصال بالدعم إذا استمرت المشكلة.`;

  const dashboardTitle = statusCode === 404 ? "الصفحة غير موجودة" : "حدث خطأ في لوحة التحكم";
  const dashboardMessage =
    statusCode === 404
      ? "عذراً، لم نتمكن من العثور على الصفحة المطلوبة داخل لوحة التحكم."
      : `عذراً، حدث خطأ غير متوقع (الرمز: ${statusCode}). يرجى المحاولة مرة أخرى أو التواصل مع الدعم إذا استمرت المشكلة.`;

  const displayTitle = isDashboardRoute ? dashboardTitle : generalTitle;
  const displayMessage = isDashboardRoute ? dashboardMessage : generalMessage;
  const errorCodeDisplay = statusCode || (isDashboardRoute ? "خطأ باللوحة" : "خطأ");

  if (isDashboardRoute) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-6">
          <XCircleIcon className="w-20 h-20 sm:w-28 sm:h-28 text-danger-500 dark:text-danger-400 mx-auto mb-6" />
          <h1 className="text-4xl sm:text-5xl font-bold text-grey-900 dark:text-white mb-4">
            {errorCodeDisplay}
          </h1>
          <h2 className="text-2xl font-semibold text-grey-800 dark:text-grey-200 mb-3">
            {displayTitle}
          </h2>
          <p className="text-lg text-grey-600 dark:text-grey-400 mb-8 max-w-lg">
            {displayMessage}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link href="/dashboard" passHref>
              <Button 
                variant="primary" 
                className="w-full sm:w-auto"
                leftIcon={<HomeIcon className="w-5 h-5" />}
              >
                العودة إلى لوحة التحكم
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-grey-100 via-grey-50 to-white dark:from-grey-900 dark:via-grey-800 dark:to-grey-900 relative overflow-hidden transition-colors duration-250 will-change-auto">
        <BackgroundEffects />
        <div className="text-center p-8 bg-white/50 dark:bg-grey-800/40 backdrop-blur-lg shadow-2xl rounded-xl max-w-md mx-auto relative z-10">
          <XCircleIcon className="w-24 h-24 text-danger-500 dark:text-danger-400 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold text-grey-900 dark:text-white mb-4">
            {errorCodeDisplay}
          </h1>
          <h2 className="text-2xl font-semibold text-grey-800 dark:text-grey-200 mb-3">
            {displayTitle}
          </h2>
          <p className="text-grey-600 dark:text-grey-400 mb-8">
            {displayMessage}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/" passHref>
              <Button 
                variant="primary" 
                className="w-full sm:w-auto"
              >
                العودة إلى الرئيسية
              </Button>
            </Link>
          </div>
          <div className="mt-10">
            <ThemeSwitch />
          </div>
        </div>
      </div>
    );
  }
};

export const getInitialProps = ({ res, err }: NextPageContext): CombinedErrorPageProps => {
  const statusCode = res ? res.statusCode : err ? err.statusCode ?? 500 : 404;
  return { statusCode };
};

export default CombinedErrorPage; 