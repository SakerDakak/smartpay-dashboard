import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminLoginSuccess } from '../services/firebase/authService'; // المسار قد يحتاج تعديل
import { AuthAccount, AdminProfile } from '../types/models'; // المسار قد يحتاج تعديل
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthAccount | null;
  profile: AdminProfile | null;
  isLoading: boolean;
  login: (data: AdminLoginSuccess) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthAccount | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true); // للتحقق من localStorage عند التحميل الأولي

  useEffect(() => {
    try {
      // قراءة البيانات من الكوكيز
      const storedUser = Cookies.get('auth-user');
      const storedProfile = Cookies.get('auth-profile');
      
      if (storedUser && storedProfile) {
        setUser(JSON.parse(storedUser));
        setProfile(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error("Failed to parse auth data from cookies", error);
      // في حال وجود خطأ، تأكد من حذف البيانات التالفة
      Cookies.remove('auth-user');
      Cookies.remove('auth-profile');
    }
    setIsLoading(false);
  }, []);

  const login = (data: AdminLoginSuccess) => {
    setUser(data.authAccount);
    setProfile(data.adminProfile);
    
    // حفظ البيانات في الكوكيز
    Cookies.set('auth-user', JSON.stringify(data.authAccount), { 
      expires: 7, // تنتهي صلاحية الكوكيز بعد 7 أيام
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    
    Cookies.set('auth-profile', JSON.stringify(data.adminProfile), {
      expires: 7,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    
    // حذف الكوكيز
    Cookies.remove('auth-user');
    Cookies.remove('auth-profile');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!user, 
      user, 
      profile, 
      isLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 