import { db } from "./config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import CryptoJS from "crypto-js";
import { FIRESTORE_COLLECTIONS } from "./constants";
import { MerchantProfile } from "../../types/models";
import { AccountStatus } from "../../types/enums";
import { SellerService } from "./sellerService";
import { formatEmail, formatMobile } from "./utils";

interface MerchantData {
  id: string;
  name: string;
  brandName: string;
  email: string;
  phone: string;
  countryCode: number;
  city: string;
  iban: string;
  status: string;
  imageFrontIdCard: string;
  imageBackIdCard: string;
  imageCommercialRegistrationOrFreelanceDocument: string;
  logo: string;
  password: string;
  createdAt: string;
}

export class MerchantService {
  static readonly COLLECTION = "merchants";
  static readonly AUTH_COLLECTION = "auths";

  /**
   * استرجاع قائمة التجار
   */
  static async getMerchants(searchTerm: string = "") {
    try {
      const merchantCollectionRef = collection(
        db,
        FIRESTORE_COLLECTIONS.MERCHANTS
      );
      let merchantQuery;

      if (searchTerm) {
        // البحث بالاسم
        merchantQuery = query(
          merchantCollectionRef,
          where("name", ">=", searchTerm),
          where("name", "<=", searchTerm + "\uf8ff"),
          orderBy("name")
        );
      } else {
        merchantQuery = query(
          merchantCollectionRef,
          orderBy("created_at", "desc")
        );
      }

      const merchantSnapshot = await getDocs(merchantQuery);

      if (merchantSnapshot.empty) {
        return [];
      }

      const merchantsList = merchantSnapshot.docs.map((doc) => {
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
          brand_name: data.brand_name,
          logo: data.logo,
        } as MerchantProfile;
      });

      return merchantsList;
    } catch (error) {
      console.error("Error fetching merchants:", error);
      throw error;
    }
  }

  /**
   * استرجاع تاجر محدد بواسطة المعرف
   */
  static async getMerchantById(id: string) {
    try {
      const merchantDocRef = doc(db, FIRESTORE_COLLECTIONS.MERCHANTS, id);
      const merchantSnapshot = await getDoc(merchantDocRef);

      if (!merchantSnapshot.exists()) {
        return null;
      }

      const merchantData = merchantSnapshot.data();
      return {
        id: merchantSnapshot.id,
        ...merchantData,
      } as MerchantProfile;
    } catch (error) {
      console.error("Error fetching merchant details:", error);
      throw error;
    }
  }

  /**
   * إضافة تاجر جديد إلى Firebase
   */
  static async addMerchant(data: MerchantData): Promise<void> {
    try {
      // معالجة البريد الإلكتروني ورقم الهاتف
      const formattedEmail = formatEmail(data.email);
      const formattedPhone = formatMobile(data.phone);

      // إضافة التاجر إلى مجموعة التجار
      const merchantRef = doc(db, FIRESTORE_COLLECTIONS.MERCHANTS, data.id);
      await setDoc(merchantRef, {
        id: data.id,
        name: data.name,
        brand_name: data.brandName,
        email: formattedEmail,
        mobile: formattedPhone,
        country_code: data.countryCode,
        city: data.city,
        iban: data.iban,
        status: data.status,
        image_front_id_card: data.imageFrontIdCard,
        image_back_id_card: data.imageBackIdCard,
        image_commercial_registration_or_freelance_focument:
          data.imageCommercialRegistrationOrFreelanceDocument,
        logo: data.logo,
        created_at: data.createdAt,
      });

      // إضافة معلومات المصادقة
      const authRef = doc(db, FIRESTORE_COLLECTIONS.ACCOUNTS, data.id);
      await setDoc(authRef, {
        id: data.id,
        email: formattedEmail,
        mobile: formattedPhone,
        country_code: data.countryCode,
        password: this.hashPassword(data.password),
        type: "merchant",
        status: data.status,
        created_at: data.createdAt,
      });
    } catch (error) {
      console.error("Error adding merchant:", error);
      throw new Error("فشل في إضافة التاجر. يرجى المحاولة مرة أخرى.");
    }
  }

  /**
   * تشفير كلمة المرور
   */
  private static hashPassword(password: string): string {
    return CryptoJS.MD5(password).toString();
  }

  /**
   * تحديث بيانات تاجر
   */
  static async updateMerchant(
    id: string,
    merchantData: {
      name: string;
      email: string;
      mobile: string;
      country_code: number;
      city: string;
      status: AccountStatus;
      brand_name: string;
      iban?: string;
      password?: string;
      logo?: string;
      image_front_id_card?: string;
      image_back_id_card?: string;
      image_commercial_registration_or_freelance_focument?: string;
    }
  ) {
    try {
      // معالجة البريد الإلكتروني ورقم الهاتف
      const formattedEmail = formatEmail(merchantData.email);
      const formattedMobile = formatMobile(merchantData.mobile);

      // تحديث بيانات التاجر في Firestore
      const merchantDocRef = doc(db, FIRESTORE_COLLECTIONS.MERCHANTS, id);

      // إعداد كائن التحديث الأساسي
      const updateObj: Record<string, string | number | AccountStatus | Date> =
        {
          name: merchantData.name,
          email: formattedEmail,
          mobile: formattedMobile,
          country_code: Number(merchantData.country_code),
          city: merchantData.city,
          status: merchantData.status,
          updated_at: new Date().toISOString(),
          brand_name: merchantData.brand_name,
        };

      // إضافة الحقول الاختيارية فقط إذا تم توفيرها
      if (merchantData.iban !== undefined) {
        updateObj.iban = merchantData.iban;
      }

      if (merchantData.logo !== undefined) {
        updateObj.logo = merchantData.logo;
      }

      if (merchantData.image_front_id_card !== undefined) {
        updateObj.image_front_id_card = merchantData.image_front_id_card;
      }

      if (merchantData.image_back_id_card !== undefined) {
        updateObj.image_back_id_card = merchantData.image_back_id_card;
      }

      if (
        merchantData.image_commercial_registration_or_freelance_focument !==
        undefined
      ) {
        updateObj.image_commercial_registration_or_freelance_focument =
          merchantData.image_commercial_registration_or_freelance_focument;
      }

      // تحديث وثيقة التاجر
      await updateDoc(merchantDocRef, updateObj);

      // تحديث بيانات الحساب المرتبط (بريد إلكتروني ورقم جوال ورمز البلد)
      const accountDocRef = doc(db, FIRESTORE_COLLECTIONS.ACCOUNTS, id);
      const accountUpdateObj: Record<
        string,
        string | number | AccountStatus | Date
      > = {
        email: formattedEmail,
        mobile: formattedMobile,
        country_code: Number(merchantData.country_code),
        status: merchantData.status,
        updated_at: new Date().toISOString(),
      };

      // إضافة كلمة المرور إلى التحديث إذا تم توفيرها
      if (merchantData.password) {
        accountUpdateObj.password = this.hashPassword(merchantData.password);
      }

      await updateDoc(accountDocRef, accountUpdateObj);

      return {
        id,
        ...merchantData,
        email: formattedEmail,
        mobile: formattedMobile,
        updated_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error updating merchant:", error);
      throw error;
    }
  }

  /**
   * حذف البائعين المرتبطين بتاجر معين
   */
  static async deleteSellersByMerchantId(merchantId: string): Promise<void> {
    try {
      const sellersQuery = query(
        collection(db, FIRESTORE_COLLECTIONS.END_USERS),
        where("merchant_id", "==", merchantId)
      );
      const sellersSnapshot = await getDocs(sellersQuery);

      const deletePromises: Promise<void>[] = [];
      sellersSnapshot.forEach((sellerDoc) => {
        deletePromises.push(SellerService.deleteSeller(sellerDoc.id));
      });

      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error deleting sellers by merchant ID:", error);
      throw error;
    }
  }

  /**
   * حذف تاجر
   */
  static async deleteMerchant(id: string) {
    try {
      // أولاً، حذف جميع البائعين المرتبطين بهذا التاجر
      await this.deleteSellersByMerchantId(id);

      // حذف ملف التاجر
      await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.MERCHANTS, id));

      // حذف حساب المصادقة المرتبط
      await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.ACCOUNTS, id));

      return true;
    } catch (error) {
      console.error("Error deleting merchant:", error);
      throw error;
    }
  }
}
