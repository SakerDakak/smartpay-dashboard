import { useState, useEffect } from "react";
import { MerchantService } from "@/services/firebase/merchantService";
import { SellerService } from "@/services/firebase/sellerService";
import { NearpayService } from "@/services/nearpay/nearpayService";
import { NearpayTransaction } from "@/types/models";

export interface DashboardStats {
  totalSellers: number;
  totalTransactions: number;
  totalTransactionAmount: number;
  totalMerchants: number;
  sellersChange: {
    value: string;
    type: "increase" | "decrease";
  };
  transactionsChange: {
    value: string;
    type: "increase" | "decrease";
  };
  totalAmountChange: {
    value: string;
    type: "increase" | "decrease";
  };
  merchantsChange: {
    value: string;
    type: "increase" | "decrease";
  };
  isLoading: boolean;
  error: string | null;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSellers: 0,
    totalTransactions: 0,
    totalTransactionAmount: 0,
    totalMerchants: 0,
    sellersChange: { value: "0%", type: "increase" },
    transactionsChange: { value: "0%", type: "increase" },
    totalAmountChange: { value: "0%", type: "increase" },
    merchantsChange: { value: "0%", type: "increase" },
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // جلب إحصائيات التجار
        const allMerchants = await MerchantService.getMerchants();

        // جلب إحصائيات البائعين
        const allSellers = await SellerService.getSellers();

        // جلب جميع المعاملات بطريقة التكرار حتى استيفاء جميع الصفحات
        const allTransactions: NearpayTransaction[] = [];
        let currentPage = 1;
        let hasMorePages = true;

        while (hasMorePages) {
          const transactionsData = await NearpayService.getTransactions({
            page: currentPage,
            limit: 100, // جلب أكبر عدد ممكن في كل طلب
          });

          // إضافة المعاملات الجديدة للمصفوفة الكلية
          allTransactions.push(...transactionsData.transactions);

          // التحقق مما إذا كانت هناك صفحات أخرى
          if (
            transactionsData.pages &&
            transactionsData.pages.current < transactionsData.pages.total
          ) {
            currentPage++;
          } else {
            hasMorePages = false;
          }
        }

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0-11

        // تحديد بداية ونهاية الشهر الحالي
        const firstDayCurrentMonth = new Date(currentYear, currentMonth, 1);
        const lastDayCurrentMonth = new Date(currentYear, currentMonth + 1, 0);

        // تحديد بداية ونهاية الشهر السابق
        const firstDayPreviousMonth = new Date(
          currentYear,
          currentMonth - 1,
          1
        );
        const lastDayPreviousMonth = new Date(currentYear, currentMonth, 0);

        // فلترة المعاملات للشهر الحالي والشهر السابق
        const currentMonthTransactions = allTransactions.filter((tx) => {
          const txDate = new Date(tx.created_at);
          return (
            txDate >= firstDayCurrentMonth && txDate <= lastDayCurrentMonth
          );
        });

        const previousMonthTransactions = allTransactions.filter((tx) => {
          const txDate = new Date(tx.created_at);
          return (
            txDate >= firstDayPreviousMonth && txDate <= lastDayPreviousMonth
          );
        });

        // حساب مجموع المبالغ للمعاملات المقبولة لكل شهر
        const calculateAcceptedAmount = (
          transactions: NearpayTransaction[]
        ): number => {
          return transactions.reduce((sum: number, tx: NearpayTransaction) => {
            if (
              tx.status &&
              (tx.status.toLowerCase() === "approved" ||
                tx.status.toLowerCase() === "accepted")
            ) {
              return sum + (tx.amount || 0);
            }
            return sum;
          }, 0);
        };

        const currentMonthTotalAmount = calculateAcceptedAmount(
          currentMonthTransactions
        );
        const previousMonthTotalAmount = calculateAcceptedAmount(
          previousMonthTransactions
        );

        // العدد الإجمالي للمعاملات (جميع المعاملات بغض النظر عن التاريخ للحقل totalTransactions)
        const totalTransactionsCount = allTransactions.length;
        // العدد الإجمالي لمبلغ المعاملات (فقط المقبولة من جميع المعاملات للحقل totalTransactionAmount)
        const overallTotalAcceptedAmount =
          calculateAcceptedAmount(allTransactions);

        // فلترة التجار للشهر السابق (الذين تم إنشاؤهم قبل بداية الشهر الحالي)
        const previousMonthMerchantsCount = allMerchants.filter((merchant) => {
          if (!merchant.created_at) return false; // تجاهل إذا لم يكن هناك تاريخ إنشاء
          const merchantDate = new Date(merchant.created_at);
          return merchantDate < firstDayCurrentMonth;
        }).length;

        // فلترة البائعين للشهر السابق (الذين تم إنشاؤهم قبل بداية الشهر الحالي)
        const previousMonthSellersCount = allSellers.filter((seller) => {
          if (!seller.created_at) return false; // تجاهل إذا لم يكن هناك تاريخ إنشاء
          const sellerDate = new Date(seller.created_at);
          return sellerDate < firstDayCurrentMonth;
        }).length;

        // حساب نسب التغيير
        const calculateChange = (
          current: number,
          previous: number
        ): { value: string; type: "increase" | "decrease" } => {
          if (previous === 0) {
            if (current > 0) {
              return { value: "---", type: "increase" };
            }
            return { value: "0%", type: "increase" };
          }

          const changePercentage = ((current - previous) / previous) * 100;
          const type = changePercentage >= 0 ? "increase" : "decrease";
          return {
            value: `${Math.abs(changePercentage).toFixed(1)}%`,
            type,
          };
        };

        setStats({
          totalSellers: allSellers.length,
          totalTransactions: totalTransactionsCount,
          totalTransactionAmount: overallTotalAcceptedAmount,
          totalMerchants: allMerchants.length,
          sellersChange: calculateChange(
            allSellers.length,
            previousMonthSellersCount
          ),
          transactionsChange: calculateChange(
            currentMonthTransactions.length,
            previousMonthTransactions.length
          ),
          totalAmountChange: calculateChange(
            currentMonthTotalAmount,
            previousMonthTotalAmount
          ),
          merchantsChange: calculateChange(
            allMerchants.length,
            previousMonthMerchantsCount
          ),
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setStats((prev) => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "حدث خطأ أثناء جلب إحصائيات لوحة التحكم",
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
};
