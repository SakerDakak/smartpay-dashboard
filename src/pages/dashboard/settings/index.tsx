import React, { useState } from 'react';
import { NextPage } from 'next';
import DashboardLayout from '@/layouts/DashboardLayout';
import { DataListHeader, StatusMessages } from '@/components/dashboard';
import { Card, TextEditor, Spinner } from '@/components/ui';
import { DocumentTextIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import { useConfigSettings } from '@/hooks/dashboard/useConfigSettings';

const PoliciesPage: NextPage = () => {
  const {
    privacyPolicy,
    termsOfService,
    loading,
    error,
    updatePrivacyPolicy,
    updateTermsOfService,
  } = useConfigSettings();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePrivacyPolicyUpdate = async (data: string) => {
    try {
      await updatePrivacyPolicy(data);
      setSuccessMessage('تم تحديث سياسة الخصوصية بنجاح');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      // الخطأ تم التعامل معه في الهوك
    }
  };

  const handleTermsOfServiceUpdate = async (data: string) => {
    try {
      await updateTermsOfService(data);
      setSuccessMessage('تم تحديث شروط الخدمة بنجاح');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      // الخطأ تم التعامل معه في الهوك
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <DataListHeader
          title="إعدادات سياسة الخصوصية وشروط الخدمة"
          subtitle="تعديل سياسة الخصوصية وشروط الخدمة الخاصة بالتطبيق"
        />

        <StatusMessages 
          error={error} 
          successMessage={successMessage}
          onClearError={() => {}}
          onClearSuccess={() => setSuccessMessage(null)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card
            title="سياسة الخصوصية"
            subtitle="سياسة الخصوصية المعروضة للمستخدمين في التطبيق"
            headerActions={<DocumentTextIcon className="w-6 h-6 text-primary-500" />}
          >
            {loading && (
              <div className="absolute inset-0 bg-white/70 dark:bg-grey-900/70 flex justify-center items-center z-10 rounded-xl">
                <Spinner size="lg" />
              </div>
            )}
            <TextEditor
              defaultValue={privacyPolicy?.data || ''}
              placeholder="أدخل سياسة الخصوصية هنا..."
              label="محتوى سياسة الخصوصية"
              onSave={handlePrivacyPolicyUpdate}
              initialVisibleChars={500}
            />
          </Card>

          <Card
            title="شروط الخدمة"
            subtitle="شروط الخدمة المعروضة للمستخدمين في التطبيق"
            headerActions={<DocumentCheckIcon className="w-6 h-6 text-primary-500" />}
          >
            {loading && (
              <div className="absolute inset-0 bg-white/70 dark:bg-grey-900/70 flex justify-center items-center z-10 rounded-xl">
                <Spinner size="lg" />
              </div>
            )}
            <TextEditor
              defaultValue={termsOfService?.data || ''}
              placeholder="أدخل شروط الخدمة هنا..."
              label="محتوى شروط الخدمة"
              onSave={handleTermsOfServiceUpdate}
              initialVisibleChars={500}
            />
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PoliciesPage; 