import React from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import {
  DashboardCard,
  DataListHeader,
  StatusMessages,
} from "../../../components/dashboard";
import { ArrowPathIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useAdminAddForm } from "../../../hooks/dashboard/admins/useAdminAddForm";
import {
  Button,
  Input,
  PasswordField,
  PhoneInput,
  Select,
} from "@/components/ui";
import { AccountStatus } from "@/types/enums/account-status.enum";

const AdminAddPage: React.FC = () => {
  const {
    formData,
    formErrors,
    loading,
    error,
    success,
    handleChange,
    handleSubmit,
    handleReset,
  } = useAdminAddForm();

  return (
    <DashboardLayout>
      <DataListHeader
        title="إضافة مشرف جديد"
        subtitle="إضافة حساب مشرف جديد في النظام"
      />

      <DashboardCard className="max-w-5xl mx-auto">
        <StatusMessages error={error} successMessage={success} />

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* المعلومات الشخصية */}
          <h2 className="text-xl font-bold mb-6">المعلومات الشخصية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="الاسم الكامل"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="أدخل الاسم الكامل"
                error={formErrors.name}
                isRequired
              />
            </div>

            <div>
              <Input
                label="البريد الإلكتروني"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@smartpay.com"
                error={formErrors.email}
                isRequired
              />
            </div>

            <div>
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
                onCountryCodeChange={handleChange}
                error={formErrors.mobile}
                isRequired
              />
            </div>

            <div>
              <Input
                label="المدينة"
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="أدخل اسم المدينة"
                error={formErrors.city}
                isRequired
              />
            </div>
          </div>

          {/* كلمة المرور */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <PasswordField
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                label="كلمة المرور"
                required
                helpText="يجب أن تكون 8 أحرف على الأقل"
                error={formErrors.password}
              />
            </div>

            <div>
              <PasswordField
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                label="تأكيد كلمة المرور"
                required
                error={formErrors.confirmPassword}
              />
            </div>
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
                { value: AccountStatus.PendingApproval, label: "قيد المراجعة" },
                { value: AccountStatus.Suspended, label: "محظور" },
              ]}
              label="حالة الحساب"
              isRequired
            />
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
              isLoading={loading}
              variant="primary"
              className="bg-primary-gradient text-white shadow-md hover:shadow-lg"
              leftIcon={!loading && <CheckIcon className="h-5 w-5" />}
            >
              {loading ? "جاري الإضافة..." : "إضافة المشرف"}
            </Button>
          </div>
        </form>
      </DashboardCard>
    </DashboardLayout>
  );
};

export default AdminAddPage;
