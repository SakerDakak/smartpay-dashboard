import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  PencilIcon,
  UserGroupIcon,
  CreditCardIcon,
  BuildingStorefrontIcon,
  TrashIcon,
  EyeIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  IdentificationIcon,
  ArrowsPointingOutIcon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { Button, Table, ConfirmDialog, AlertMessage } from "@/components/ui";
import {
  DataListHeader,
  StatusRenderer,
  DateFormatter,
  SellerCell,
  CardCell,
  StatCard,
  DashboardCard,
} from "@/components/dashboard";
import { InfoItem } from "@/components/ui/InfoItem";
import Modal from "@/components/dashboard/Modal";
import { SARCurrencyIcon } from "@/components/dashboard/SARCurrencyIcon";
import DashboardLayout from "@/layouts/DashboardLayout";
import type {
  MerchantSeller,
  MerchantDetails,
} from "@/hooks/dashboard/merchants/useMerchantDetails";
import { useMerchantDetailsView } from "@/hooks/dashboard/merchants/useMerchantDetailsView";
import type { NearpayTransaction } from "@/types/models";
import type { Column, TableProps } from "@/components/ui/Table";
import { translateTransactionStatus } from "@/utils/translations";

type SellerProfileRecord = MerchantSeller & Record<string, unknown>;
type TransactionRecord = NearpayTransaction & Record<string, unknown>;

interface MerchantInfoProps {
  merchant: MerchantDetails | null;
  loading: boolean;
  formatBase64Image: (base64: string) => string;
}

interface DocumentsSectionProps {
  merchant: MerchantDetails | Record<string, never>;
  showDocuments: boolean;
  toggleDocumentsSection: () => void;
  handleViewDocument: (title: string, imageUrl: string) => void;
  formatBase64Image: (base64: string) => string;
}

