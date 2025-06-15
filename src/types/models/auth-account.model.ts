import { AccountType, AccountStatus } from '../enums';

/**
 * يمثل بيانات المصادقة الأساسية المخزنة في مجموعة 'accounts'.
 */
export interface AuthAccount {
  id: string;      // المعرف المستخدم للربط مع مجموعات (admins, merchants, end_users)
  email: string;
  mobile: string;
  country_code: number;
  password_hash: string; // كلمة المرور المخزنة في Firestore (MD5 hash)
  type: AccountType;
  status: AccountStatus;
} 