import React from "react";
import { Button } from "../ui/Button";
import router from "next/router";

interface SellerCellProps {
  user: {
    id: string;
    name: string;
    email: string;
    mobile: string;
  } | null;
  fallbackName?: string;
  fallbackMobile?: string;
}

/**
 * مكون لعرض بيانات البائع في خلية الجدول
 * يعرض اسم البائع ورقم هاتفه
 */
export const SellerCell: React.FC<SellerCellProps> = ({
  user,
  fallbackName,
  fallbackMobile,
}) => {
  if (!user) {
    if (!fallbackName && !fallbackMobile) {
      return (
        <div className="text-grey-600 dark:text-grey-400 text-sm">غير متاح</div>
      );
    }
    return (
      <div className="flex flex-col">
        <span className="font-medium text-grey-900 dark:text-white">
          {fallbackName || "غير معروف"}
        </span>
        <span className="text-xs text-grey-600 dark:text-grey-400 font-mono">
          {fallbackMobile || ""}
        </span>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      onClick={() => router.push(`/dashboard/sellers/${user.id}`)}
      title="عرض البائع"
      aria-label={`عرض البائع ${user.name}`}
      className="m-0 p-0 focus:ring-0 focus:ring-offset-0 hover:bg-transparent hover:dark:bg-transparent"
    >
      <div className="flex flex-col text-right">
        <span className="font-medium text-grey-900 dark:text-white">
          {user.name || "غير معروف"}
        </span>
        <span className="text-xs text-grey-600 dark:text-grey-400 font-mono">
          {user.mobile || ""}
        </span>
      </div>
    </Button>
  );
};
