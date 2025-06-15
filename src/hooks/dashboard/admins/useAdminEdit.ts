import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AccountStatus } from '../../../types/enums';
import { AdminService } from '../../../services/firebase/adminService';
import { PasswordService } from '../../../services/firebase/authService';
import { validateName, validateCity, validatePhoneNumber, validatePassword, validateEmail, validatePasswordConfirmation } from '@/utils/validation';
import { checkEmailExists, checkMobileExists } from '../../../services/firebase/utils';

interface AdminFormData {
  name: string;
  email: string;
  mobile: string;
  country_code: number;
  city: string;
  status: AccountStatus;
  password: string;
  confirmPassword: string;
}

interface OriginalData {
  email: string;
  mobile: string;
  country_code: number;
  name: string;
  city: string;
  status: AccountStatus;
}

// واجهة أخطاء التحقق
interface ValidationErrors {
  name: string;
  email: string;
  mobile: string;
  city: string;
  password: string;
  confirmPassword: string;
}

export const useAdminEdit = (adminId: string | string[] | undefined) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPasswordSection, setShowPasswordSection] = useState<boolean>(false);

  // إضافة حالة لرسائل الخطأ في التحقق
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({
    name: '',
    email: '',
    mobile: '',
    city: '',
    password: '',
    confirmPassword: ''
  });

  // بيانات نموذج تعديل المشرف
  const [formData, setFormData] = useState<AdminFormData>({
    name: '',
    email: '',
    mobile: '',
    country_code: 966,
    city: '',
    status: AccountStatus.Active,
    password: '',
    confirmPassword: '',
  });
  
  // تخزين البيانات الأصلية للمقارنة
  const [originalData, setOriginalData] = useState<OriginalData>({
    email: '',
    mobile: '',
    country_code: 966,
    name: '',
    city: '',
    status: AccountStatus.Active,
  });

  // استرجاع بيانات المشرف
  useEffect(() => {
    const fetchAdmin = async () => {
      if (!adminId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // استخدام خدمة AdminService بدلاً من الاتصال المباشر بفايربيس
        const adminData = await AdminService.getAdminById(adminId as string);
        
        if (!adminData) {
          setError('المشرف غير موجود');
          setLoading(false);
          return;
        }
        
        setFormData({
          name: adminData.name || '',
          email: adminData.email || '',
          mobile: adminData.mobile || '',
          country_code: adminData.country_code || 966,
          city: adminData.city || '',
          status: adminData.status || AccountStatus.Active,
          password: '',
          confirmPassword: '',
        });
        
        // تخزين البيانات الأصلية للمقارنة
        setOriginalData({
          email: adminData.email || '',
          mobile: adminData.mobile || '',
          country_code: adminData.country_code || 966,
          name: adminData.name || '',
          city: adminData.city || '',
          status: adminData.status || AccountStatus.Active,
        });
      } catch (err) {
        console.error('Error fetching admin details:', err);
        setError('حدث خطأ في جلب بيانات المشرف');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdmin();
  }, [adminId]);

  // التحقق من صحة حقل معين
  const validateField = (name: string, value: string) => {
    let error = null;
    
    switch (name) {
      case 'name':
        error = validateName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'mobile':
        error = validatePhoneNumber(value, formData.country_code?.toString());
        break;
      case 'city':
        error = validateCity(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        error = validatePasswordConfirmation(formData.password, value, false);
        break;
      default:
        break;
    }

    setValidationErrors(prev => ({
      ...prev,
      [name]: error || ''
    }));

    return error === null;
  };

  // التعامل مع تغيير قيم الحقول مع تنفيذ التحقق
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // التحقق من الحقل إذا كان من ضمن حقول التحقق
    if (['name', 'email', 'mobile', 'city', 'password', 'confirmPassword'].includes(name)) {
      validateField(name, value);
    }
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    // التحقق من جميع الحقول الإلزامية
    let isValid = validateField('name', formData.name) &&
                 validateField('email', formData.email) &&
                 validateField('mobile', formData.mobile) &&
                 validateField('city', formData.city);
    
    // التحقق من كلمة المرور إذا كان قسم كلمة المرور مفعل
    if (showPasswordSection) {
      isValid = isValid && 
                validateField('password', formData.password) &&
                validateField('confirmPassword', formData.confirmPassword);
    }
    
    if (!isValid) {
      setError('يرجى تصحيح الأخطاء في النموذج قبل الحفظ.');
      return false;
    }

    return true;
  };
  
  // التحقق من وجود تكرار للبريد الإلكتروني أو رقم الجوال
  const checkDuplicates = async () => {
    try {
      let isValid = true;
      
      // التحقق فقط إذا تم تغيير البيانات
      if (formData.email !== originalData.email) {
        const emailExists = await checkEmailExists(formData.email, adminId as string);
        if (emailExists) {
          setValidationErrors(prev => ({
            ...prev,
            email: 'البريد الإلكتروني مستخدم بالفعل. يرجى استخدام بريد إلكتروني آخر.'
          }));
          isValid = false;
        }
      }
      
      if (formData.mobile !== originalData.mobile || Number(formData.country_code) !== originalData.country_code) {
        const mobileExists = await checkMobileExists(formData.mobile, parseInt(formData.country_code.toString(), 10), adminId as string);
        if (mobileExists) {
          setValidationErrors(prev => ({
            ...prev,
            mobile: 'رقم الجوال مستخدم بالفعل. يرجى استخدام رقم آخر.'
          }));
          isValid = false;
        }
      }
      
      return isValid;
    } catch (err) {
      console.error('Error checking duplicates:', err);
      setError('حدث خطأ أثناء التحقق من البيانات. يرجى المحاولة مرة أخرى.');
      return false;
    }
  };

  // إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // إعادة تعيين رسائل الخطأ
    setError(null);
    setSuccess(null);
    
    // التحقق من صحة البيانات
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      if (!adminId) {
        throw new Error('معرف المشرف غير موجود');
      }
      
      // التحقق من وجود تكرار للبريد الإلكتروني أو رقم الجوال
      const noDuplicates = await checkDuplicates();
      if (!noDuplicates) {
        setSaving(false);
        return;
      }
      
      // استخدام خدمة AdminService لتحديث بيانات المشرف
      await AdminService.updateAdmin(adminId as string, {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        country_code: Number(formData.country_code),
        city: formData.city,
        status: formData.status,
      });
      
      // تحديث كلمة المرور إذا تم تغييرها
      if (showPasswordSection && formData.password) {
        await PasswordService.updatePassword(adminId as string, formData.password);
      }
      
      setSuccess('تم تحديث بيانات المشرف بنجاح!');
      
      // تحديث البيانات الأصلية
      setOriginalData({
        email: formData.email,
        mobile: formData.mobile,
        country_code: Number(formData.country_code),
        name: formData.name,
        city: formData.city,
        status: formData.status,
      });
      
      // إعادة تعيين حقول كلمة المرور
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      
      // إخفاء قسم تغيير كلمة المرور
      setShowPasswordSection(false);
      
      // التوجيه إلى صفحة تفاصيل المشرف بعد 2 ثانية
      setTimeout(() => {
        router.push(`/dashboard/admins/${adminId}`);
      }, 2000);
      
    } catch (err) {
      console.error('Error updating admin:', err);
      setError('حدث خطأ أثناء تحديث بيانات المشرف. يرجى المحاولة مرة أخرى.');
    } finally {
      setSaving(false);
    }
  };

  // إعادة تعيين النموذج
  const handleReset = () => {
    setFormData({
      name: originalData.name,
      email: originalData.email,
      mobile: originalData.mobile,
      country_code: originalData.country_code,
      city: originalData.city,
      status: originalData.status,
      password: '',
      confirmPassword: '',
    });
    
    // إعادة تعيين أخطاء التحقق
    setValidationErrors({
      name: '',
      email: '',
      mobile: '',
      city: '',
      password: '',
      confirmPassword: ''
    });
    
    setError(null);
    setSuccess(null);
    setShowPasswordSection(false);
  };

  // تبديل حالة قسم تغيير كلمة المرور
  const togglePasswordSection = () => {
    setShowPasswordSection(!showPasswordSection);
    if (!showPasswordSection) {
      // إعادة تعيين حقول كلمة المرور عند فتح القسم
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      
      // إعادة تعيين أخطاء التحقق لكلمة المرور
      setValidationErrors(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
    }
  };

  return {
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
    validateField
  };
}; 