// مكون فرعي لعرض معلومات التاجر
const MerchantInfo: React.FC<MerchantInfoProps> = ({
  merchant,
  loading,
  formatBase64Image,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row lg:gap-8 gap-4 animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 bg-grey-200 dark:bg-grey-700 rounded-lg"></div>
          <div className="h-8 bg-grey-200 dark:bg-grey-700 rounded w-32"></div>
          <div className="h-6 bg-grey-200 dark:bg-grey-700 rounded w-20"></div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="h-4 bg-grey-200 dark:bg-grey-700 rounded w-1/2"></div>
          <div className="h-4 bg-grey-200 dark:bg-grey-700 rounded w-1/3"></div>
          <div className="h-4 bg-grey-200 dark:bg-grey-700 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (!merchant) return null;

  return (
    <div className="flex flex-col lg:flex-row lg:gap-8 gap-4">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32 overflow-hidden rounded-lg border border-grey-200 dark:border-grey-700 shadow-md bg-white dark:bg-grey-800 p-1 shrink-0">
          {merchant.logo ? (
            <Image
              src={formatBase64Image(merchant.logo)}
              alt={merchant.brand_name || merchant.name}
              fill
              sizes="128px"
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/assets/placeholder-logo.png";
              }}
            />
          ) : (
            <div className="w-full h-full bg-primary-500 flex items-center justify-center">
              <BuildingStorefrontIcon className="w-12 h-12 text-white" />
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold text-grey-900 dark:text-white flex items-center">
            {merchant.brand_name || merchant.name}
          </h2>
          {merchant.brand_name && merchant.name !== merchant.brand_name && (
            <p className="text-grey-600 dark:text-grey-400 text-center">
              {merchant.name}
            </p>
          )}
          <StatusRenderer status={merchant.status} />
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
                value={merchant.email || "غير متوفر"}
              />
              <InfoItem
                icon={PhoneIcon}
                label="رقم الجوال"
                dir="ltr"
                value={
                  merchant.country_code && merchant.mobile
                    ? `+${merchant.country_code} ${merchant.mobile}`
                    : merchant.mobile || "غير متوفر"
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
                  <DateFormatter date={merchant.created_at} format="medium" />
                }
              />
              <InfoItem
                icon={MapPinIcon}
                label="المدينة"
                value={merchant.city || "غير متوفر"}
              />
              {merchant.iban && (
                <InfoItem
                  icon={CurrencyDollarIcon}
                  label="رقم الآيبان"
                  dir="ltr"
                  value={merchant.iban}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// مكون فرعي لعرض قسم المستندات
const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  merchant,
  showDocuments,
  toggleDocumentsSection,
  handleViewDocument,
  formatBase64Image,
}) => {
  if (
    !merchant.image_front_id_card &&
    !merchant.image_back_id_card &&
    !merchant.image_commercial_registration_or_freelance_focument
  ) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t border-grey-200 dark:border-grey-700">
      <button
        onClick={toggleDocumentsSection}
        className="flex items-center justify-between w-full text-right text-lg font-semibold text-grey-900 dark:text-white bg-grey-50 dark:bg-grey-800/50 p-3 rounded-lg hover:bg-grey-100 dark:hover:bg-grey-700/50 transition-all"
      >
        <div className="flex items-center gap-2">
          <IdentificationIcon className="w-5 h-5 text-primary-500" />
          مستندات التاجر
        </div>
        {showDocuments ? (
          <ChevronUpIcon className="w-5 h-5" />
        ) : (
          <ChevronDownIcon className="w-5 h-5" />
        )}
      </button>

      {showDocuments && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {merchant.image_front_id_card && (
            <div className="relative h-60 border border-grey-200 dark:border-grey-700 rounded-lg overflow-hidden shadow-md bg-white dark:bg-grey-800 group">
              <div className="relative h-full w-full p-2">
                <Image
                  src={formatBase64Image(merchant.image_front_id_card)}
                  alt="صورة الهوية الأمامية"
                  fill
                  sizes="300px"
                  className="object-contain p-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/assets/placeholder-logo.png";
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-black/40 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex justify-center items-center opacity-0 group-hover:opacity-100">
                <div className="flex flex-col gap-2">
                  <Button
                    variant="primary"
                    onClick={() =>
                      handleViewDocument(
                        "صورة الهوية الأمامية",
                        formatBase64Image(merchant.image_front_id_card!)
                      )
                    }
                    leftIcon={<ArrowsPointingOutIcon className="w-5 h-5" />}
                    className="w-full"
                  >
                    عرض المستند
                  </Button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-grey-800 bg-opacity-80 text-white p-2 text-center text-sm flex items-center justify-center">
                <IdentificationIcon className="w-4 h-4 ml-1" />
                صورة الهوية الأمامية
              </div>
            </div>
          )}

          {merchant.image_back_id_card && (
            <div className="relative h-60 border border-grey-200 dark:border-grey-700 rounded-lg overflow-hidden shadow-md bg-white dark:bg-grey-800 group">
              <div className="relative h-full w-full p-2">
                <Image
                  src={formatBase64Image(merchant.image_back_id_card)}
                  alt="صورة الهوية الخلفية"
                  fill
                  sizes="300px"
                  className="object-contain p-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/assets/placeholder-logo.png";
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-black/40 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex justify-center items-center opacity-0 group-hover:opacity-100">
                <div className="flex flex-col gap-2">
                  <Button
                    variant="primary"
                    onClick={() =>
                      handleViewDocument(
                        "صورة الهوية الخلفية",
                        formatBase64Image(merchant.image_back_id_card!)
                      )
                    }
                    leftIcon={<ArrowsPointingOutIcon className="w-5 h-5" />}
                    className="w-full"
                  >
                    عرض المستند
                  </Button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-grey-800 bg-opacity-80 text-white p-2 text-center text-sm flex items-center justify-center">
                <IdentificationIcon className="w-4 h-4 ml-1" />
                صورة الهوية الخلفية
              </div>
            </div>
          )}

          {merchant.image_commercial_registration_or_freelance_focument && (
            <div className="relative h-60 border border-grey-200 dark:border-grey-700 rounded-lg overflow-hidden shadow-md bg-white dark:bg-grey-800 group">
              <div className="relative h-full w-full p-2">
                <Image
                  src={formatBase64Image(
                    merchant.image_commercial_registration_or_freelance_focument
                  )}
                  alt="السجل التجاري / وثيقة العمل الحر"
                  fill
                  sizes="300px"
                  className="object-contain p-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/assets/placeholder-logo.png";
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-black/40 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex justify-center items-center opacity-0 group-hover:opacity-100">
                <div className="flex flex-col gap-2">
                  <Button
                    variant="primary"
                    onClick={() =>
                      handleViewDocument(
                        "السجل التجاري / وثيقة العمل الحر",
                        formatBase64Image(
                          merchant.image_commercial_registration_or_freelance_focument!
                        )
                      )
                    }
                    leftIcon={<ArrowsPointingOutIcon className="w-5 h-5" />}
                    className="w-full"
                  >
                    عرض المستند
                  </Button>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-grey-800 bg-opacity-80 text-white p-2 text-center text-sm flex items-center justify-center">
                <DocumentTextIcon className="w-4 h-4 ml-1" />
                السجل التجاري / وثيقة العمل الحر
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MerchantDetails = () => {
  const router = useRouter();
  const {
    merchant,
    sellers,
    transactions,
    stats,
    loading,
    error,
    confirmDelete,
    documentModal,
    showDocuments,
    handleAddSeller,
    handleEditMerchant,
    handleViewSeller,
    handleEditSeller,
    handleShowDeleteConfirm,
    handleCancelDelete,
    handleConfirmDelete,
    handleViewTransaction,
    handleViewDocument,
    handleCloseDocumentModal,
    toggleDocumentsSection,
    formatBase64Image,
  } = useMerchantDetailsView();

  // خطأ في جلب البيانات
  if (error && !loading) {
    return (
      <DashboardLayout>
        <DataListHeader
          title="تفاصيل التاجر"
          subtitle="عرض معلومات التاجر والبائعين والمعاملات"
        />
        <DashboardCard className="mt-8">
          <AlertMessage
            type="error"
            title="خطأ في جلب البيانات"
            message={error}
            actionText="العودة إلى قائمة التجار"
            onAction={() => router.push("/dashboard/merchants")}
          />
        </DashboardCard>
      </DashboardLayout>
    );
  }

  // تكوين جدول البائعين
  const sellerColumns: Column<SellerProfileRecord>[] = [
    {
      header: "الاسم",
      key: "name",
      render: (seller) => (
        <span className="font-medium text-grey-900 dark:text-white">
          {seller.name}
        </span>
      ),
      sortable: true,
    },
    {
      header: "البريد الإلكتروني",
      key: "email",
      sortable: true,
    },
    {
      header: "المدينة",
      key: "city",
      sortable: true,
    },
    {
      header: "رقم الجوال",
      key: "mobile",
      render: (seller) => (
        <span dir="ltr" className="text-grey-700 dark:text-grey-300">
          {seller.country_code != null ? `+${seller.country_code}` : ""}{" "}
          {seller.mobile}
        </span>
      ),
      sortable: true,
    },
    {
      header: "الحالة",
      key: "status",
      render: (seller) => <StatusRenderer status={seller.status} />,
      sortable: true,
    },
    {
      header: "تاريخ الإنشاء",
      key: "created_at",
      render: (seller) => (
        <DateFormatter date={seller.created_at} format="short" />
      ),
      sortable: true,
    },
    {
      header: "الإجراءات",
      key: "actions",
      render: (seller) => (
        <div className="flex items-center gap-1">
          <Button
            variant="link"
            onClick={() => handleViewSeller(seller.id)}
            title="عرض"
            aria-label={`عرض بيانات البائع ${seller.name}`}
            className="p-2 rounded-lg"
          >
            <EyeIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          </Button>

          <Button
            variant="link"
            onClick={() => handleEditSeller(seller.id)}
            title="تعديل"
            aria-label={`تعديل بيانات البائع ${seller.name}`}
            className="p-2 rounded-lg"
          >
            <PencilIcon className="h-5 w-5 text-warning-600 dark:text-warning-400" />
          </Button>

          <Button
            variant="link"
            onClick={() =>
              handleShowDeleteConfirm(seller.id, seller.name as string)
            }
            title="حذف"
            aria-label={`حذف البائع ${seller.name}`}
            className="p-2 rounded-lg"
          >
            <TrashIcon className="h-5 w-5 text-danger-600 dark:text-danger-400" />
          </Button>
        </div>
      ),
    },
  ];

  // خصائص جدول البائعين
  const sellerTableProps: TableProps<SellerProfileRecord> = {
    columns: sellerColumns,
    data: sellers as unknown as SellerProfileRecord[],
    loading,
    error: error || undefined,
    emptyMessage: "لا يوجد بائعين مسجلين لهذا التاجر",
    keyExtractor: (seller) => seller.id,
    showRowsPerPage: true,
    showSorting: true,
    showGlobalFilter: true,
    className: "border-none relative",
    onAddClick: handleAddSeller,
    addButtonLabel: "إضافة بائع جديد",
    searchInputProps: {
      placeholder: "البحث في البائعين...",
      className:
        "block w-full md:w-80 px-5 py-2.5 rounded-xl border bg-white/50 dark:bg-grey-900/50 backdrop-blur-sm placeholder-grey-400 dark:placeholder-grey-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-grey-900 dark:text-white border-grey-300/70 dark:border-grey-700/70 pr-12",
      rightIcon: <MagnifyingGlassIcon className="h-5 w-5 text-grey-400" />,
    },
  };

  // تكوين جدول المعاملات
  const transactionColumns: Column<TransactionRecord>[] = [
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
      header: "البائع",
      key: "user",
      render: (transaction) => <SellerCell user={transaction.user} />,
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

  // خصائص جدول المعاملات
  const transactionTableProps: TableProps<TransactionRecord> = {
    columns: transactionColumns,
    data: transactions as unknown as TransactionRecord[],
    loading,
    error: error || undefined,
    emptyMessage: "لا توجد معاملات لهذا التاجر",
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
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <DataListHeader
            title="تفاصيل التاجر"
            subtitle="عرض معلومات التاجر والبائعين والمعاملات"
          />

          <div className="mt-4 md:mt-0">
            <Button
              onClick={handleEditMerchant}
              variant="primary"
              leftIcon={<PencilIcon className="w-5 h-5" />}
              isLoading={loading}
            >
              تعديل التاجر
            </Button>
          </div>
        </div>

        {/* بطاقة معلومات التاجر */}
        <DashboardCard className="mb-8 p-6 shadow-lg rounded-xl">
          <div className="flex flex-col gap-6">
            <MerchantInfo
              merchant={merchant}
              loading={loading}
              formatBase64Image={formatBase64Image}
            />
            <DocumentsSection
              merchant={merchant || {}}
              showDocuments={showDocuments}
              toggleDocumentsSection={toggleDocumentsSection}
              handleViewDocument={handleViewDocument}
              formatBase64Image={formatBase64Image}
            />
          </div>
        </DashboardCard>

        {/* إحصائيات التاجر */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="إجمالي البائعين"
            value={loading ? "-" : stats.totalSellers.toString()}
            icon={<UserGroupIcon className="w-5 h-5" />}
            isLoading={loading}
          />

          <StatCard
            title="البائعين النشطين"
            value={loading ? "-" : stats.activeSellers.toString()}
            icon={<UserGroupIcon className="w-5 h-5" />}
            isLoading={loading}
          />

          <StatCard
            title="عدد المعاملات"
            value={loading ? "-" : stats.totalTransactions.toString()}
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
                  <span>{stats.totalAmount.toFixed(2)}</span>
                  <SARCurrencyIcon width={14} height={14} className="mr-1" />
                </div>
              )
            }
            icon={<CreditCardIcon className="w-5 h-5" />}
            isLoading={loading}
          />
        </div>

        {/* جدول البائعين */}
        <DashboardCard
          title="البائعين التابعين للتاجر"
          className="mb-8 shadow-lg rounded-xl overflow-visible relative p-0"
        >
          <Table {...sellerTableProps} />
        </DashboardCard>

        {/* جدول المعاملات */}
        <DashboardCard
          title="المعاملات"
          className="shadow-lg rounded-xl overflow-visible relative p-0"
        >
          <Table {...transactionTableProps} />
        </DashboardCard>

        {/* حوار تأكيد الحذف */}
        <ConfirmDialog
          isOpen={confirmDelete.isOpen}
          title="تأكيد حذف البائع"
          message={`هل أنت متأكد من حذف البائع "${confirmDelete.sellerName}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
          confirmText="نعم، حذف"
          cancelText="إلغاء"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          type="error"
        />

        {/* نافذة عرض المستندات */}
        {documentModal.isOpen && (
          <Modal
            isOpen={documentModal.isOpen}
            onClose={handleCloseDocumentModal}
            title={documentModal.title}
            size="lg"
          >
            <div className="relative w-full h-[70vh] bg-white/40 dark:bg-grey-900/40 rounded-lg border border-grey-200 dark:border-grey-700">
              {documentModal.imageUrl && (
                <Image
                  src={documentModal.imageUrl}
                  alt={documentModal.title}
                  fill
                  className="object-contain p-2"
                />
              )}
            </div>
            <div className="flex justify-center mt-4 gap-2">
              <Button
                variant="secondary"
                onClick={handleCloseDocumentModal}
                leftIcon={<XMarkIcon className="w-5 h-5" />}
              >
                إغلاق
              </Button>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MerchantDetails;
