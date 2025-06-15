import React from "react";
import { StatCard } from "./StatCard";
import {
  TruckIcon,
  CreditCardIcon,
  BanknotesIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import { SARCurrencyIcon } from "./SARCurrencyIcon";

interface DashboardStatsProps {
  totalSellers: number;
  totalTransactions: number;
  totalTransactionAmount: number;
  totalMerchants: number;
  sellersChange?: {
    value: string;
    type: "increase" | "decrease";
  };
  transactionsChange?: {
    value: string;
    type: "increase" | "decrease";
  };
  totalAmountChange?: {
    value: string;
    type: "increase" | "decrease";
  };
  merchantsChange?: {
    value: string;
    type: "increase" | "decrease";
  };
  isLoading?: boolean;
  className?: string;
}

/**
 * مكون لعرض الإحصائيات الرئيسية في لوحة التحكم
 */
export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalSellers,
  totalTransactions,
  totalTransactionAmount,
  totalMerchants,
  sellersChange,
  transactionsChange,
  totalAmountChange,
  merchantsChange,
  isLoading = false,
  className = "",
}) => {
  // تنسيق المبالغ المالية بالريال السعودي
  const formatCurrency = (value: number): React.ReactNode => {
    return (
      <span className="flex items-center gap-1 justify-start">
        <span>{value.toFixed(2)}</span>
        <SARCurrencyIcon width={14} height={14} className="mr-1" />
      </span>
    );
  };

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 ${className}`}
    >
      <StatCard
        title="عدد التجار"
        value={isLoading ? "-" : totalMerchants.toLocaleString()}
        icon={<BuildingStorefrontIcon className="w-5 h-5" />}
        change={merchantsChange}
        isLoading={isLoading}
      />

      <StatCard
        title="عدد البائعين"
        value={isLoading ? "-" : totalSellers.toLocaleString()}
        icon={<TruckIcon className="w-5 h-5" />}
        change={sellersChange}
        isLoading={isLoading}
      />

      <StatCard
        title="مجموع قيمة العمليات"
        value={isLoading ? "-" : formatCurrency(totalTransactionAmount)}
        icon={<BanknotesIcon className="w-5 h-5" />}
        change={totalAmountChange}
        isLoading={isLoading}
      />

      <StatCard
        title="إجمالي المعاملات"
        value={isLoading ? "-" : totalTransactions.toLocaleString()}
        icon={<CreditCardIcon className="w-5 h-5" />}
        change={transactionsChange}
        isLoading={isLoading}
      />
    </div>
  );
};
