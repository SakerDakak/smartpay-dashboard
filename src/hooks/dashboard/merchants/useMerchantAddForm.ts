import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { MerchantService } from '../../../services/firebase/merchantService';
import { NearpayService } from '../../../services/nearpay/nearpayService';
import { AccountStatusEX } from '../../../types/enums/accountStatus';
import { 
  validateName, 
  validateBrandName, 
  validateEmail, 
  validatePhoneNumber, 
  validateCity, 
  validatePassword, 
  validatePasswordConfirmation 
} from '../../../utils/validation';
import { checkEmailExists, checkMobileExists } from '../../../services/firebase/utils';

// نموذج بيانات إضافة تاجر جديد
export interface MerchantFormData {
  id?: string;
  name: string;
  brand_name: string;
  email: string;
  mobile: string;
  country_code: number;
  city: string;
  password: string;
  confirm_password: string;
  iban: string;
  logo: File | null;
  front_id_card: File | null;
  back_id_card: File | null;
  commercial_registration: File | null;
  status: AccountStatusEX;
}

// أنواع خطأ التحقق
export interface ValidationErrors {
  name?: string;
  brand_name?: string;
  email?: string;
  mobile?: string;
  country_code?: string;
  city?: string;
  password?: string;
  confirm_password?: string;
  iban?: string;
  logo?: string;
  front_id_card?: string;
  back_id_card?: string;
  commercial_registration?: string;
  status?: string;
}

// تعريف نوع مرجع حقل الإدخال
export type InputFileRef = React.RefObject<HTMLInputElement | null>;

