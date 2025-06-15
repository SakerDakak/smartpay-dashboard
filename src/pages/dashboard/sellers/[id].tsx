import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  PencilIcon,
  UserIcon,
  CreditCardIcon,
  BuildingStorefrontIcon,
  EyeIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import { Button, Table, Card, AlertMessage } from "@/components/ui";
import {
  DataListHeader,
  StatusRenderer,
  DateFormatter,
  CardCell,
  StatCard,
  MerchantCell,
  DashboardCard,
} from "@/components/dashboard";
import { InfoItem } from "@/components/ui/InfoItem";
import { SARCurrencyIcon } from "@/components/dashboard/SARCurrencyIcon";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useSellerDetailsView } from "@/hooks/dashboard/sellers/useSellerDetailsView";
import type { NearpayTransaction, SellerProfile } from "@/types/models";
import type { Column, TableProps } from "@/components/ui/Table";
import { translateTransactionStatus } from "@/utils/translations";
import { AccountStatus } from "@/types/enums";

type TransactionRecord = NearpayTransaction & Record<string, unknown>;

interface Merchant {
  id: string;
  name: string;
  brand_name?: string;
  email: string;
  status: AccountStatus;
  logo?: string;
}

interface SellerStats {
  totalTransactions: number;
  totalAmount: number;
}

interface SellerInfoProps {
  seller: SellerProfile | null;
  loading: boolean;
}

interface MerchantInfoProps {
  merchant: Merchant | null;
  handleViewMerchant: () => void;
  formatBase64Image: (base64: string) => string;
}

interface SellerStatsSectionProps {
  loading: boolean;
  sellerStats: SellerStats;
}

