import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { loginAdmin } from "@/services/firebase/authService";

interface LoginFormErrors {
  email?: string;
  password?: string;
}

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    setShowForm(true);
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated && !auth.isLoading) {
      router.push("/dashboard");
    }
  }, [auth.isAuthenticated, auth.isLoading, router]);

  const validateForm = () => {
    const currentFieldErrors: LoginFormErrors = {};
    if (!email.trim()) {
      currentFieldErrors.email = "البريد الإلكتروني مطلوب.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      currentFieldErrors.email = "صيغة البريد الإلكتروني غير صحيحة.";
    }

    if (!password) {
      currentFieldErrors.password = "كلمة المرور مطلوبة.";
    }
    return currentFieldErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validationErrors = validateForm();
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const adminData = await loginAdmin(email, password);
      auth.login(adminData);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setFormError(
          err.message || "فشل تسجيل الدخول. الرجاء التحقق من بيانات الاعتماد."
        );
      } else {
        setFormError("فشل تسجيل الدخول. حدث خطأ غير متوقع.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    formError,
    fieldErrors,
    isLoading,
    showForm,
    handleSubmit,
    isAuthenticated: auth.isAuthenticated,
    isAuthLoading: auth.isLoading,
  };
};
