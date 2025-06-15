import React, { createContext, ReactNode, useEffect, useState } from "react";
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="smartpay-theme"
    >
      <ThemeProviderContent>{children}</ThemeProviderContent>
    </NextThemeProvider>
  );
};

const ThemeProviderContent: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // التحقق من الثيم الفعلي عند تحميل المكون والتغييرات
  useEffect(() => {
    // استخدام resolvedTheme للحصول على الثيم النهائي بعد تطبيق إعدادات النظام
    setIsDarkMode(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const toggleTheme = () => {
    try {
      // تعطيل تفاعل المستخدم مؤقتًا لتحسين الأداء أثناء التبديل
      document.body.style.pointerEvents = "none";

      // تبديل الثيم
      setTheme(resolvedTheme === "dark" ? "light" : "dark");

      // إعادة تمكين تفاعل المستخدم بعد انتهاء التبديل
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 250);
    } catch (error) {
      console.error("Error toggling theme:", error);
      document.body.style.pointerEvents = "";
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
