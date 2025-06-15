import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/services/firebase/config";
import { AccountStatus, AccountType } from "@/types/enums";
import { NearpayTransaction } from "@/types/models";
import { NearpayService } from "@/services/nearpay/nearpayService";

export interface MerchantDetails {
  id: string;
  name: string;
  brand_name?: string;
  email: string;
  mobile: string;
  logo?: string;
  status: AccountStatus;
  address?: string;
  city?: string;
  district?: string;
  created_at: string;
  country_code?: number;
  type?: AccountType;
  iban?: string;
  image_front_id_card?: string;
  image_back_id_card?: string;
  image_commercial_registration_or_freelance_focument?: string;
}

export interface MerchantSeller {
  id: string;
  name: string;
  email: string;
  mobile: string;
  status: AccountStatus;
  created_at: string;
  merchant_id: string;
}

export interface MerchantStats {
  totalSellers: number;
  totalTransactions: number;
  totalAmount: number;
  activeSellers: number;
}

export const useMerchantDetails = (merchantId: string | undefined) => {
  const [merchant, setMerchant] = useState<MerchantDetails | null>(null);
  const [sellers, setSellers] = useState<MerchantSeller[]>([]);
  const [transactions, setTransactions] = useState<NearpayTransaction[]>([]);
  const [stats, setStats] = useState<MerchantStats>({
    totalSellers: 0,
    totalTransactions: 0,
    totalAmount: 0,
    activeSellers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!merchantId) {
      setLoading(false);
      setError("معرف التاجر مفقود");
      return;
    }

    const fetchMerchantData = async () => {
      try {
        setLoading(true);

        // جلب بيانات التاجر من Firebase
        const merchantDocRef = doc(db, "merchants", merchantId);
        const merchantDoc = await getDoc(merchantDocRef);

        if (!merchantDoc.exists()) {
          setError("لم يتم العثور على بيانات التاجر");
          setLoading(false);
          return;
        }

        const merchantData = {
          id: merchantDoc.id,
          ...merchantDoc.data(),
        } as MerchantDetails;

        setMerchant(merchantData);

        // جلب البائعين التابعين للتاجر من Firebase - جدول end_users
        const sellersQuery = query(
          collection(db, "end_users"),
          where("merchant_id", "==", merchantId)
        );

        const sellersSnapshot = await getDocs(sellersQuery);
        const sellersData = sellersSnapshot.docs.map((doc) => ({
          id: doc.id,
          merchant_id: merchantId,
          ...doc.data(),
        })) as MerchantSeller[];

        setSellers(sellersData);

        // جلب المعاملات من Nearpay API باستخدام merchant_id
        try {
          const transactionsResponse = await NearpayService.getTransactions({
            merchant_id: merchantId,
            limit: 50, // نحدد عدد النتائج كمثال
          });

          if (transactionsResponse && transactionsResponse.transactions) {
            setTransactions(transactionsResponse.transactions);

            // حساب إحصائيات المعاملات
            const totalAmount = transactionsResponse.transactions.reduce(
              (sum, tx) => sum + (tx.amount || 0),
              0
            );

            // تحديث الإحصائيات
            setStats({
              totalSellers: sellersData.length,
              totalTransactions: transactionsResponse.transactions.length,
              totalAmount,
              activeSellers: sellersData.filter(
                (seller) => seller.status === AccountStatus.Active
              ).length,
            });
          }
        } catch (apiError) {
          console.error("خطأ في جلب المعاملات من Nearpay API:", apiError);
          // في حالة فشل جلب المعاملات، نستمر في عرض بيانات التاجر والبائعين
          setStats({
            totalSellers: sellersData.length,
            totalTransactions: 0,
            totalAmount: 0,
            activeSellers: sellersData.filter(
              (seller) => seller.status === AccountStatus.Active
            ).length,
          });
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching merchant details:", err);
        setError("حدث خطأ أثناء جلب بيانات التاجر");
        setLoading(false);
      }
    };

    fetchMerchantData();
  }, [merchantId]);

  return {
    merchant,
    sellers,
    transactions,
    stats,
    loading,
    error,
  };
};
