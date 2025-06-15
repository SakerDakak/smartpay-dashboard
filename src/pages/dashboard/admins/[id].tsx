import React from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { 
  ArrowRightIcon, 
  PencilIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CalendarIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useAdminView } from '../../../hooks/dashboard/admins/useAdminView';
import { Button, Card, Spinner, AlertMessage, StatusBadge, InfoItem } from '../../../components/ui';
import { DashboardCard, DataListHeader, DateFormatter } from '../../../components/dashboard';

const AdminViewPage: React.FC = () => {
  const { 
    admin,
    loading,
    error,
    getStatusBadgeProps,
    formatType,
    router
  } = useAdminView();

  if (loading) {
    return (
      <DashboardLayout>
        <DataListHeader 
        title="تفاصيل المشرف"
        subtitle={`عرض معلومات المشرف وتفاصيل حساب`}
      />
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" label="جاري تحميل بيانات المشرف..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error && !admin && !loading) {
    return (
      <DashboardLayout>
        <DataListHeader 
        title="تفاصيل المشرف"
        subtitle={`عرض معلومات المشرف وتفاصيل حساب`}
      />
      <DashboardCard>
          <AlertMessage
            type="error"
            title={error}
            message="لا يمكن العثور على المشرف المطلوب"
            actionText="العودة إلى قائمة المشرفين"
            actionLink="/dashboard/admins"
          />
        </DashboardCard>
      </DashboardLayout>
    );
  }

  if (!admin ) {
    // هذه الحالة قد لا تحدث إذا كان error يعالج عدم وجود المشرف، لكنها احتياطية
    return (
      <DashboardLayout>
        <DataListHeader 
        title="تفاصيل المشرف"
        subtitle={`عرض معلومات المشرف وتفاصيل حساب`}
      />
        <DashboardCard>
          <AlertMessage
            type="warning"
            title="المشرف غير موجود"
            message="لم يتم العثور على بيانات المشرف المطلوب."
            actionText="العودة إلى قائمة المشرفين"
            actionLink="/dashboard/admins"
          />
        </DashboardCard>
      </DashboardLayout>
    );
  }

  const statusProps = getStatusBadgeProps(admin.status);

  return (
    <DashboardLayout>
      <DataListHeader 
        title="تفاصيل المشرف"
        subtitle={`عرض معلومات المشرف وتفاصيل حساب ${admin.name}`}
      />
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div /> {/* Spacer */} 
        <div className="flex flex-row gap-2 sm:gap-3 mt-4">
          <Button 
            variant="secondary"
            onClick={() => router.push('/dashboard/admins')}
            leftIcon={<ArrowRightIcon className="h-5 w-5" />}
            className=""
          >
            العودة
          </Button>
          <Button 
            onClick={() => router.push(`/dashboard/admins/edit/${admin.id}`)}
            leftIcon={<PencilIcon className="h-5 w-5" />}
            className=""
          >
            تعديل المشرف
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* بطاقة المعلومات الأساسية */} 
        <Card className="lg:col-span-1" variant="outline">
          <div className="flex flex-col items-center text-center p-6">
            <div className="relative mb-5">
              <div className="w-28 h-28 bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center rounded-full border-4 border-white dark:border-grey-700/40 shadow-sm">
                <UserCircleIcon className="w-16 h-16 text-primary-500 dark:text-primary-400" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-grey-900 dark:text-white mb-2">{admin.name}</h2>
            
            <StatusBadge 
              label={statusProps.label}
              className={`${statusProps.bg} ${statusProps.color} border ${statusProps.borderColor} px-4 py-1.5 text-sm mb-4`}
            />
            
            <p className="text-grey-600 dark:text-grey-400 mb-6 text-md">
              {formatType(admin.type)}
            </p>
            
            <div className="w-full pt-6 border-t border-grey-200 dark:border-grey-700">
              <p className="text-sm text-grey-500 dark:text-grey-400 mb-1">تاريخ الانضمام</p>
              <div className="text-grey-800 dark:text-grey-300 flex items-center justify-center text-md">
                <CalendarIcon className="h-4 w-4 ml-2 opacity-70" />
                <DateFormatter date={admin.created_at} />
              </div>
            </div>
          </div>
        </Card>
        
        {/* بطاقة معلومات الاتصال */}
        <Card className="lg:col-span-2" variant="outline" title="معلومات الاتصال">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4">
            <InfoItem icon={EnvelopeIcon} label="البريد الإلكتروني" value={admin.email} />
            <InfoItem 
              icon={PhoneIcon} 
              label="رقم الجوال" 
              value={`${admin.country_code ? `+${admin.country_code} ` : ''}${admin.mobile}`}
              dir="ltr"
            />
            <InfoItem icon={MapPinIcon} label="المدينة" value={admin.city || 'غير محدد'} />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminViewPage;