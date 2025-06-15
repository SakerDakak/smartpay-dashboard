import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import {
  checkEmailExists,
  checkMobileExists,
  SellerService,
  MerchantService,
} from "@/services/firebase";
import { MerchantProfile, SellerProfile } from "@/types/models";
import { AccountStatus, AccountType } from "@/types/enums";
import {
  validateEmail,
  validateName,
  validateCity,
  validatePhoneNumber,
  validatePassword,
  validatePasswordConfirmation,
} from "@/utils/validation";

// Define the shape of your form data
interface SellerFormData {
  name: string;
  email: string;
  mobile: string;
  country_code: string;
  city: string;
  password: string;
  confirmPassword: string;
  merchant_id: string;
  status: AccountStatus;
}

// Define the shape for validation errors
interface ValidationErrors {
  name?: string;
  email?: string;
  mobile?: string;
  city?: string;
  password?: string;
  confirmPassword?: string;
  merchant_id?: string;
  status?: string;
  general?: string; // For general form errors not tied to a specific field
}

const initialFormData: SellerFormData = {
  name: "",
  email: "",
  mobile: "",
  country_code: "966", // Default to Saudi Arabia
  city: "",
  password: "",
  confirmPassword: "",
  merchant_id: "",
  status: AccountStatus.Active, // Default to active, can be changed if needed
};

