import React from "react";
import { useRouter } from "next/router";
import DashboardLayout from "../../../../layouts/DashboardLayout";
import { AccountStatus } from "../../../../types/enums";
import { ArrowPathIcon, CheckIcon, KeyIcon } from "@heroicons/react/24/outline";
import { useSellerEdit } from "@/hooks/dashboard/sellers/useSellerEdit";
import {
  Button,
  Input,
  Select,
  Spinner,
  AlertMessage,
  PhoneInput,
} from "@/components/ui";
import {
  DashboardCard,
  DataListHeader,
  StatusMessages,
} from "@/components/dashboard";

const SellerEditPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    loading,
    saving,
    error,
    success,
    formData,
    showPasswordSection,
    validationErrors,
    handleChange,
    handleSubmit,
    handleReset,
    togglePasswordSection,
  } = useSellerEdit(id);

  return (
    <DashboardLayout>
      <DataListHeader
        title="تعديل بيانات البائع"
        subtitle="تعديل معلومات وحالة حساب البائع"
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
            message="لا يمكن العثور على البائع المطلوب"
            actionText="العودة إلى قائمة البائعين"
            actionLink="/dashboard/sellers"
          />
        </DashboardCard>
      ) : (
        <DashboardCard className="max-w-5xl mx-auto">
          <StatusMessages error={error} successMessage={success} />

          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* المعلومات الشخصية */}
            <h2 className="text-xl font-bold mb-6">المعلومات الشخصية</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div>
              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: AccountStatus.Active, label: "نشط" },
                  {
                    value: AccountStatus.PendingApproval,
                    label: "قيد المراجعة",
                  },
                  { value: AccountStatus.Suspended, label: "محظور" },
                ]}
                label="حالة الحساب"
                isRequired
              />
            </div>

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
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Input
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    label="كلمة المرور الجديدة"
                    helperText="يجب أن تكون 8 أحرف على الأقل"
                    type="password"
                    error={validationErrors.password}
                  />

                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    label="تأكيد كلمة المرور الجديدة"
                    type="password"
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

export default SellerEditPage;
