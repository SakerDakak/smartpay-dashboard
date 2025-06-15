import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { NearpayTransaction } from "@/types/models";
import { Card, Table } from "@/components/ui";
import type { Column, TableProps } from "@/components/ui/Table";
import { useTransactionsPageLogic } from "@/hooks/dashboard/transactions/useTransactionsPageLogic";
import {
  DataListHeader,
  DateFormatter,
  StatusMessages,
  MerchantCell,
  SellerCell,
  CardCell,
} from "@/components/dashboard";
import {
  EyeIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { translateTransactionStatus } from "@/utils/translations";
import { Button, StatusBadge } from "@/components/ui";
import Image from "next/image";

type TransactionRecord = NearpayTransaction & Record<string, unknown>;

const TransactionsPage: React.FC = () => {
  const {
    transactions,
    loading,
    error,
    successMessage,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    totalTransactions,
    totalPages,
    handleNavigateToViewTransaction,
    clearError,
    clearSuccess,
  } = useTransactionsPageLogic();

  const columns: Column<TransactionRecord>[] = [
    {
      header: "المبلغ",
      key: "amount",
      render: (transaction) => (
        <span className="font-semibold text-grey-900 dark:text-white flex items-center gap-2">
          {transaction.amount !== undefined ? (
            <>
              {transaction.amount}
              {transaction.currency === "SAR" && (
                <Image
                  src="/assets/sar.svg"
                  alt="ريال سعودي"
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
      render: (transaction) => {
        let variant: "success" | "danger" | "default" = "default";

        if (
          transaction.status?.toLowerCase() === "accepted" ||
          transaction.status?.toLowerCase() === "approved"
        ) {
          variant = "success";
        } else if (
          transaction.status?.toLowerCase() === "failed" ||
          transaction.status
            ?.toLowerCase()
            ?.includes("declined by issuing bank")
        ) {
          variant = "danger";
        }

        return (
          <StatusBadge
            variant={variant}
            label={translateTransactionStatus(transaction.status || "Unknown")}
            size="sm"
          />
        );
      },
      sortable: true,
    },
    {
      header: "التاجر",
      key: "merchant",
      render: (transaction) => (
        <MerchantCell
          merchantId={String(transaction.merchant_id)}
          fallbackBrandName={
            typeof transaction.merchant?.name === "string"
              ? transaction.merchant.name
              : typeof transaction.brand_name === "string"
              ? transaction.brand_name
              : undefined
          }
          fallbackName={
            typeof transaction.merchant?.name_ar === "string"
              ? transaction.merchant.name_ar
              : typeof transaction.name === "string"
              ? transaction.name
              : undefined
          }
          fallbackLogo={
            typeof transaction.logo === "string" ? transaction.logo : undefined
          }
        />
      ),
      sortable: true,
    },
    {
      header: "البائع",
      key: "user",
      render: (transaction) => (
        <SellerCell
          user={transaction.user}
          fallbackName={
            typeof transaction.name === "string" ? transaction.name : undefined
          }
          fallbackMobile={
            typeof transaction.mobile === "string"
              ? transaction.mobile
              : undefined
          }
        />
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
              onClick={() => handleNavigateToViewTransaction(transaction.id)}
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
                className="p-2 rounded-lg "
              >
                <DocumentTextIcon className="h-5 w-5 text-warning-600 dark:text-warning-400" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  // تعريف خيارات عدد الصفوف المعروضة - تم إزالة خيار "الكل"
  const customRowsPerPageOptions = [
    { value: "10", label: "10" },
    { value: "25", label: "25" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
  ];

  const tableProps: TableProps<TransactionRecord> = {
    columns,
    data: transactions as unknown as TransactionRecord[],
    loading,
    error: error || undefined,
    emptyMessage: "لا توجد معاملات للعرض",
    keyExtractor: (transaction) => transaction.id,
    showRowsPerPage: true,
    showSorting: true,
    showGlobalFilter: true,
    className: "border-none relative",
    onAddClick: undefined,
    addButtonLabel: "",
    // بيانات التصفح الخارجية - استخدام القيم المحسوبة بدقة
    currentPage: currentPage,
    totalPages: totalPages,
    totalRecords: totalTransactions,
    onPageChange: setCurrentPage,
    rowsPerPage,
    onRowsPerPageChange: setRowsPerPage,
    rowsPerPageOptions: customRowsPerPageOptions,
    // خصائص البحث
    searchInputProps: {
      placeholder: "البحث في المعاملات...",
      className:
        "block w-full md:w-80 px-5 py-2.5 rounded-xl border bg-white/50 dark:bg-grey-900/50 backdrop-blur-sm placeholder-grey-400 dark:placeholder-grey-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-grey-900 dark:text-white border-grey-300/70 dark:border-grey-700/70 pr-12",
      rightIcon: <MagnifyingGlassIcon className="h-5 w-5 text-grey-400" />,
    },
  };

  return (
    <DashboardLayout>
      <DataListHeader
        title="إدارة المعاملات"
        subtitle="عرض وتصفية معاملات Nearpay"
      />
      <StatusMessages
        error={error}
        successMessage={successMessage}
        onClearError={clearError}
        onClearSuccess={clearSuccess}
      />

      <Card
        className="mb-8 shadow-lg rounded-xl overflow-visible relative"
        variant="default"
      >
        <Table {...tableProps} />
      </Card>
    </DashboardLayout>
  );
};

export default TransactionsPage;
