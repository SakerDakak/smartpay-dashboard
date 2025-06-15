import React from "react";
import { DashboardCard } from "./DashboardCard";
import { TopSeller } from "@/hooks/dashboard/useTopSellers";
import { TruckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface TopSellersSectionProps {
  sellers: TopSeller[];
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

/**
 * مكون لعرض أفضل البائعين نشاطًا في لوحة التحكم
 */
export const TopSellersSection: React.FC<TopSellersSectionProps> = ({
  sellers,
  isLoading = false,
  error = null,
  className = "",
}) => {
  // عنصر التحميل
  if (isLoading) {
    return (
      <DashboardCard title="أكثر البائعين نشاطًا" className={className}>
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-40 bg-grey-200 dark:bg-grey-700 rounded mb-6"></div>

          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="mb-8">
              <div className="flex justify-between mb-4">
                <div className="h-6 w-24 bg-grey-200 dark:bg-grey-700 rounded"></div>
                <div className="h-6 w-8 bg-grey-200 dark:bg-grey-700 rounded"></div>
              </div>
              <div className="w-full h-2 bg-grey-200 dark:bg-grey-700 rounded-full"></div>
            </div>
          ))}
        </div>
      </DashboardCard>
    );
  }

  // عنصر الخطأ
  if (error) {
    return (
      <DashboardCard title="أكثر البائعين نشاطًا" className={className}>
        <div className="text-center py-6">
          <p className="text-danger-600 dark:text-danger-400">{error}</p>
        </div>
      </DashboardCard>
    );
  }

  // عنصر البيانات الفارغة
  if (sellers.length === 0) {
    return (
      <DashboardCard title="أكثر البائعين نشاطًا" className={className}>
        <div className="text-center py-6">
          <p className="text-grey-600 dark:text-grey-400">
            لا توجد بيانات متاحة حالياً
          </p>
        </div>
      </DashboardCard>
    );
  }

  // عنصر البيانات
  return (
    <DashboardCard title="أكثر البائعين نشاطًا" className={className}>
      <div className="space-y-3 md:space-y-4">
        <div className="mb-4 md:mb-6">
          <p className="text-sm text-grey-600 dark:text-grey-400 mb-4">
            قائمة البائعين الأكثر نشاطًا بناءً على عدد المعاملات
          </p>

          {sellers.map((seller) => (
            <Link
              key={seller.id}
              href={`/dashboard/sellers/${seller.id}`}
              className="block mb-3 md:mb-4 hover:bg-grey-50 dark:hover:bg-grey-800/50 px-2 py-2 rounded-lg transition-colors"
            >
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-500 dark:text-primary-400 ml-2">
                  <TruckIcon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-grey-900 dark:text-white">
                  {seller.name}
                </span>
                <div className="flex-grow"></div>
                <div className="flex items-center px-2 py-1 bg-primary-50 dark:bg-primary-900/30 rounded text-xs font-medium text-primary-600 dark:text-primary-400">
                  <span>{seller.transactionCount} معاملة</span>
                </div>
              </div>
              <div className="relative">
                <div className="w-full bg-grey-200 dark:bg-grey-700 rounded-full h-1.5 md:h-2">
                  <div
                    className="bg-primary-gradient h-1.5 md:h-2 rounded-full transition-all duration-500"
                    style={{ width: `${seller.percentageActivity}%` }}
                  ></div>
                </div>
                <span className="absolute left-0 top-2 text-xs text-grey-600 dark:text-grey-400">
                  {seller.percentageActivity}%
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
};
