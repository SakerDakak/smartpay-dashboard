import React, { useRef } from "react";
import DashboardLayout from "../../../../layouts/DashboardLayout";
import {
  Button,
  Input,
  PasswordField,
  PhoneInput,
  Select,
  Spinner,
} from "../../../../components/ui";
import {
  DataListHeader,
  DashboardCard,
  StatusMessages,
} from "../../../../components/dashboard";
import {
  ArrowPathIcon,
  CheckIcon,
  KeyIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { AccountStatus } from "../../../../types/enums";
import Image from "next/image";
import {
  useMerchantEditForm,
  ImageFieldName,
} from "@/hooks/dashboard/merchants/useMerchantEditForm";

// تعريف نوع مرجع حقل الإدخال
type InputFileRef = React.RefObject<HTMLInputElement | null>;

const EditMerchantPage: React.FC = () => {
  const {
    formData,
    loading,
    saving,
    error,
    success,
    validationErrors,
    showPasswordSection,
    logoPreviews,
    frontIdCardPreview,
    backIdCardPreview,
    commercialRegistrationPreview,
    handleChange,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleReset,
    handleSubmit,
    togglePasswordSection,
    setErrorRef,
    handleCancelImageChange,
    handleRemoveImage,
  } = useMerchantEditForm();

  // مراجع ملفات الصور
  const logoFileRef = useRef<HTMLInputElement>(null);
  const frontIdCardRef = useRef<HTMLInputElement>(null);
  const backIdCardRef = useRef<HTMLInputElement>(null);
  const commercialRegistrationRef = useRef<HTMLInputElement>(null);

  // مكون حقل إدخال الصورة القابل للسحب والإفلات
  const ImageUploadField = ({
    label,
    name,
    fileRef,
    preview,
    error,
    isRequired,
  }: {
    label: string;
    name: ImageFieldName;
    fileRef: InputFileRef;
    preview: string | null;
    error?: string;
    isRequired?: boolean;
  }) => {
    const hasOriginal = (() => {
      switch (name) {
        case "logo":
          return !!formData.logo_preview;
        case "image_front_id_card":
          return !!formData.image_front_id_card_preview;
        case "image_back_id_card":
          return !!formData.image_back_id_card_preview;
        case "image_commercial_registration_or_freelance_focument":
          return !!formData.image_commercial_registration_or_freelance_focument_preview;
        default:
          return false;
      }
    })();
    const hasNew = (() => {
      switch (name) {
        case "logo":
          return !!formData.logo;
        case "image_front_id_card":
          return !!formData.image_front_id_card;
        case "image_back_id_card":
          return !!formData.image_back_id_card;
        case "image_commercial_registration_or_freelance_focument":
          return !!formData.image_commercial_registration_or_freelance_focument;
        default:
          return false;
      }
    })();
    return (
      <div>
        <label className="block mb-2 text-sm font-medium text-grey-700 dark:text-grey-300">
          {label}
          {isRequired && <span className="text-danger-600">*</span>}
        </label>
        <div
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            error
              ? "border-danger-500 dark:border-danger-600"
              : "border-grey-300 dark:border-grey-700 hover:border-primary-500 dark:hover:border-primary-500"
          }`}
          onClick={() => fileRef.current?.click()}
          onDrop={(e) => handleDrop(e, name)}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            name={name}
            id={name}
            ref={fileRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {preview ? (
            <div className="flex flex-col items-center">
              <Image
                src={preview}
                alt={`${label} Preview`}
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded-lg mb-2"
              />
              <span className="text-sm text-grey-600 dark:text-grey-400">
                {name === "logo" && formData.logo
                  ? formData.logo.name
                  : name === "image_front_id_card" &&
                    formData.image_front_id_card
                  ? formData.image_front_id_card.name
                  : name === "image_back_id_card" && formData.image_back_id_card
                  ? formData.image_back_id_card.name
                  : name ===
                      "image_commercial_registration_or_freelance_focument" &&
                    formData.image_commercial_registration_or_freelance_focument
                  ? formData.image_commercial_registration_or_freelance_focument
                      .name
                  : ""}
              </span>
              {hasNew ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (fileRef.current) fileRef.current.value = "";
                    // استخدام وظيفة إلغاء تغيير الصورة الجديدة
                    handleCancelImageChange(name);
                  }}
                >
                  إلغاء التغيير
                </Button>
              ) : !hasOriginal ? (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    // استخدام وظيفة حذف الصورة الجديدة
                    handleRemoveImage(name);
                  }}
                >
                  حذف
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="py-4">
              <svg
                className="mx-auto h-12 w-12 text-grey-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-grey-600 dark:text-grey-400">
                انقر لاختيار صورة أو اسحب وأفلت ملف هنا
              </p>
              <p className="mt-1 text-xs text-grey-500 dark:text-grey-500">
                PNG, JPG حتى 1MB
              </p>
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <DataListHeader
        title="تعديل بيانات التاجر"
        subtitle="تعديل معلومات وبيانات التاجر"
      />

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner size="lg" color="primary" />
        </div>
      ) : error && !formData.name ? (
        <DashboardCard className="max-w-5xl mx-auto">
          <div className="text-center py-8">
            <div className="mb-4">
              <XCircleIcon className="h-16 w-16 mx-auto text-danger-500" />
            </div>
            <p className="text-xl font-semibold mb-2 text-danger-500">
              {error}
            </p>
            <p className="text-grey-600 dark:text-grey-400 mb-6">
              لا يمكن العثور على التاجر المطلوب
            </p>
            <Button
              onClick={() => (window.location.href = "/dashboard/merchants")}
            >
              العودة إلى قائمة التاجر
            </Button>
          </div>
        </DashboardCard>
      ) : (
        <DashboardCard className="max-w-5xl mx-auto">
          <StatusMessages error={error} successMessage={success} />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">المعلومات الشخصية</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* الاسم الكامل */}
                <div ref={(el) => setErrorRef("name", el)}>
                  <Input
                    label="الاسم الكامل"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={validationErrors.name}
                    isRequired
                  />
                </div>

                {/* البريد الإلكتروني */}
                <div ref={(el) => setErrorRef("email", el)}>
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
                </div>

                {/* المدينة */}
                <div ref={(el) => setErrorRef("city", el)}>
                  <Input
                    label="المدينة"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    error={validationErrors.city}
                    isRequired
                  />
                </div>

                {/* رقم الجوال */}
                <div ref={(el) => setErrorRef("mobile", el)}>
                  <PhoneInput
                    mobileValue={formData.mobile}
                    countryCodeValue={formData.country_code}
                    onMobileChange={handleChange}
                    onCountryCodeChange={handleChange}
                    error={validationErrors.mobile}
                    isRequired
                  />
                </div>

                {/* رقم الآيبان */}
                <div ref={(el) => setErrorRef("iban", el)}>
                  <Input
                    label="رقم الآيبان"
                    name="iban"
                    id="iban"
                    value={formData.iban}
                    onChange={handleChange}
                    error={validationErrors.iban}
                    isRequired
                  />
                </div>

                {/* حالة الحساب */}
                <div ref={(el) => setErrorRef("status", el)}>
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
              </div>

              <h2 className="text-xl font-bold mb-6 mt-10">
                المعلومات التجارية
              </h2>

              <div className="grid grid-cols-1 gap-6">
                {/* الاسم التجاري */}
                <div ref={(el) => setErrorRef("brand_name", el)}>
                  <Input
                    label="الاسم التجاري"
                    name="brand_name"
                    id="brand_name"
                    value={formData.brand_name}
                    onChange={handleChange}
                    error={validationErrors.brand_name}
                    isRequired
                  />
                </div>

                {/* الشعار التجاري */}
                <div ref={(el) => setErrorRef("logo", el)}>
                  <div>
                    <ImageUploadField
                      label="الشعار التجاري "
                      name="logo"
                      fileRef={logoFileRef}
                      preview={logoPreviews}
                      error={validationErrors.logo}
                      isRequired
                    />
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-6 mt-10">المستندات</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* صورة الهوية الأمامية */}
                <div ref={(el) => setErrorRef("image_front_id_card", el)}>
                  <div>
                    <ImageUploadField
                      label="صورة الهوية - الوجه الأمامي "
                      name="image_front_id_card"
                      fileRef={frontIdCardRef}
                      preview={frontIdCardPreview}
                      error={validationErrors.image_front_id_card}
                      isRequired
                    />
                  </div>
                </div>

                {/* صورة الهوية الخلفية */}
                <div ref={(el) => setErrorRef("image_back_id_card", el)}>
                  <div>
                    <ImageUploadField
                      label="صورة الهوية - الوجه الخلفي "
                      name="image_back_id_card"
                      fileRef={backIdCardRef}
                      preview={backIdCardPreview}
                      error={validationErrors.image_back_id_card}
                      isRequired
                    />
                  </div>
                </div>

                {/* صورة السجل التجاري */}
                <div
                  ref={(el) =>
                    setErrorRef(
                      "image_commercial_registration_or_freelance_focument",
                      el
                    )
                  }
                  className="lg:col-span-2"
                >
                  <div>
                    <ImageUploadField
                      label="صورة السجل التجاري أو وثيقة العمل الحر "
                      name="image_commercial_registration_or_freelance_focument"
                      fileRef={commercialRegistrationRef}
                      preview={commercialRegistrationPreview}
                      error={
                        validationErrors.image_commercial_registration_or_freelance_focument
                      }
                      isRequired
                    />
                  </div>
                </div>
              </div>
            </div>

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
                    id="confirm_password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    label="تأكيد كلمة المرور الجديدة"
                    error={validationErrors.confirm_password}
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
                className="py-3 px-6"
                leftIcon={<ArrowPathIcon className="h-5 w-5" />}
              >
                إعادة تعيين
              </Button>

              <Button
                type="submit"
                variant="primary"
                className="py-3 px-6"
                isLoading={saving}
                leftIcon={!saving && <CheckIcon className="h-5 w-5" />}
              >
                حفظ التغييرات
              </Button>
            </div>
          </form>
        </DashboardCard>
      )}
    </DashboardLayout>
  );
};

export default EditMerchantPage;
