import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { NearpayService } from '../../../services/nearpay/nearpayService';
import { NearpayTransaction, GetTransactionsParams, TransactionsResponse } from '../../../types/models';

export const useTransactionsPageLogic = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState<NearpayTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pagination, setPagination] = useState<TransactionsResponse['pages'] | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchTransactions = useCallback(async (params: GetTransactionsParams) => {
    console.log("جاري جلب المعاملات بالمعلمات:", params);
    setLoading(true);
    setError(null);
    try {
      const limit = Math.min(Math.max(1, params.limit || 10), 100);
      
      const apiParams: GetTransactionsParams = {
        ...params,
        page: params.page || 1,
        limit,
      };
      
      const response = await NearpayService.getTransactions(apiParams);
      
      console.log("تم جلب البيانات من API:", response);
      console.log("معلومات الصفحات:", response.pages);
      
      setTransactions(response.transactions);
      setPagination(response.pages);
      
      // تحديث مجموع الصفحات بناءً على رد API
      if (response.pages && response.pages.total > 0) {
        setTotalPages(response.pages.total);
        
        // حساب إجمالي عدد المعاملات (تقديري) بناءً على عدد الصفحات وحجم الصفحة
        // في آخر صفحة قد يكون هناك أقل من الحد الأقصى للصفحة
        const fullPagesRecords = (response.pages.total - 1) * limit;
        
        // إذا كنا في الصفحة الأخيرة، نستخدم عدد السجلات الفعلية من API 
        // وإلا نفترض الصفحات الممتلئة بالكامل
        if (response.pages.current === response.pages.total) {
          setTotalTransactions(fullPagesRecords + response.transactions.length);
        } else {
          // نفترض أن جميع الصفحات تحتوي على الحد الأقصى من السجلات
          setTotalTransactions(response.pages.total * limit);
        }
      } else {
        setTotalPages(1);
        setTotalTransactions(response.transactions.length);
      }
    } catch (err) {
      console.error("خطأ في جلب البيانات:", err);
      if (err instanceof Error) {
        setError(err.message || 'حدث خطأ أثناء جلب المعاملات.');
      } else {
        setError('حدث خطأ غير متوقع أثناء جلب المعاملات.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    fetchTransactions({
      page: currentPage,
      limit: rowsPerPage,
      search: searchTerm || undefined,
    });
  }, [fetchTransactions, currentPage, rowsPerPage, searchTerm]);

  const handleNavigateToViewTransaction = (id: string) => {
    router.push(`/dashboard/transactions/${id}`);
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccessMessage(null);

  return {
    transactions,
    loading,
    error,
    successMessage,
    pagination,
    currentPage,
    setCurrentPage: handlePageChange,
    rowsPerPage,
    setRowsPerPage: handleRowsPerPageChange,
    searchTerm,
    setSearchTerm,
    totalTransactions,
    totalPages,
    fetchTransactions,
    handleNavigateToViewTransaction,
    clearError,
    clearSuccess,
  };
}; 