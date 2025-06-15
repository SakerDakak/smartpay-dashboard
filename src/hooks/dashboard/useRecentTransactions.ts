import { useState, useEffect } from 'react';
import { NearpayService } from '@/services/nearpay/nearpayService';
import { NearpayTransaction } from '@/types/models';

export interface RecentTransactionsResult {
  transactions: NearpayTransaction[];
  isLoading: boolean;
  error: string | null;
}

export const useRecentTransactions = (limit: number = 5) => {
  const [result, setResult] = useState<RecentTransactionsResult>({
    transactions: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        const transactionsData = await NearpayService.getTransactions({
          page: 1,
          limit: limit
        });
        
        setResult({
          transactions: transactionsData.transactions,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching recent transactions:', error);
        setResult(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'حدث خطأ أثناء جلب أحدث المعاملات'
        }));
      }
    };

    fetchRecentTransactions();
  }, [limit]);

  return result;
}; 