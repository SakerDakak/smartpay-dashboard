import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { MerchantProfile } from '@/types/models';
import { MerchantService } from '@/services/firebase/merchantService';

export const useMerchantsPageLogic = () => {
  const router = useRouter();
  const [merchants, setMerchants] = useState<MerchantProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    merchantId: '',
    merchantName: '',
  });

  const fetchMerchants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const merchants = await MerchantService.getMerchants();
      setMerchants(merchants);
    } catch (err) {
      console.error('Error fetching merchants:', err);
      setError('حدث خطأ أثناء جلب بيانات التجار.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMerchants();
  }, [fetchMerchants]);

  const showDeleteConfirm = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      merchantId: id,
      merchantName: name,
    });
  };

  const cancelDelete = () => {
    setConfirmDialog({
      isOpen: false,
      merchantId: '',
      merchantName: '',
    });
  };

  const handleDeleteMerchant = async () => {
    const { merchantId } = confirmDialog;
    if (!merchantId) return;
    try {
      await MerchantService.deleteMerchant(merchantId);
      setMerchants(merchants.filter(merchant => merchant.id !== merchantId));
      setSuccessMessage('تم حذف التاجر بنجاح.');
      setConfirmDialog({ isOpen: false, merchantId: '', merchantName: '' });
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting merchant:', err);
      setError('حدث خطأ أثناء حذف التاجر.');
      setConfirmDialog({ isOpen: false, merchantId: '', merchantName: '' });
    }
  };

  const handleAddClick = () => {
    router.push('/dashboard/merchants/add');
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccessMessage(null);

  return {
    merchants,
    loading,
    error,
    successMessage,
    confirmDialog,
    fetchMerchants,
    showDeleteConfirm,
    cancelDelete,
    handleDeleteMerchant,
    handleAddClick,
    clearError,
    clearSuccess,
    router, // إعادة التوجيه قد تحتاجها الواجهة أيضاً
  };
}; 