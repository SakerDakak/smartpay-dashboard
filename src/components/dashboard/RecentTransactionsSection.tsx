import React from "react";
import { DashboardCard } from "./DashboardCard";
import { NearpayTransaction } from "@/types/models";
import { SellerCell } from "./SellerCell";
import { DateFormatter } from "./DateFormatter";
import { SARCurrencyIcon } from "./SARCurrencyIcon";
import Link from "next/link";

interface RecentTransactionsSectionProps {
  transactions: NearpayTransaction[];
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

/**
 * مكون لعرض أحدث المعاملات في لوحة التحكم
 */
export const RecentTransactionsSection: React.FC<
  RecentTransactionsSectionProps
> = ({ transactions, isLoading = false, error = null, className = "" }) => {
  // تنسيق المبلغ بالعملة
  const formatAmount = (amount: number | undefined): React.ReactNode => {
    if (amount === undefined) return "-";
    return (
      <div className="flex items-center gap-1 justify-end">
        <span>{amount.toFixed(2)}</span>
        <SARCurrencyIcon width={12} height={12} />
      </div>
    );
  };

  // عنصر التحميل
  if (isLoading) {
    return (
      <DashboardCard
        title="آخر المعاملات"
        subtitle="جاري التحميل..."
        className={`${className}`}
      >
        <div className="space-y-3 md:space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between py-2 border-b border-grey-100 dark:border-grey-700/30 last:border-0"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-grey-200 dark:bg-grey-700 rounded-full animate-pulse"></div>
                <div className="mr-3 md:mr-4">
                  <div className="h-4 w-24 bg-grey-200 dark:bg-grey-700 rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-32 bg-grey-200 dark:bg-grey-700 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="text-left">
                <div className="h-4 w-16 bg-grey-200 dark:bg-grey-700 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-12 bg-grey-200 dark:bg-grey-700 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    );
  }

  // عنصر الخطأ
  if (error) {
    return (
      <DashboardCard
        title="آخر المعاملات"
        subtitle="حدث خطأ"
        className={`${className}`}
      >
        <div className="text-center py-6">
          <p className="text-danger-600 dark:text-danger-400">{error}</p>
        </div>
      </DashboardCard>
    );
  }

  // عنصر البيانات الفارغة
  if (transactions.length === 0) {
    return (
      <DashboardCard
        title="آخر المعاملات"
        subtitle="لا توجد معاملات حاليًا"
        className={`${className}`}
      >
        <div className="text-center py-6">
          <p className="text-grey-600 dark:text-grey-400">
            لا توجد معاملات متاحة حالياً
          </p>
        </div>
      </DashboardCard>
    );
  }

  // عنصر البيانات
  const lastUpdate =
    transactions.length > 0 && transactions[0].created_at
      ? new Date(transactions[0].created_at)
      : new Date();

  // حساب الوقت المنقضي منذ آخر تحديث
  const updateText = getUpdateText(lastUpdate);

  function getUpdateText(lastUpdate: Date): string {
    const diffMs = Date.now() - lastUpdate.getTime();
    const minutes = Math.floor(diffMs / 60000);

    if (minutes < 60) {
      return `تحديث منذ ${minutes} ${getArabicUnit(
        minutes,
        "دقيقة",
        "دقيقتان",
        "دقائق",
        "دقيقة"
      )}`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `تحديث منذ ${hours} ${getArabicUnit(
        hours,
        "ساعة",
        "ساعتان",
        "ساعات",
        "ساعة"
      )}`;
    }

    const days = Math.floor(hours / 24);
    return `تحديث منذ ${days} ${getArabicUnit(
      days,
      "يوم",
      "يومان",
      "أيام",
      "يوم"
    )}`;
  }

  // دالة للمفرد/المثنى/الجمع بطريقة بسيطة
  function getArabicUnit(
    value: number,
    singular: string,
    dual: string,
    plural: string,
    pluralPlus: string
  ) {
    if (value === 1) return singular;
    if (value === 2) return dual;
    if (value >= 3 && value <= 10) return plural;
    return pluralPlus; // 11 فأكثر
  }

  return (
    <DashboardCard
      title="آخر المعاملات"
      subtitle={updateText}
      className={`${className}`}
    >
      <div className="space-y-3 md:space-y-4">
        {transactions.map((transaction) => (
          <Link
            key={transaction.id}
            href={`/dashboard/transactions/${transaction.id}`}
            className="flex items-center justify-between py-2 border-b border-grey-100 dark:border-grey-700/30 last:border-0 hover:bg-grey-50 dark:hover:bg-grey-800/50 px-2 rounded-lg transition-colors"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-500 dark:text-primary-400">
                #
              </div>
              <div className="mr-3 md:mr-4">
                <p className="text-sm md:text-base font-medium text-grey-900 dark:text-white">
                  معاملة #
                  {transaction.retrieval_reference_number?.substring(0, 6)}
                </p>
                <div className="text-xs md:text-sm text-grey-500 dark:text-grey-400">
                  {transaction.user ? (
                    <SellerCell
                      user={transaction.user}
                      fallbackName="بائع: غير معروف"
                    />
                  ) : (
                    <span>البائع: غير معروف</span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-left">
              <p className="text-sm md:text-base font-semibold text-grey-900 dark:text-white">
                {formatAmount(transaction.amount)}
              </p>
              <p className="text-xs text-grey-500 dark:text-grey-400">
                {transaction.created_at ? (
                  <DateFormatter
                    date={transaction.created_at}
                    format="medium"
                  />
                ) : (
                  "تاريخ غير معروف"
                )}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </DashboardCard>
  );
};
