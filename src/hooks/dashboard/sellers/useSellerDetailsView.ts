import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { SellerService, MerchantService } from "@/services/firebase";
import { NearpayService } from "@/services/nearpay/nearpayService";
import type {
  SellerProfile,
  MerchantProfile,
  NearpayTransaction,
} from "@/types/models";
import { formatBase64Image as utilFormatBase64Image } from "@/utils/imageUtils";

interface SellerStats {
  totalTransactions: number;
  totalAmount: number;
}

export const useSellerDetailsView = () => {
  const router = useRouter();
  const sellerId = typeof router.query.id === "string" ? router.query.id : null;

  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [merchant, setMerchant] = useState<MerchantProfile | null>(null);
  const [transactions, setTransactions] = useState<NearpayTransaction[]>([]);
  const [sellerStats, setSellerStats] = useState<SellerStats>({
    totalTransactions: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatBase64Image = useCallback(
    (base64String: string | undefined | null) => {
      if (!base64String) return "/assets/placeholder-logo.png"; // Default placeholder
      return utilFormatBase64Image(base64String);
    },
    []
  );

  const fetchSellerDetails = useCallback(async () => {
    if (!sellerId) {
      setError("معرف البائع غير موجود.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sellerData = await SellerService.getSellerById(sellerId);
      if (!sellerData) {
        setError("لم يتم العثور على البائع.");
        setSeller(null);
        setMerchant(null);
        setTransactions([]);
        setSellerStats({ totalTransactions: 0, totalAmount: 0 });
        setLoading(false);
        return;
      }
      setSeller(sellerData);

      if (sellerData.merchant_id) {
        const merchantData = await MerchantService.getMerchantById(
          sellerData.merchant_id
        );
        setMerchant(merchantData);
      } else {
        setMerchant(null);
      }

      // Nearpay's API might use user_id generally, ensure to filter for this specific seller
      const transactionResponse = await NearpayService.getTransactions({
        terminal_id: sellerData.terminal_id || undefined,
        limit: 100,
      });

      // Client-side filter for extra safety or if API doesn't perfectly match seller ID
      const sellerTransactions = transactionResponse.transactions.filter(
        (tx) =>
          (sellerData.terminal_id &&
            tx.terminal?.tid === sellerData.terminal_id) || // Match by terminal ID if available
          tx.user?.id === sellerId // Or match by user ID if that's how Nearpay links them
      );
      setTransactions(sellerTransactions);

      let totalAmount = 0;
      sellerTransactions.forEach((tx) => {
        const status = tx.status?.toLowerCase();
        if (
          tx.amount &&
          (status === "succeeded" ||
            status === "success" ||
            status === "approved" ||
            status === "accepted")
        ) {
          totalAmount += tx.amount;
        }
      });
      setSellerStats({
        totalTransactions: sellerTransactions.length,
        totalAmount: totalAmount,
      });
    } catch (err) {
      console.error("Error fetching seller details:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "حدث خطأ غير متوقع أثناء جلب بيانات البائع.";
      setError(errorMessage);
      setSeller(null);
      setMerchant(null);
      setTransactions([]);
      setSellerStats({ totalTransactions: 0, totalAmount: 0 });
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  useEffect(() => {
    if (sellerId) {
      fetchSellerDetails();
    } else {
      setLoading(false);
    }
  }, [sellerId, fetchSellerDetails]);

  const handleEditSeller = () => {
    if (sellerId) {
      router.push(`/dashboard/sellers/edit/${sellerId}`);
    }
  };

  const handleViewTransaction = (transactionId: string) => {
    router.push(`/dashboard/transactions/${transactionId}`);
  };

  const handleViewMerchant = () => {
    if (merchant?.id) {
      router.push(`/dashboard/merchants/${merchant.id}`);
    }
  };

  return {
    seller,
    merchant,
    transactions,
    sellerStats,
    loading,
    error,
    router,
    sellerId,
    handleEditSeller,
    handleViewTransaction,
    handleViewMerchant,
    formatBase64Image,
  };
};
