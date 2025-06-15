import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  NearpayTransaction,
  MerchantProfile,
  SellerProfile,
} from "@/types/models";
import { NearpayService } from "@/services/nearpay/nearpayService";
import { MerchantService } from "@/services/firebase/merchantService";
import { SellerService } from "@/services/firebase/sellerService";

export const useTransactionView = () => {
  const router = useRouter();
  const { id } = router.query;
  const [transaction, setTransaction] = useState<NearpayTransaction | null>(
    null
  );
  const [merchantProfile, setMerchantProfile] =
    useState<MerchantProfile | null>(null);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [merchantError, setMerchantError] = useState<string | null>(null);
  const [sellerError, setSellerError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!id || typeof id !== "string") return;

      setLoading(true);
      setError(null);
      setMerchantProfile(null);
      setSellerProfile(null);
      setMerchantError(null);
      setSellerError(null);

      try {
        const txData = await NearpayService.getTransactionById(id);
        setTransaction(txData);

        const merchantIdToFetch = txData?.merchant?.id || txData?.merchant_id;
        if (merchantIdToFetch) {
          try {
            const merchant = await MerchantService.getMerchantById(
              merchantIdToFetch
            );
            if (merchant) {
              setMerchantProfile(merchant);
            } else {
              setMerchantError(
                "لم يتم العثور على التاجر في النظام. قد يكون قد تم حذفه."
              );
            }
          } catch (err) {
            console.error("Error fetching merchant from Firebase:", err);
            setMerchantError(
              "خطأ أثناء جلب بيانات التاجر. قد يكون قد تم حذفه."
            );
          }
        } else {
          setMerchantError("معرف التاجر غير متوفر في بيانات المعاملة.");
        }

        const sellerIdToFetch = txData?.user?.id;
        if (sellerIdToFetch) {
          try {
            const seller = await SellerService.getSellerById(sellerIdToFetch);
            if (seller) {
              setSellerProfile(seller);
            } else {
              setSellerError(
                "لم يتم العثور على البائع في النظام. قد يكون قد تم حذفه."
              );
            }
          } catch (err) {
            console.error(
              "Error fetching seller (end user) from Firebase:",
              err
            );
            setSellerError("خطأ أثناء جلب بيانات البائع. قد يكون قد تم حذفه.");
          }
        } // No error if user.id is not present, simply don't display seller info from Firebase
      } catch (err) {
        console.error("Error fetching transaction details:", err);
        if (err instanceof Error) {
          setError(err.message || "حدث خطأ في جلب تفاصيل المعاملة");
        } else {
          setError("حدث خطأ غير متوقع في جلب تفاصيل المعاملة");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [id]);

  const displayAmount =
    transaction?.amount !== undefined
      ? transaction.amount
      : transaction?.receipts &&
        transaction.receipts[0]?.amount_authorized?.value
      ? parseFloat(transaction.receipts[0].amount_authorized.value)
      : "N/A";
  const displayCurrency =
    transaction?.currency ||
    (transaction?.receipts && transaction.receipts[0]?.currency?.english) ||
    "";
  const displayStatus =
    transaction?.status ||
    (transaction?.receipts &&
      transaction.receipts[0]?.status_message?.english) ||
    "Unknown";
  const displayType =
    transaction?.type ||
    (transaction?.receipts &&
      transaction.receipts[0]?.transaction_type?.name?.english) ||
    "Unknown";
  const displayMerchantId =
    transaction?.merchant?.id || transaction?.merchant_id || "N/A";
  const displaySellerIdFromTx =
    transaction?.user?.id ||
    (transaction?.metadata?.seller_id as string) ||
    "N/A";

  return {
    router,
    id,
    transaction,
    merchantProfile,
    sellerProfile,
    loading,
    error,
    merchantError,
    sellerError,
    displayAmount,
    displayCurrency,
    displayStatus,
    displayType,
    displayMerchantId,
    displaySellerIdFromTx,
  };
};
