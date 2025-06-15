import { db } from './config';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData
} from 'firebase/firestore';
import CryptoJS from 'crypto-js';
import { FIRESTORE_COLLECTIONS } from './constants';
import { AdminProfile } from '../../types/models';
import { AccountStatus, AccountType } from '../../types/enums';
import { translateAccountStatus } from '../../utils/translations';
import { formatEmail, formatMobile } from './utils';

export class AdminService {
  /**
   * استرجاع قائمة المشرفين
   */
  static async getAdmins(searchTerm: string = '', lastVisible: DocumentData | null = null, itemsPerPage: number = 10) {
    try {
      const adminCollectionRef = collection(db, FIRESTORE_COLLECTIONS.ADMINS);
      let adminQuery;
      
      if (searchTerm) {
        // البحث بالاسم
        adminQuery = query(
          adminCollectionRef,
          where('name', '>=', searchTerm),
          where('name', '<=', searchTerm + '\uf8ff'),
          orderBy('name'),
          limit(itemsPerPage)
        );
      } else {
        if (!lastVisible) {
          // أول تحميل
          adminQuery = query(
            adminCollectionRef,
            orderBy('created_at', 'desc'),
            limit(itemsPerPage)
          );
        } else {
          // تحميل المزيد
          adminQuery = query(
            adminCollectionRef,
            orderBy('created_at', 'desc'),
            startAfter(lastVisible),
            limit(itemsPerPage)
          );
        }
      }
      
      const adminSnapshot = await getDocs(adminQuery);
      
      if (adminSnapshot.empty) {
        return {
          admins: [],
          lastVisible: null,
          hasMore: false
        };
      }
      
      const lastDoc = adminSnapshot.docs[adminSnapshot.docs.length - 1];
      const adminsList = adminSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          city: data.city,
          mobile: data.mobile,
          type: data.type,
          status: data.status,
          country_code: data.country_code,
          created_at: data.created_at,
        } as AdminProfile;
      });
      
      return {
        admins: adminsList,
        lastVisible: lastDoc,
        hasMore: adminSnapshot.docs.length === itemsPerPage
      };
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw error;
    }
  }

  /**
   * استرجاع مشرف محدد بواسطة المعرف
   */
  static async getAdminById(id: string) {
    try {
      const adminDocRef = doc(db, FIRESTORE_COLLECTIONS.ADMINS, id);
      const adminSnapshot = await getDoc(adminDocRef);
      
      if (!adminSnapshot.exists()) {
        return null;
      }
      
      const adminData = adminSnapshot.data();
      return {
        id: adminSnapshot.id,
        name: adminData.name,
        email: adminData.email,
        mobile: adminData.mobile,
        country_code: adminData.country_code,
        city: adminData.city,
        type: adminData.type,
        status: adminData.status,
        created_at: adminData.created_at,
      } as AdminProfile;
    } catch (error) {
      console.error('Error fetching admin details:', error);
      throw error;
    }
  }

  /**
   * إضافة مشرف جديد
   */
  static async addAdmin(adminData: {
    name: string;
    email: string;
    mobile: string;
    country_code: number;
    city: string;
    password: string;
    status: string;
  }) {
    try {
      // تشفير كلمة المرور
      const hashedPassword = CryptoJS.MD5(adminData.password).toString();
      
      // معالجة البريد الإلكتروني ورقم الهاتف
      const formattedEmail = formatEmail(adminData.email);
      const formattedMobile = formatMobile(adminData.mobile);
      
      // إنشاء حساب المصادقة أولاً
      const authAccountRef = collection(db, FIRESTORE_COLLECTIONS.ACCOUNTS);
      const authData = {
        email: formattedEmail,
        mobile: formattedMobile,
        country_code: Number(adminData.country_code),
        password: hashedPassword,
        type: AccountType.Admin,
        status: adminData.status,
        created_at: new Date().toISOString(),
      };
      
      // إضافة وثيقة حساب المصادقة
      const authDocRef = await addDoc(authAccountRef, authData);
      
      // إنشاء ملف المشرف باستخدام نفس معرف حساب المصادقة
      const adminProfileRef = doc(db, FIRESTORE_COLLECTIONS.ADMINS, authDocRef.id);
      const adminProfileData = {
        name: adminData.name,
        email: formattedEmail,
        mobile: formattedMobile,
        country_code: Number(adminData.country_code),
        city: adminData.city,
        type: AccountType.Admin,
        status: adminData.status,
        created_at: new Date().toISOString(),
      };
      
      // إضافة وثيقة ملف المشرف
      await setDoc(adminProfileRef, adminProfileData);
      
      return {
        id: authDocRef.id,
        ...adminProfileData
      };
    } catch (error) {
      console.error('Error adding admin:', error);
      throw error;
    }
  }

  /**
   * تحديث بيانات مشرف
   */
  static async updateAdmin(id: string, adminData: {
    name: string;
    email: string;
    mobile: string;
    country_code: number;
    city: string;
    status: AccountStatus;
  }) {
    try {
      // معالجة البريد الإلكتروني ورقم الهاتف
      const formattedEmail = formatEmail(adminData.email);
      const formattedMobile = formatMobile(adminData.mobile);
      
      // تحديث بيانات المشرف في Firestore
      const adminDocRef = doc(db, FIRESTORE_COLLECTIONS.ADMINS, id);
      await updateDoc(adminDocRef, {
        name: adminData.name,
        email: formattedEmail,
        mobile: formattedMobile,
        country_code: Number(adminData.country_code),
        city: adminData.city,
        status: adminData.status,
        updated_at: new Date().toISOString(),
      });
      
      // تحديث بيانات الحساب المرتبط (بريد إلكتروني ورقم جوال ورمز البلد)
      const accountDocRef = doc(db, FIRESTORE_COLLECTIONS.ACCOUNTS, id);
      await updateDoc(accountDocRef, {
        email: formattedEmail,
        mobile: formattedMobile,
        country_code: Number(adminData.country_code),
        status: adminData.status,
        updated_at: new Date().toISOString(),
      });
      
      return {
        id,
        ...adminData,
        email: formattedEmail,
        mobile: formattedMobile,
        updated_at: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error updating admin:', error);
      throw error;
    }
  }

  /**
   * حذف مشرف
   */
  static async deleteAdmin(id: string) {
    try {
      // حذف ملف المشرف
      await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.ADMINS, id));
      
      // حذف حساب المصادقة المرتبط
      await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.ACCOUNTS, id));
      
      return true;
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw error;
    }
  }

  /**
   * التحقق من وضع المشرف (إذا كان نشطا وغير محذوف)
   */
  static async checkAdminStatus(id: string) {
    try {
      // التحقق من وجود الحساب في مجموعة المشرفين
      const adminDocRef = doc(db, FIRESTORE_COLLECTIONS.ADMINS, id);
      const adminSnapshot = await getDoc(adminDocRef);
      
      if (!adminSnapshot.exists()) {
        return { exists: false, isActive: false, message: 'تم حذف حساب المشرف' };
      }
      
      const adminData = adminSnapshot.data();
      const isActive = adminData.status === AccountStatus.Active;
      
      return { 
        exists: true, 
        isActive: isActive, 
        message: isActive ? null : `حساب المشرف ${translateAccountStatus(adminData.status)}` 
      };
    } catch (error) {
      console.error('Error checking admin status:', error);
      throw error;
    }
  }
} 