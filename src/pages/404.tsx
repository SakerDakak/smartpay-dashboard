import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ExclamationTriangleIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Button, ThemeSwitch } from '../components/ui';
import { BackgroundEffects } from '../components/ui/BackgroundEffects';
import DashboardLayout from '../layouts/DashboardLayout';

const CombinedNotFoundPage: React.FC = () => {
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

  if (isDashboardRoute) {
    // محتوى Dashboard 404
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-6">
          <ExclamationTriangleIcon className="w-20 h-20 sm:w-28 sm:h-28 text-warning-500 dark:text-warning-400 mx-auto mb-6" />
          <h1 className="text-4xl sm:text-5xl font-bold text-grey-900 dark:text-white mb-4">404 - الصفحة غير موجودة</h1>
          <p className="text-lg text-grey-600 dark:text-grey-400 mb-8 max-w-lg">
            عذراً، الصفحة التي تحاول الوصول إليها داخل لوحة التحكم غير موجودة. قد يكون الرابط خاطئاً أو تم نقل الصفحة.
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
    // محتوى General 404
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-grey-100 via-grey-50 to-white dark:from-grey-900 dark:via-grey-800 dark:to-grey-900 relative overflow-hidden transition-colors duration-250 will-change-auto">
        <BackgroundEffects />
        <div className="text-center p-8 bg-white/50 dark:bg-grey-800/40 backdrop-blur-lg shadow-2xl rounded-xl max-w-md mx-auto relative z-10">
          <ExclamationTriangleIcon className="w-24 h-24 text-warning-500 dark:text-warning-400 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold text-grey-900 dark:text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-grey-800 dark:text-grey-200 mb-3">الصفحة غير موجودة</h2>
          <p className="text-grey-600 dark:text-grey-400 mb-8">
            عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم حذفها أو نقلها.
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

export default CombinedNotFoundPage; 