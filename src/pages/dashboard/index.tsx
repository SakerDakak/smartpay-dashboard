import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  DashboardStats,
  TopSellersSection,
  RecentTransactionsSection,
  DataListHeader,
} from "@/components/dashboard";

import { useDashboardStats } from "@/hooks/dashboard/useDashboardStats";
import { useRecentTransactions } from "@/hooks/dashboard/useRecentTransactions";
import { useTopSellers } from "@/hooks/dashboard/useTopSellers";

const DashboardPage: React.FC = () => {
  const auth = useAuth();
  const router = useRouter();

  // جلب البيانات باستخدام الـ hooks
  const dashboardStats = useDashboardStats();
  const recentTransactions = useRecentTransactions(5);
  const topSellers = useTopSellers(5);

  useEffect(() => {
    // إذا كان AuthContext لا يزال يحمل أو المستخدم غير مسجل دخوله، وجهه لصفحة تسجيل الدخول
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push("/login");
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  if (auth.isLoading || !auth.isAuthenticated) {
    // يمكنك عرض شاشة تحميل هنا أو null حتى يتم التوجيه
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-grey-100 via-grey-50 to-white dark:from-grey-900 dark:via-grey-800 dark:to-grey-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 bg-primary-400/30 dark:bg-primary-500/20 blur-md rounded-full scale-150 z-0 animate-pulse"></div>
            <svg
              aria-hidden="true"
              className="w-14 h-14 text-grey-200 dark:text-grey-700 animate-spin fill-primary-500 relative z-10"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
          <p className="mt-4 text-grey-600 dark:text-grey-400">
            جاري التحميل...
          </p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      {/* ترويسة مع نص ترحيبي */}
      <DataListHeader
        title={`مرحباً بك, ${auth.profile?.name || "أدمن"}!`}
        subtitle="هنا ستجد نظرة عامة عن أحدث إحصائيات النظام والمعلومات الهامة."
      />
      {/* الإحصائيات الرئيسية */}
      <DashboardStats
        totalSellers={dashboardStats.totalSellers}
        totalTransactions={dashboardStats.totalTransactions}
        totalTransactionAmount={dashboardStats.totalTransactionAmount}
        totalMerchants={dashboardStats.totalMerchants}
        sellersChange={dashboardStats.sellersChange}
        transactionsChange={dashboardStats.transactionsChange}
        totalAmountChange={dashboardStats.totalAmountChange}
        merchantsChange={dashboardStats.merchantsChange}
        isLoading={dashboardStats.isLoading}
        className="mb-6 md:mb-8"
      />

      {/* قسم البيانات الرئيسي */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <RecentTransactionsSection
          transactions={recentTransactions.transactions}
          isLoading={recentTransactions.isLoading}
          error={recentTransactions.error}
          className="lg:col-span-2"
        />

        <TopSellersSection
          sellers={topSellers.sellers}
          isLoading={topSellers.isLoading}
          error={topSellers.error}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
