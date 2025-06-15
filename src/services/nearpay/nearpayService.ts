import axios, { isAxiosError, AxiosError } from 'axios';
import { NearpayTransaction, TransactionsResponse, GetTransactionsParams } from '../../types/models';

// Interfaces for Nearpay service methods
interface CreateMerchantParams {
  name: string;
  brandName: string;
  email: string;
  phone: string;
  countryCode: number;
}

interface ServerStatus {
  message: string;
  cluster: string;
  env: string;
  primary: boolean;
}

interface NearpayTransactionResponseWrapper {
  transaction: NearpayTransaction;
}

interface AccessTokenResponse {
  accessToken: string;
}

interface NearpayUserPayload {
  name: string;
  mobile: string; // Should be in format +countryCodePhone
  merchant_id: string;
  email: string;
}

interface NearpayUserResponse {
  id: string;
  // ... other user properties returned by Nearpay if needed
}

interface CreateTerminalPayload {
  name: string;
  merchant_id: string;
  trsm_code: string; // 6-digit random number
}

interface CreateTerminalResponse {
  id: string; // This is the terminal_id
  tid: string;
  // ... other terminal properties returned by Nearpay if needed
}

interface AssignTerminalPayload {
  name: string;
  email: string;
  mobile: string; // Should be in format +countryCodePhone
}

export class NearpayService {
    private static readonly API_BASE_URL = process.env.NEXT_PUBLIC_NEARPAY_API_BASE_URL || '';
    private static readonly API_KEY = process.env.NEXT_PUBLIC_NEARPAY_API_KEY || '';
    private static readonly REFRESH_TOKEN = process.env.NEXT_PUBLIC_NEARPAY_REFRESH_TOKEN || ''; 
    private static readonly NEARPAY_CLIENT_ID = process.env.NEXT_PUBLIC_NEARPAY_CLIENT_ID || '';

  /**
   * Get an access token from Nearpay using a refresh token.
   */
  static async getAccessToken(): Promise<string> {
    if (!this.REFRESH_TOKEN || this.REFRESH_TOKEN === '') {
      console.error('Nearpay Refresh Token is not configured.');
      throw new Error('Refresh Token for Nearpay is not configured. Please set NEXT_PUBLIC_NEARPAY_REFRESH_TOKEN.');
    }
    try {
      const response = await axios.post<AccessTokenResponse>(
        `${this.API_BASE_URL}/clients/refresh-access-token`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${this.REFRESH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data && response.data.accessToken) {
        return response.data.accessToken;
      }
      throw new Error('Failed to retrieve access token from Nearpay.');
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<unknown>; 
        console.error('Error getting Nearpay access token:', axiosError.response?.data || axiosError.message);
        throw new Error(`Failed to get Nearpay access token: ${(axiosError.response?.data as { message?: string })?.message || axiosError.message}`);
      } else {
        console.error('Error getting Nearpay access token:', error);
        throw new Error(`Failed to get Nearpay access token: ${(error as Error).message}`);
      }
    }
  }

