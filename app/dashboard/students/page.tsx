/**
 * app/dashboard/students/page.tsx
 * ─────────────────────────────────
 * صفحة عرض قائمة طلاب المعلم.
 * Server Component — تجلب البيانات مباشرة من Supabase.
 */

import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser, createServerSupabase } from "@/lib/supabaseServer";
import type { Student } from "@/lib/types";

export const metadata = { title: "إدارة الطلاب" };

export default async function StudentsPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");

  const supabase = await createServerSupabase();
  const { data: students, error } = await supabase
    .from("students")
    .select("*")
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* رأس الصفحة */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">إدارة الطلاب</h1>
          <p className="text-gray-500 text-sm mt-1">
            {students?.length ?? 0} طالب مسجّل
          </p>
        </div>
        <Link href="/dashboard/students/new" className="btn-primary">
          + إضافة طالب
        </Link>
      </div>

      {/* خطأ */}
      {error && (
        <div className="error-message mb-4">حدث خطأ في جلب البيانات: {error.message}</div>
      )}

      {/* جدول الطلاب */}
      {!students || students.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">لا يوجد طلاب بعد</h3>
          <p className="text-gray-400 mb-6">أضف أول طالب لك الآن</p>
          <Link href="/dashboard/students/new" className="btn-primary inline-flex">
            + إضافة طالب جديد
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right text-sm font-semibold text-gray-600 px-6 py-3">#</th>
                <th className="text-right text-sm font-semibold text-gray-600 px-6 py-3">اسم الطالب</th>
                <th className="text-right text-sm font-semibold text-gray-600 px-6 py-3">الصف</th>
                <th className="text-right text-sm font-semibold text-gray-600 px-6 py-3">الملاحظات</th>
                <th className="text-right text-sm font-semibold text-gray-600 px-6 py-3">تاريخ الإضافة</th>
                <th className="text-center text-sm font-semibold text-gray-600 px-6 py-3">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map((student: Student, index: number) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-400 text-sm">{index + 1}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">{student.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                      {student.grade || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">
                    {student.notes || "—"}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {new Date(student.created_at).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/dashboard/students/${student.id}`}
                      className="text-primary-600 hover:text-primary-800 text-sm font-semibold"
                    >
                      تفاصيل / تعديل
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
