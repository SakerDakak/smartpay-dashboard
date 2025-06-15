import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AdminProfile } from '../../../types/models';
import { AdminService } from '../../../services/firebase/adminService';
import { useAuth } from '../../../contexts/AuthContext';

// نوع لحالة حوار التأكيد
export interface ConfirmDialogState {
  isOpen: boolean;
  adminId: string;
  adminName: string;
}

// نوع للقيم المرجعة من الهوك
export interface AdminsPageLogic {
  admins: AdminProfile[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  confirmDialog: ConfirmDialogState;
  currentUserProfileId?: string;
  fetchAdmins: () => Promise<void>;
  handleShowDeleteConfirm: (id: string, name: string) => void;
  handleCancelDelete: () => void;
  handleConfirmDelete: () => Promise<void>;
  handleNavigateToAddAdmin: () => void;
  handleNavigateToViewAdmin: (adminId: string) => void;
  handleNavigateToEditAdmin: (adminId: string) => void;
  clearError: () => void;
  clearSuccess: () => void;
}

/**
 * @description منطق مخصص لإدارة صفحة المشرفين.
 * يوفر هذا الهوك الحالات والدوال اللازمة للتعامل مع بيانات المشرفين،
 * بما في ذلك الجلب، الحذف، وعرض رسائل الحالة والتأكيدات.
 */
export const useAdminsPageLogic = (): AdminsPageLogic => {
  const router = useRouter();
  const { profile } = useAuth(); // استدعاء سياق المصادقة للحصول على معلومات المستخدم الحالي
  
  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // حالة حوار التأكيد
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    adminId: '',
    adminName: '',
  });

  // استرجاع قائمة المشرفين
  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await AdminService.getAdmins();
      setAdmins(result.admins);
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError('حدث خطأ أثناء جلب بيانات المشرفين.');
    } finally {
      setLoading(false);
    }
  }, []);

  // تحميل أول مجموعة من البيانات
  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);
  
  // عرض حوار تأكيد الحذف
  const handleShowDeleteConfirm = (id: string, name: string) => {
    // منع حذف المستخدم الحالي
    if (profile && id === profile.id) {
      setError('لا يمكن حذف المشرف الحالي المسجل منه الدخول.');
      // إخفاء رسالة الخطأ بعد 3 ثواني
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }
    
    setConfirmDialog({
      isOpen: true,
      adminId: id,
      adminName: name,
    });
  };

  // إلغاء حوار التأكيد
  const handleCancelDelete = () => {
    setConfirmDialog({
      isOpen: false,
      adminId: '',
      adminName: '',
    });
  };

  // حذف مشرف
  const handleConfirmDelete = async () => {
    const { adminId } = confirmDialog;
    
    if (!adminId) return;
    
    try {
      await AdminService.deleteAdmin(adminId);
      setAdmins(prevAdmins => prevAdmins.filter(admin => admin.id !== adminId));
      setSuccessMessage('تم حذف المشرف بنجاح.');
      handleCancelDelete(); // لإغلاق الحوار وتفريغ البيانات
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error deleting admin:', err);
      setError('حدث خطأ أثناء حذف المشرف.');
      handleCancelDelete(); // لإغلاق الحوار وتفريغ البيانات في حالة الخطأ أيضًا
    }
  };

  // التوجيه لصفحة إضافة مشرف جديد
  const handleNavigateToAddAdmin = () => {
    router.push('/dashboard/admins/add');
  };

  // التوجيه لصفحة عرض بيانات المشرف
  const handleNavigateToViewAdmin = (adminId: string) => {
    router.push(`/dashboard/admins/${adminId}`);
  };

  // التوجيه لصفحة تعديل بيانات المشرف
  const handleNavigateToEditAdmin = (adminId: string) => {
    router.push(`/dashboard/admins/edit/${adminId}`);
  };

  // مسح رسائل الخطأ أو النجاح
  const clearError = () => setError(null);
  const clearSuccess = () => setSuccessMessage(null);

  return {
    admins,
    loading,
    error,
    successMessage,
    confirmDialog,
    currentUserProfileId: profile?.id,
    fetchAdmins,
    handleShowDeleteConfirm,
    handleCancelDelete,
    handleConfirmDelete,
    handleNavigateToAddAdmin,
    handleNavigateToViewAdmin,
    handleNavigateToEditAdmin,
    clearError,
    clearSuccess,
  };
}; 