/**
 * app/dashboard/students/new/page.tsx
 * ─────────────────────────────────────
 * صفحة إضافة طالب جديد.
 * Client Component تستخدم Supabase من المتصفح.
 */

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

const GRADES = [
  "الأول الابتدائي",  "الثاني الابتدائي",  "الثالث الابتدائي",
  "الرابع الابتدائي", "الخامس الابتدائي",  "السادس الابتدائي",
  "الأول المتوسط",    "الثاني المتوسط",     "الثالث المتوسط",
  "الأول الثانوي",    "الثاني الثانوي",     "الثالث الثانوي",
];

export default function NewStudentPage() {
  const router = useRouter();

  const [name,    setName]    = useState("");
  const [grade,   setGrade]   = useState("");
  const [notes,   setNotes]   = useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("اسم الطالب مطلوب");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      // جلب المستخدم الحالي
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth/login"); return; }

      const { error: insertError } = await supabase
        .from("students")
        .insert({
          teacher_id: user.id,
          name:  name.trim(),
          grade: grade || null,
          notes: notes.trim() || null,
        });

      if (insertError) {
        setError("حدث خطأ أثناء إضافة الطالب: " + insertError.message);
        return;
      }

      router.push("/dashboard/students");
      router.refresh();
    } catch {
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">

      {/* رأس الصفحة */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/students" className="text-gray-400 hover:text-gray-600 transition-colors">
          ← الطلاب
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">إضافة طالب جديد</h1>
      </div>

      <div className="card">
        {error && (
          <div className="error-message mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="form-group">
            <label className="form-label" htmlFor="name">
              اسم الطالب <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              className="input-field"
              placeholder="مثال: أحمد محمد العمري"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="grade">
              الصف الدراسي
            </label>
            <select
              id="grade"
              className="input-field"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              <option value="">— اختر الصف —</option>
              {GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="notes">
              ملاحظات (اختياري)
            </label>
            <textarea
              id="notes"
              className="input-field resize-none"
              placeholder="أي ملاحظات خاصة بالطالب..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? "جارٍ الإضافة..." : "إضافة الطالب"}
            </button>
            <Link href="/dashboard/students" className="btn-secondary flex-1 text-center">
              إلغاء
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
