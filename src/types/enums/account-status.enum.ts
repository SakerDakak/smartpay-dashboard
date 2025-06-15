/**
 * حالات الحسابات المختلفة.
 */
export enum AccountStatus {
  /** الحساب نشط ومسموح له بالاستخدام الكامل. */
  Active = 'active',

  /** تم إنشاء الحساب ولكنه بانتظار موافقة المسؤول لتفعيله. */
  PendingApproval = 'pending_approval',

  /** الحساب موقوف، إما مؤقتًا أو دائمًا. */
  Suspended = 'suspended',
} 