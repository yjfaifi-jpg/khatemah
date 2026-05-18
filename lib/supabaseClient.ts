/**
 * lib/supabaseClient.ts
 * ─────────────────────
 * عميل Supabase للاستخدام في Client Components (المتصفح).
 * يُستخدم في مكونات "use client" فقط.
 */

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/** نسخة مفردة (singleton) للاستخدام السريع في Client Components */
export const supabase = createClient();
