import { db } from "./config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  DocumentData,
} from "firebase/firestore";
import CryptoJS from "crypto-js";
import { AuthAccount, AdminProfile } from "../../types/models";
import { AccountType, AccountStatus } from "../../types/enums";
import { FIRESTORE_COLLECTIONS } from "./constants";
import { translateAccountStatus } from "../../utils/translations";
import { formatEmail } from "./utils";

/**
 * نتيجة تسجيل دخول الأدمن الناجحة.
 */
export interface AdminLoginSuccess {
  authAccount: AuthAccount;
  adminProfile: AdminProfile;
}

/**
 * خدمة التعامل مع الكلمات المرور والمصادقة
 */
export class PasswordService {
  /**
   * تحديث كلمة مرور المستخدم
   * @param id معرف المستخدم
   * @param newPassword كلمة المرور الجديدة
   * @returns نجاح أو فشل العملية
   */
  static async updatePassword(id: string, newPassword: string) {
    try {
      // تشفير كلمة المرور الجديدة
      const hashedPassword = CryptoJS.MD5(newPassword).toString();

      // تحديث كلمة المرور في حساب المصادقة
      const accountDocRef = doc(db, FIRESTORE_COLLECTIONS.ACCOUNTS, id);
      await updateDoc(accountDocRef, {
        password: hashedPassword,
        updated_at: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  }

  /**
   * التحقق من صحة كلمة المرور
   * @param password كلمة المرور
   * @param confirmPassword تأكيد كلمة المرور
   * @returns رسالة خطأ إذا كانت كلمة المرور غير صالحة أو null إذا كانت صالحة
   */
  static validatePassword(
    password: string,
    confirmPassword: string
  ): string | null {
    // التحقق من تطابق كلمة المرور وتأكيدها
    if (password !== confirmPassword) {
      return "كلمة المرور وتأكيد كلمة المرور غير متطابقين.";
    }

    // التحقق من طول كلمة المرور (الحد الأدنى 8 أحرف)
    if (password.length < 8) {
      return "يجب أن تكون كلمة المرور 8 أحرف على الأقل.";
    }

    return null;
  }
}

/**
 * يقوم بتسجيل دخول الأدمن.
 * @param email البريد الإلكتروني للأدمن.
 * @param rawPassword كلمة المرور الأصلية (غير مشفرة).
 * @returns Promise يحتوي على بيانات حساب الأدمن وملفه الشخصي في حال النجاح.
 * @throws Error في حال فشل تسجيل الدخول أو إذا لم يكن الحساب من نوع أدمن أو غير نشط.
 */
export const loginAdmin = async (
  email: string,
  rawPassword: string
): Promise<AdminLoginSuccess> => {
  const hashedPassword = CryptoJS.MD5(rawPassword).toString();
  const formattedEmail = formatEmail(email);

  const accountsRef = collection(db, FIRESTORE_COLLECTIONS.ACCOUNTS);
  const q = query(
    accountsRef,
    where("email", "==", formattedEmail),
    where("password", "==", hashedPassword)
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error("بيانات الاعتماد غير صحيحة أو الحساب غير موجود.");
  }

  const accountDoc = querySnapshot.docs[0];
  const accountData = accountDoc.data() as DocumentData;

  const authAccount: AuthAccount = {
    id: accountDoc.id,
    email: accountData.email,
    mobile: accountData.mobile,
    country_code: accountData.country_code,
    password_hash: accountData.password,
    type: accountData.type as AccountType,
    status: accountData.status as AccountStatus,
  };

  if (authAccount.type !== AccountType.Admin) {
    throw new Error("هذا الحساب ليس حساب أدمن.");
  }

  if (authAccount.status !== AccountStatus.Active) {
    throw new Error(
      `حالة الحساب هي: ${translateAccountStatus(
        authAccount.status
      )}. يجب أن يكون الحساب نشطًا.`
    );
  }

  const adminProfileDocRef = doc(
    db,
    FIRESTORE_COLLECTIONS.ADMINS,
    authAccount.id
  );
  const adminProfileDocSnap = await getDoc(adminProfileDocRef);

  if (!adminProfileDocSnap.exists()) {
    throw new Error("تم حذف ملف المشرف من النظام. الرجاء التواصل مع المسؤول.");
  }

  const adminProfileData = adminProfileDocSnap.data() as DocumentData;

  // التحقق مرة أخرى من حالة الملف في مجموعة المشرفين
  if (adminProfileData.status !== AccountStatus.Active) {
    throw new Error(
      `حالة المشرف هي: ${translateAccountStatus(
        adminProfileData.status
      )}. يجب أن يكون الحساب نشطًا.`
    );
  }

  const adminProfile: AdminProfile = {
    id: adminProfileDocSnap.id,
    name: adminProfileData.name,
    email: adminProfileData.email,
    city: adminProfileData.city,
    mobile: adminProfileData.mobile,
    type: adminProfileData.type as AccountType,
    status: adminProfileData.status as AccountStatus,
    country_code: adminProfileData.country_code,
    created_at: adminProfileData.created_at as string,
  };

  return { authAccount, adminProfile };
};
