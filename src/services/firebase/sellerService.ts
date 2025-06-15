import { db } from "./config";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import CryptoJS from "crypto-js";
import { FIRESTORE_COLLECTIONS } from "./constants";
import { SellerProfile, AuthAccount } from "../../types/models";
import { AccountStatus, AccountType } from "../../types/enums";
import { NearpayService } from "../nearpay/nearpayService";
import {
  checkEmailExists,
  checkMobileExists,
  formatEmail,
  formatMobile,
} from "./utils";

// Helper function to generate a random 6-digit number string
const generateTrsmCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export class SellerService {
  /**
   * استرجاع مستخدم نهائي (بائع) محدد بواسطة المعرف
   */
  static async getSellerById(id: string): Promise<SellerProfile | null> {
    try {
      const userDocRef = doc(db, FIRESTORE_COLLECTIONS.END_USERS, id);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        return null;
      }

      const userData = userSnapshot.data();
      return {
        id: userSnapshot.id,
        terminal_id: userData.terminal_id,
        tid: userData.tid,
        merchant_id: userData.merchant_id,
        name: userData.name,
        email: userData.email,
        city: userData.city,
        mobile: userData.mobile,
        type: AccountType.Seller,
        status: userData.status as AccountStatus,
        country_code: userData.country_code,
        created_at: userData.created_at,
      } as SellerProfile;
    } catch (error) {
      console.error("Error fetching end user details:", error);
      throw error;
    }
  }

  /**
   * استرجاع قائمة البائعين
   */
  static async getSellers(): Promise<SellerProfile[]> {
    try {
      const sellersRef = collection(db, FIRESTORE_COLLECTIONS.END_USERS);
      const sellersSnapshot = await getDocs(sellersRef);
      const sellers: SellerProfile[] = [];

      sellersSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        sellers.push({
          id: data.id,
          terminal_id: data.terminal_id,
          tid: data.tid,
          merchant_id: data.merchant_id,
          name: data.name,
          email: data.email,
          city: data.city,
          mobile: data.mobile,
          type: AccountType.Seller,
          status: data.status as AccountStatus,
          country_code: data.country_code,
          created_at: data.created_at,
        } as SellerProfile);
      });

      return sellers;
    } catch (error) {
      console.error("Error fetching sellers:", error);
      throw error;
    }
  }

  /**
   * إضافة بائع جديد
   */
  static async addSeller(
    sellerData: Omit<SellerProfile, "id" | "created_at"> & { password: string }
  ): Promise<SellerProfile> {
    try {
      // معالجة البريد الإلكتروني ورقم الهاتف
      const formattedEmail = formatEmail(sellerData.email);
      const formattedMobile = formatMobile(sellerData.mobile);

      // 1. Check if email or mobile already exists in Firebase
      const emailExists = await checkEmailExists(formattedEmail);
      if (emailExists) {
        throw new Error("هذا البريد الإلكتروني مسجل مسبقًا.");
      }
      const mobileExists = await checkMobileExists(
        formattedMobile,
        sellerData.country_code
      );
      if (mobileExists) {
        throw new Error("رقم الجوال هذا مسجل مسبقًا مع نفس رمز الدولة.");
      }

      // Prepare Nearpay phone format: +countryCodePhone (without leading zero)
      const nearpayMobile = `+${sellerData.country_code}${formattedMobile}`;

      // 2. Get Access Token from Nearpay
      const accessToken = await NearpayService.getAccessToken();

      // 3. Create Nearpay User
      const nearpayUser = await NearpayService.createNearpayUser(
        {
          name: sellerData.name,
          email: formattedEmail,
          mobile: nearpayMobile,
          merchant_id: sellerData.merchant_id,
        },
        accessToken
      );

      const sellerNearpayId = nearpayUser.id; // This will be the seller's ID in Firebase as well

      // 4. Create Terminal in Nearpay
      const trsmCode = generateTrsmCode();
      const terminal = await NearpayService.createTerminal({
        name: sellerData.name, // Seller's name for the terminal
        merchant_id: sellerData.merchant_id,
        trsm_code: trsmCode,
      });
      const terminalId = terminal.id;
      const tid = terminal.tid;

      // 5. Assign Terminal to User in Nearpay
      await NearpayService.assignTerminalToUser(terminalId, {
        name: sellerData.name,
        email: formattedEmail,
        mobile: nearpayMobile,
      });

      // 6. Hash password (MD5)
      const hashedPassword = CryptoJS.MD5(sellerData.password).toString();
      const creationTimestamp = new Date().toISOString();

      // 7. Add to 'accounts' collection in Firebase
      const authAccountRef = doc(
        db,
        FIRESTORE_COLLECTIONS.ACCOUNTS,
        sellerNearpayId
      );
      const authAccountData: AuthAccount = {
        id: sellerNearpayId,
        email: formattedEmail,
        mobile: formattedMobile,
        country_code: sellerData.country_code,
        password_hash: hashedPassword, // Firestore field is password_hash
        type: AccountType.Seller,
        status: sellerData.status, // Or default to AccountStatus.Active if not provided
      };
      await setDoc(authAccountRef, authAccountData);

      // 8. Add to 'end_users' collection in Firebase
      const sellerProfileRef = doc(
        db,
        FIRESTORE_COLLECTIONS.END_USERS,
        sellerNearpayId
      );
      const sellerProfileData = {
        id: sellerNearpayId,
        name: sellerData.name,
        email: formattedEmail,
        mobile: formattedMobile,
        country_code: sellerData.country_code,
        city: sellerData.city,
        status: sellerData.status,
        merchant_id: sellerData.merchant_id,
        terminal_id: terminalId,
        tid: tid,
        created_at: creationTimestamp,
      };
      await setDoc(sellerProfileRef, sellerProfileData);

      // عند الإرجاع، أضف type برمجياً
      return {
        ...sellerProfileData,
        type: AccountType.Seller,
      } as SellerProfile;
    } catch (error) {
      console.error("Error adding seller:", error);
      // Rethrow the error to be caught by the form hook
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("فشل في إضافة البائع. يرجى المحاولة مرة أخرى.");
    }
  }

  /**
   * تحديث بيانات بائع
   */
  static async updateSeller(
    id: string,
    sellerData: Partial<Omit<SellerProfile, "id" | "created_at" | "type">>
  ): Promise<SellerProfile> {
    try {
      // معالجة البريد الإلكتروني ورقم الهاتف إذا تم توفيرهما
      if (sellerData.email) {
        sellerData.email = formatEmail(sellerData.email);
      }

      if (sellerData.mobile) {
        sellerData.mobile = formatMobile(sellerData.mobile);
      }

      const sellerRef = doc(db, FIRESTORE_COLLECTIONS.END_USERS, id);

      const updateData: Partial<SellerProfile> = { ...sellerData };
      // Ensure `updated_at` is part of SellerProfile or handle it appropriately
      // (updateData as any).updated_at = new Date().toISOString();

      await updateDoc(sellerRef, updateData);

      // Also update relevant fields in the 'accounts' collection if necessary
      const accountUpdateData: Partial<AuthAccount> = {};
      if (sellerData.email) accountUpdateData.email = sellerData.email;
      if (sellerData.mobile) accountUpdateData.mobile = sellerData.mobile;
      if (sellerData.country_code)
        accountUpdateData.country_code = sellerData.country_code;
      if (sellerData.status) accountUpdateData.status = sellerData.status;

      if (Object.keys(accountUpdateData).length > 0) {
        // (accountUpdateData as any).updated_at = new Date().toISOString();
        const accountRef = doc(db, FIRESTORE_COLLECTIONS.ACCOUNTS, id);
        await updateDoc(accountRef, accountUpdateData);
      }

      const updatedSeller = await this.getSellerById(id);
      if (!updatedSeller) {
        throw new Error("لم يتم العثور على البائع بعد التحديث");
      }

      return updatedSeller;
    } catch (error) {
      console.error("Error updating seller:", error);
      throw error;
    }
  }

  /**
   * حذف بائع
   */
  static async deleteSeller(id: string): Promise<void> {
    try {
      const seller = await this.getSellerById(id);

      if (seller && seller.terminal_id) {
        // Attempt to unassign and disconnect terminal, ignore errors if they occur
        try {
          await NearpayService.unassignTerminal(seller.terminal_id);
        } catch (unassignError) {
          console.warn(
            `Could not unassign terminal ${seller.terminal_id} for seller ${id}:`,
            unassignError
          );
        }
        try {
          await NearpayService.disconnectTerminal(seller.terminal_id);
        } catch (disconnectError) {
          console.warn(
            `Could not disconnect terminal ${seller.terminal_id} for seller ${id}:`,
            disconnectError
          );
        }
      }

      await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.END_USERS, id));
      await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.ACCOUNTS, id));
    } catch (error) {
      console.error("Error deleting seller:", error);
      throw error;
    }
  }
}
