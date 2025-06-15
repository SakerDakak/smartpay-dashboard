import { useState, useEffect } from 'react';
import { ConfigService, PolicyDocument } from '@/services/firebase/configService';

export interface UseConfigSettingsReturn {
  privacyPolicy: PolicyDocument | null;
  termsOfService: PolicyDocument | null;
  loading: boolean;
  error: string | null;
  updatePrivacyPolicy: (data: string) => Promise<void>;
  updateTermsOfService: (data: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useConfigSettings = (): UseConfigSettingsReturn => {
  const [privacyPolicy, setPrivacyPolicy] = useState<PolicyDocument | null>(null);
  const [termsOfService, setTermsOfService] = useState<PolicyDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [privacyData, termsData] = await Promise.all([
        ConfigService.getPrivacyPolicy(),
        ConfigService.getTermsOfService()
      ]);
      
      setPrivacyPolicy(privacyData);
      setTermsOfService(termsData);
    } catch (err) {
      console.error('فشل في استرجاع بيانات الإعدادات:', err);
      setError('حدث خطأ أثناء استرجاع بيانات الإعدادات. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updatePrivacyPolicy = async (data: string) => {
    setLoading(true);
    setError(null);
    try {
      await ConfigService.updatePrivacyPolicy(data);
      setPrivacyPolicy({ data });
    } catch (err) {
      console.error('فشل في تحديث سياسة الخصوصية:', err);
      setError('حدث خطأ أثناء تحديث سياسة الخصوصية. يرجى المحاولة مرة أخرى.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTermsOfService = async (data: string) => {
    setLoading(true);
    setError(null);
    try {
      await ConfigService.updateTermsOfService(data);
      setTermsOfService({ data });
    } catch (err) {
      console.error('فشل في تحديث شروط الخدمة:', err);
      setError('حدث خطأ أثناء تحديث شروط الخدمة. يرجى المحاولة مرة أخرى.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    privacyPolicy,
    termsOfService,
    loading,
    error,
    updatePrivacyPolicy,
    updateTermsOfService,
    refreshData: fetchData
  };
}; 