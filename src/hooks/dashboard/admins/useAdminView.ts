import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { AdminProfile } from '../../../types/models';
import { AccountStatus, AccountType } from '../../../types/enums';
import { AdminService } from '../../../services/firebase/adminService';
import { translateAccountStatus, translateAccountType } from '../../../utils/translations';

interface UseAdminViewReturn {
  admin: AdminProfile | null;
  loading: boolean;
  error: string | null;
  formatDate: (dateString: string) => string;
  getStatusBadgeProps: (status: AccountStatus) => {
    label: string;
    color: string;
    bg: string;
    borderColor: string;
  };
  formatType: (type: AccountType) => string;
  router: ReturnType<typeof useRouter>;
}

export const useAdminView = (): UseAdminViewReturn => {
  const router = useRouter();
  const { id } = router.query;
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      if (!id || typeof id !== 'string') {
        setError('معرف المشرف غير صالح');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const adminData = await AdminService.getAdminById(id);
        
        if (!adminData) {
          setError('المشرف غير موجود');
        } else {
          setAdmin(adminData);
        }
      } catch (err) {
        console.error('Error fetching admin details:', err);
        setError('حدث خطأ في جلب بيانات المشرف');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdmin();
  }, [id]);

  const formatDate = useCallback((dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'تاريخ غير صالح';
      }
      return new Intl.DateTimeFormat('ar-SA', { // استخدام locale عربي للتنسيق المناسب
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch (e) {
      console.error("Error formatting date:", e); // Log the error
      return 'تاريخ غير صالح';
    }
  }, []);

  const getStatusBadgeProps = useCallback((status: AccountStatus) => {
    const translatedLabel = translateAccountStatus(status);
    switch (status) {
      case AccountStatus.Active:
        return { 
          label: translatedLabel,
          color: "text-success-500 dark:text-success-400", 
          bg: "bg-success-50 dark:bg-success-900/20", 
          borderColor: "border-success-200 dark:border-success-700" // تعديل طفيف
        };
      case AccountStatus.PendingApproval:
        return { 
          label: translatedLabel,
          color: "text-warning-500 dark:text-warning-400", 
          bg: "bg-warning-50 dark:bg-warning-900/20", 
          borderColor: "border-warning-200 dark:border-warning-700"
        };
      case AccountStatus.Suspended:
        return { 
          label: translatedLabel,
          color: "text-danger-500 dark:text-danger-400", 
          bg: "bg-danger-50 dark:bg-danger-900/20", 
          borderColor: "border-danger-200 dark:border-danger-700"
        };
      default:
        return { 
          label: translatedLabel,
          color: "text-grey-500 dark:text-grey-400", 
          bg: "bg-grey-100 dark:bg-grey-900/20", 
          borderColor: "border-grey-200 dark:border-grey-700"
        };
    }
  }, []);

  const formatType = useCallback((type: AccountType): string => {
    return translateAccountType(type);
  }, []);

  return { admin, loading, error, formatDate, getStatusBadgeProps, formatType, router };
}; 