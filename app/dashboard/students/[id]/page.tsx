/**
 * app/dashboard/students/[id]/page.tsx
 * ──────────────────────────────────────
 * صفحة عرض وتعديل وحذف بيانات طالب محدد.
 * مزيج من Server Component (جلب البيانات) وClient Actions (التعديل/الحذف).
 */

import { redirect, notFound } from "next/navigation";
import { getUser, createServerSupabase } from "@/lib/supabaseServer";
import StudentForm from "./StudentForm";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase.from("students").select("name").eq("id", id).single();
  return { title: data?.name ? `الطالب: ${data.name}` : "تفاصيل الطالب" };
}

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user    = await getUser();
  if (!user) redirect("/auth/login");

  const supabase = await createServerSupabase();
  const { data: student, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .eq("teacher_id", user.id)       // التأكد أن الطالب تابع لهذا المعلم
    .single();

  if (error || !student) notFound();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <StudentForm student={student} />
    </div>
  );
}
