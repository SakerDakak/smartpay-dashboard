import { AccountType, AccountStatus } from '../enums';

/**
 * يمثل بيانات ملف تعريف التاجر المخزنة في مجموعة 'merchants'.
 */
export interface MerchantProfile {
  id: string;
  name: string;
  email: string;
  city: string;
  mobile: string;
  type: AccountType;
  status: AccountStatus;
  country_code: number;
  created_at: string;
  brand_name: string;       // الاسم التجاري
  logo?: string;            // شعار المتجر (base64)
  iban?: string;            // رقم الآيبان
  image_front_id_card?: string;   // صورة الهوية الأمامية (base64)
  image_back_id_card?: string;    // صورة الهوية الخلفية (base64)
  image_commercial_registration_or_freelance_focument?: string; // صورة السجل التجاري (base64)
} 