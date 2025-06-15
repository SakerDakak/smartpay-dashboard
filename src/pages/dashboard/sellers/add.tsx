import React from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import {
  DashboardCard,
  DataListHeader,
  StatusMessages,
} from "../../../components/dashboard";
import { ArrowPathIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useSellerAddForm } from "@/hooks/dashboard/sellers/useSellerAddForm";
import {
  Button,
  Input,
  PasswordField,
  PhoneInput,
  Select,
} from "@/components/ui";
import { MerchantProfile } from "@/types/models";
import { AccountStatus } from "@/types/enums";

const SellerAddPage: React.FC = () => {
  const {
    formData,
    loading,
    error,
    success,
    merchants,
    merchantLoading,
    merchantSearchTerm,
    setMerchantSearchTerm,
    filteredMerchants,
    validationErrors,
    handleChange,
    handleSelectChange,
    handleSubmit,
    handleReset,
  } = useSellerAddForm();

  // Options for Account Status
  const accountStatusOptions = [
    { value: AccountStatus.Active, label: "نشط" },
    { value: AccountStatus.PendingApproval, label: "قيد المراجعة" },
    { value: AccountStatus.Suspended, label: "محظور" },
  ];

  const merchantOptions = filteredMerchants.map(
    (merchant: MerchantProfile) => ({
      value: merchant.id,
      label: `${merchant.brand_name} (${merchant.name})`,
    })
  );

  return (
    <DashboardLayout>
      <DataListHeader
        title="إضافة بائع جديد"
        subtitle="إضافة حساب بائع جديد للنظام وربطه بتاجر"
      />

      <DashboardCard className="max-w-5xl mx-auto">
        <StatusMessages
          error={validationErrors.general || error}
          successMessage={success}
        />

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* المعلومات الشخصية */}
          <h2 className="text-xl font-bold mb-6">المعلومات الشخصية للبائع</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              label="الاسم الكامل"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="أدخل الاسم الكامل للبائع"
              error={validationErrors.name}
              isRequired
            />
            <Input
              label="البريد الإلكتروني"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@seller.com"
              error={validationErrors.email}
              isRequired
            />

            <PhoneInput
              label="رقم الجوال"
              mobileId="mobile"
              mobileName="mobile"
              mobileValue={formData.mobile}
              onMobileChange={handleChange}
              mobilePlaceholder="5xxxxxxxx"
              countryCodeId="country_code"
              countryCodeName="country_code"
              countryCodeValue={formData.country_code}
              onCountryCodeChange={handleSelectChange}
              error={validationErrors.mobile}
              isRequired
            />

            <Input
              label="المدينة"
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="أدخل اسم المدينة"
              error={validationErrors.city}
              isRequired
            />

            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleSelectChange}
              options={accountStatusOptions}
              label="حالة الحساب"
              isRequired
              error={validationErrors.status}
            />
          </div>

          {/* معلومات التاجر وحالة الحساب */}
          <h2 className="text-xl font-bold mb-6 pt-4">
            ربط التاجر وحالة الحساب
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Select
              id="merchant_id"
              name="merchant_id"
              value={formData.merchant_id}
              onChange={handleSelectChange}
              options={merchantOptions}
              label="اختر التاجر"
              isRequired
              disabled={merchantLoading || merchants.length === 0}
              error={validationErrors.merchant_id}
              helperText={
                validationErrors.merchant_id
                  ? undefined
                  : merchantLoading
                  ? "جاري تحميل التجار..."
                  : merchants.length === 0
                  ? "لا يوجد تجار متاحون."
                  : filteredMerchants.length === 0 && merchantSearchTerm
                  ? "لم يتم العثور على تاجر يطابق بحثك."
                  : "اختر التاجر الذي سيعمل معه هذا البائع."
              }
            />
            <Input
              label="بحث عن تاجر"
              type="text"
              id="merchantSearch"
              name="merchantSearch"
              value={merchantSearchTerm}
              onChange={(e) => setMerchantSearchTerm(e.target.value)}
              placeholder="ابحث هنا..."
              disabled={merchantLoading || merchants.length === 0}
            />
          </div>

          {/* كلمة المرور */}
          <h2 className="text-xl font-bold mb-6 pt-4">معلومات الأمان</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PasswordField
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              label="كلمة المرور"
              required
              helpText="يجب أن تكون 8 أحرف على الأقل"
              isError={!!validationErrors.password}
              error={validationErrors.password}
            />

            <PasswordField
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              label="تأكيد كلمة المرور"
              required
              isError={!!validationErrors.confirmPassword}
              error={validationErrors.confirmPassword}
            />
          </div>

          {/* أزرار التحكم */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
            <Button
              type="button"
              onClick={handleReset}
              variant="secondary"
              leftIcon={<ArrowPathIcon className="h-5 w-5" />}
              disabled={loading}
            >
              إعادة تعيين
            </Button>

            <Button
              type="submit"
              variant="primary"
              leftIcon={<CheckIcon className="h-5 w-5" />}
              isLoading={loading}
              disabled={loading}
            >
              إضافة البائع
            </Button>
          </div>
        </form>
      </DashboardCard>
    </DashboardLayout>
  );
};

export default SellerAddPage;
