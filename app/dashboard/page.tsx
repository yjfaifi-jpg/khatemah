/**
 * app/dashboard/page.tsx
 * ───────────────────────
 * لوحة التحكم الرئيسية للمعلم.
 * تعرض الإحصاءات وروابط الأقسام.
 */

import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser, getProfile, createServerSupabase } from "@/lib/supabaseServer";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");

  const profile  = await getProfile(user.id);
  const supabase = await createServerSupabase();

  // عدد الطلاب
  const { count: studentsCount } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("teacher_id", user.id);

  // عدد استخدامات الأدوات
  const { count: toolsCount } = await supabase
    .from("ai_tools_history")
    .select("*", { count: "exact", head: true })
    .eq("teacher_id", user.id);

  const teacherName = profile?.name || user.email || "المعلم";

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* رأس الصفحة */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">
          مرحباً، {teacherName} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          ما الذي تريد إنجازه اليوم؟
        </p>
      </div>

      {/* بطاقات الإحصاء */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
            👥
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{studentsCount ?? 0}</p>
            <p className="text-sm text-gray-500">إجمالي الطلاب</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
            🤖
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">{toolsCount ?? 0}</p>
            <p className="text-sm text-gray-500">استخدامات الأدوات</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
            ✨
          </div>
          <div>
            <p className="text-2xl font-black text-gray-900">3</p>
            <p className="text-sm text-gray-500">أدوات متاحة</p>
          </div>
        </div>
      </div>

      {/* القسمان الرئيسيان */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* إدارة الطلاب */}
        <div className="card hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
              👥
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">إدارة الطلاب</h2>
              <p className="text-gray-500 text-sm mt-1">
                أضف طلابك وتابع سجلاتهم ومعلوماتهم الدراسية
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/students" className="btn-primary text-sm">
              عرض الطلاب
            </Link>
            <Link href="/dashboard/students/new" className="btn-secondary text-sm">
              إضافة طالب
            </Link>
          </div>
        </div>

        {/* أدوات الذكاء الاصطناعي */}
        <div className="card hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
              🤖
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">أدوات الذكاء الاصطناعي</h2>
              <p className="text-gray-500 text-sm mt-1">
                أنشئ خطط دروس، أسئلة، وأوراق عمل في ثوانٍ
              </p>
            </div>
          </div>
          <Link href="/dashboard/tools" className="btn-primary text-sm">
            استعرض الأدوات
          </Link>
        </div>
      </div>

      {/* روابط سريعة للأدوات */}
      <div>
        <h2 className="text-lg font-bold text-gray-700 mb-4">وصول سريع للأدوات</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: "/dashboard/tools/lesson-plan", icon: "📖", title: "مولّد خطة درس",    color: "bg-blue-50   border-blue-100   text-blue-700" },
            { href: "/dashboard/tools/questions",   icon: "❓", title: "مولّد الأسئلة",    color: "bg-green-50  border-green-100  text-green-700" },
            { href: "/dashboard/tools/worksheets",  icon: "📝", title: "مولّد أوراق العمل", color: "bg-orange-50 border-orange-100 text-orange-700" },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 hover:shadow-sm transition-all ${tool.color}`}
            >
              <span className="text-2xl">{tool.icon}</span>
              <span className="font-semibold text-sm">{tool.title}</span>
              <span className="mr-auto text-lg">←</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
