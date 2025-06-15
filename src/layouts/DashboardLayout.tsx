import React, { useState, useEffect, ReactNode, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAuth } from "../contexts/AuthContext";
import {
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  ChevronDoubleRightIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  ArrowLeftEndOnRectangleIcon,
  XMarkIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useAdminLoginStatus } from "@/hooks/security/useAdminLoginStatus";
import { BackgroundEffects, LogoutAlert, ConfirmDialog } from "@/components/ui";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const auth = useAuth();
  const router = useRouter();

  // استخدام التحقق من حالة المشرف
  const { shouldLogout, message } = useAdminLoginStatus();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("smartpay-theme");
      setIsDarkMode(storedTheme === "dark");
    } catch (error) {
      console.error("Error checking theme status:", error);
    }
  }, []);

  // التحقق من حجم الشاشة
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // معالجة النقر خارج الشريط الجانبي
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile &&
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  // إغلاق الشريط الجانبي عند تغيير المسار في الموبايل
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [router.pathname, isMobile]);

  const toggleTheme = () => {
    try {
      document.body.style.pointerEvents = "none";
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);

      if (newTheme) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("smartpay-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("smartpay-theme", "light");
      }

      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 250);
    } catch (error) {
      console.error("Error toggling theme:", error);
      document.body.style.pointerEvents = "";
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const openLogoutDialog = () => {
    setIsLogoutDialogOpen(true);
  };

  const closeLogoutDialog = () => {
    setIsLogoutDialogOpen(false);
  };

  const handleLogout = () => {
    auth.logout();
    router.push("/login");
    closeLogoutDialog();
  };

  const isActiveRoute = (path: string) => {
    return router.pathname === path;
  };

  const navigationItems = [
    { name: "الرئيسية", icon: HomeIcon, path: "/dashboard" },
    { name: "المشرفين", icon: UsersIcon, path: "/dashboard/admins" },
    { name: "التجار", icon: ShoppingBagIcon, path: "/dashboard/merchants" },
    {
      name: "البائعين",
      icon: BuildingStorefrontIcon,
      path: "/dashboard/sellers",
    },
    { name: "المعاملات", icon: ChartBarIcon, path: "/dashboard/transactions" },
    { name: "الإعدادات", icon: Cog6ToothIcon, path: "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-grey-100 via-grey-50 to-white dark:from-grey-900 dark:via-grey-800 dark:to-grey-900 transition-colors duration-250">
      {/* تأثيرات الخلفية */}
      <BackgroundEffects />

      {/* إشعار تسجيل الخروج الإجباري */}
      <LogoutAlert
        isOpen={shouldLogout}
        message={message || "تم إلغاء تنشيط حسابك أو حذفه من النظام"}
      />

      {/* شاشة تأكيد تسجيل الخروج */}
      <ConfirmDialog
        isOpen={isLogoutDialogOpen}
        title="تأكيد تسجيل الخروج"
        message="هل أنت متأكد من رغبتك في تسجيل الخروج؟ سيتم إنهاء جلستك الحالية وستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى لوحة التحكم."
        confirmText="تسجيل الخروج"
        cancelText="إلغاء"
        onConfirm={handleLogout}
        onCancel={closeLogoutDialog}
        type="error"
      />

      {/* الشريط الجانبي */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 ${
          isSidebarOpen ? "right-0" : "-right-96"
        } z-40 h-screen transition-all duration-300 hardware-accelerated md:${
          isSidebarOpen ? "w-80" : "w-20"
        } bg-primary-600 dark:bg-primary-700/100 backdrop-blur-xl border-l border-white/10 dark:border-white/5 shadow-lg md:right-0`}
      >
        <div className="h-full flex flex-col">
          {/* الشعار والعنوان */}
          <div
            className={`pt-8 pb-6 px-4 h-24 flex items-center justify-between ${
              isSidebarOpen ? "pr-4" : "pr-0 md:pr-4 justify-center"
            }`}
          >
            <div className="flex items-center space-x-3 space-x-reverse">
              {isSidebarOpen && (
                <div className="relative w-8 h-8">
                  <Image
                    src={
                      isDarkMode
                        ? "/logo/logo-white.png"
                        : "/logo/logo-white.png"
                    }
                    alt="smartpay Logo"
                    width={32}
                    height={32}
                    className="relative z-10"
                  />
                </div>
              )}
              {isSidebarOpen && (
                <h1 className="text-2xl font-extrabold text-white mr-2">
                  سمارت باي
                </h1>
              )}
            </div>

            <button
              onClick={toggleSidebar}
              className="p-2 rounded-full text-white hover:bg-[#7c8495]/30 transition-colors"
            >
              {isSidebarOpen ? (
                isMobile ? (
                  <XMarkIcon className="w-7 h-7" />
                ) : (
                  <ChevronDoubleRightIcon className="w-6 h-6" />
                )
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* عناصر التنقل */}
          <nav className="flex-1 py-6 px-3 space-y-2.5 overflow-y-auto">
            {navigationItems.map((item) => {
              const active = isActiveRoute(item.path);
              const Icon = item.icon;

              return (
                <a
                  key={item.name}
                  href={item.path}
                  className={`flex items-center ${
                    isSidebarOpen ? "px-4" : "px-3 justify-center"
                  } py-3 rounded-xl transition-all group text-[17px] md:text-[18px]
                  ${
                    active
                      ? "bg-gray-400/20 border-r-4 border-white text-white font-bold"
                      : "text-white/90 hover:bg-[#7c8495]/20 hover:border-r-4 hover:border-white/60"
                  }`}
                >
                  <Icon
                    className={`h-7 w-7 ${
                      isSidebarOpen ? "ml-4" : ""
                    } transition-colors ${
                      active
                        ? "text-white"
                        : "text-white/90 group-hover:text-white"
                    }`}
                  />
                  {isSidebarOpen && (
                    <span className={active ? "font-bold" : "font-medium"}>
                      {item.name}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* قسم تسجيل الخروج */}
          <div
            className={`mt-auto px-3 pb-4 ${isSidebarOpen ? "py-3" : "py-2"}`}
          >
            <button
              onClick={openLogoutDialog}
              className={`w-full flex items-center cursor-pointer ${
                isSidebarOpen ? "px-4 justify-start" : "px-3 justify-center"
              } py-3 text-white/90 hover:bg-[#7c8495]/20 rounded-xl transition-all text-[17px]`}
            >
              <ArrowLeftEndOnRectangleIcon
                className={`h-7 w-7 ${isSidebarOpen ? "ml-3" : ""}`}
              />
              {isSidebarOpen && <span>تسجيل الخروج</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* الشريط العلوي */}
      <header
        className={`fixed top-0 left-0 right-0 z-20 transition-all duration-300 hardware-accelerated ${
          isSidebarOpen ? "md:mr-80" : "md:mr-20"
        } mr-0`}
      >
        <div className="bg-white/30 dark:bg-grey-800/20 backdrop-blur-lg border-b border-grey-300/40 dark:border-grey-700/20">
          <div className="flex items-center justify-start h-16 md:h-20">
            {/* زر القائمة للموبايل */}
            <button
              onClick={toggleSidebar}
              className="p-6 rounded-xl text-grey-600 hover:bg-grey-100/60 dark:text-grey-400 dark:hover:bg-grey-700/30 transition-colors md:hidden"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            {/* العناصر على اليسار */}
            <div className="flex items-center gap-3 md:gap-4 mr-auto md:ml-0 md:mr-auto px-8">
              {/* زر تبديل الثيم */}
              <button
                onClick={toggleTheme}
                className="bg-white/40 dark:bg-grey-800/40 cursor-pointer backdrop-blur-lg rounded-xl p-2 md:p-2.5 border-2 border-gray-200/60 dark:border-gray-700 hover:bg-white/60 dark:hover:bg-grey-800/60 transition-all duration-250 text-primary-500 dark:text-primary-400"
              >
                {isDarkMode ? (
                  <MoonIcon className="w-5 h-5 md:w-6 md:h-6" />
                ) : (
                  <SunIcon className="w-5 h-5 md:w-6 md:h-6" />
                )}
              </button>

              {/* الملف الشخصي مع قائمة منسدلة */}
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center rounded-xl border-2 cursor-pointer border-gray-200/60 dark:border-gray-700 hover:bg-white/40 dark:hover:bg-grey-700/30 transition-all duration-200"
                >
                  <div className="relative w-9 h-9 md:w-11 md:h-11 overflow-hidden rounded-xl bg-white/40 dark:bg-grey-800/40 backdrop-blur-lg flex items-center justify-center">
                    <div
                      className="absolute inset-0 bg-primary-400/5 dark:bg-primary-500/5 animate-pulse"
                      style={{ animationDuration: "3s" }}
                    ></div>
                    <span className="relative z-10 text-base md:text-lg font-medium text-primary-700 dark:text-primary-300">
                      {auth.profile?.name?.[0] || "م"}
                    </span>
                  </div>
                </button>

                {/* القائمة المنسدلة */}
                {isProfileMenuOpen && (
                  <div className="absolute left-0 mt-2 w-56 md:w-64 rounded-xl shadow-lg py-1 bg-white/95 dark:bg-grey-800/95 backdrop-blur-lg ring-1 ring-grey-200/50 dark:ring-grey-700/30 z-50 origin-top-left transition-all">
                    <div className="px-4 py-3 border-b border-grey-100/50 dark:border-grey-700/30">
                      <p className="text-[15px] md:text-[16px] leading-5 text-grey-900 dark:text-white font-medium">
                        {auth.profile?.name || "المستخدم"}
                      </p>
                      <p className="text-[13px] md:text-[14px] leading-4 text-grey-500 dark:text-grey-400 mt-1 truncate">
                        {auth.profile?.email || "admin@smartpay.com"}
                      </p>
                    </div>
                    <a
                      href={`/dashboard/admins/${auth.profile?.id}`}
                      className="block px-4 py-2.5 md:py-3 text-[14px] md:text-[15px] text-grey-700 dark:text-grey-300 hover:bg-grey-100/50 dark:hover:bg-grey-700/30"
                    >
                      الملف الشخصي
                    </a>
                    <button
                      onClick={openLogoutDialog}
                      className="block w-full cursor-pointer text-right px-4 py-2.5 md:py-3 text-[14px] md:text-[15px] text-danger-600 dark:text-danger-400 hover:bg-danger-50/50 dark:hover:bg-danger-900/30 border-t border-grey-100/50 dark:border-grey-700/30 mt-1"
                    >
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main
        className={`transition-all relative z-10 duration-300 pt-14 px-4 ${
          isSidebarOpen ? "md:mr-80" : "md:mr-20"
        } mr-0`}
      >
        <div className="p-4 md:p-6 lg:p-8">
          {/* رأس الصفحة وشريط التنقل العلوي */}
          <div className="flex justify-between items-center mb-8">
            {title && (
              <h1 className="text-2xl font-bold text-grey-900 dark:text-white">
                {title}
              </h1>
            )}

            {/* ... existing code ... */}
          </div>

          {/* المحتوى */}
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
