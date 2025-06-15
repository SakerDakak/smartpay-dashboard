import { useState, useEffect } from 'react';
import { MerchantProfile } from '@/types/models';
import { MerchantService } from '@/services/firebase/merchantService';

/**
 * hook لجلب بيانات التاجر من Firebase
 */
export const useMerchantData = (merchantId: string | undefined) => {
  const [merchant, setMerchant] = useState<MerchantProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMerchantData = async () => {
      if (!merchantId) {
        setMerchant(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const merchantData = await MerchantService.getMerchantById(merchantId);
        setMerchant(merchantData);
      } catch (err) {
        console.error('Error fetching merchant data:', err);
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء جلب بيانات التاجر');
      } finally {
        setLoading(false);
      }
    };

    fetchMerchantData();
  }, [merchantId]);

  return { merchant, loading, error };
}; 