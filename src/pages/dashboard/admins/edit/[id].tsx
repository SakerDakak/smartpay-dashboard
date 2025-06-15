import React from "react";
import { useRouter } from "next/router";
import DashboardLayout from "../../../../layouts/DashboardLayout";
import { AccountStatus } from "../../../../types/enums";
import { ArrowPathIcon, CheckIcon, KeyIcon } from "@heroicons/react/24/outline";
import { useAdminEdit } from "@/hooks/dashboard/admins/useAdminEdit";
import {
  Button,
  Input,
  Select,
  Spinner,
  AlertMessage,
  PhoneInput,
  PasswordField,
} from "@/components/ui";
import {
  DashboardCard,
  DataListHeader,
  StatusMessages,
} from "@/components/dashboard";

const AdminEditPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    loading,
    saving,
    error,
    success,
    formData,
    validationErrors,
    showPasswordSection,
    handleChange,
    handleSubmit,
    handleReset,
    togglePasswordSection,
  } = useAdminEdit(id);

  return (
    <DashboardLayout>
      <DataListHeader
        title="تعديل بيانات المشرف"
        subtitle="تعديل معلومات وحالة حساب المشرف"
      />

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner size="lg" color="primary" />
        </div>
      ) : error && !formData.name ? (
        <DashboardCard>
          <AlertMessage
            type="error"
            title={error}
            message="لا يمكن العثور على المشرف المطلوب"
            actionText="العودة إلى قائمة المشرفين"
            actionLink="/dashboard/admins"
          />
        </DashboardCard>
      ) : (
        <DashboardCard className="max-w-5xl mx-auto">
          <StatusMessages error={error} successMessage={success} />

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* المعلومات الشخصية */}
            <h2 className="text-xl font-bold mb-6">المعلومات الشخصية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="أدخل الاسم الكامل"
                label="الاسم الكامل"
                isRequired
                error={validationErrors.name}
              />

              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@smartpay.com"
                label="البريد الإلكتروني"
                isRequired
                error={validationErrors.email}
              />

              <PhoneInput
                mobileValue={formData.mobile}
                countryCodeValue={formData.country_code}
                onMobileChange={handleChange}
                onCountryCodeChange={handleChange}
                isRequired
                error={validationErrors.mobile}
              />

              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="أدخل اسم المدينة"
                label="المدينة"
                isRequired
                error={validationErrors.city}
              />
            </div>

            {/* حالة الحساب */}
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: AccountStatus.Active, label: "نشط" },
                { value: AccountStatus.PendingApproval, label: "قيد المراجعة" },
                { value: AccountStatus.Suspended, label: "محظور" },
              ]}
              label="حالة الحساب"
              isRequired
            />

            {/* قسم تغيير كلمة المرور */}
            <div className="mt-8 py-4 border-y border-grey-200 dark:border-grey-700">
              <Button
                type="button"
                onClick={togglePasswordSection}
                variant="ghost"
                leftIcon={<KeyIcon className="h-5 w-5" />}
              >
                {showPasswordSection
                  ? "إلغاء تغيير كلمة المرور"
                  : "تغيير كلمة المرور"}
              </Button>

              {showPasswordSection && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <PasswordField
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    label="كلمة المرور الجديدة"
                    helpText="يجب أن تكون 8 أحرف على الأقل"
                    error={validationErrors.password}
                  />

                  <PasswordField
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    label="تأكيد كلمة المرور الجديدة"
                    error={validationErrors.confirmPassword}
                  />
                </div>
              )}
            </div>

            {/* أزرار التحكم */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
              <Button
                type="button"
                onClick={handleReset}
                variant="secondary"
                leftIcon={<ArrowPathIcon className="h-5 w-5" />}
              >
                إعادة تعيين
              </Button>

              <Button
                type="submit"
                isLoading={saving}
                variant="primary"
                className="bg-primary-gradient text-white shadow-md hover:shadow-lg"
                leftIcon={!saving && <CheckIcon className="h-5 w-5" />}
              >
                {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </div>
          </form>
        </DashboardCard>
      )}
    </DashboardLayout>
  );
};

export default AdminEditPage;
