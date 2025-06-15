import { db } from './config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from './constants';

export interface PolicyDocument {
  data: string;
}

export class ConfigService {
  /**
   * استرجاع وثيقة سياسة الخصوصية
   */
  static async getPrivacyPolicy(): Promise<PolicyDocument | null> {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.CONFIG, 'privacy_policy');
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return docSnap.data() as PolicyDocument;
    } catch (error) {
      console.error('خطأ في استرجاع سياسة الخصوصية:', error);
      throw error;
    }
  }

  /**
   * استرجاع وثيقة شروط الخدمة
   */
  static async getTermsOfService(): Promise<PolicyDocument | null> {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.CONFIG, 'terms_of_service');
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return docSnap.data() as PolicyDocument;
    } catch (error) {
      console.error('خطأ في استرجاع شروط الخدمة:', error);
      throw error;
    }
  }

  /**
   * تحديث وثيقة سياسة الخصوصية
   */
  static async updatePrivacyPolicy(data: string): Promise<void> {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.CONFIG, 'privacy_policy');
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        // إنشاء الوثيقة إذا لم تكن موجودة
        await setDoc(docRef, { data });
      } else {
        // تحديث الوثيقة إذا كانت موجودة
        await updateDoc(docRef, { data });
      }
    } catch (error) {
      console.error('خطأ في تحديث سياسة الخصوصية:', error);
      throw error;
    }
  }

  /**
   * تحديث وثيقة شروط الخدمة
   */
  static async updateTermsOfService(data: string): Promise<void> {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTIONS.CONFIG, 'terms_of_service');
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        // إنشاء الوثيقة إذا لم تكن موجودة
        await setDoc(docRef, { data });
      } else {
        // تحديث الوثيقة إذا كانت موجودة
        await updateDoc(docRef, { data });
      }
    } catch (error) {
      console.error('خطأ في تحديث شروط الخدمة:', error);
      throw error;
    }
  }
} 