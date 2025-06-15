import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { MerchantProfile } from '../../../types/models';
import { AccountStatus } from '../../../types/enums';
import { Button, Card, ConfirmDialog, Table } from '../../../components/ui';
import type { Column, TableProps } from '../../../components/ui/Table';
import { StatusRenderer, DateFormatter, DataListHeader, StatusMessages, LogoImage } from '@/components/dashboard';
import { useMerchantsPageLogic } from '@/hooks/dashboard/merchants/useMerchantsPageLogic';

// تعريف نوع بيانات التجار
type MerchantProfileRecord = MerchantProfile & Record<string, unknown>;

const MerchantsPage: React.FC = () => {
  const {
    merchants,
    loading,
    error,
    successMessage,
    confirmDialog,
    showDeleteConfirm,
    cancelDelete,
    handleDeleteMerchant,
    handleAddClick,
    clearError,
    clearSuccess,
    router,
  } = useMerchantsPageLogic();

  // تعريف أعمدة جدول التجار
  const columns: Column<MerchantProfileRecord>[] = [
    {
      header: 'الشعار',
      key: 'logo',
      render: (merchant) => (
        <LogoImage 
          src={merchant.logo as string} 
          alt={merchant.brand_name as string} 
        />
      ),
      className: 'w-16'
    },
    {
      header: 'الاسم',
      key: 'name',
      render: (merchant) => (
        <span className="font-medium text-grey-900 dark:text-white">
          {merchant.name}
        </span>
      ),
      sortable: true
    },
    {
      header: 'الاسم التجاري',
      key: 'brand_name',
      sortable: true
    },
    {
      header: 'البريد الإلكتروني',
      key: 'email',
      sortable: true
    },
    {
      header: 'المدينة',
      key: 'city',
      sortable: true
    },
    {
      header: 'رقم الجوال',
      key: 'mobile',
      render: (merchant) => (
        <span dir="ltr" className="text-grey-700 dark:text-grey-300">
          {merchant.country_code !== undefined || null ? `+${merchant.country_code}` : ''} {merchant.mobile}
        </span>
      ),
      sortable: true
    },
    {
      header: 'الحالة',
      key: 'status',
      render: (merchant) => <StatusRenderer status={merchant.status as AccountStatus} />,
      sortable: true
    },
    {
      header: 'تاريخ الإنشاء',
      key: 'created_at',
      render: (merchant) => <DateFormatter date={merchant.created_at as string} />,
      sortable: true
    },
    {
      header: 'الإجراءات',
      key: 'actions',
      render: (merchant) => (
        <div className="flex items-center gap-1">
          <Button 
            variant="link" 
            onClick={() => router.push(`/dashboard/merchants/${merchant.id}`)}
            title="عرض"
            aria-label={`عرض بيانات التاجر ${merchant.name}`}
            className="p-2 hover:bg-grey-100 dark:hover:bg-grey-800 rounded-lg transition-colors"
          >
            <EyeIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          </Button>
          
          <Button 
            variant="link" 
            onClick={() => router.push(`/dashboard/merchants/edit/${merchant.id}`)}
            title="تعديل"
            aria-label={`تعديل بيانات التاجر ${merchant.name}`}
            className="p-2 hover:bg-grey-100 dark:hover:bg-grey-800 rounded-lg transition-colors"
          >
            <PencilIcon className="h-5 w-5 text-warning-600 dark:text-warning-400" />
          </Button>
          
          <Button 
            variant="link" 
            onClick={() => showDeleteConfirm(merchant.id, merchant.name as string)}
            title="حذف"
            aria-label={`حذف التاجر ${merchant.name}`}
            className="p-2 hover:bg-grey-100 dark:hover:bg-grey-800 rounded-lg transition-colors"
          >
            <TrashIcon className="h-5 w-5 text-danger-600 dark:text-danger-400" />
          </Button>
        </div>
      ),
    },
  ];

  // حل مشكلة أخطاء التطابق النوعي من خلال إجبار التحويل
  const tableProps: TableProps<MerchantProfileRecord> = {
    columns,
    data: merchants as unknown as MerchantProfileRecord[],
    loading,
    error: error || undefined,
    emptyMessage: "لا يوجد تجار للعرض",
    keyExtractor: (merchant) => merchant.id,
    onRowClick: undefined,
    showRowsPerPage: true,
    showSorting: true,
    showGlobalFilter: true,
    className: "border-none relative",
    onAddClick: handleAddClick,
    addButtonLabel: "إضافة تاجر جديد",
    searchInputProps: {
      placeholder: "البحث في التجار...",
      className: "block w-full md:w-80 px-5 py-2.5 rounded-xl border bg-white/50 dark:bg-grey-900/50 backdrop-blur-sm placeholder-grey-400 dark:placeholder-grey-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-grey-900 dark:text-white border-grey-300/70 dark:border-grey-700/70 pr-12",
      rightIcon: <MagnifyingGlassIcon className="h-5 w-5 text-grey-400" />
    }
  };

  return (
    <DashboardLayout>
      {/* عنوان الصفحة */}
      <DataListHeader 
        title="إدارة التجار"
        subtitle="عرض وإضافة وتعديل وحذف حسابات التجار في النظام"
      />
      
      {/* عرض رسائل الحالة */}
      <StatusMessages 
        error={error}
        successMessage={successMessage}
        onClearError={clearError}
        onClearSuccess={clearSuccess}
      />
      
      <Card className="mb-8 shadow-lg rounded-xl overflow-visible relative" variant="default">
        {/* جدول التجار */}
        <Table {...tableProps} />
      </Card>
      
      {/* حوار تأكيد الحذف */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="تأكيد حذف التاجر"
        message={`هل أنت متأكد من حذف التاجر "${confirmDialog.merchantName}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="نعم، حذف"
        cancelText="إلغاء"
        onConfirm={handleDeleteMerchant}
        onCancel={cancelDelete}
        type="error"
      />
    </DashboardLayout>
  );
};

export default MerchantsPage; 