export const useSellerAddForm = () => {
  const router = useRouter();
  const { merchant_id: queryMerchantId } = router.query; // Get merchant_id from URL query

  const [formData, setFormData] = useState<SellerFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Kept for general errors or success messages
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [merchants, setMerchants] = useState<MerchantProfile[]>([]);
  const [merchantLoading, setMerchantLoading] = useState(true);
  const [merchantSearchTerm, setMerchantSearchTerm] = useState(""); // For client-side filtering

  // Fetch merchants for the select dropdown
  useEffect(() => {
    const fetchMerchants = async () => {
      try {
        setMerchantLoading(true);
        const fetchedMerchants = await MerchantService.getMerchants();
        setMerchants(fetchedMerchants);
        if (fetchedMerchants.length === 0) {
          // Use validationErrors for field-specific or general form errors
          setValidationErrors((prev) => ({
            ...prev,
            general:
              "لا يوجد تجار متاحون لربط البائع بهم. يرجى إضافة تاجر أولاً.",
          }));
        }
        // If merchantId is passed in query and exists in fetched merchants, set it as default
        if (
          queryMerchantId &&
          typeof queryMerchantId === "string" &&
          fetchedMerchants.some((m) => m.id === queryMerchantId)
        ) {
          setFormData((prev) => ({
            ...prev,
            merchant_id: queryMerchantId as string,
          }));
        } else if (fetchedMerchants.length > 0 && !queryMerchantId) {
          // If no queryMerchantId and merchants exist
          setFormData((prev) => ({
            ...prev,
            merchant_id: fetchedMerchants[0].id,
          })); // Set the first merchant as default
        }
      } catch (err) {
        const error = err as Error; // Type assertion
        console.error("Failed to fetch merchants:", error);
        // Use validationErrors for field-specific or general form errors
        setValidationErrors((prev) => ({
          ...prev,
          general: error.message || "فشل في تحميل قائمة التجار.",
        }));
      }
      setMerchantLoading(false);
    };
    fetchMerchants();
  }, [queryMerchantId]);

  // Client-side filtering for merchants
  const filteredMerchants = useMemo(() => {
    if (!merchantSearchTerm) {
      return merchants;
    }
    return merchants.filter(
      (merchant) =>
        merchant.name
          .toLowerCase()
          .includes(merchantSearchTerm.toLowerCase()) ||
        merchant.brand_name
          .toLowerCase()
          .includes(merchantSearchTerm.toLowerCase())
    );
  }, [merchants, merchantSearchTerm]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // التحقق الفوري من صحة البيانات
      let fieldError: string | null = null;

      switch (name) {
        case "name":
          fieldError = validateName(value);
          break;
        case "email":
          fieldError = validateEmail(value);
          break;
        case "mobile":
          fieldError = validatePhoneNumber(value, formData.country_code);
          break;
        case "city":
          fieldError = validateCity(value);
          break;
        case "password":
          fieldError = validatePassword(value);
          // عند تغيير كلمة المرور، تحقق أيضًا من تطابق كلمتي المرور
          if (!fieldError && formData.confirmPassword) {
            const confirmError = validatePasswordConfirmation(
              value,
              formData.confirmPassword
            );
            setValidationErrors((prev) => ({
              ...prev,
              confirmPassword: confirmError || undefined,
            }));
          }
          break;
        case "confirmPassword":
          fieldError = validatePasswordConfirmation(formData.password, value);
          break;
      }

      // تحديث أخطاء التحقق
      setValidationErrors((prev) => ({
        ...prev,
        [name]: fieldError || undefined,
        general: undefined,
      }));

      setError(null); // مسح رسالة الخطأ العامة
    },
    [formData]
  );

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      // التحقق الفوري من صحة البيانات
      let fieldError: string | null = null;

      switch (name) {
        case "country_code":
          // إذا تغير رمز الدولة، أعد التحقق من رقم الجوال
          if (formData.mobile) {
            fieldError = validatePhoneNumber(formData.mobile, value);
            setValidationErrors((prev) => ({
              ...prev,
              mobile: fieldError || undefined,
            }));
          }
          break;
        case "merchant_id":
          if (!value) {
            fieldError = "الرجاء اختيار التاجر الذي سيعمل معه هذا البائع.";
          }
          break;
      }

      // تحديث أخطاء التحقق
      setValidationErrors((prev) => ({
        ...prev,
        [name]: fieldError || undefined,
        general: undefined,
      }));

      setError(null);
    },
    [formData]
  );

  const handleReset = useCallback(() => {
    setFormData(initialFormData);
    setError(null);
    setSuccess(null);
    setValidationErrors({}); // Clear all validation errors
    setMerchantSearchTerm(""); // Reset search term
    // If queryMerchantId exists, retain it on reset
    if (queryMerchantId && typeof queryMerchantId === "string") {
      setFormData((prev) => ({
        ...prev,
        merchant_id: queryMerchantId as string,
      }));
    }
  }, [queryMerchantId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setValidationErrors({}); // Clear previous validation errors
    setLoading(true);

    const currentValidationErrors: ValidationErrors = {};

    // استخدام دوال التحقق من validation.ts
    const nameError = validateName(formData.name);
    if (nameError) {
      currentValidationErrors.name = nameError;
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      currentValidationErrors.email = emailError;
    } else {
      try {
        const emailExists = await checkEmailExists(formData.email);
        if (emailExists) {
          currentValidationErrors.email =
            "البريد الإلكتروني للبائع مستخدم بالفعل.";
        }
      } catch (err) {
        console.error("Error checking seller email:", err);
        currentValidationErrors.general =
          "خطأ في التحقق من البريد الإلكتروني للبائع.";
      }
    }

    const mobileError = validatePhoneNumber(
      formData.mobile,
      formData.country_code
    );
    if (mobileError) {
      currentValidationErrors.mobile = mobileError;
    } else {
      try {
        const mobileExists = await checkMobileExists(
          formData.mobile.trim(),
          parseInt(formData.country_code, 10)
        );
        if (mobileExists) {
          currentValidationErrors.mobile = "رقم جوال البائع مستخدم بالفعل.";
        }
      } catch (err) {
        console.error("Error checking seller mobile:", err);
        currentValidationErrors.general = "خطأ في التحقق من رقم جوال البائع.";
      }
    }

    const cityError = validateCity(formData.city);
    if (cityError) {
      currentValidationErrors.city = cityError;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      currentValidationErrors.password = passwordError;
    }

    const confirmPasswordError = validatePasswordConfirmation(
      formData.password,
      formData.confirmPassword
    );
    if (confirmPasswordError) {
      currentValidationErrors.confirmPassword = confirmPasswordError;
    }

    // Merchant ID validation
    if (!formData.merchant_id) {
      currentValidationErrors.merchant_id =
        "الرجاء اختيار التاجر الذي سيعمل معه هذا البائع.";
    }

    if (Object.keys(currentValidationErrors).length > 0) {
      setValidationErrors(currentValidationErrors);
      setLoading(false);
      return;
    }

    try {
      // Constructing the payload for SellerService.addSeller carefully
      const sellerPayload: Omit<SellerProfile, "id" | "created_at"> & {
        password: string;
      } = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        country_code: parseInt(formData.country_code, 10),
        city: formData.city,
        password: formData.password,
        merchant_id: formData.merchant_id,
        status: formData.status,
        terminal_id: "",
        tid: "",
        type: AccountType.Seller,
      };
      await SellerService.addSeller(sellerPayload);

      setSuccess(
        "تمت إضافة البائع بنجاح! سيتم توجيهك للتاجر الذي سيعمل معه هذا البائع."
      );
      setFormData(initialFormData); // Reset form on success
      if (queryMerchantId && typeof queryMerchantId === "string") {
        setFormData((prev) => ({
          ...prev,
          merchant_id: queryMerchantId as string,
        }));
      }
      setTimeout(() => {
        router.push(`/dashboard/merchants/${formData.merchant_id}`);
      }, 2000);
    } catch (err) {
      const error = err as Error; // Type assertion
      console.error("Error adding seller:", error);
      // Set general error or specific field error if possible
      // For now, setting as a general validation error
      setValidationErrors({
        general:
          error.message || "فشل في إضافة البائع. يرجى المحاولة مرة أخرى.",
      });
    }
    setLoading(false);
  };

  return {
    formData,
    loading,
    error, // Keep for now, might be used for non-field specific messages not caught by validationErrors.general
    success,
    merchants,
    merchantLoading,
    merchantSearchTerm,
    setMerchantSearchTerm,
    filteredMerchants,
    validationErrors, // Expose validationErrors
    handleChange,
    handleSelectChange,
    handleSubmit,
    handleReset,
  };
};
