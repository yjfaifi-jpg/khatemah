/**
 * lib/supabaseServer.ts
 * ─────────────────────
 * عميل Supabase للاستخدام في Server Components و Route Handlers.
 * يقرأ الـ cookies تلقائياً للمصادقة من جانب الخادم.
 */

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // يُتجاهل في Server Components (القراءة فقط)
          }
        },
      },
    }
  );
}

/**
 * يجلب المستخدم الحالي من الخادم.
 * يُستخدم في Server Components للتحقق من تسجيل الدخول.
 */
export async function getUser() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * يجلب الملف الشخصي للمعلم من جدول profiles.
 */
export async function getProfile(userId: string) {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}
