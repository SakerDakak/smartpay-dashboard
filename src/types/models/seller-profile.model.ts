import { AccountType, AccountStatus } from "../enums";

/**
 * يمثل بيانات ملف تعريف المستخدم النهائي المخزنة في مجموعة 'end_users'.
 */
export interface SellerProfile {
  id: string;
  terminal_id: string;
  tid: string;
  merchant_id: string;
  name: string;
  email: string;
  city: string;
  mobile: string;
  type: AccountType;
  status: AccountStatus;
  country_code: number;
  created_at: string;
}
