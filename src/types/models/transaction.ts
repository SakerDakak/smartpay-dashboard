export interface NearpayTransaction {
  id: string;
  created_at: string; // ISO 8601 date string
  is_reconcilied: boolean;
  terminal: { tid: string } | null;
  user: {
    id: string;
    name: string;
    email: string;
    mobile: string;
  } | null;
  merchant: {
    id: string;
    name: string;
    name_ar: string;
  } | null;
  // الحقول الأساسية للمعاملة الفعلية غالبًا ما تكون داخل receipts أو حقل آخر مشابه
  // بناءً على المخرجات، يبدو أن تفاصيل المبلغ والعملة والحالة موجودة ضمن أول عنصر في receipts
  // هذا قد يحتاج إلى تحليل أعمق لبنية receipts لتمثيلها بدقة
  receipts: NearpayReceipt[] | null; // مصفوفة الإيصالات
  amount?: number; // قد يكون هذا محسوبًا أو منقولًا من الإيصال الأساسي
  currency?: string; // نفس ملاحظة المبلغ
  status?: string; // نفس ملاحظة المبلغ (مثلاً، من status_message في الإيصال)
  type?: string; // نفس ملاحظة المبلغ (مثلاً، من transaction_type في الإيصال)
  merchant_id?: string; // يبدو أنه موجود في merchant داخل كل معاملة
  card_brand?: string; // من الإيصال
  last_four_digits?: string; // من الإيصال (pan)
  metadata?: Record<string, unknown>; // استخدام unknown أو نوع أكثر تحديدًا إذا عرف
  qr_url?: string; // رابط QR لفاتورة المعاملة
  // حقول أخرى من المخرجات الفعلية للمعاملة:
  customer_reference_number: string | null;
  device: {
    id: string;
    status: string;
    type: string;
  } | null;
  internet: {
    speed: string;
    type: string;
  } | null;
  package_name: string | null;
  reconciliation: Record<string, unknown> | null; // استخدام unknown أو نوع أكثر تحديدًا إذا عرف
  retrieval_reference_number: string | null;
  // merchant: { id: string, name: string, name_ar: string }; // موجود أيضًا
}

export interface NearpayReceipt {
  id: string;
  action_code: string;
  amount_authorized: { label: { arabic: string; english: string }; value: string } | null;
  amount_other: { label: { arabic: string; english: string }; value: string } | null;
  application_cryptogram: string | null;
  application_identifier: string | null;
  approval_code: { label: { arabic: string; english: string }; value: string } | null;
  card_expiration: string | null;
  card_scheme: { id: string; name: { arabic: string; english: string } } | null;
  card_scheme_sponsor: string | null;
  cardholader_verfication_result: string | null; // خطأ إملائي محتمل في API؟ (cardholder)
  created_at: string;
  cryptogram_information_data: string | null;
  currency: { arabic: string; english: string } | null;
  end_date: string | null;
  end_time: string | null;
  entry_mode: string | null;
  is_approved: boolean;
  is_refunded: boolean;
  is_reversed: boolean;
  kernel_id: string | null;
  merchant: {
    address: { arabic: string; english: string } | null;
    category_code: string | null;
    id: string;
    name: { arabic: string; english: string } | null;
  } | null;
  pan: string | null; // يحتوي على آخر 4 أرقام
  pan_suffix: string | null;
  payment_account_reference: string | null;
  pos_software_version_number: string | null;
  qr_code: string | null;
  receipt_line_one: { arabic: string; english: string } | null;
  receipt_line_two: { arabic: string; english: string } | null;
  retrieval_reference_number: string | null;
  save_receipt_message: { arabic: string; english: string } | null;
  start_date: string | null;
  start_time: string | null;
  status_message: { arabic: string; english: string } | null; // هذا قد يكون الحالة الرئيسية
  system_trace_audit_number: string | null;
  terminal_verification_result: string | null;
  thanks_message: { arabic: string; english: string } | null;
  tid: string | null;
  transaction_state_information: string | null;
  transaction_type: { id: string; name: { arabic: string; english: string } } | null; // هذا قد يكون النوع الرئيسي
  transaction_uuid: string; // يربط بالمعاملة الرئيسية
  type: string; // "purchase" مثلاً
  updated_at: string;
  verification_method: { arabic: string; english: string } | null;
}

export interface GetTransactionsParams {
  page?: number;
  limit?: number; // API قد يستخدم اسم مختلف مثل per_page
  search?: string;
  from_date?: string;
  to_date?: string;
  status?: string;
  type?: string;
  merchant_id?: string;
  terminal_id?: string;
}

export interface TransactionsResponse {
  transactions: NearpayTransaction[]; // تغيير data إلى transactions
  pages: { // تغيير meta إلى pages
    current: number; // تغيير current_page إلى current
    total: number;   // تغيير last_page إلى total (يمثل إجمالي الصفحات)
  };
} 