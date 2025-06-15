import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { MerchantService } from '../../../services/firebase/merchantService';
import { AccountStatus } from '../../../types/enums';
import { checkEmailExists, checkMobileExists } from '../../../services/firebase/utils';
import {
  validateName,
  validatePhoneNumber,
  validateCity,
  validateBrandName,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation
} from '../../../utils/validation';

// نموذج بيانات تعديل تاجر
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
  image_front_id_card: File | null;
  image_back_id_card: File | null;
  image_commercial_registration_or_freelance_focument: File | null;
  status: AccountStatus;
  // للمعاينة
  logo_preview?: string | null;
  image_front_id_card_preview?: string | null;
  image_back_id_card_preview?: string | null;
  image_commercial_registration_or_freelance_focument_preview?: string | null;
}

// نوع حقول الصور
export type ImageFieldName = 'logo' | 'image_front_id_card' | 'image_back_id_card' | 'image_commercial_registration_or_freelance_focument';

// نموذج بيانات التحديث
interface UpdateData {
  name: string;
  brand_name: string;
  email: string;
  mobile: string;
  country_code: number;
  city: string;
  status: AccountStatus;
  iban: string;
  password?: string;
  logo?: string;
  image_front_id_card?: string;
  image_back_id_card?: string;
  image_commercial_registration_or_freelance_focument?: string;
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
  image_front_id_card?: string;
  image_back_id_card?: string;
  image_commercial_registration_or_freelance_focument?: string;
  status?: string;
}

// الحد الأعلى لحجم الصورة بالبايت (1 ميجا)
const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB

