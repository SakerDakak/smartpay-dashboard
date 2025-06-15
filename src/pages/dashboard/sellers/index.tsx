import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { SellerProfile } from "@/types/models";
import { AccountStatus } from "@/types/enums";
import { Card, Button, Table, ConfirmDialog } from "@/components/ui";
import type { Column, TableProps } from "@/components/ui/Table";
import { useSellersPageLogic } from "@/hooks/dashboard/sellers/useSellersPageLogic";
import {
  DataListHeader,
  DateFormatter,
  StatusMessages,
  StatusRenderer,
} from "@/components/dashboard";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { MerchantCell } from "@/components/dashboard/MerchantCell";

// نوع SellerProfile يمكن استخدامه كـ Record<string, unknown>
// تم الإبقاء عليه لضمان التوافق مع نوع TableProps
type SellerProfileRecord = SellerProfile & Record<string, unknown>;

/**
 * @description صفحة إدارة البائعين.
 * تعرض هذه الصفحة قائمة بالبائعين وتوفر وظائف لإضافتهم، تعديلهم، حذفهم، وعرض تفاصيلهم.
 * تستخدم `useSellersPageLogic` لفصل المنطق عن العرض.
 */
const SellersPage: React.FC = () => {
  // استخدام الهوك للحصول على الحالات والدوال
  const {
    sellers,
    loading,
    error,
    successMessage,
    confirmDialog,
    handleShowDeleteConfirm,
    handleCancelDelete,
    handleConfirmDelete,
    handleNavigateToAddSeller,
    handleNavigateToViewSeller,
    handleNavigateToEditSeller,
    clearError,
    clearSuccess,
  } = useSellersPageLogic();

  // تعريف أعمدة جدول البائعين
  const columns: Column<SellerProfileRecord>[] = [
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
      header: "التاجر",
      key: "merchant_id",
      render: (seller) => <MerchantCell merchantId={seller.merchant_id} />,
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
      render: (seller) => (
        <StatusRenderer status={seller.status as AccountStatus} />
      ),
      sortable: true,
    },
    {
      header: "تاريخ الإنشاء",
      key: "created_at",
      render: (seller) => <DateFormatter date={seller.created_at as string} />,
      sortable: true,
    },
    {
      header: "الإجراءات",
      key: "actions",
      render: (seller) => (
        <div className="flex items-center gap-1">
          <Button
            variant="link"
            onClick={() => handleNavigateToViewSeller(seller.id)}
            title="عرض"
            aria-label={`عرض بيانات البائع ${seller.name}`}
            className="p-2 rounded-lg "
          >
            <EyeIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          </Button>

          <Button
            variant="link"
            onClick={() => handleNavigateToEditSeller(seller.id)}
            title="تعديل"
            aria-label={`تعديل بيانات البائع ${seller.name}`}
            className="p-2 rounded-lg "
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
            className="p-2 rounded-lg "
            disabled={loading}
          >
            <TrashIcon className="h-5 w-5 text-danger-600 dark:text-danger-400" />
          </Button>
        </div>
      ),
    },
  ];

  // خصائص الجدول
  // تم استخدام sellers as unknown as SellerProfileRecord[] للحفاظ على التوافق النوعي مع TableProps
  const tableProps: TableProps<SellerProfileRecord> = {
    columns,
    data: sellers as unknown as SellerProfileRecord[],
    loading,
    error: error || undefined,
    emptyMessage: "لا يوجد بائعين للعرض",
    keyExtractor: (seller) => seller.id,
    onRowClick: undefined, // يمكن تحديد دالة هنا إذا أردنا سلوكًا عند النقر على الصف
    showRowsPerPage: true,
    showSorting: true,
    showGlobalFilter: true,
    className: "border-none relative",
    onAddClick: handleNavigateToAddSeller, // استخدام الدالة من الهوك
    addButtonLabel: "إضافة بائع جديد",
    searchInputProps: {
      placeholder: "البحث في البائعين...",
      className:
        "block w-full md:w-80 px-5 py-2.5 rounded-xl border bg-white/50 dark:bg-grey-900/50 backdrop-blur-sm placeholder-grey-400 dark:placeholder-grey-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-grey-900 dark:text-white border-grey-300/70 dark:border-grey-700/70 pr-12",
      rightIcon: <MagnifyingGlassIcon className="h-5 w-5 text-grey-400" />,
    },
  };

  return (
    <DashboardLayout>
      <DataListHeader
        title="إدارة البائعين"
        subtitle="عرض وإضافة وتعديل وحذف حسابات البائعين في النظام"
      />

      {/* عرض رسائل الحالة */}
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
        {/* جدول البائعين */}
        <Table {...tableProps} />
      </Card>

      {/* حوار تأكيد الحذف */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="تأكيد حذف البائع"
        message={`هل أنت متأكد من حذف البائع "${confirmDialog.sellerName}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="نعم، حذف"
        cancelText="إلغاء"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        type="error"
      />
    </DashboardLayout>
  );
};

export default SellersPage;