export const MAX_FILE_SIZE_MB = 1;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const useMerchantAddForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  
  // مراجع ملفات الصور
  const logoFileRef = useRef<HTMLInputElement>(null);
  const frontIdCardRef = useRef<HTMLInputElement>(null);
  const backIdCardRef = useRef<HTMLInputElement>(null);
  const commercialRegistrationRef = useRef<HTMLInputElement>(null);
  
  // حالة النموذج
  const [formData, setFormData] = useState<MerchantFormData>({
    name: '',
    brand_name: '',
    email: '',
    mobile: '',
    country_code: 966, // الافتراضي للسعودية
    city: '',
    password: '',
    confirm_password: '',
    iban: '',
    logo: null,
    front_id_card: null,
    back_id_card: null,
    commercial_registration: null,
    status: AccountStatusEX.active, // الافتراضي هو نشط
  });

  // معاينة الصور
  const [logoPreviews, setLogoPreviews] = useState<string | null>(null);
  const [frontIdCardPreview, setFrontIdCardPreview] = useState<string | null>(null);
  const [backIdCardPreview, setBackIdCardPreview] = useState<string | null>(null);
  const [commercialRegistrationPreview, setCommercialRegistrationPreview] = useState<string | null>(null);
  
  // تحديث حالة النموذج للحقول العادية
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // إجراء التحقق المباشر عند تغيير القيمة
    validateField(name, value);
  };
  
  // التحقق المباشر من حقل واحد
  const validateField = (name: string, value: string) => {
    let error: string | null = null;
    
    switch (name) {
      case 'name':
        error = validateName(value);
        break;
      case 'brand_name':
        error = validateBrandName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'mobile':
        error = validatePhoneNumber(value, formData.country_code.toString());
        break;
      case 'city':
        error = validateCity(value);
        break;
      case 'password':
        error = validatePassword(value);
        // تحقق من تأكيد كلمة المرور أيضاً عند تغيير كلمة المرور
        if (formData.confirm_password) {
          const confirmPasswordError = validatePasswordConfirmation(value, formData.confirm_password);
          setValidationErrors(prev => ({
            ...prev,
            confirm_password: confirmPasswordError || undefined
          }));
        }
        break;
      case 'confirm_password':
        error = validatePasswordConfirmation(formData.password, value);
        break;
      case 'iban':
        if (!value.trim()) {
          error = 'رقم الآيبان مطلوب';
        } else if (!/^SA\d{2}[0-9A-Z]{20}$/.test(value)) {
          error = 'الرجاء إدخال رقم آيبان سعودي صحيح';
        }
        break;
    }
    
    setValidationErrors(prev => ({
      ...prev,
      [name]: error || undefined
    }));
  };
  
  // تحويل الصورة إلى Base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          // استخراج القيمة الفعلية من سلسلة Base64 (إزالة "data:image/jpeg;base64,")
          const base64String = reader.result.toString();
          const base64Value = base64String.substring(base64String.indexOf(',') + 1);
          resolve(base64Value);
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };
  
  // ضغط الصورة وتحويلها إلى Base64
  const compressAndConvertToBase64 = async (file: File): Promise<string> => {
    // في الواقع، يمكنك هنا إضافة منطق لضغط الصورة قبل تحويلها
    return await convertToBase64(file);
  };
  
  // معالجة تحميل الصور
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    
    // التحقق من حجم الملف
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: `حجم الملف يجب أن لا يتجاوز ${MAX_FILE_SIZE_MB} ميجابايت`,
      }));
      // مسح قيمة الإدخال إذا كان الملف كبيرًا جدًا
      if (e.target) {
        e.target.value = '';
      }
      return;
    }
    
    // تحديث حالة النموذج
    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));
    
    // إزالة خطأ التحقق
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
    
    // عرض معاينة للصورة
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const preview = reader.result.toString();
        
        switch(name) {
          case 'logo':
            setLogoPreviews(preview);
            break;
          case 'front_id_card':
            setFrontIdCardPreview(preview);
            break;
          case 'back_id_card':
            setBackIdCardPreview(preview);
            break;
          case 'commercial_registration':
            setCommercialRegistrationPreview(preview);
            break;
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // معالجة سحب وإفلات الصور
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, fieldName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // التحقق من حجم الملف
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setValidationErrors((prev) => ({
          ...prev,
          [fieldName]: `حجم الملف يجب أن لا يتجاوز ${MAX_FILE_SIZE_MB} ميجابايت`,
        }));
        return;
      }
      
      // تحديث حالة النموذج
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
      
      // إزالة خطأ التحقق
      if (validationErrors[fieldName as keyof ValidationErrors]) {
        setValidationErrors((prev) => ({
          ...prev,
          [fieldName]: undefined,
        }));
      }
      
      // عرض معاينة للصورة
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const preview = reader.result.toString();
          
          switch(fieldName) {
            case 'logo':
              setLogoPreviews(preview);
              break;
            case 'front_id_card':
              setFrontIdCardPreview(preview);
              break;
            case 'back_id_card':
              setBackIdCardPreview(preview);
              break;
            case 'commercial_registration':
              setCommercialRegistrationPreview(preview);
              break;
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  // التحقق من صحة النموذج
  const validateForm = async (): Promise<boolean> => {
    const errors: ValidationErrors = {};
    
    // التحقق من الاسم
    const nameError = validateName(formData.name);
    if (nameError) {
      errors.name = nameError;
    }
    
    // التحقق من الاسم التجاري
    const brandNameError = validateBrandName(formData.brand_name);
    if (brandNameError) {
      errors.brand_name = brandNameError;
    }
    
    // التحقق من البريد الإلكتروني
    const emailError = validateEmail(formData.email);
    if (emailError) {
      errors.email = emailError;
    } else {
      try {
        const emailExists = await checkEmailExists(formData.email.trim().toLowerCase());
        if (emailExists) {
          errors.email = 'البريد الإلكتروني مستخدم بالفعل';
        }
      } catch (err) {
        console.error('Error checking email existence:', err);
        setError('حدث خطأ أثناء التحقق من البريد الإلكتروني.');
        return false;
      }
    }
    
    // التحقق من رقم الجوال
    const phoneError = validatePhoneNumber(formData.mobile, formData.country_code.toString());
    if (phoneError) {
      errors.mobile = phoneError;
    } else {
      try {
        const mobileExists = await checkMobileExists(
          formData.mobile.trim(),
          formData.country_code
        );
        if (mobileExists) {
          errors.mobile = 'رقم الجوال مستخدم بالفعل';
        }
      } catch (err) {
        console.error('Error checking mobile existence:', err);
        setError('حدث خطأ أثناء التحقق من رقم الجوال.');
        return false;
      }
    }
    
    // التحقق من المدينة
    const cityError = validateCity(formData.city);
    if (cityError) {
      errors.city = cityError;
    }
    
    // التحقق من كلمة المرور
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      errors.password = passwordError;
    }
    
    // التحقق من تأكيد كلمة المرور
    const confirmPasswordError = validatePasswordConfirmation(formData.password, formData.confirm_password);
    if (confirmPasswordError) {
      errors.confirm_password = confirmPasswordError;
    }
    
    // التحقق من IBAN
    if (!formData.iban.trim()) {
      errors.iban = 'رقم الآيبان مطلوب';
    } else if (!/^SA\d{2}[0-9A-Z]{20}$/.test(formData.iban)) {
      errors.iban = 'الرجاء إدخال رقم آيبان سعودي صحيح';
    }
    
    // التحقق من الشعار التجاري
    if (!formData.logo) {
      errors.logo = 'الشعار التجاري مطلوب';
    }
    
    // التحقق من صورة الهوية الأمامية
    if (!formData.front_id_card) {
      errors.front_id_card = 'صورة الهوية الأمامية مطلوبة';
    }
    
    // التحقق من صورة الهوية الخلفية
    if (!formData.back_id_card) {
      errors.back_id_card = 'صورة الهوية الخلفية مطلوبة';
    }
    
    // التحقق من صورة السجل التجاري أو وثيقة العمل الحر
    if (!formData.commercial_registration) {
      errors.commercial_registration = 'صورة السجل التجاري أو وثيقة العمل الحر مطلوبة';
    }
    
    // حفظ أخطاء التحقق
    setValidationErrors(errors);
    
    // إرجاع النتيجة
    return Object.keys(errors).length === 0;
  };
  
  // إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // مسح رسائل الخطأ والنجاح السابقة
    setError(null);
    setSuccess(null);
    
    // ضبط حالة التحميل إلى true فوراً عند بدء معالجة النموذج
    setLoading(true);
    
    // التحقق من صحة النموذج
    const isValid = await validateForm();
    if (!isValid) {
      setLoading(false);
      return;
    }
    
    try {
      /// here
      // تحويل الصور إلى Base64
      const logoBase64 = await compressAndConvertToBase64(formData.logo!);
      const frontIdCardBase64 = await compressAndConvertToBase64(formData.front_id_card!);
      const backIdCardBase64 = await compressAndConvertToBase64(formData.back_id_card!);
      const commercialRegistrationBase64 = await compressAndConvertToBase64(formData.commercial_registration!);
      
      // تحضير رقم الهاتف بالتنسيق المناسب
      const formattedPhone = formData.mobile.startsWith('0') 
        ? formData.mobile.substring(1) 
        : formData.mobile;
      
      // إنشاء التاجر في Nearpay أولاً
      const merchantId = await NearpayService.createMerchant({
        name: formData.name.trim().toLowerCase(),
        brandName: formData.brand_name.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        phone: formattedPhone.trim(),
        countryCode: formData.country_code,
      });
      
      // إضافة التاجر إلى Firebase
      await MerchantService.addMerchant({
        id: merchantId,
        name: formData.name.trim().toLowerCase(),
        brandName: formData.brand_name.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        phone: formattedPhone.trim(),
        countryCode: formData.country_code,
        city: formData.city.trim(),
        iban: formData.iban.trim(),
        status: formData.status,
        imageFrontIdCard: frontIdCardBase64,
        imageBackIdCard: backIdCardBase64,
        imageCommercialRegistrationOrFreelanceDocument: commercialRegistrationBase64,
        logo: logoBase64,
        password: formData.password,
        createdAt: new Date().toISOString(),
      });
      
      // عرض رسالة النجاح
      setSuccess('تم إضافة التاجر بنجاح');
      
      // توجيه المستخدم إلى صفحة التجار بعد 2 ثانية
      setTimeout(() => {
        router.push('/dashboard/merchants');
      }, 2000);
      
    } catch (err) {
      console.error('Error adding merchant:', err);
      setError('حدث خطأ أثناء إضافة التاجر. الرجاء المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };
  
  // إعادة تعيين النموذج
  const handleReset = () => {
    setFormData({
      name: '',
      brand_name: '',
      email: '',
      mobile: '',
      country_code: 966,
      city: '',
      password: '',
      confirm_password: '',
      iban: '',
      logo: null,
      front_id_card: null,
      back_id_card: null,
      commercial_registration: null,
      status: AccountStatusEX.active,
    });
    
    // إعادة تعيين معاينات الصور
    setLogoPreviews(null);
    setFrontIdCardPreview(null);
    setBackIdCardPreview(null);
    setCommercialRegistrationPreview(null);
    
    // إعادة تعيين مراجع الملفات
    if (logoFileRef.current) logoFileRef.current.value = '';
    if (frontIdCardRef.current) frontIdCardRef.current.value = '';
    if (backIdCardRef.current) backIdCardRef.current.value = '';
    if (commercialRegistrationRef.current) commercialRegistrationRef.current.value = '';
    
    setError(null);
    setSuccess(null);
    setValidationErrors({});
  };

  // إزالة الملف
  const handleRemoveFile = (fileRef: InputFileRef, fileType: string) => {
    if (fileRef.current) fileRef.current.value = '';
    
    switch(fileType) {
      case 'logo':
        setFormData(prev => ({ ...prev, logo: null }));
        setLogoPreviews(null);
        break;
      case 'front_id_card':
        setFormData(prev => ({ ...prev, front_id_card: null }));
        setFrontIdCardPreview(null);
        break;
      case 'back_id_card':
        setFormData(prev => ({ ...prev, back_id_card: null }));
        setBackIdCardPreview(null);
        break;
      case 'commercial_registration':
        setFormData(prev => ({ ...prev, commercial_registration: null }));
        setCommercialRegistrationPreview(null);
        break;
    }
  };

  return {
    formData,
    setFormData,
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
  };
};

export default useMerchantAddForm; 