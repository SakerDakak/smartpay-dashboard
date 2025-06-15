/**
 * أسماء مجموعات Firestore المستخدمة في التطبيق.
 */
export const FIRESTORE_COLLECTIONS = {
  ACCOUNTS: 'accounts',
  ADMINS: 'admins',
  CONFIG: 'config',
  END_USERS: 'end_users',
  MERCHANTS: 'merchants',
} as const; // 'as const' يجعل القيم للقراءة فقط وأنواعها أكثر تحديدًا 