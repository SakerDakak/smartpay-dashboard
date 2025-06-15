import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import {
  CalendarIcon,
  CreditCardIcon,
  HashtagIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  TagIcon,
  DevicePhoneMobileIcon,
  WifiIcon,
  CubeIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  ArrowTopRightOnSquareIcon,
  EnvelopeIcon,
  BuildingOffice2Icon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import {
  DashboardCard,
  DataListHeader,
  DateFormatter,
} from "@/components/dashboard";
import { AlertMessage, Spinner, Button, InfoItem } from "@/components/ui";
import {
  translateTransactionStatus,
  translateTransactionType,
} from "@/utils/translations";
import Image from "next/image";
import { useTransactionView } from "@/hooks/dashboard/transactions/useTransactionView";
import StatusMessage from "@/components/ui/StatusMessage";

const TransactionViewPage: React.FC = () => {
  const {
    router,
    id,
    transaction,
    merchantProfile,
    sellerProfile,
    loading,
    error,
    merchantError,
    sellerError,
    displayAmount,
    displayCurrency,
    displayStatus,
    displayType,
    displayMerchantId,
    displaySellerIdFromTx,
  } = useTransactionView();

  const renderStatusBadge = (status?: string) => {
    if (!status) return null;
    const statusText = translateTransactionStatus(status);
    let colorClasses =
      "bg-grey-100 text-grey-700 dark:bg-grey-700/30 dark:text-grey-400";
    if (
      status.toLowerCase() === "succeeded" ||
      status.toLowerCase() === "success" ||
      status.toLowerCase() === "accepted" ||
      status.toLowerCase() === "approved"
    ) {
      colorClasses =
        "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400";
    } else if (status.toLowerCase() === "declined by issuing bank") {
      colorClasses =
        "bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400";
    }
    return (
      <span
        className={`px-3 py-1.5 text-sm rounded-full font-medium ${colorClasses}`}
      >
        {statusText}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DataListHeader title="تفاصيل المعاملة" subtitle={`المعرف: ${id}`} />
        <DashboardCard>
          <AlertMessage
            type="error"
            title={error}
            message="لم نتمكن من تحميل تفاصيل المعاملة."
            actionText="العودة إلى قائمة المعاملات"
            actionLink="/dashboard/transactions"
          />
        </DashboardCard>
      </DashboardLayout>
    );
  }

  if (!transaction) {
    return (
      <DashboardLayout>
        <DataListHeader title="تفاصيل المعاملة" subtitle={`المعرف: ${id}`} />
        <AlertMessage
          type="info"
          title="المعاملة غير موجودة"
          message="لم يتم العثور على المعاملة المطلوبة."
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DataListHeader
        title="تفاصيل المعاملة"
        subtitle={`معرف المعاملة: ${transaction.id}`}
      />

      {/* شبكة مرنة تستجيب لمختلف أحجام الشاشة */}
      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 gap-6">
        {/* كرت معلومات المعاملة الأساسية */}
        <DashboardCard
          className="col-span-1"
          title="المعلومات الأساسية للمعاملة"
        >
          <div className="space-y-3">
            <div className="flex flex-col items-center text-center pb-4 border-b border-grey-200 dark:border-grey-700 mb-3">
              <div
                className={`mb-2 ${
                  displayStatus.toLowerCase().includes("success") ||
                  displayStatus.toLowerCase().includes("approved")
                    ? "text-success-500"
                    : displayStatus
                        .toLowerCase()
                        .includes("declined by issuing bank")
                    ? "text-danger-500"
                    : "text-grey-500"
                }`}
              >
                {displayStatus.toLowerCase().includes("success") ||
                displayStatus.toLowerCase().includes("approved") ? (
                  <ShieldCheckIcon className="w-16 h-16" />
                ) : displayStatus
                    .toLowerCase()
                    .includes("declined by issuing bank") ? (
                  <XCircleIcon className="w-16 h-16" />
                ) : (
                  <HashtagIcon className="w-16 h-16" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-grey-900 dark:text-white mb-3 flex items-center justify-center">
                <span className="ml-2 text-3xl">{displayAmount}</span>
                {displayCurrency === "SAR" ? (
                  <Image
                    src="/assets/sar.svg"
                    alt="SAR"
                    width={28}
                    height={28}
                    className="h-7 w-7 inline-block dark:invert"
                  />
                ) : (
                  <span>{displayCurrency}</span>
                )}
              </h2>
              {renderStatusBadge(displayStatus)}
              {(transaction?.qr_url ||
                (transaction?.receipts &&
                  transaction.receipts[0]?.qr_code)) && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() =>
                    window.open(
                      transaction.receipts?.[0]?.qr_code || "",
                      "_blank"
                    )
                  }
                  className="mt-3"
                  rightIcon={<ArrowTopRightOnSquareIcon className="h-4 w-4" />}
                >
                  عرض فاتورة المعاملة
                </Button>
              )}
            </div>
            {/* في الشاشات بين 1024-1228 ستظهر العناصر في عمودين بجانب بعض */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-x-4 gap-y-3">
              <InfoItem
                icon={TagIcon}
                label="نوع المعاملة"
                value={translateTransactionType(displayType)}
              />
              {transaction?.card_brand && (
                <InfoItem
                  icon={CreditCardIcon}
                  label="العلامة التجارية للبطاقة"
                  value={transaction.card_brand}
                />
              )}
              {transaction.last_four_digits && (
                <InfoItem
                  icon={CreditCardIcon}
                  label="آخر 4 أرقام"
                  value={`**** **** **** ${transaction.last_four_digits}`}
                  dir="ltr"
                />
              )}
              <InfoItem icon={CalendarIcon} label="تاريخ إنشاء المعاملة">
                <DateFormatter date={transaction.created_at} format="medium" />
              </InfoItem>
            </div>
          </div>
        </DashboardCard>

        {/* كروت التاجر والبائع في وضع xl */}
        <DashboardCard
          className="col-span-1 hidden xl:block"
          title="بيانات التاجر"
        >
          <div className="space-y-2">
            {merchantProfile ? (
              <>
                <div className="flex flex-col items-center text-center pb-5 border-b border-grey-200 dark:border-grey-700 mb-3">
                  {merchantProfile.logo ? (
                    <Image
                      src={
                        merchantProfile.logo.startsWith("data:image")
                          ? merchantProfile.logo
                          : `data:image/png;base64,${merchantProfile.logo}`
                      }
                      alt={merchantProfile.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full mb-3 object-cover shadow-md"
                    />
                  ) : (
                    <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-4 mb-3">
                      <BuildingStorefrontIcon className="w-12 h-12 text-primary-500 dark:text-primary-400" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-grey-900 dark:text-white mb-1">
                    {merchantProfile.name}
                  </h3>
                  <p className="text-grey-500 dark:text-grey-400 mb-3">
                    {merchantProfile.email || merchantProfile.mobile || ""}
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() =>
                      router.push(`/dashboard/merchants/${merchantProfile.id}`)
                    }
                    rightIcon={
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    }
                  >
                    عرض صفحة التاجر
                  </Button>
                </div>
                <InfoItem
                  icon={UserCircleIcon}
                  label="معرف التاجر"
                  value={merchantProfile.id}
                />
                {merchantProfile.email && (
                  <InfoItem
                    icon={EnvelopeIcon}
                    label="البريد الإلكتروني"
                    value={merchantProfile.email}
                  />
                )}
                {merchantProfile.mobile && (
                  <InfoItem
                    icon={DevicePhoneMobileIcon}
                    label="رقم الجوال"
                    value={`${
                      merchantProfile.country_code != undefined || null
                        ? "+" + merchantProfile.country_code
                        : ""
                    } ${merchantProfile.mobile}`}
                    dir="ltr"
                  />
                )}
                {merchantProfile.city && (
                  <InfoItem
                    icon={BuildingOffice2Icon}
                    label="المدينة"
                    value={merchantProfile.city}
                  />
                )}
              </>
            ) : (
              <>
                <div className="flex flex-col items-center text-center pb-5 pt-7 border-b border-grey-200 dark:border-grey-700 mb-3">
                  <div className="bg-warning-100 dark:bg-warning-900/30 rounded-full p-4 mb-3">
                    <BuildingStorefrontIcon className="w-12 h-12 text-warning-500 dark:text-warning-400" />
                  </div>
                  <h3 className="text-xl font-bold text-grey-900 dark:text-white mb-1">
                    {transaction?.merchant?.name || "اسم التاجر غير متوفر"}
                  </h3>
                  <p className="text-grey-500 dark:text-grey-400 mb-3">
                    {transaction?.merchant &&
                    "email" in transaction.merchant &&
                    typeof transaction.merchant.email === "string" ? (
                      transaction.merchant.email
                    ) : transaction?.merchant &&
                      "mobile" in transaction.merchant &&
                      typeof transaction.merchant.mobile === "string" ? (
                      transaction.merchant.mobile
                    ) : (
                      <span className="my-8 hidden lg:inline text-transparent">
                        -
                      </span>
                    )}
                  </p>
                </div>
                <InfoItem
                  icon={UserCircleIcon}
                  label="معرف التاجر"
                  value={
                    displayMerchantId !== "N/A"
                      ? displayMerchantId
                      : "غير متوفر"
                  }
                />
                {transaction?.merchant &&
                  "email" in transaction.merchant &&
                  typeof transaction.merchant.email === "string" && (
                    <InfoItem
                      icon={EnvelopeIcon}
                      label="البريد الإلكتروني"
                      value={transaction.merchant.email}
                    />
                  )}
                {transaction?.merchant &&
                  "mobile" in transaction.merchant &&
                  typeof transaction.merchant.mobile === "string" && (
                    <InfoItem
                      icon={DevicePhoneMobileIcon}
                      label="رقم الجوال"
                      value={transaction.merchant.mobile}
                      dir="ltr"
                    />
                  )}
                {transaction?.merchant &&
                  "city" in transaction.merchant &&
                  typeof transaction.merchant.city === "string" && (
                    <InfoItem
                      icon={BuildingOffice2Icon}
                      label="المدينة"
                      value={transaction.merchant.city}
                    />
                  )}
                <StatusMessage
                  type="warning"
                  message={
                    merchantError ||
                    "قد يكون هذا التاجر قد تم حذفه من النظام أو لم يتم تسجيله بعد."
                  }
                  className="mt-2 lg:mt-46"
                />
              </>
            )}
          </div>
        </DashboardCard>

        <DashboardCard
          className="col-span-1 hidden xl:block"
          title="بيانات البائع"
        >
          <div className="space-y-2">
            {sellerProfile ? (
              <>
                <div className="flex flex-col items-center text-center pb-5 border-b border-grey-200 dark:border-grey-700 mb-3">
                  <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-4 mb-3">
                    <TruckIcon className="w-12 h-12 text-primary-500 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-bold text-grey-900 dark:text-white mb-1">
                    {sellerProfile.name}
                  </h3>
                  <p className="text-grey-500 dark:text-grey-400 mb-3">
                    {sellerProfile.email || sellerProfile.mobile || ""}
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() =>
                      router.push(`/dashboard/sellers/${sellerProfile.id}`)
                    }
                    rightIcon={
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    }
                  >
                    عرض صفحة البائع
                  </Button>
                </div>
                <InfoItem
                  icon={UserCircleIcon}
                  label="معرف البائع"
                  value={sellerProfile.id}
                />
                {sellerProfile.email && (
                  <InfoItem
                    icon={EnvelopeIcon}
                    label="البريد الإلكتروني"
                    value={sellerProfile.email}
                  />
                )}
                {sellerProfile.mobile && (
                  <InfoItem
                    icon={DevicePhoneMobileIcon}
                    label="رقم الجوال"
                    value={`${
                      sellerProfile.country_code != undefined || null
                        ? "+" + sellerProfile.country_code
                        : ""
                    } ${sellerProfile.mobile}`}
                    dir="ltr"
                  />
                )}
                {sellerProfile.city && (
                  <InfoItem
                    icon={BuildingOffice2Icon}
                    label="المدينة"
                    value={sellerProfile.city}
                  />
                )}
              </>
            ) : (
              <>
                <div className="flex flex-col items-center text-center pb-5 pt-7 border-b border-grey-200 dark:border-grey-700 mb-3">
                  <div className="bg-warning-100 dark:bg-warning-900/30 rounded-full p-4 mb-3">
                    <TruckIcon className="w-12 h-12 text-warning-500 dark:text-warning-400" />
                  </div>
                  <h3 className="text-xl font-bold text-grey-900 dark:text-white mb-1">
                    {transaction?.user?.name || "اسم البائع غير متوفر"}
                  </h3>
                  <p className="text-grey-500 dark:text-grey-400 mb-3">
                    {transaction?.user?.email ||
                      transaction?.user?.mobile ||
                      ""}
                  </p>
                </div>
                <InfoItem
                  icon={UserCircleIcon}
                  label="معرف البائع"
                  value={
                    displaySellerIdFromTx !== "N/A"
                      ? displaySellerIdFromTx
                      : "غير متوفر"
                  }
                />
                {transaction?.user?.email && (
                  <InfoItem
                    icon={InformationCircleIcon}
                    label="البريد الإلكتروني"
                    value={transaction.user.email}
                  />
                )}
                {transaction?.user?.mobile && (
                  <InfoItem
                    icon={DevicePhoneMobileIcon}
                    label="رقم الجوال"
                    value={transaction.user.mobile}
                    dir="ltr"
                  />
                )}
                <StatusMessage
                  type="warning"
                  message={
                    sellerError ||
                    "قد يكون هذا البائع قد تم حذفه من النظام أو لم يتم تسجيله بعد."
                  }
                  className="mt-2 lg:mt-7"
                />
              </>
            )}
          </div>
        </DashboardCard>

        {/* حاوية للكرتين في وضع lg فقط (بين 1024-1228 بكسل) */}
        <div className="hidden lg:block xl:hidden col-span-1">
          <div className="grid grid-cols-2 gap-6">
            <DashboardCard className="col-span-1" title="بيانات التاجر">
              <div className="space-y-2">
                {merchantProfile ? (
                  <>
                    <div className="flex flex-col items-center text-center pb-5 border-b border-grey-200 dark:border-grey-700 mb-3">
                      {merchantProfile.logo ? (
                        <Image
                          src={
                            merchantProfile.logo.startsWith("data:image")
                              ? merchantProfile.logo
                              : `data:image/png;base64,${merchantProfile.logo}`
                          }
                          alt={merchantProfile.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-full mb-3 object-cover shadow-md"
                        />
                      ) : (
                        <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-4 mb-3">
                          <BuildingStorefrontIcon className="w-12 h-12 text-primary-500 dark:text-primary-400" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-grey-900 dark:text-white mb-1">
                        {merchantProfile.name}
                      </h3>
                      <p className="text-grey-500 dark:text-grey-400 mb-3">
                        {merchantProfile.email || merchantProfile.mobile || ""}
                      </p>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() =>
                          router.push(
                            `/dashboard/merchants/${merchantProfile.id}`
                          )
                        }
                        rightIcon={
                          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        }
                      >
                        عرض صفحة التاجر
                      </Button>
                    </div>
                    <InfoItem
                      icon={UserCircleIcon}
                      label="معرف التاجر"
                      value={merchantProfile.id}
                    />
                    {merchantProfile.email && (
                      <InfoItem
                        icon={EnvelopeIcon}
                        label="البريد الإلكتروني"
                        value={merchantProfile.email}
                      />
                    )}
                    {merchantProfile.mobile && (
                      <InfoItem
                        icon={DevicePhoneMobileIcon}
                        label="رقم الجوال"
                        value={`${
                          merchantProfile.country_code != undefined || null
                            ? "+" + merchantProfile.country_code
                            : ""
                        } ${merchantProfile.mobile}`}
                        dir="ltr"
                      />
                    )}
                    {merchantProfile.city && (
                      <InfoItem
                        icon={BuildingOffice2Icon}
                        label="المدينة"
                        value={merchantProfile.city}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center text-center pb-5 pt-7 border-b border-grey-200 dark:border-grey-700 mb-3">
                      <div className="bg-warning-100 dark:bg-warning-900/30 rounded-full p-4 mb-3">
                        <BuildingStorefrontIcon className="w-12 h-12 text-warning-500 dark:text-warning-400" />
                      </div>
                      <h3 className="text-xl font-bold text-grey-900 dark:text-white mb-1">
                        {transaction?.merchant?.name || "اسم التاجر غير متوفر"}
                      </h3>
                      <p className="text-grey-500 dark:text-grey-400 mb-3">
                        {transaction?.merchant &&
                        "email" in transaction.merchant &&
                        typeof transaction.merchant.email === "string" ? (
                          transaction.merchant.email
                        ) : transaction?.merchant &&
                          "mobile" in transaction.merchant &&
                          typeof transaction.merchant.mobile === "string" ? (
                          transaction.merchant.mobile
                        ) : (
                          <span className="my-8 hidden lg:inline text-transparent">
                            -
                          </span>
                        )}
                      </p>
                    </div>
                    <InfoItem
                      icon={UserCircleIcon}
                      label="معرف التاجر"
                      value={
                        displayMerchantId !== "N/A"
                          ? displayMerchantId
                          : "غير متوفر"
                      }
                    />
                    {transaction?.merchant &&
                      "email" in transaction.merchant &&
                      typeof transaction.merchant.email === "string" && (
                        <InfoItem
                          icon={EnvelopeIcon}
                          label="البريد الإلكتروني"
                          value={transaction.merchant.email}
                        />
                      )}
                    {transaction?.merchant &&
                      "mobile" in transaction.merchant &&
                      typeof transaction.merchant.mobile === "string" && (
                        <InfoItem
                          icon={DevicePhoneMobileIcon}
                          label="رقم الجوال"
                          value={transaction.merchant.mobile}
                          dir="ltr"
                        />
                      )}
                    {transaction?.merchant &&
                      "city" in transaction.merchant &&
                      typeof transaction.merchant.city === "string" && (
                        <InfoItem
                          icon={BuildingOffice2Icon}
                          label="المدينة"
                          value={transaction.merchant.city}
                        />
                      )}
                    <StatusMessage
                      type="warning"
                      message={
                        merchantError ||
                        "قد يكون هذا التاجر قد تم حذفه من النظام أو لم يتم تسجيله بعد."
                      }
                      className="mt-2 lg:mt-46"
                    />
                  </>
                )}
              </div>
            </DashboardCard>

            <DashboardCard className="col-span-1" title="بيانات البائع">
              <div className="space-y-2">
                {sellerProfile ? (
                  <>
                    <div className="flex flex-col items-center text-center pb-5 border-b border-grey-200 dark:border-grey-700 mb-3">
                      <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-4 mb-3">
                        <TruckIcon className="w-12 h-12 text-primary-500 dark:text-primary-400" />
                      </div>
                      <h3 className="text-xl font-bold text-grey-900 dark:text-white mb-1">
                        {sellerProfile.name}
                      </h3>
                      <p className="text-grey-500 dark:text-grey-400 mb-3">
                        {sellerProfile.email || sellerProfile.mobile || ""}
                      </p>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() =>
                          router.push(`/dashboard/sellers/${sellerProfile.id}`)
                        }
                        rightIcon={
                          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        }
                      >
                        عرض صفحة البائع
                      </Button>
                    </div>
                    <InfoItem
                      icon={UserCircleIcon}
                      label="معرف البائع"
                      value={sellerProfile.id}
                    />
                    {sellerProfile.email && (
                      <InfoItem
                        icon={EnvelopeIcon}
                        label="البريد الإلكتروني"
                        value={sellerProfile.email}
                      />
                    )}
                    {sellerProfile.mobile && (
                      <InfoItem
                        icon={DevicePhoneMobileIcon}
                        label="رقم الجوال"
                        value={`${
                          sellerProfile.country_code != undefined || null
                            ? "+" + sellerProfile.country_code
                            : ""
                        } ${sellerProfile.mobile}`}
                        dir="ltr"
                      />
                    )}
                    {sellerProfile.city && (
                      <InfoItem
                        icon={BuildingOffice2Icon}
                        label="المدينة"
                        value={sellerProfile.city}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center text-center pb-5 pt-7 border-b border-grey-200 dark:border-grey-700 mb-3">
                      <div className="bg-warning-100 dark:bg-warning-900/30 rounded-full p-4 mb-3">
                        <TruckIcon className="w-12 h-12 text-warning-500 dark:text-warning-400" />
                      </div>
                      <h3 className="text-xl font-bold text-grey-900 dark:text-white mb-1">
                        {transaction?.user?.name || "اسم البائع غير متوفر"}
                      </h3>
                      <p className="text-grey-500 dark:text-grey-400 mb-3">
                        {transaction?.user?.email ||
                          transaction?.user?.mobile ||
                          ""}
                      </p>
                    </div>
                    <InfoItem
                      icon={UserCircleIcon}
                      label="معرف البائع"
                      value={
                        displaySellerIdFromTx !== "N/A"
                          ? displaySellerIdFromTx
                          : "غير متوفر"
                      }
                    />
                    {transaction?.user?.email && (
                      <InfoItem
                        icon={InformationCircleIcon}
                        label="البريد الإلكتروني"
                        value={transaction.user.email}
                      />
                    )}
                    {transaction?.user?.mobile && (
                      <InfoItem
                        icon={DevicePhoneMobileIcon}
                        label="رقم الجوال"
                        value={transaction.user.mobile}
                        dir="ltr"
                      />
                    )}
                    <StatusMessage
                      type="warning"
                      message={
                        sellerError ||
                        "قد يكون هذا البائع قد تم حذفه من النظام أو لم يتم تسجيله بعد."
                      }
                      className="mt-2 lg:mt-7"
                    />
                  </>
                )}
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* حاوية للكرتين للشاشات الصغيرة والمتوسطة (أقل من 1024 بكسل) */}
        <div className="block lg:hidden col-span-1">
          <div className="grid grid-cols-1 gap-6">
            <DashboardCard className="col-span-1" title="بيانات التاجر">
              <div className="space-y-2">
                {merchantProfile ? (
                  <>
                    <div className="flex flex-col items-center text-center pb-5 border-b border-grey-200 dark:border-grey-700 mb-3">
                      {merchantProfile.logo ? (
                        <Image
                          src={
                            merchantProfile.logo.startsWith("data:image")
                              ? merchantProfile.logo
                              : `data:image/png;base64,${merchantProfile.logo}`
                          }
                          alt={merchantProfile.name}
                          width={80}
                          height={80}
                          className="w-20 h-20 rounded-full mb-3 object-cover shadow-md"
                        />
                      ) : (
                        <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-4 mb-3">
                          <BuildingStorefrontIcon className="w-12 h-12 text-primary-500 dark:text-primary-400" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-grey-900 dark:text-white mb-1">
                        {merchantProfile.name}
                      </h3>
                      <p className="text-grey-500 dark:text-grey-400 mb-3">
                        {merchantProfile.email || merchantProfile.mobile || ""}
                      </p>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() =>
                          router.push(
                            `/dashboard/merchants/${merchantProfile.id}`
                          )
                        }
                        rightIcon={
                          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        }
                      >
                        عرض صفحة التاجر
                      </Button>
                    </div>
                    <InfoItem
                      icon={UserCircleIcon}
                      label="معرف التاجر"
                      value={merchantProfile.id}
                    />
                    {merchantProfile.email && (
                      <InfoItem
                        icon={EnvelopeIcon}
                        label="البريد الإلكتروني"
                        value={merchantProfile.email}
                      />
                    )}
                    {merchantProfile.mobile && (
                      <InfoItem
                        icon={DevicePhoneMobileIcon}
                        label="رقم الجوال"
                        value={`${
                          merchantProfile.country_code != undefined || null
                            ? "+" + merchantProfile.country_code
                            : ""
                        } ${merchantProfile.mobile}`}
                        dir="ltr"
                      />
                    )}
                    {merchantProfile.city && (
                      <InfoItem
                        icon={BuildingOffice2Icon}
                        label="المدينة"
                        value={merchantProfile.city}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center text-center pb-5 pt-7 border-b border-grey-200 dark:border-grey-700 mb-3">
                      <div className="bg-warning-100 dark:bg-warning-900/30 rounded-full p-4 mb-3">
                        <BuildingStorefrontIcon className="w-12 h-12 text-warning-500 dark:text-warning-400" />
                      </div>
                      <h3 className="text-xl font-bold text-grey-900 dark:text-white mb-1">
                        {transaction?.merchant?.name || "اسم التاجر غير متوفر"}
                      </h3>
                      <p className="text-grey-500 dark:text-grey-400 mb-3">
                        {transaction?.merchant &&
                        "email" in transaction.merchant &&
                        typeof transaction.merchant.email === "string" ? (
                          transaction.merchant.email
                        ) : transaction?.merchant &&
                          "mobile" in transaction.merchant &&
                          typeof transaction.merchant.mobile === "string" ? (
                          transaction.merchant.mobile
                        ) : (
                          <span className="my-8 hidden lg:inline text-transparent">
                            -
                          </span>
                        )}
                      </p>
                    </div>
                    <InfoItem
                      icon={UserCircleIcon}
                      label="معرف التاجر"
                      value={
                        displayMerchantId !== "N/A"
                          ? displayMerchantId
                          : "غير متوفر"
                      }
                    />
                    {transaction?.merchant &&
                      "email" in transaction.merchant &&
                      typeof transaction.merchant.email === "string" && (
                        <InfoItem
                          icon={EnvelopeIcon}
                          label="البريد الإلكتروني"
                          value={transaction.merchant.email}
                        />
                      )}
                    {transaction?.merchant &&
                      "mobile" in transaction.merchant &&
                      typeof transaction.merchant.mobile === "string" && (
                        <InfoItem
                          icon={DevicePhoneMobileIcon}
                          label="رقم الجوال"
                          value={transaction.merchant.mobile}
                          dir="ltr"
                        />
                      )}
                    {transaction?.merchant &&
                      "city" in transaction.merchant &&
                      typeof transaction.merchant.city === "string" && (
                        <InfoItem
                          icon={BuildingOffice2Icon}
                          label="المدينة"
                          value={transaction.merchant.city}
                        />
                      )}
                    <StatusMessage
                      type="warning"
                      message={
                        merchantError ||
                        "قد يكون هذا التاجر قد تم حذفه من النظام أو لم يتم تسجيله بعد."
                      }
                      className="mt-2 lg:mt-46"
                    />
                  </>
                )}
              </div>
            </DashboardCard>

            <DashboardCard className="col-span-1" title="بيانات البائع">
              <div className="space-y-2">
                {sellerProfile ? (
                  <>
                    <div className="flex flex-col items-center text-center pb-5 border-b border-grey-200 dark:border-grey-700 mb-3">
                      <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full p-4 mb-3">
                        <TruckIcon className="w-12 h-12 text-primary-500 dark:text-primary-400" />
                      </div>
                      <h3 className="text-xl font-bold text-grey-900 dark:text-white mb-1">
                        {sellerProfile.name}
                      </h3>
                      <p className="text-grey-500 dark:text-grey-400 mb-3">
                        {sellerProfile.email || sellerProfile.mobile || ""}
                      </p>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() =>
                          router.push(`/dashboard/sellers/${sellerProfile.id}`)
                        }
                        rightIcon={
                          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        }
                      >
                        عرض صفحة البائع
                      </Button>
                    </div>
                    <InfoItem
                      icon={UserCircleIcon}
                      label="معرف البائع"
                      value={sellerProfile.id}
                    />
                    {sellerProfile.email && (
                      <InfoItem
                        icon={EnvelopeIcon}
                        label="البريد الإلكتروني"
                        value={sellerProfile.email}
                      />
                    )}
                    {sellerProfile.mobile && (
                      <InfoItem
                        icon={DevicePhoneMobileIcon}
                        label="رقم الجوال"
                        value={`${
                          sellerProfile.country_code != undefined || null
                            ? "+" + sellerProfile.country_code
                            : ""
                        } ${sellerProfile.mobile}`}
                        dir="ltr"
                      />
                    )}
                    {sellerProfile.city && (
                      <InfoItem
                        icon={BuildingOffice2Icon}
                        label="المدينة"
                        value={sellerProfile.city}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center text-center pb-5 pt-7 border-b border-grey-200 dark:border-grey-700 mb-3">
                      <div className="bg-warning-100 dark:bg-warning-900/30 rounded-full p-4 mb-3">
                        <TruckIcon className="w-12 h-12 text-warning-500 dark:text-warning-400" />
                      </div>
                      <h3 className="text-xl font-bold text-grey-900 dark:text-white mb-1">
                        {transaction?.user?.name || "اسم البائع غير متوفر"}
                      </h3>
                      <p className="text-grey-500 dark:text-grey-400 mb-3">
                        {transaction?.user?.email ||
                          transaction?.user?.mobile ||
                          ""}
                      </p>
                    </div>
                    <InfoItem
                      icon={UserCircleIcon}
                      label="معرف البائع"
                      value={
                        displaySellerIdFromTx !== "N/A"
                          ? displaySellerIdFromTx
                          : "غير متوفر"
                      }
                    />
                    {transaction?.user?.email && (
                      <InfoItem
                        icon={InformationCircleIcon}
                        label="البريد الإلكتروني"
                        value={transaction.user.email}
                      />
                    )}
                    {transaction?.user?.mobile && (
                      <InfoItem
                        icon={DevicePhoneMobileIcon}
                        label="رقم الجوال"
                        value={transaction.user.mobile}
                        dir="ltr"
                      />
                    )}
                    <StatusMessage
                      type="warning"
                      message={
                        sellerError ||
                        "قد يكون هذا البائع قد تم حذفه من النظام أو لم يتم تسجيله بعد."
                      }
                      className="mt-2 lg:mt-7"
                    />
                  </>
                )}
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* معلومات إضافية */}
        <DashboardCard
          className="col-span-1 xl:col-span-3"
          title="معلومات إضافية"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            {transaction.user && (
              <InfoItem
                icon={UserCircleIcon}
                label="المستخدم (Nearpay)"
                value={`${transaction.user.name} (${transaction.user.email})`}
              />
            )}
            {transaction.terminal?.tid && (
              <InfoItem
                icon={DevicePhoneMobileIcon}
                label="معرف الطرفية (Nearpay)"
                value={transaction.terminal.tid}
              />
            )}
            {transaction.device && (
              <InfoItem
                icon={DevicePhoneMobileIcon}
                label="الجهاز"
                value={`${transaction.device.type} (${transaction.device.status})`}
              />
            )}
            {transaction.internet && (
              <InfoItem
                icon={WifiIcon}
                label="الإنترنت"
                value={`${transaction.internet.type} (سرعة: ${transaction.internet.speed})`}
              />
            )}
            {transaction.package_name && (
              <InfoItem
                icon={CubeIcon}
                label="اسم الحزمة"
                value={transaction.package_name}
              />
            )}
            <InfoItem
              icon={ShieldCheckIcon}
              label="هل تمت التسوية؟"
              value={transaction.is_reconcilied ? "نعم" : "لا"}
            />
            {transaction.retrieval_reference_number && (
              <InfoItem
                icon={HashtagIcon}
                label="رقم مرجع الاسترداد"
                value={transaction.retrieval_reference_number}
              />
            )}
            {transaction.customer_reference_number && (
              <InfoItem
                icon={HashtagIcon}
                label="رقم مرجع العميل"
                value={transaction.customer_reference_number}
              />
            )}
            {transaction?.receipts &&
              transaction.receipts.length > 0 &&
              transaction.receipts.map((receipt, index) => (
                <React.Fragment key={`receipt-details-${index}`}>
                  <InfoItem
                    icon={ShieldCheckIcon}
                    label="هل تمت الموافقة؟"
                    value={receipt.is_approved ? "نعم" : "لا"}
                  />
                  {receipt.status_message && (
                    <InfoItem
                      icon={InformationCircleIcon}
                      label="رسالة الحالة"
                      value={`${receipt.status_message.arabic} / ${receipt.status_message.english}`}
                    />
                  )}
                  {receipt.tid && (
                    <InfoItem
                      icon={DevicePhoneMobileIcon}
                      label="معرف الطرفية (TID)"
                      value={receipt.tid}
                    />
                  )}
                  {receipt.approval_code?.value && (
                    <InfoItem
                      icon={HashtagIcon}
                      label="رمز الموافقة"
                      value={receipt.approval_code.value}
                    />
                  )}
                  {receipt.entry_mode && (
                    <InfoItem
                      icon={InformationCircleIcon}
                      label="وضع الإدخال"
                      value={receipt.entry_mode}
                    />
                  )}
                </React.Fragment>
              ))}
          </div>
        </DashboardCard>

        {transaction.metadata &&
          Object.keys(transaction.metadata).length > 0 && (
            <DashboardCard
              className="col-span-1 xl:col-span-3"
              title="البيانات الوصفية (Metadata)"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                {Object.entries(transaction.metadata).map(([key, value]) => {
                  return (
                    <InfoItem
                      key={`meta-${key}`}
                      icon={InformationCircleIcon}
                      label={key.replace(/_/g, " ")}
                      value={
                        typeof value === "object"
                          ? JSON.stringify(value, null, 2)
                          : String(value)
                      }
                    />
                  );
                })}
              </div>
            </DashboardCard>
          )}
      </div>
    </DashboardLayout>
  );
};

export default TransactionViewPage;
