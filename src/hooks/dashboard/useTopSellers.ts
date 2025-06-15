import { useState, useEffect } from "react";
import { SellerService } from "@/services/firebase/sellerService";
import { NearpayService } from "@/services/nearpay/nearpayService";
import { NearpayTransaction } from "@/types/models";

export interface TopSeller {
  id: string;
  name: string;
  transactionCount: number;
  percentageActivity: number;
}

export interface TopSellersResult {
  sellers: TopSeller[];
  isLoading: boolean;
  error: string | null;
}

export const useTopSellers = (limit: number = 5) => {
  const [result, setResult] = useState<TopSellersResult>({
    sellers: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchTopSellers = async () => {
      try {
        // جلب جميع البائعين
        const sellers = await SellerService.getSellers();

        // جلب جميع المعاملات
        const allTransactions: NearpayTransaction[] = [];
        let currentPage = 1;
        let hasMorePages = true;

        while (hasMorePages) {
          const transactionsData = await NearpayService.getTransactions({
            page: currentPage,
            limit: 100, // جلب أكبر عدد ممكن في كل طلب
          });

          allTransactions.push(...transactionsData.transactions);

          if (
            transactionsData.pages &&
            transactionsData.pages.current < transactionsData.pages.total
          ) {
            currentPage++;
          } else {
            hasMorePages = false;
          }
        }

        // حساب عدد المعاملات لكل بائع
        const sellerTransactionCounts: Record<string, number> = {};
        let totalTransactions = 0;

        allTransactions.forEach((transaction) => {
          if (transaction.user && transaction.user.id) {
            const sellerId = transaction.user.id;

            // زيادة عداد المعاملات للبائع
            sellerTransactionCounts[sellerId] =
              (sellerTransactionCounts[sellerId] || 0) + 1;
            totalTransactions++;
          }
        });

        // حساب نسبة النشاط بناءً على إجمالي المعاملات
        const sellersWithActivity = sellers.map((seller) => {
          const transactionCount = sellerTransactionCounts[seller.id] || 0;

          // حساب النسبة المئوية من إجمالي المعاملات
          const percentageActivity =
            totalTransactions > 0
              ? Math.round((transactionCount / totalTransactions) * 100)
              : 0;

          return {
            id: seller.id,
            name: seller.name,
            transactionCount,
            percentageActivity,
          };
        });

        // ترتيب البائعين حسب عدد المعاملات وأخذ العدد المطلوب
        const topSellers = sellersWithActivity
          .sort((a, b) => b.transactionCount - a.transactionCount)
          .slice(0, limit);

        setResult({
          sellers: topSellers,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching top sellers:", error);
        setResult((prev) => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "حدث خطأ أثناء جلب أفضل البائعين",
        }));
      }
    };

    fetchTopSellers();
  }, [limit]);

  return result;
};
