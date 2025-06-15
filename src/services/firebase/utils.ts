import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './config';
import { FIRESTORE_COLLECTIONS } from './constants';

/**
 * التحقق من وجود بريد إلكتروني مسجل مسبقاً (في جدول Accounts)
 * @param email البريد الإلكتروني المراد التحقق منه
 * @param excludeId معرف المستخدم المراد استبعاده من البحث (اختياري - يستخدم في حالة التعديل)
 * @returns وعد يحتوي على قيمة منطقية تمثل وجود البريد الإلكتروني (true) أو عدم وجوده (false)
 */
export async function checkEmailExists(email: string, excludeId?: string): Promise<boolean> {
  try {
    const accountsRef = collection(db, FIRESTORE_COLLECTIONS.ACCOUNTS);
    const q = query(accountsRef, where("email", "==", formatEmail(email)));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return false;
    // في حالة التعديل، استبعاد المعرف الحالي من الفحص
    if (excludeId) return snapshot.docs.some(docSnap => docSnap.id !== excludeId);
    return true;
  } catch (error) {
    console.error('Error checking if email exists in accounts:', error);
    throw error;
  }
}

/**
 * التحقق من وجود رقم جوال مسجل مسبقاً (في جدول Accounts)
 * @param mobile رقم الجوال المراد التحقق منه
 * @param country_code رمز الدولة المرتبط برقم الجوال
 * @param excludeId معرف المستخدم المراد استبعاده من البحث (اختياري - يستخدم في حالة التعديل)
 * @returns وعد يحتوي على قيمة منطقية تمثل وجود رقم الجوال (true) أو عدم وجوده (false)
 */
export async function checkMobileExists(mobile: string, country_code: number | string, excludeId?: string): Promise<boolean> {
  try {
    const accountsRef = collection(db, FIRESTORE_COLLECTIONS.ACCOUNTS);
    // تحويل country_code إلى رقم إذا كان نصاً
    const numericCountryCode = typeof country_code === 'string' ? parseInt(country_code, 10) : country_code;
    const formattedMobile = formatMobile(mobile);
    const q = query(
      accountsRef, 
      where("mobile", "==", formattedMobile),
      where("country_code", "==", numericCountryCode)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return false;
    // في حالة التعديل، استبعاد المعرف الحالي من الفحص
    if (excludeId) return snapshot.docs.some(docSnap => docSnap.id !== excludeId);
    return true;
  } catch (error) {
    console.error('Error checking if mobile exists in accounts:', error);
    throw error;
  }
}

/**
 * تنسيق رقم الهاتف: إزالة الصفر البادئ، وإزالة أي مسافات
 * @param mobile رقم الهاتف المراد تنسيقه
 * @returns رقم الهاتف بعد التنسيق
 */
export function formatMobile(mobile: string): string {
  if (!mobile) return '';
  // إزالة المسافات
  const trimmed = mobile.trim();
  // إزالة الصفر في البداية إذا وجد
  return trimmed.startsWith('0') ? trimmed.substring(1) : trimmed;
}

/**
 * تنسيق البريد الإلكتروني: تحويل إلى أحرف صغيرة وإزالة المسافات
 * @param email البريد الإلكتروني المراد تنسيقه
 * @returns البريد الإلكتروني بعد التنسيق
 */
export function formatEmail(email: string): string {
  if (!email) return '';
  return email.toLowerCase().trim();
} 