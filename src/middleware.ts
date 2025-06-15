import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// المسارات العامة التي لا تحتاج إلى مصادقة
const PUBLIC_PATHS = ['/login'];

// التحقق من أن المسار ليس ملفاً ثابتاً أو API
const isPublicFile = (pathname: string): boolean => {
  return pathname.startsWith('/_next') || 
         pathname.startsWith('/api') || 
         pathname.startsWith('/assets') || 
         pathname === '/favicon.ico';
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // تجاهل الملفات العامة و API
  if (isPublicFile(pathname)) {
    return NextResponse.next();
  }

  // إذا كان المستخدم يحاول الوصول إلى الصفحة الرئيسية، وجهه إلى تسجيل الدخول
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // التحقق من وجود جلسة المستخدم
  const hasAuthTokens = request.cookies.has('auth-user') && request.cookies.has('auth-profile');

  // إذا كان المسار عاماً، اسمح بالوصول
  if (PUBLIC_PATHS.includes(pathname)) {
    // إذا كان المستخدم مسجل الدخول ويحاول الوصول إلى صفحة تسجيل الدخول
    // قم بتوجيهه إلى لوحة التحكم
    if (hasAuthTokens && pathname === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // إذا كان المسار يبدأ بـ /dashboard ولم يكن المستخدم مسجل الدخول
  // قم بتوجيهه إلى صفحة تسجيل الدخول
  if (pathname.startsWith('/dashboard') && !hasAuthTokens) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    // إضافة رأس لمنع التخزين المؤقت
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    return response;
  }
  
  // إضافة متغير للتحقق من حالة المشرف في كوكيز الرد
  // سيتم استخدامه في المكونات للتحقق من حالة المشرف
  if (pathname.startsWith('/dashboard') && hasAuthTokens) {
    const response = NextResponse.next();
    // إضافة رأس للتحقق من المشرف
    response.headers.set('X-Check-Admin-Status', 'true');
    return response;
  }

  // السماح بالمرور لباقي الطلبات
  return NextResponse.next();
}

// تحديد المسارات التي سيتم تطبيق الـ Middleware عليها
export const config = {
  matcher: [
    /*
     * تطابق جميع مسارات الطلبات باستثناء تلك التي تبدأ بـ:
     * - api (مسارات API)
     * - _next/static (ملفات ثابتة لـ Next.js)
     * - _next/image (تحسينات صور Next.js)
     * - assets (مجلد الأصول العامة الخاص بك)
     * - favicon.ico (ملف أيقونة الموقع)
     */
    '/',
    '/login',
    '/dashboard/:path*'
  ],
}; 