import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AdminService } from '../../services/firebase/adminService';

interface AdminLoginStatusState {
  isChecking: boolean;
  shouldLogout: boolean;
  message: string | null;
}

export const useAdminLoginStatus = () => {
  const { user } = useAuth();
  const [statusState, setStatusState] = useState<AdminLoginStatusState>({
    isChecking: false,
    shouldLogout: false,
    message: null
  });

  // التحقق من حالة المشرف عندما يكون هناك مستخدم مسجل الدخول
  useEffect(() => {
    let isMounted = true;
    let checkInterval: NodeJS.Timeout;

    const checkAdminLoginStatus = async () => {
      if (!user || !user.id) return;
      
      try {
        setStatusState(prev => ({ ...prev, isChecking: true }));
        const result = await AdminService.checkAdminStatus(user.id);
        
        if (isMounted) {
          // إذا تم حذف المشرف أو أصبح غير نشط، قم بإظهار رسالة وتسجيل الخروج
          if (!result.exists || !result.isActive) {
            setStatusState({
              isChecking: false,
              shouldLogout: true,
              message: result.message
            });
          } else {
            setStatusState({
              isChecking: false,
              shouldLogout: false,
              message: null
            });
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        if (isMounted) {
          setStatusState({
            isChecking: false,
            shouldLogout: false,
            message: null
          });
        }
      }
    };

    if (user && user.id) {
      // التحقق الفوري عند تحميل الصفحة
      checkAdminLoginStatus();
      
      // تحقق كل 5 دقائق
      checkInterval = setInterval(checkAdminLoginStatus, 5 * 60 * 1000);
    }

    return () => {
      isMounted = false;
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [user]);

  return statusState;
}; 