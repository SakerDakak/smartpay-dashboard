import { AccountType, AccountStatus } from '../enums';

/**
 * يمثل بيانات ملف تعريف الأدمن المخزنة في مجموعة 'admins'.
 */
export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  city: string;
  mobile: string;
  type: AccountType;
  status: AccountStatus;
  country_code: number;
  created_at: string;
} 