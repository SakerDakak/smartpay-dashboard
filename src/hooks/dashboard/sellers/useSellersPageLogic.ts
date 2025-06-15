import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { SellerProfile } from "../../../types/models";
import { SellerService } from "../../../services/firebase/sellerService";

// نوع لحالة حوار التأكيد
export interface ConfirmDialogState {
  isOpen: boolean;
  sellerId: string;
  sellerName: string;
}

// نوع للقيم المرجعة من الهوك
export interface SellersPageLogic {
  sellers: SellerProfile[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  confirmDialog: ConfirmDialogState;
  fetchSellers: () => Promise<void>;
  handleShowDeleteConfirm: (id: string, name: string) => void;
  handleCancelDelete: () => void;
  handleConfirmDelete: () => Promise<void>;
  handleNavigateToAddSeller: () => void;
  handleNavigateToViewSeller: (sellerId: string) => void;
  handleNavigateToEditSeller: (sellerId: string) => void;
  clearError: () => void;
  clearSuccess: () => void;
}

/**
 * @description منطق مخصص لإدارة صفحة البائعين.
 * يوفر هذا الهوك الحالات والدوال اللازمة للتعامل مع بيانات البائعين،
 * بما في ذلك الجلب، الحذف، وعرض رسائل الحالة والتأكيدات.
 */
export const useSellersPageLogic = (): SellersPageLogic => {
  const router = useRouter();

  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // حالة حوار التأكيد
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    sellerId: "",
    sellerName: "",
  });

  // استرجاع قائمة البائعين
  const fetchSellers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const sellers = await SellerService.getSellers();
      setSellers(sellers);
    } catch (err) {
      console.error("Error fetching sellers:", err);
      setError("حدث خطأ أثناء جلب بيانات البائعين.");
    } finally {
      setLoading(false);
    }
  }, []);

  // تحميل أول مجموعة من البيانات
  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);

  // عرض حوار تأكيد الحذف
  const handleShowDeleteConfirm = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      sellerId: id,
      sellerName: name,
    });
  };

  // إلغاء حوار التأكيد
  const handleCancelDelete = () => {
    setConfirmDialog({
      isOpen: false,
      sellerId: "",
      sellerName: "",
    });
  };

  // حذف بائع
  const handleConfirmDelete = async () => {
    const { sellerId } = confirmDialog;

    if (!sellerId) return;

    try {
      await SellerService.deleteSeller(sellerId);
      setSellers((prevSellers) =>
        prevSellers.filter((seller) => seller.id !== sellerId)
      );
      setSuccessMessage("تم حذف البائع بنجاح.");
      handleCancelDelete(); // لإغلاق الحوار وتفريغ البيانات

      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error deleting seller:", err);
      setError("حدث خطأ أثناء حذف البائع.");
      handleCancelDelete(); // لإغلاق الحوار وتفريغ البيانات في حالة الخطأ أيضًا
    }
  };

  // التوجيه لصفحة إضافة بائع جديد
  const handleNavigateToAddSeller = () => {
    router.push("/dashboard/sellers/add");
  };

  // التوجيه لصفحة عرض بيانات البائع
  const handleNavigateToViewSeller = (sellerId: string) => {
    router.push(`/dashboard/sellers/${sellerId}`);
  };

  // التوجيه لصفحة تعديل بيانات البائع
  const handleNavigateToEditSeller = (sellerId: string) => {
    router.push(`/dashboard/sellers/edit/${sellerId}`);
  };

  // مسح رسائل الخطأ أو النجاح
  const clearError = () => setError(null);
  const clearSuccess = () => setSuccessMessage(null);

  return {
    sellers,
    loading,
    error,
    successMessage,
    confirmDialog,
    fetchSellers,
    handleShowDeleteConfirm,
    handleCancelDelete,
    handleConfirmDelete,
    handleNavigateToAddSeller,
    handleNavigateToViewSeller,
    handleNavigateToEditSeller,
    clearError,
    clearSuccess,
  };
};
