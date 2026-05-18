/**
 * middleware.ts
 * ─────────────
 * يحمي مسارات /dashboard من المستخدمين غير المسجلين.
 * يعمل على حافة الشبكة (Edge) قبل عرض أي صفحة.
 *
 * الآلية:
 *  1. يقرأ الـ session من الـ cookies.
 *  2. إذا كان المستخدم غير مسجل وحاول الوصول لـ /dashboard → يُعاد توجيهه لـ /auth/login
 *  3. إذا كان مسجلاً وحاول الوصول لـ /auth/login أو /auth/register → يُعاد توجيهه لـ /dashboard
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // لا تحذف هذا السطر — ضروري لتحديث الـ session
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // مستخدم غير مسجل → حماية /dashboard
  if (!user && pathname.startsWith("/dashboard")) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // مستخدم مسجل → لا حاجة لصفحات Auth
  if (user && (pathname === "/auth/login" || pathname === "/auth/register")) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // تطبيق الـ middleware على كل المسارات ما عدا الملفات الثابتة
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
