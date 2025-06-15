import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { AdminProfile } from '@/types/models';
import { AccountStatus } from '@/types/enums';
import { Card, Button, Table ,ConfirmDialog} from '@/components/ui';
import type { Column, TableProps } from '@/components/ui/Table';
import { useAdminsPageLogic } from '@/hooks/dashboard/admins/useAdminsPageLogic'; 
import { DataListHeader, DateFormatter, StatusMessages, StatusRenderer } from '@/components/dashboard';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  MagnifyingGlassIcon,
  ShieldExclamationIcon
} from '@heroicons/react/24/outline';

// نوع AdminProfile يمكن استخدامه كـ Record<string, unknown>
// تم الإبقاء عليه لضمان التوافق مع نوع TableProps
type AdminProfileRecord = AdminProfile & Record<string, unknown>;

/**
 * @description صفحة إدارة المشرفين.
 * تعرض هذه الصفحة قائمة بالمشرفين وتوفر وظائف لإضافتهم، تعديلهم، حذفهم، وعرض تفاصيلهم.
 * تستخدم `useAdminsPageLogic` لفصل المنطق عن العرض.
 */
const AdminsPage: React.FC = () => {
  // استخدام الهوك للحصول على الحالات والدوال
  const {
    admins,
    loading,
    error,
    successMessage,
    confirmDialog,
    currentUserProfileId,
    handleShowDeleteConfirm,
    handleCancelDelete,
    handleConfirmDelete,
    handleNavigateToAddAdmin,
    handleNavigateToViewAdmin,
    handleNavigateToEditAdmin,
    clearError,
    clearSuccess,
  } = useAdminsPageLogic();

  // تعريف أعمدة جدول المشرفين
  const columns: Column<AdminProfileRecord>[] = [
    {
      header: 'الاسم',
      key: 'name',
      render: (admin) => (
        <span className="font-medium text-grey-900 dark:text-white">
          {admin.name}
          {currentUserProfileId && admin.id === currentUserProfileId && (
            <span className="inline-flex items-center justify-center mx-2 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400 rounded-full px-2.5 py-0.5 pt-1">
              أنت
            </span>
          )}
        </span>
      ),
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
      render: (admin) => (
        <span dir="ltr" className="text-grey-700 dark:text-grey-300">
          {admin.country_code != null ? `+${admin.country_code}` : ''} {admin.mobile}
        </span>
      ),
      sortable: true
    },
    {
      header: 'الحالة',
      key: 'status',
      render: (admin) => <StatusRenderer status={admin.status as AccountStatus} />,
      sortable: true
    },
    {
      header: 'تاريخ الإنشاء',
      key: 'created_at',
      render: (admin) => <DateFormatter date={admin.created_at as string} />,
      sortable: true
    },
    {
      header: 'الإجراءات',
      key: 'actions',
      render: (admin) => (
        <div className="flex items-center gap-1">
          <Button  
            variant="link"
            onClick={() => handleNavigateToViewAdmin(admin.id)}
            title="عرض"
            aria-label={`عرض بيانات المشرف ${admin.name}`}
            className="p-2 rounded-lg "
          >
            <EyeIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          </Button>
          
          <Button 
            variant="link"
            onClick={() => handleNavigateToEditAdmin(admin.id)}
            title="تعديل"
            aria-label={`تعديل بيانات المشرف ${admin.name}`}
            className="p-2 rounded-lg "
          >
            <PencilIcon className="h-5 w-5 text-warning-600 dark:text-warning-400" />
          </Button>
          
          {currentUserProfileId && admin.id === currentUserProfileId ? (
            <Button 
              variant="link"
              disabled={true}
              title="لا يمكن حذف المشرف الحالي"
              aria-label="لا يمكن حذف المشرف الحالي"
              className="p-2 rounded-lg "
            >
              <ShieldExclamationIcon className="h-5 w-5 text-grey-400" />
            </Button>
          ) : (
            <Button 
              variant="link"
              onClick={() => handleShowDeleteConfirm(admin.id, admin.name as string)}
              title="حذف"
              aria-label={`حذف المشرف ${admin.name}`}
              className="p-2 rounded-lg "
            >
              <TrashIcon className="h-5 w-5 text-danger-600 dark:text-danger-400" />
            </Button>
          )}
        </div>
      )
    }
  ];

  // خصائص الجدول
  // تم استخدام admins as unknown as AdminProfileRecord[] للحفاظ على التوافق النوعي مع TableProps
  const tableProps: TableProps<AdminProfileRecord> = {
    columns,
    data: admins as unknown as AdminProfileRecord[],
    loading,
    error: error || undefined,
    emptyMessage: "لا يوجد مشرفين للعرض",
    keyExtractor: (admin) => admin.id,
    onRowClick: undefined, // يمكن تحديد دالة هنا إذا أردنا سلوكًا عند النقر على الصف
    showRowsPerPage: true,
    showSorting: true,
    showGlobalFilter: true,
    className: "border-none relative",
    onAddClick: handleNavigateToAddAdmin, // استخدام الدالة من الهوك
    addButtonLabel: "إضافة مشرف جديد",
    searchInputProps: {
      placeholder: "البحث في المشرفين...",
      className: "block w-full md:w-80 px-5 py-2.5 rounded-xl border bg-white/50 dark:bg-grey-900/50 backdrop-blur-sm placeholder-grey-400 dark:placeholder-grey-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-grey-900 dark:text-white border-grey-300/70 dark:border-grey-700/70 pr-12",
      rightIcon: <MagnifyingGlassIcon className="h-5 w-5 text-grey-400" />
    }
  };

  return (
    <DashboardLayout>
      <DataListHeader 
        title="إدارة المشرفين"
        subtitle="عرض وإضافة وتعديل وحذف حسابات المشرفين في النظام"
      />
      
      {/* عرض رسائل الحالة */}
      <StatusMessages 
        error={error}
        successMessage={successMessage}
        onClearError={clearError}
        onClearSuccess={clearSuccess}
      />

      <Card className="mb-8 shadow-lg rounded-xl overflow-visible relative" variant="default">
        {/* جدول المشرفين */}
        <Table {...tableProps} />
      </Card>
      
      {/* حوار تأكيد الحذف */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="تأكيد حذف المشرف"
        message={`هل أنت متأكد من حذف المشرف "${confirmDialog.adminName}"؟ هذا الإجراء لا يمكن التراجع عنه.`}
        confirmText="نعم، حذف"
        cancelText="إلغاء"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        type="error"
      />
    </DashboardLayout>
  );
};

export default AdminsPage; 