  /**
   * Create a new user in Nearpay.
   */
  static async createNearpayUser(payload: NearpayUserPayload, accessToken: string): Promise<NearpayUserResponse> {
    try {
      const response = await axios.post<NearpayUserResponse>(
        `${this.API_BASE_URL}/clients/users`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'client_id': this.NEARPAY_CLIENT_ID,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data && response.data.id) {
        return response.data;
      }
      throw new Error('Failed to create user in Nearpay or ID not returned.');
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<unknown>; 
        console.error('Error creating Nearpay user:', axiosError.response?.data || axiosError.message);
        throw new Error(`Failed to create Nearpay user: ${(axiosError.response?.data as { message?: string })?.message || axiosError.message}`);
      } else {
        console.error('Error creating Nearpay user:', error);
        throw new Error(`Failed to create Nearpay user: ${(error as Error).message}`);
      }
    }
  }

  /**
   * Create a new terminal in Nearpay.
   */
  static async createTerminal(payload: CreateTerminalPayload): Promise<CreateTerminalResponse> {
    try {
      const response = await axios.post<{ terminal: CreateTerminalResponse }>(
        `${this.API_BASE_URL}/clients-sdk/terminals`,
        payload,
        {
          headers: {
            'api-key': this.API_KEY, 
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.terminal && response.data.terminal.id && response.data.terminal.tid) {
        return response.data.terminal;
      }
      console.error('data', response.data);
      throw new Error('Failed to create terminal in Nearpay or required fields (id, tid) not returned.');
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<unknown>; 
        console.error('Error creating Nearpay terminal:', axiosError.response?.data || axiosError.message);
        throw new Error(`Failed to create Nearpay terminal: ${(axiosError.response?.data as { message?: string })?.message || axiosError.message}`);
      } else {
        console.error('Error creating Nearpay terminal:', error);
        throw new Error(`Failed to create Nearpay terminal: ${(error as Error).message}`);
      }
    }
  }

  /**
   * Assign a terminal to a user in Nearpay.
   */
  static async assignTerminalToUser(terminalId: string, payload: AssignTerminalPayload): Promise<boolean> {
    try {
      await axios.post(
        `${this.API_BASE_URL}/clients-sdk/terminals/${terminalId}/assign`,
        payload,
        {
          headers: {
            'api-key': this.API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
      return true;
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<unknown>; 
        console.error(`Error assigning Nearpay terminal ${terminalId} to user:`, axiosError.response?.data || axiosError.message);
        throw new Error(`Failed to assign Nearpay terminal ${terminalId}: ${(axiosError.response?.data as { message?: string })?.message || axiosError.message}`);
      } else {
        console.error(`Error assigning Nearpay terminal ${terminalId} to user:`, error);
        throw new Error(`Failed to assign Nearpay terminal ${terminalId}: ${(error as Error).message}`);
      }
    }
  }

  /**
   * إنشاء تاجر جديد في نظام Nearpay
   * @param params بيانات التاجر
   * @returns معرّف التاجر الذي تم إنشاؤه
   */
  static async createMerchant(params: CreateMerchantParams): Promise<string> {
    try {
      const response = await axios.post(
        `${this.API_BASE_URL}/clients-sdk/merchants`,
        {
          name: params.brandName,
          name_ar: params.brandName,
          mobile: `+${params.countryCode}${params.phone}`,
          user: {
            name: params.name,
            email: params.email,
            mobile: `+${params.countryCode}${params.phone}`,
          },
        },
        {
          headers: {
            'api-key': this.API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.data && response.data.id) {
        return response.data.id;
      }
      
      throw new Error('لم يتم استلام معرّف التاجر من الخادم');
    } catch (error) {
      console.error('خطأ في إنشاء التاجر في Nearpay:', error);
      throw new Error('فشل في إنشاء التاجر في Nearpay. يرجى المحاولة مرة أخرى.');
    }
  }
  
  /**
   * التحقق من حالة الخادم
   * @returns حالة الخادم
   */
  static async checkServerStatus(): Promise<ServerStatus> {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/clients-sdk`);
      return response.data as ServerStatus;
    } catch (error) {
      console.error('خطأ في الاتصال مع Nearpay:', error);
      throw new Error('فشل في الاتصال مع Nearpay. يرجى المحاولة مرة أخرى.');
    }
  }

  /**
   * جلب قائمة المعاملات من Nearpay
   * @param params معلمات الاستعلام للمعاملات
   * @returns قائمة المعاملات وبيانات الترقيم
   */
  static async getTransactions(params?: GetTransactionsParams): Promise<TransactionsResponse> {
    try {
      const response = await axios.get(
        `${this.API_BASE_URL}/clients-sdk/transactions`,
        {
          headers: {
            'api-key': this.API_KEY,
            'Content-Type': 'application/json',
          },
          params: params,
        }
      );

      if (response.data && 
          typeof response.data === 'object' && 
          Array.isArray(response.data.transactions) &&
          typeof response.data.pages === 'object' &&
          typeof response.data.pages.current === 'number' &&
          typeof response.data.pages.total === 'number'
          ) {
        const transformedTransactions = response.data.transactions.map((tx: NearpayTransaction) => {
          const firstReceipt = tx.receipts && tx.receipts[0] ? tx.receipts[0] : null;
          return {
            ...tx,
            amount: firstReceipt?.amount_authorized?.value ? parseFloat(firstReceipt.amount_authorized.value) : tx.amount,
            currency: firstReceipt?.currency?.english || tx.currency,
            status: firstReceipt?.status_message?.english || tx.status || 'Unknown',
            type: firstReceipt?.transaction_type?.name?.english || tx.type || 'Unknown',
            merchant_id: tx.merchant?.id || tx.merchant_id,
            card_brand: firstReceipt?.card_scheme?.name?.english || tx.card_brand,
            last_four_digits: firstReceipt?.pan ? firstReceipt.pan.slice(-4) : tx.last_four_digits,
          } as NearpayTransaction;
        });

        return {
          transactions: transformedTransactions,
          pages: response.data.pages,
        };
      } else {
        console.error('Unexpected response structure from Nearpay /transactions:', response.data);
        throw new Error('فشلت خدمة Nearpay في جلب المعاملات بصيغة صحيحة. تحقق من تفاصيل الاستجابة في الكونسول.');
      }

    } catch (error) {
      let errorMessage = 'فشل في جلب المعاملات من Nearpay. يرجى المحاولة مرة أخرى.';
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<unknown>; 
        console.error('Axios error fetching transactions from Nearpay:', {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          message: axiosError.message,
          url: axiosError.config?.url,
          params: axiosError.config?.params,
        });
        if ((axiosError.response?.data as { message?: string })?.message) {
          errorMessage = `فشل في جلب المعاملات: ${(axiosError.response!.data as { message: string }).message}`;
        } else if (axiosError.message) {
          errorMessage = axiosError.message;
        }
      } else if (error instanceof Error) {
        console.error('Error fetching transactions from Nearpay:', error.message);
        errorMessage = error.message;
      } else {
        console.error('Unknown error fetching transactions from Nearpay:', error);
      }
      throw new Error(errorMessage);
    }
  }

  /**
   * جلب تفاصيل معاملة محددة من Nearpay
   * @param transactionId معرّف المعاملة
   * @returns تفاصيل المعاملة
   */
  static async getTransactionById(transactionId: string): Promise<NearpayTransaction> {
    try {
      const response = await axios.get<NearpayTransactionResponseWrapper>(
        `${this.API_BASE_URL}/clients-sdk/transactions/${transactionId}`,
        {
          headers: {
            'api-key': this.API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && typeof response.data === 'object' && response.data.transaction) {
        const tx = response.data.transaction;
        const firstReceipt = tx.receipts && tx.receipts[0] ? tx.receipts[0] : null;
        const transformedTransaction = {
          ...tx,
          amount: firstReceipt?.amount_authorized?.value ? parseFloat(firstReceipt.amount_authorized.value) : tx.amount,
          currency: firstReceipt?.currency?.english || tx.currency,
          status: firstReceipt?.status_message?.english || tx.status || 'Unknown',
          type: firstReceipt?.transaction_type?.name?.english || tx.type || 'Unknown',
          merchant_id: tx.merchant?.id || tx.merchant_id,
          card_brand: firstReceipt?.card_scheme?.name?.english || tx.card_brand,
          last_four_digits: firstReceipt?.pan ? firstReceipt.pan.slice(-4) : tx.last_four_digits,
        } as NearpayTransaction;
        return transformedTransaction;
      } else {
        console.error(`Unexpected response structure for transaction ${transactionId} from Nearpay:`, response.data);
        throw new Error('فشلت خدمة Nearpay في جلب تفاصيل المعاملة بصيغة صحيحة.');
      }

    } catch (error) {
      let errorMessage = `فشل في جلب تفاصيل المعاملة ${transactionId} من Nearpay.`;
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<unknown>; 
        console.error(`Axios error fetching transaction ${transactionId} from Nearpay:`, {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          message: axiosError.message,
        });
        if ((axiosError.response?.data as { message?: string })?.message) {
          errorMessage = `فشل في جلب تفاصيل المعاملة`;
        } else if (axiosError.message) {
          errorMessage = axiosError.message;
        }
      } else if (error instanceof Error) {
        console.error(`Error fetching transaction ${transactionId} from Nearpay:`, error.message);
        errorMessage = error.message;
      } else {
        console.error(`Unknown error fetching transaction ${transactionId} from Nearpay:`, error);
      }
      throw new Error(errorMessage);
    }
  }

  /**
   * إلغاء تعيين الطرفية من المستخدم
   * @param terminalId معرّف الطرفية
   * @returns true في حالة النجاح
   */
  static async unassignTerminal(terminalId: string): Promise<boolean> {
    try {
      await axios.put(
        `${this.API_BASE_URL}/clients-sdk/terminals/${terminalId}/unassign`,
        {},
        {
          headers: {
            'api-key': this.API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
      return true;
    } catch (error) {
      console.error(`Failed to unassign terminal ${terminalId}:`, error);
      return false;
    }
  }

  /**
   * فصل الطرفية
   * @param terminalId معرّف الطرفية
   * @returns true في حالة النجاح
   */
  static async disconnectTerminal(terminalId: string): Promise<boolean> {
    try {
      await axios.put(
        `${this.API_BASE_URL}/clients-sdk/terminals/${terminalId}/disconnect`,
        {},
        {
          headers: {
            'api-key': this.API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
      return true;
    } catch (error) {
      console.error(`Terminal disconnect failure ${terminalId}:`, error);
      return false;
    }
  }
} 