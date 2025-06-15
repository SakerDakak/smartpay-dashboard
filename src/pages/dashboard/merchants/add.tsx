import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import {
  Button,
  Input,
  PasswordField,
  Select,
  ImageUploadField,
  PhoneInput
} from '../../../components/ui';
import { DashboardCard, DataListHeader, StatusMessages } from '../../../components/dashboard';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { AccountStatusEX } from '../../../types/enums/accountStatus';
import useMerchantAddForm from '@/hooks/dashboard/merchants/useMerchantAddForm';
import { SelectOption } from '@/components/ui/Select';

const AddMerchantPage: React.FC = () => {
  const {
    formData,
    loading,
    error,
    success,
    validationErrors,
    logoFileRef,
    frontIdCardRef,
    backIdCardRef,
    commercialRegistrationRef,
    logoPreviews,
    frontIdCardPreview,
    backIdCardPreview,
    commercialRegistrationPreview,
    handleChange,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleSubmit,
    handleReset,
    handleRemoveFile
  } = useMerchantAddForm();

  const accountStatusOptions: SelectOption[] = [
    { value: AccountStatusEX.active, label: 'نشط' },
    { value: AccountStatusEX.pendingApproval, label: 'بانتظار الموافقة' },
    { value: AccountStatusEX.suspended, label: 'محظور' },
  ];

  const countryCodeOptions = [
    { value: '966', label: '+966' },
  ];

  return (
    <DashboardLayout>
      <DataListHeader
        title="إضافة تاجر جديد"
        subtitle="إضافة حساب تاجر جديد في النظام"
      />

      <StatusMessages
        error={error}
        successMessage={success}
      />

      <DashboardCard className="max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">المعلومات الشخصية</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* الاسم الكامل */}
              <Input
                label="الاسم الكامل"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                error={validationErrors.name}
                isRequired
              />
              
              {/* البريد الإلكتروني */}
              <Input
                label="البريد الإلكتروني"
                name="email"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={validationErrors.email}
                isRequired
              />
              
              {/* المدينة */}
              <Input
                label="المدينة"
                name="city"
                id="city"
                value={formData.city}
                onChange={handleChange}
                error={validationErrors.city}
                isRequired
              />
              {/* رقم الجوال */}
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
                countryCodes={countryCodeOptions}
                error={validationErrors.mobile}
                isRequired
              />

              {/* كلمة المرور */}
              <PasswordField
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                label="كلمة المرور"
                required
                helpText="يجب أن تكون 8 أحرف على الأقل"
                error={validationErrors.password}
              />
              
              {/* تأكيد كلمة المرور */}
              <PasswordField
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                label="تأكيد كلمة المرور"
                required
                error={validationErrors.confirm_password}
              />
              
              {/* رقم الآيبان */}
              <Input
                label="رقم الآيبان (IBAN)"
                name="iban"
                id="iban"
                value={formData.iban}
                onChange={handleChange}
                error={validationErrors.iban}
                dir="ltr"
                isRequired
              />

              <Select
                label="حالة الحساب"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={accountStatusOptions}
                error={validationErrors.status}
                isRequired
              />
            </div>

            <h2 className="text-xl font-bold mb-6 mt-10">المعلومات التجارية</h2>
            
            <div className="grid grid-cols-1  gap-6">
              {/* الاسم التجاري */}
              <Input
                label="الاسم التجاري"
                name="brand_name"
                id="brand_name"
                value={formData.brand_name}
                onChange={handleChange}
                error={validationErrors.brand_name}
                isRequired
              />
              
              {/* الشعار التجاري */}
              <ImageUploadField
                label="الشعار التجاري"
                name="logo"
                id="logo"
                fileRef={logoFileRef as React.RefObject<HTMLInputElement>}
                preview={logoPreviews}
                currentFileName={formData.logo?.name}
                error={validationErrors.logo}
                onChange={handleFileChange}
                onDrop={(e) => handleDrop(e, 'logo')}
                onDragOver={handleDragOver}
                onRemove={() => handleRemoveFile(logoFileRef, 'logo')}
              />
            </div>

            <h2 className="text-xl font-bold mb-6 mt-10">المستندات المطلوبة</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* صورة الهوية الأمامية */}
              <ImageUploadField
                label="صورة الهوية - الوجه الأمامي"
                name="front_id_card"
                id="front_id_card"
                fileRef={frontIdCardRef as React.RefObject<HTMLInputElement>}
                preview={frontIdCardPreview}
                currentFileName={formData.front_id_card?.name}
                error={validationErrors.front_id_card}
                onChange={handleFileChange}
                onDrop={(e) => handleDrop(e, 'front_id_card')}
                onDragOver={handleDragOver}
                onRemove={() => handleRemoveFile(frontIdCardRef, 'front_id_card')}
              />
              
              {/* صورة الهوية الخلفية */}
              <ImageUploadField
                label="صورة الهوية - الوجه الخلفي"
                name="back_id_card"
                id="back_id_card"
                fileRef={backIdCardRef as React.RefObject<HTMLInputElement>}
                preview={backIdCardPreview}
                currentFileName={formData.back_id_card?.name}
                error={validationErrors.back_id_card}
                onChange={handleFileChange}
                onDrop={(e) => handleDrop(e, 'back_id_card')}
                onDragOver={handleDragOver}
                onRemove={() => handleRemoveFile(backIdCardRef, 'back_id_card')}
              />
              
              {/* صورة السجل التجاري */}
              <div className="lg:col-span-2">
                <ImageUploadField
                  label="صورة السجل التجاري أو وثيقة العمل الحر"
                  name="commercial_registration"
                  id="commercial_registration"
                  fileRef={commercialRegistrationRef as React.RefObject<HTMLInputElement>}
                  preview={commercialRegistrationPreview}
                  currentFileName={formData.commercial_registration?.name}
                  error={validationErrors.commercial_registration}
                  onChange={handleFileChange}
                  onDrop={(e) => handleDrop(e, 'commercial_registration')}
                  onDragOver={handleDragOver}
                  onRemove={() => handleRemoveFile(commercialRegistrationRef, 'commercial_registration')}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 border-t border-grey-200 dark:border-grey-700 py-6 px-6">
            <Button
              type="button"
              variant="secondary"
              onClick={handleReset}
              leftIcon={<ArrowPathIcon className="h-5 w-5" />}
            >
              إعادة تعيين
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              isLoading={loading}
            >
              إضافة التاجر
            </Button>
          </div>
        </form>
      </DashboardCard>
    </DashboardLayout>
  );
};

export default AddMerchantPage; 