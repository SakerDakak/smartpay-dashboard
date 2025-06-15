import { useState } from 'react';
import { useRouter } from 'next/router';
import { AdminService } from '../../../services/firebase/adminService';
import { 
  validateName, 
  validateEmail, 
  validatePhoneNumber, 
  validateCity, 
  validatePassword, 
  validatePasswordConfirmation 
} from '../../../utils/validation';
import { AccountStatus } from '@/types/enums';
import { checkEmailExists, checkMobileExists } from '../../../services/firebase/utils';

/**
 * @interface AdminAddFormData
 * @description Defines the structure for the admin creation form data.
 * @property {string} name - The full name of the admin.
 * @property {string} email - The email address of the admin.
 * @property {string} mobile - The mobile number of the admin.
 * @property {number} country_code - The country code for the mobile number.
 * @property {string} city - The city of residence for the admin.
 * @property {string} password - The admin\'s chosen password.
 * @property {string} confirmPassword - The confirmation of the admin\'s password.
 */
interface AdminAddFormData {
  name: string;
  email: string;
  mobile: string;
  country_code: number;
  city: string;
  password: string;
  confirmPassword: string;
  status: AccountStatus;
}

/**
 * @interface FormErrors
 * @description Defines the structure for validation errors in the form.
 */
interface FormErrors {
  name: string | null;
  email: string | null;
  mobile: string | null;
  city: string | null;
  password: string | null;
  confirmPassword: string | null;
}

const initialFormData: AdminAddFormData = {
  name: '',
  email: '',
  mobile: '',
  country_code: 966, // السعودية افتراضيًا
  city: '',
  password: '',
  confirmPassword: '',
  status: AccountStatus.Active,
};

const initialErrors: FormErrors = {
  name: null,
  email: null,
  mobile: null,
  city: null,
  password: null,
  confirmPassword: null,
};

/**
 * @function useAdminAddForm
 * @description Custom hook for managing the admin creation form.
 * Handles form state, validation, submission, and feedback messages (error/success).
 * @returns {object} An object containing form data, loading state, error message, success message,
 * and handler functions (handleChange, handleSubmit, handleReset).
 */
export const useAdminAddForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<AdminAddFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<FormErrors>(initialErrors);

  /**
   * @function handleChange
   * @description Handles changes in form input fields and updates the formData state.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} e - The event object from the input change.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'country_code' ? Number(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // التحقق من الحقل المحدد عند تغييره
    validateField(name, newValue);
  };

  /**
   * @function validateField
   * @description التحقق من صحة حقل محدد وتحديث حالة الأخطاء
   * @param {string} fieldName - اسم الحقل المراد التحقق منه
   * @param {any} value - قيمة الحقل
   */
  const validateField = (fieldName: string, value: string | number) => {
    let error: string | null = null;

    switch (fieldName) {
      case 'name':
        error = validateName(value as string);
        break;
      case 'email':
        error = validateEmail(value as string);
        break;
      case 'mobile':
        error = validatePhoneNumber(value as string, formData.country_code.toString());
        break;
      case 'country_code':
        // إعادة التحقق من رقم الجوال عند تغيير رمز البلد
        error = validatePhoneNumber(formData.mobile, value.toString());
        setFormErrors(prev => ({ ...prev, mobile: error }));
        return;
      case 'city':
        error = validateCity(value as string);
        break;
      case 'password':
        error = validatePassword(value as string);
        // إعادة التحقق من تطابق كلمة المرور عند تغيير كلمة المرور الأصلية
        const confirmError = validatePasswordConfirmation(value as string, formData.confirmPassword);
        setFormErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        break;
      case 'confirmPassword':
        error = validatePasswordConfirmation(formData.password, value as string);
        break;
    }

    setFormErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  /**
   * @function validateAllFields
   * @description التحقق من جميع حقول النموذج
   * @returns {boolean} True if all fields are valid, false otherwise.
   */
  const validateAllFields = () => {
    const newErrors: FormErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      mobile: validatePhoneNumber(formData.mobile, formData.country_code.toString()),
      city: validateCity(formData.city),
      password: validatePassword(formData.password),
      confirmPassword: validatePasswordConfirmation(formData.password, formData.confirmPassword),
    };

    setFormErrors(newErrors);

    // التحقق من وجود أي أخطاء
    return !Object.values(newErrors).some(error => error !== null);
  };

  /**
   * @async
   * @function checkDuplicates
   * @description Checks if the provided email or mobile number already exist in the system.
   * Sets an error message if duplicates are found.
   * @returns {Promise<boolean>} True if no duplicates are found, false otherwise.
   */
  const checkDuplicates = async () => {
    try {
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        setFormErrors(prev => ({
          ...prev,
          email: 'البريد الإلكتروني مستخدم بالفعل. يرجى استخدام بريد إلكتروني آخر.'
        }));
        return false;
      }
      
      const mobileExists = await checkMobileExists(formData.mobile, parseInt(formData.country_code.toString(), 10));
      if (mobileExists) {
        setFormErrors(prev => ({
          ...prev,
          mobile: 'رقم الجوال مستخدم بالفعل. يرجى استخدام رقم آخر.'
        }));
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error checking duplicates:', err);
      setError('حدث خطأ أثناء التحقق من البيانات. يرجى المحاولة مرة أخرى.');
      return false;
    }
  };

  /**
   * @async
   * @function handleSubmit
   * @description Handles the form submission process.
   * Validates the form, checks for duplicates, submits the data if valid, and handles success/error feedback.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // التحقق من جميع الحقول
    if (!validateAllFields()) {
      return;
    }

    setLoading(true);

    try {
      const noDuplicates = await checkDuplicates();
      if (!noDuplicates) {
        setLoading(false);
        return;
      }
      
      await AdminService.addAdmin({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        country_code: formData.country_code,
        city: formData.city,
        password: formData.password,
        status: formData.status,
      });
      
      setSuccess('تمت إضافة المشرف بنجاح!');
      setFormData(initialFormData);
      setFormErrors(initialErrors);
      
      setTimeout(() => {
        router.push('/dashboard/admins');
      }, 2000);
      
    } catch (err) {
      console.error('Error adding admin:', err);
      setError('حدث خطأ أثناء إضافة المشرف. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * @function handleReset
   * @description Resets the form to its initial state and clears any error or success messages.
   */
  const handleReset = () => {
    setFormData(initialFormData);
    setFormErrors(initialErrors);
    setError(null);
    setSuccess(null);
  };

  return {
    formData,
    formErrors,
    loading,
    error,
    success,
    handleChange,
    handleSubmit,
    handleReset,
  };
}; 