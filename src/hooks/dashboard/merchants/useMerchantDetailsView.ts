import { useState } from "react";
import { useRouter } from "next/router";
import { useMerchantDetails } from "./useMerchantDetails";
import { formatBase64Image } from "@/utils/imageUtils";

export const useMerchantDetailsView = () => {
  const router = useRouter();
  const { id } = router.query;
  const merchantId = typeof id === "string" ? id : "";

  const { merchant, sellers, transactions, stats, loading, error } =
    useMerchantDetails(merchantId);

  // حالة لحوار تأكيد حذف البائع
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    sellerId: "",
    sellerName: "",
  });

  // حالة لعرض المستندات في نافذة منبثقة
  const [documentModal, setDocumentModal] = useState({
    isOpen: false,
    title: "",
    imageUrl: "",
  });

  // حالة لعرض/إخفاء قسم المستندات
  const [showDocuments, setShowDocuments] = useState(false);

  // زر إضافة بائع
  const handleAddSeller = () => {
    router.push(`/dashboard/sellers/add?merchant_id=${merchantId}`);
  };

  // زر تعديل التاجر
  const handleEditMerchant = () => {
    router.push(`/dashboard/merchants/edit/${merchantId}`);
  };

  // عرض تفاصيل البائع
  const handleViewSeller = (sellerId: string) => {
    router.push(`/dashboard/sellers/${sellerId}`);
  };

  // تعديل بيانات البائع
  const handleEditSeller = (sellerId: string) => {
    router.push(`/dashboard/sellers/edit/${sellerId}`);
  };

  // عرض حوار تأكيد حذف البائع
  const handleShowDeleteConfirm = (sellerId: string, sellerName: string) => {
    setConfirmDelete({
      isOpen: true,
      sellerId,
      sellerName,
    });
  };

  // إلغاء حذف البائع
  const handleCancelDelete = () => {
    setConfirmDelete({
      isOpen: false,
      sellerId: "",
      sellerName: "",
    });
  };

  // تأكيد حذف البائع (يمكن إضافة الكود الخاص بالحذف لاحقًا)
  const handleConfirmDelete = async () => {
    // TODO: implement delete logic
    console.log(`Deleting seller: ${confirmDelete.sellerId}`);
    setConfirmDelete({
      isOpen: false,
      sellerId: "",
      sellerName: "",
    });
  };

  // عرض تفاصيل المعاملة
  const handleViewTransaction = (transactionId: string) => {
    router.push(`/dashboard/transactions/${transactionId}`);
  };

  // عرض المستند في نافذة منبثقة
  const handleViewDocument = (title: string, imageUrl: string) => {
    setDocumentModal({
      isOpen: true,
      title,
      imageUrl,
    });
  };

  // إغلاق نافذة المستند
  const handleCloseDocumentModal = () => {
    setDocumentModal({
      isOpen: false,
      title: "",
      imageUrl: "",
    });
  };

  // تبديل عرض المستندات
  const toggleDocumentsSection = () => {
    setShowDocuments(!showDocuments);
  };

  return {
    merchant,
    sellers,
    transactions,
    stats,
    loading,
    error,
    confirmDelete,
    documentModal,
    showDocuments,
    handleAddSeller,
    handleEditMerchant,
    handleViewSeller,
    handleEditSeller,
    handleShowDeleteConfirm,
    handleCancelDelete,
    handleConfirmDelete,
    handleViewTransaction,
    handleViewDocument,
    handleCloseDocumentModal,
    toggleDocumentsSection,
    formatBase64Image,
  };
};
