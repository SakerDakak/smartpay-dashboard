import { AccountStatus, AccountType } from "../types/enums";

/**
 * ترجمة حالة الحساب إلى نص عربي
 * @param status حالة الحساب
 * @returns نص عربي يمثل حالة الحساب
 */
export const translateAccountStatus = (status: AccountStatus): string => {
  switch (status) {
    case AccountStatus.Active:
      return "نشط";
    case AccountStatus.PendingApproval:
      return "قيد المراجعة";
    case AccountStatus.Suspended:
      return "محظور";
    default:
      return status;
  }
};

/**
 * ترجمة نوع الحساب إلى نص عربي
 * @param type نوع الحساب
 * @returns نص عربي يمثل نوع الحساب
 */
export const translateAccountType = (type: AccountType): string => {
  switch (type) {
    case AccountType.Admin:
      return "مشرف";
    case AccountType.Merchant:
      return "تاجر";
    case AccountType.Seller:
      return "البائعين";
    default:
      return type;
  }
};

/**
 * ترجمة حالة المعاملة إلى نص عربي
 * @param status حالة المعاملة (من Nearpay)
 * @returns نص عربي يمثل حالة المعاملة
 */
export const translateTransactionStatus = (status: string): string => {
  switch (status.toLowerCase()) {
    case "succeeded":
    case "success":
    case "approved":
    case "accepted":
      return "ناجحة";
    case "declined by issuing bank":
      return "مرفوضة";
    case "failed":
      return "فاشلة";
    case "pending":
      return "قيد الانتظار";
    case "authorized":
      return "مصرح بها";
    case "captured":
      return "مقبوضة";
    case "refunded":
      return "مستردة";
    case "partially_refunded":
      return "مستردة جزئيًا";
    case "voided":
      return "ملغاة";
    default:
      return status;
  }
};

/**
 * ترجمة نوع المعاملة إلى نص عربي
 * @param type نوع المعاملة (من Nearpay)
 * @returns نص عربي يمثل نوع المعاملة
 */
export const translateTransactionType = (type: string): string => {
  switch (type.toLowerCase()) {
    case "sale":
      return "بيع";
    case "authorize":
      return "تفويض";
    case "capture":
      return "قبض";
    case "refund":
      return "استرداد";
    case "void":
      return "إلغاء";
    default:
      return type;
  }
};