// مكونات فرعية للصفحة
const SellerInfo: React.FC<SellerInfoProps> = ({ seller, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col md:flex-row gap-8 animate-pulse">
        <div className="w-32 h-32 bg-grey-200 dark:bg-grey-700 rounded-lg flex items-center justify-center">
          <UserIcon className="w-16 h-16 text-grey-400 dark:text-grey-500" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-grey-200 dark:bg-grey-700 rounded w-1/3"></div>
          <div className="h-6 bg-grey-200 dark:bg-grey-700 rounded w-1/4"></div>
          <div className="h-4 bg-grey-200 dark:bg-grey-700 rounded w-1/2"></div>
          <div className="h-4 bg-grey-200 dark:bg-grey-700 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!seller) return null;

  return (
    <div className="flex flex-col lg:flex-row lg:gap-8 gap-4">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32 overflow-hidden rounded-lg border border-grey-200 dark:border-grey-700 shadow-md bg-primary-500 flex items-center justify-center shrink-0">
          <UserIcon className="w-20 h-20 text-white" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold text-grey-900 dark:text-white flex items-center">
            {seller.name}
          </h2>
          <StatusRenderer status={seller.status} />
        </div>
      </div>

      <div className="flex-1 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="bg-grey-50 dark:bg-grey-800/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-grey-500 dark:text-grey-400 mb-3 flex items-center">
              <IdentificationIcon className="w-4 h-4 ml-1" />
              معلومات الاتصال
            </h3>
            <div>
              <InfoItem
                icon={EnvelopeIcon}
                label="البريد الإلكتروني"
                value={seller.email || "غير متوفر"}
              />
              <InfoItem
                icon={PhoneIcon}
                label="رقم الجوال"
                dir="ltr"
                value={
                  seller.country_code && seller.mobile
                    ? `+${seller.country_code} ${seller.mobile}`
                    : seller.mobile || "غير متوفر"
                }
              />
            </div>
          </div>
          <div className="bg-grey-50 dark:bg-grey-800/50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-grey-500 dark:text-grey-400 mb-3 flex items-center">
              <DocumentTextIcon className="w-4 h-4 ml-1" />
              معلومات إضافية
            </h3>
            <div>
              <InfoItem
                icon={CalendarIcon}
                label="تاريخ التسجيل"
                value={
                  <DateFormatter date={seller.created_at} format="medium" />
                }
              />
              <InfoItem
                icon={MapPinIcon}
                label="المدينة"
                value={seller.city || "غير متوفر"}
              />
              {seller.tid && (
                <InfoItem
                  icon={CreditCardIcon}
                  label="معرف الطرفية (TID)"
                  value={seller.tid}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MerchantInfo: React.FC<MerchantInfoProps> = ({
  merchant,
  handleViewMerchant,
  formatBase64Image,
}) => {
  if (!merchant) return null;

  return (
    <div className="mt-6 pt-6 border-t border-grey-200 dark:border-grey-700">
      <h3 className="text-xl font-semibold text-grey-900 dark:text-white mb-4 flex items-center">
        <BuildingStorefrontIcon className="w-5 h-5 ml-2 text-primary-500" />
        التاجر المرتبط
      </h3>
      <Card
        className="rounded-lg bg-grey-50 dark:bg-transparent cursor-pointer shadow-none"
        onClick={handleViewMerchant}
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-20 h-20 overflow-hidden rounded-lg border border-grey-200 dark:border-grey-700 shadow-sm bg-white dark:bg-grey-800 p-1 shrink-0">
            {merchant.logo ? (
              <Image
                src={formatBase64Image(merchant.logo)}
                alt={merchant.brand_name || merchant.name}
                fill
                sizes="80px"
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/assets/placeholder-logo.png";
                }}
              />
            ) : (
              <div className="w-full h-full bg-primary-500 flex items-center justify-center">
                <BuildingStorefrontIcon className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-right">
            <h4 className="text-lg font-semibold text-grey-900 dark:text-white">
              {merchant.brand_name || merchant.name}
            </h4>
            {merchant.brand_name && merchant.name !== merchant.brand_name && (
              <p className="text-sm text-grey-600 dark:text-grey-400">
                {merchant.name}
              </p>
            )}
            <p className="text-sm text-grey-500 dark:text-grey-400 mt-1">
              {merchant.email}
            </p>
          </div>
          <div className="mt-2 sm:mt-0 shrink-0">
            <StatusRenderer status={merchant.status} />
          </div>
        </div>
      </Card>
    </div>
  );
};

const SellerStatsSection: React.FC<SellerStatsSectionProps> = ({
  loading,
  sellerStats,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
    <StatCard
      title="إجمالي المعاملات"
      value={loading ? "-" : sellerStats.totalTransactions.toString()}
      icon={<CreditCardIcon className="w-5 h-5" />}
      isLoading={loading}
    />
    <StatCard
      title="إجمالي المبالغ"
      value={
        loading ? (
          "-"
        ) : (
          <div className="flex items-center">
            <span>{sellerStats.totalAmount.toFixed(2)}</span>
            <SARCurrencyIcon width={14} height={14} className="mr-1" />
          </div>
        )
      }
      icon={<CurrencyDollarIcon className="w-5 h-5" />}
      isLoading={loading}
    />
  </div>
);

const SellerDetailsPage = () => {
  const router = useRouter();
  const {
    seller,
    merchant,
    transactions,
    sellerStats,
    loading,
    error,
    handleEditSeller,
    handleViewTransaction,
    handleViewMerchant,
    formatBase64Image,
  } = useSellerDetailsView();

  // تعريف أعمدة جدول المعاملات
  const getTransactionColumns = (): Column<TransactionRecord>[] => [
    {
      header: "المبلغ",
      key: "amount",
      render: (transaction) => (
        <span className="font-semibold text-grey-900 dark:text-white flex items-center gap-2">
          {transaction.amount !== undefined ? (
            <>
              {transaction.amount}
              {transaction.currency === "SAR" && (
                <SARCurrencyIcon
                  width={20}
                  height={20}
                  className="inline-block w-5 h-5 align-middle dark:invert"
                />
              )}
              {transaction.currency && transaction.currency !== "SAR" && (
                <span>{transaction.currency}</span>
              )}
            </>
          ) : (
            "-"
          )}
        </span>
      ),
      sortable: true,
    },
    {
      header: "الحالة",
      key: "status",
      render: (transaction) => (
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium 
          ${
            transaction.status === "succeeded" ||
            transaction.status === "Success" ||
            transaction.status?.toLowerCase() === "accepted" ||
            transaction.status === "Approved"
              ? "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400"
              : transaction.status === "failed" ||
                transaction.status === "Failed" ||
                transaction.status?.includes("DECLINED BY ISSUING BANK")
              ? "bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400"
              : "bg-grey-100 text-grey-700 dark:bg-grey-700/30 dark:text-grey-400"
          }
        `}
        >
          {translateTransactionStatus(transaction.status || "Unknown")}
        </span>
      ),
      sortable: true,
    },
    {
      header: "التاجر",
      key: "merchant",
      render: (transaction) =>
        transaction.merchant_id ? (
          <MerchantCell
            merchantId={transaction.merchant_id}
            fallbackBrandName={transaction.merchant?.name}
          />
        ) : (
          <span className="text-grey-500 dark:text-grey-400">غير معروف</span>
        ),
      sortable: true,
    },
    {
      header: "البطاقة",
      key: "card",
      render: (transaction) => (
        <CardCell
          cardBrand={transaction.card_brand}
          lastFourDigits={transaction.last_four_digits}
        />
      ),
      sortable: true,
    },
    {
      header: "رقم المعاملة",
      key: "retrieval_reference_number",
      render: (transaction) => (
        <span className="font-mono text-grey-700 dark:text-grey-300">
          {transaction.retrieval_reference_number?.substring(0, 8) ||
            transaction.id?.substring(0, 8) ||
            "-"}
        </span>
      ),
      sortable: true,
    },
    {
      header: "التاريخ",
      key: "created_at",
      render: (transaction) => (
        <DateFormatter
          date={transaction.created_at as string}
          format="medium"
        />
      ),
      sortable: true,
    },
    {
      header: "الإجراءات",
      key: "actions",
      render: (transaction) => {
        const receipt = transaction.receipts && transaction.receipts[0];
        const qrCodeUrl =
          receipt && typeof receipt.qr_code === "string"
            ? receipt.qr_code
            : null;
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="link"
              onClick={() => handleViewTransaction(transaction.id)}
              title="عرض التفاصيل"
              aria-label={`عرض تفاصيل المعاملة ${transaction.id}`}
              className="p-2 rounded-lg"
            >
              <EyeIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </Button>
            {qrCodeUrl && (
              <Button
                variant="link"
                onClick={() => window.open(qrCodeUrl, "_blank")}
                title="عرض الفاتورة"
                aria-label={`عرض الفاتورة في صفحة خارجية`}
                className="p-2 rounded-lg"
              >
                <DocumentTextIcon className="h-5 w-5 text-warning-600 dark:text-warning-400" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  // إنشاء خصائص جدول المعاملات
  const getTransactionTableProps = (): TableProps<TransactionRecord> => ({
    columns: getTransactionColumns(),
    data: transactions as unknown as TransactionRecord[],
    loading,
    error: error || undefined,
    emptyMessage: "لا توجد معاملات لهذا البائع",
    keyExtractor: (transaction) => transaction.id,
    showRowsPerPage: true,
    showSorting: true,
    showGlobalFilter: true,
    className: "border-none relative",
    searchInputProps: {
      placeholder: "البحث في المعاملات...",
      className:
        "block w-full md:w-80 px-5 py-2.5 rounded-xl border bg-white/50 dark:bg-grey-900/50 backdrop-blur-sm placeholder-grey-400 dark:placeholder-grey-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-grey-900 dark:text-white border-grey-300/70 dark:border-grey-700/70 pr-12",
      rightIcon: <MagnifyingGlassIcon className="h-5 w-5 text-grey-400" />,
    },
  });

  // عرض رسالة الخطأ إذا حدث خطأ
  if (error && !loading) {
    return (
      <DashboardLayout>
        <DataListHeader
          title="تفاصيل البائع"
          subtitle="عرض معلومات البائع والتاجر والمعاملات"
        />
        <DashboardCard className="mt-8">
          <AlertMessage
            type="error"
            title="خطأ في جلب البيانات"
            message={error}
            actionText="العودة إلى قائمة البائعين"
            onAction={() => router.push("/dashboard/sellers")}
          />
        </DashboardCard>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <DataListHeader
            title="تفاصيل البائع"
            subtitle="عرض معلومات البائع والتاجر والمعاملات"
          />
          <div className="mt-4 md:mt-0">
            <Button
              onClick={handleEditSeller}
              variant="primary"
              leftIcon={<PencilIcon className="w-5 h-5" />}
              isLoading={loading}
            >
              تعديل البائع
            </Button>
          </div>
        </div>

        {/* بطاقة معلومات البائع */}
        <DashboardCard className="mb-8 p-6 shadow-lg rounded-xl">
          <div className="flex flex-col gap-6">
            <SellerInfo seller={seller} loading={loading} />
            <MerchantInfo
              merchant={merchant}
              handleViewMerchant={handleViewMerchant}
              formatBase64Image={formatBase64Image}
            />
          </div>
        </DashboardCard>

        {/* إحصائيات البائع */}
        <SellerStatsSection loading={loading} sellerStats={sellerStats} />

        {/* جدول المعاملات */}
        <DashboardCard
          title="معاملات البائع"
          className="shadow-lg rounded-xl overflow-visible relative p-0"
        >
          <Table {...getTransactionTableProps()} />
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
};

export default SellerDetailsPage;