export const useMerchantEditForm = () => {
  const router = useRouter();
  const { id } = router.query;
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  // إضافة حالة إظهار/إخفاء كلمة المرور
  const [showPasswordSection, setShowPasswordSection] = useState<boolean>(false);
  // مراجع للحقول التي تحتوي على أخطاء
  const formErrorsRef = useRef<{ [key: string]: HTMLElement | null }>({});
  
  // حالة لتخزين بيانات التاجر الأصلية للمقارنة
  const [originalMerchantData, setOriginalMerchantData] = useState({
    email: '',
    mobile: '',
    country_code: 966,
  });
  
  // حالة لتخزين بيانات التاجر الأصلية كاملة (للرجوع إليها عند إعادة التعيين)
  const [originalFullMerchantData, setOriginalFullMerchantData] = useState<MerchantFormData | null>(null);
  
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
    image_front_id_card: null,
    image_back_id_card: null,
    image_commercial_registration_or_freelance_focument: null,
    status: AccountStatus.Active,
    // للمعاينة
    logo_preview: null,
    image_front_id_card_preview: null,
    image_back_id_card_preview: null,
    image_commercial_registration_or_freelance_focument_preview: null,
  });

  // معاينة الصور
  const [logoPreviews, setLogoPreviews] = useState<string | null>(null);
  const [frontIdCardPreview, setFrontIdCardPreview] = useState<string | null>(null);
  const [backIdCardPreview, setBackIdCardPreview] = useState<string | null>(null);
  const [commercialRegistrationPreview, setCommercialRegistrationPreview] = useState<string | null>(null);
  
  // جلب بيانات التاجر
  useEffect(() => {
    const fetchMerchantData = async () => {
      if (!id || typeof id !== 'string') return;

      try {
        setLoading(true);
        setError(null);
        
        // استخدام خدمة MerchantService لجلب بيانات التاجر
        const merchantData = await MerchantService.getMerchantById(id);
        
        if (!merchantData) {
          setError('التاجر غير موجود');
          return;
        }
        
        // إعداد بيانات النموذج
        const formDataInitial: MerchantFormData = {
          name: merchantData.name || '',
          email: merchantData.email || '',
          mobile: merchantData.mobile || '',
          country_code: merchantData.country_code || 966,
          city: merchantData.city || '',
          status: merchantData.status || AccountStatus.Active,
          brand_name: merchantData.brand_name || '',
          password: '',
          confirm_password: '',
          iban: merchantData.iban || '',
          logo: null,
          image_front_id_card: null,
          image_back_id_card: null,
          image_commercial_registration_or_freelance_focument: null,
          // تعيين روابط المعاينة إذا كانت متوفرة
          logo_preview: merchantData.logo || null,
          image_front_id_card_preview: merchantData.image_front_id_card || null,
          image_back_id_card_preview: merchantData.image_back_id_card || null,
          image_commercial_registration_or_freelance_focument_preview: merchantData.image_commercial_registration_or_freelance_focument || null,
        };
        
        // تعيين بيانات النموذج
        setFormData(formDataInitial);
        
        // حفظ نسخة أصلية كاملة من البيانات للرجوع إليها عند إعادة التعيين
        setOriginalFullMerchantData(formDataInitial);
        
        // تخزين البيانات الأصلية للمقارنة
        setOriginalMerchantData({
          email: merchantData.email || '',
          mobile: merchantData.mobile || '',
          country_code: merchantData.country_code || 966,
        });
        
        // تعيين معاينات الصور إذا كانت متوفرة
        if (merchantData.logo) setLogoPreviews(
          merchantData.logo.startsWith('data:image')
            ? merchantData.logo
            : `data:image/jpeg;base64,${merchantData.logo}`
        );
        if (merchantData.image_front_id_card) setFrontIdCardPreview(
          merchantData.image_front_id_card.startsWith('data:image')
            ? merchantData.image_front_id_card
            : `data:image/jpeg;base64,${merchantData.image_front_id_card}`
        );
        if (merchantData.image_back_id_card) setBackIdCardPreview(
          merchantData.image_back_id_card.startsWith('data:image')
            ? merchantData.image_back_id_card
            : `data:image/jpeg;base64,${merchantData.image_back_id_card}`
        );
        if (merchantData.image_commercial_registration_or_freelance_focument) setCommercialRegistrationPreview(
          merchantData.image_commercial_registration_or_freelance_focument.startsWith('data:image')
            ? merchantData.image_commercial_registration_or_freelance_focument
            : `data:image/jpeg;base64,${merchantData.image_commercial_registration_or_freelance_focument}`
        );
        
      } catch (err) {
        console.error('Error fetching merchant data:', err);
        setError('حدث خطأ أثناء جلب بيانات التاجر.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMerchantData();
    }
  }, [id]);
  
  // تحديث حالة النموذج للحقول العادية مع التحقق المباشر
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // التحقق المباشر من الحقول عند التغيير
    let validationError: string | null = null;
    
    switch (name) {
      case 'name':
        validationError = validateName(value);
        break;
      case 'brand_name':
        validationError = validateBrandName(value);
        break;
      case 'email':
        validationError = validateEmail(value);
        break;
      case 'mobile':
        validationError = validatePhoneNumber(value, formData.country_code.toString());
        break;
      case 'city':
        validationError = validateCity(value);
        break;
      case 'password':
        validationError = validatePassword(value);
        // إذا تغيرت كلمة المرور وكان هناك تأكيد لكلمة المرور، قم بالتحقق من التطابق
        if (formData.confirm_password) {
          const confirmError = validatePasswordConfirmation(value, formData.confirm_password, false);
          if (confirmError) {
            setValidationErrors(prev => ({
              ...prev,
              confirm_password: confirmError
            }));
          } else {
            setValidationErrors(prev => ({
              ...prev,
              confirm_password: undefined
            }));
          }
        }
        break;
      case 'confirm_password':
        validationError = validatePasswordConfirmation(formData.password, value, false);
        break;
    }
    
    // تحديث أخطاء التحقق
    setValidationErrors(prev => ({
      ...prev,
      [name]: validationError || undefined,
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
    // تحقق من الحجم
    if (file.size > MAX_IMAGE_SIZE) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: 'حجم الصورة يجب ألا يتجاوز 1 ميجا بايت',
      }));
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
          case 'image_front_id_card':
            setFrontIdCardPreview(preview);
            break;
          case 'image_back_id_card':
            setBackIdCardPreview(preview);
            break;
          case 'image_commercial_registration_or_freelance_focument':
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
      // تحقق من الحجم
      if (file.size > MAX_IMAGE_SIZE) {
        setValidationErrors((prev) => ({
          ...prev,
          [fieldName]: 'حجم الصورة يجب ألا يتجاوز 1 ميجا بايت',
        }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
      if (validationErrors[fieldName as keyof ValidationErrors]) {
        setValidationErrors((prev) => ({
          ...prev,
          [fieldName]: undefined,
        }));
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const preview = reader.result.toString();
          switch(fieldName) {
            case 'logo':
              setLogoPreviews(preview);
              break;
            case 'image_front_id_card':
              setFrontIdCardPreview(preview);
              break;
            case 'image_back_id_card':
              setBackIdCardPreview(preview);
              break;
            case 'image_commercial_registration_or_freelance_focument':
              setCommercialRegistrationPreview(preview);
              break;
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // إلغاء تغيير صورة واستعادة الصورة الأصلية
  const handleCancelImageChange = (fieldName: ImageFieldName) => {
    // إعادة تعيين حقل الملف إلى null
    setFormData(prev => ({
      ...prev,
      [fieldName]: null
    }));

    // استعادة المعاينة الأصلية
    switch(fieldName) {
      case 'logo':
        if (formData.logo_preview) {
          // استعادة المعاينة الأصلية
          const preview = formData.logo_preview.startsWith('data:image')
            ? formData.logo_preview
            : `data:image/jpeg;base64,${formData.logo_preview}`;
          setLogoPreviews(preview);
        }
        break;
      case 'image_front_id_card':
        if (formData.image_front_id_card_preview) {
          const preview = formData.image_front_id_card_preview.startsWith('data:image')
            ? formData.image_front_id_card_preview
            : `data:image/jpeg;base64,${formData.image_front_id_card_preview}`;
          setFrontIdCardPreview(preview);
        }
        break;
      case 'image_back_id_card':
        if (formData.image_back_id_card_preview) {
          const preview = formData.image_back_id_card_preview.startsWith('data:image')
            ? formData.image_back_id_card_preview
            : `data:image/jpeg;base64,${formData.image_back_id_card_preview}`;
          setBackIdCardPreview(preview);
        }
        break;
      case 'image_commercial_registration_or_freelance_focument':
        if (formData.image_commercial_registration_or_freelance_focument_preview) {
          const preview = formData.image_commercial_registration_or_freelance_focument_preview.startsWith('data:image')
            ? formData.image_commercial_registration_or_freelance_focument_preview
            : `data:image/jpeg;base64,${formData.image_commercial_registration_or_freelance_focument_preview}`;
          setCommercialRegistrationPreview(preview);
        }
        break;
    }

    // إزالة أي خطأ تحقق متعلق بالحقل
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: undefined
      }));
    }
  };

  // حذف صورة تماماً (الملف الجديد والمعاينة الأصلية)
  const handleRemoveImage = (fieldName: ImageFieldName) => {
    // إعادة تعيين حقل الملف وحقل المعاينة إلى null
    setFormData(prev => ({
      ...prev,
      [fieldName]: null,
      [`${fieldName}_preview`]: null
    }));

    // إزالة المعاينة
    switch(fieldName) {
      case 'logo':
        setLogoPreviews(null);
        break;
      case 'image_front_id_card':
        setFrontIdCardPreview(null);
        break;
      case 'image_back_id_card':
        setBackIdCardPreview(null);
        break;
      case 'image_commercial_registration_or_freelance_focument':
        setCommercialRegistrationPreview(null);
        break;
    }

    // إضافة خطأ تحقق إذا كان الحقل مطلوباً (جميع الحقول مطلوبة في هذه الحالة)
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: `${getFieldLabel(fieldName)} مطلوب`
    }));
  };

  // الحصول على تسمية الحقل المناسبة للرسائل
  const getFieldLabel = (fieldName: ImageFieldName): string => {
    switch(fieldName) {
      case 'logo':
        return 'الشعار التجاري';
      case 'image_front_id_card':
        return 'صورة الهوية الأمامية';
      case 'image_back_id_card':
        return 'صورة الهوية الخلفية';
      case 'image_commercial_registration_or_freelance_focument':
        return 'صورة السجل التجاري أو وثيقة العمل الحر';
    }
  };

  // إعادة تعيين النموذج
  const handleReset = () => {
    if (originalFullMerchantData) {
      // استخدام البيانات الأصلية المخزنة بدلاً من إعادة تحميلها من الخادم
      setFormData(originalFullMerchantData);
      
      // إعادة تعيين معاينات الصور
      if (originalFullMerchantData.logo_preview) {
        const preview = originalFullMerchantData.logo_preview.startsWith('data:image')
          ? originalFullMerchantData.logo_preview
          : `data:image/jpeg;base64,${originalFullMerchantData.logo_preview}`;
        setLogoPreviews(preview);
      } else {
        setLogoPreviews(null);
      }
      
      if (originalFullMerchantData.image_front_id_card_preview) {
        const preview = originalFullMerchantData.image_front_id_card_preview.startsWith('data:image')
          ? originalFullMerchantData.image_front_id_card_preview
          : `data:image/jpeg;base64,${originalFullMerchantData.image_front_id_card_preview}`;
        setFrontIdCardPreview(preview);
      } else {
        setFrontIdCardPreview(null);
      }
      
      if (originalFullMerchantData.image_back_id_card_preview) {
        const preview = originalFullMerchantData.image_back_id_card_preview.startsWith('data:image')
          ? originalFullMerchantData.image_back_id_card_preview
          : `data:image/jpeg;base64,${originalFullMerchantData.image_back_id_card_preview}`;
        setBackIdCardPreview(preview);
      } else {
        setBackIdCardPreview(null);
      }
      
      if (originalFullMerchantData.image_commercial_registration_or_freelance_focument_preview) {
        const preview = originalFullMerchantData.image_commercial_registration_or_freelance_focument_preview.startsWith('data:image')
          ? originalFullMerchantData.image_commercial_registration_or_freelance_focument_preview
          : `data:image/jpeg;base64,${originalFullMerchantData.image_commercial_registration_or_freelance_focument_preview}`;
        setCommercialRegistrationPreview(preview);
      } else {
        setCommercialRegistrationPreview(null);
      }
    }
    
    setError(null);
    setSuccess(null);
    setShowPasswordSection(false);
    
    // إزالة أخطاء التحقق
    setValidationErrors({});
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  // التحقق من صحة النموذج
  const validateForm = async (): Promise<boolean> => {
    const errors: ValidationErrors = {};
    
    // التحقق من الاسم باستخدام دالة validateName
    const nameError = validateName(formData.name);
    if (nameError) {
      errors.name = nameError;
    }
    
    // التحقق من الاسم التجاري باستخدام دالة validateBrandName
    const brandNameError = validateBrandName(formData.brand_name);
    if (brandNameError) {
      errors.brand_name = brandNameError;
    }

    // التحقق من اللوجو
    if (!formData.logo && !formData.logo_preview) {
      errors.logo = 'الشعار التجاري مطلوب';
    }

    // التحقق من صورة الهوية الأمامية
    if (!formData.image_front_id_card && !formData.image_front_id_card_preview) {
      errors.image_front_id_card = 'صورة الهوية الأمامية مطلوبة';
    }

    // التحقق من صورة الهوية الخلفية
    if (!formData.image_back_id_card && !formData.image_back_id_card_preview) {
      errors.image_back_id_card = 'صورة الهوية الخلفية مطلوبة';
    }

    // التحقق من صورة السجل التجاري
    if (!formData.image_commercial_registration_or_freelance_focument && !formData.image_commercial_registration_or_freelance_focument_preview) {
      errors.image_commercial_registration_or_freelance_focument = 'صورة السجل التجاري أو وثيقة العمل الحر مطلوبة';
    }
    
    // التحقق من البريد الإلكتروني باستخدام دالة validateEmail
    const emailError = validateEmail(formData.email);
    if (emailError) {
      errors.email = emailError;
    } else {
      // التحقق من وجود البريد الإلكتروني مسبقاً (فقط إذا تم تغييره)
      if (formData.email.trim().toLowerCase() !== originalMerchantData.email.toLowerCase()) {
        try {
          // لضمان أن id دائمًا هو string، نستخدم التحقق قبل استدعاء الدالة
          const merchantIdStr = typeof id === 'string' ? id : '';
          const emailExists = await checkEmailExists(formData.email, merchantIdStr);
          if (emailExists) {
            errors.email = 'البريد الإلكتروني مستخدم بالفعل';
          }
        } catch (err) {
          console.error('Error checking email existence:', err);
          setError('حدث خطأ أثناء التحقق من البريد الإلكتروني.');
          return false;
        }
      }
    }
    
    // التحقق من رقم الجوال باستخدام دالة validatePhoneNumber
    const phoneError = validatePhoneNumber(formData.mobile, formData.country_code.toString());
    if (phoneError) {
      errors.mobile = phoneError;
    } else {
      const currentMobile = formData.mobile.startsWith('0') ? formData.mobile.substring(1) : formData.mobile;
      // التحقق من وجود رقم الجوال مسبقاً (فقط إذا تم تغييره)
      if (currentMobile !== originalMerchantData.mobile || Number(formData.country_code) !== originalMerchantData.country_code) {
        try {
          // لضمان أن id دائمًا هو string، نستخدم التحقق قبل استدعاء الدالة
          const merchantIdStr = typeof id === 'string' ? id : '';
          const mobileExists = await checkMobileExists(formData.mobile, parseInt(formData.country_code.toString(), 10), merchantIdStr);
          if (mobileExists) {
            errors.mobile = 'رقم الجوال مستخدم بالفعل';
          }
        } catch (err) {
          console.error('Error checking mobile existence:', err);
          setError('حدث خطأ أثناء التحقق من رقم الجوال.');
          return false;
        }
      }
    }
    
    // التحقق من المدينة باستخدام دالة validateCity
    const cityError = validateCity(formData.city);
    if (cityError) {
      errors.city = cityError;
    }
    
    // التحقق من كلمة المرور (إذا تم تغييرها فقط)
    if (formData.password) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        errors.password = passwordError;
      }
      
      // التحقق من تأكيد كلمة المرور باستخدام دالة validatePasswordConfirmation
      const confirmPasswordError = validatePasswordConfirmation(
        formData.password,
        formData.confirm_password,
        false // لا نحتاج للتحقق من صحة كلمة المرور أساسية مرة أخرى
      );
      
      if (confirmPasswordError) {
        errors.confirm_password = confirmPasswordError;
      }
    }
    
    // التحقق من IBAN
    if (!formData.iban.trim()) {
      errors.iban = 'رقم الآيبان مطلوب';
    }
    
    // التحقق من الحالة
    if (!formData.status) {
      errors.status = 'حالة الحساب مطلوبة';
    }
    
    // حفظ أخطاء التحقق
    setValidationErrors(errors);
    // إذا كان هناك أخطاء، قم بالتمرير إلى أول خطأ
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = formErrorsRef.current[firstErrorField];
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    
    // إرجاع النتيجة
    return Object.keys(errors).length === 0;
  };
  
  // إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || typeof id !== 'string') return;
    
    // مسح رسائل الخطأ والنجاح السابقة
    setError(null);
    setSuccess(null);
    
    // التحقق من صحة النموذج
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }
    
    try {
      setSaving(true);
      
      // الإعداد الأولي لبيانات التحديث
      const updateData: UpdateData = {
        name: formData.name.trim(),
        brand_name: formData.brand_name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.startsWith('0') ? formData.mobile.substring(1) : formData.mobile,
        country_code: formData.country_code,
        city: formData.city.trim(),
        status: formData.status,
        iban: formData.iban.trim(),
      };
      
      // إضافة كلمة المرور إذا تم تغييرها
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      // معالجة الصور إذا تم تحديثها
      if (formData.logo) {
        updateData.logo = await compressAndConvertToBase64(formData.logo);
      }
      
      if (formData.image_front_id_card) {
        updateData.image_front_id_card = await compressAndConvertToBase64(formData.image_front_id_card);
      }
      
      if (formData.image_back_id_card) {
        updateData.image_back_id_card = await compressAndConvertToBase64(formData.image_back_id_card);
      }
      
      if (formData.image_commercial_registration_or_freelance_focument) {
        updateData.image_commercial_registration_or_freelance_focument = await compressAndConvertToBase64(formData.image_commercial_registration_or_freelance_focument);
      }
      
      // تحديث بيانات التاجر في Firebase
      await MerchantService.updateMerchant(id, updateData);
      
      // عرض رسالة النجاح
      setSuccess('تم تحديث بيانات التاجر بنجاح');
      
      // تحديث البيانات الأصلية بعد الحفظ الناجح
      setOriginalMerchantData({
        email: formData.email.trim().toLowerCase(),
        mobile: updateData.mobile, // mobile is already processed
        country_code: formData.country_code,
      });
      
      // توجيه المستخدم إلى صفحة التاجر بعد 2 ثانية
      setTimeout(() => {
        router.push(`/dashboard/merchants/${id}`);
      }, 2000);
      
    } catch (err) {
      console.error('Error updating merchant:', err);
      setError('حدث خطأ أثناء تحديث بيانات التاجر. الرجاء المحاولة مرة أخرى.');
    } finally {
      setSaving(false);
    }
  };
  
  // العودة إلى صفحة التاجر
  const handleBackClick = () => {
    if (id && typeof id === 'string') {
      router.push(`/dashboard/merchants/${id}`);
    } else {
      router.push('/dashboard/merchants');
    }
  };

  // تبديل إظهار قسم كلمة المرور
  const togglePasswordSection = () => {
    setShowPasswordSection((prev) => {
      // إذا تم الإغلاق، أعد تعيين الحقول
      if (prev) {
        setFormData((f) => ({ ...f, password: '', confirm_password: '' }));
      }
      return !prev;
    });
  };

  // إضافة مرجع للحقل عند ظهور خطأ
  const setErrorRef = (fieldName: string, element: HTMLElement | null) => {
    formErrorsRef.current[fieldName] = element;
  };

  return {
    id,
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
    handleBackClick,
    togglePasswordSection,
    setErrorRef,
    MAX_IMAGE_SIZE,
    handleCancelImageChange,
    handleRemoveImage
  };
}; 