/**
 * app/dashboard/layout.tsx
 * ─────────────────────────
 * Layout مشترك لكل صفحات لوحة التحكم.
 * يتحقق من تسجيل الدخول في Server Component.
 * يعرض الشريط الجانبي (Sidebar) في كل الصفحات.
 */

import { redirect } from "next/navigation";
import { getUser, getProfile } from "@/lib/supabaseServer";
import Sidebar from "@/components/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // التحقق من تسجيل الدخول (Server-side)
  const user = await getUser();
  if (!user) redirect("/auth/login");

  // جلب الملف الشخصي للمعلم
  const profile = await getProfile(user.id);
  const teacherName = profile?.name || user.email || "المعلم";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* الشريط الجانبي */}
      <Sidebar teacherName={teacherName} />

      {/* المحتوى الرئيسي */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
