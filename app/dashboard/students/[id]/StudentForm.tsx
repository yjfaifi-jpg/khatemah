/**
 * app/dashboard/students/[id]/StudentForm.tsx
 * ─────────────────────────────────────────────
 * Client Component: نموذج تعديل بيانات الطالب وحذفه.
 */

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import type { Student } from "@/lib/types";

const GRADES = [
  "الأول الابتدائي",  "الثاني الابتدائي",  "الثالث الابتدائي",
  "الرابع الابتدائي", "الخامس الابتدائي",  "السادس الابتدائي",
  "الأول المتوسط",    "الثاني المتوسط",     "الثالث المتوسط",
  "الأول الثانوي",    "الثاني الثانوي",     "الثالث الثانوي",
];

export default function StudentForm({ student }: { student: Student }) {
  const router = useRouter();

  const [name,    setName]    = useState(student.name);
  const [grade,   setGrade]   = useState(student.grade || "");
  const [notes,   setNotes]   = useState(student.notes || "");
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // ── تعديل الطالب ──────────────────────────────────────────────
  async function handleUpdate(e: FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!name.trim()) { setError("اسم الطالب مطلوب"); return; }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("students")
        .update({
          name:       name.trim(),
          grade:      grade || null,
          notes:      notes.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", student.id);

      if (updateError) {
        setError("خطأ في التحديث: " + updateError.message);
        return;
      }
      setSuccess("تم تحديث بيانات الطالب بنجاح ✓");
      router.refresh();
    } catch {
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  // ── حذف الطالب ────────────────────────────────────────────────
  async function handleDelete() {
    setDeleting(true);
    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from("students")
        .delete()
        .eq("id", student.id);

      if (deleteError) {
        setError("خطأ في الحذف: " + deleteError.message);
        setDeleting(false);
        return;
      }
      router.push("/dashboard/students");
      router.refresh();
    } catch {
      setError("حدث خطأ أثناء الحذف");
      setDeleting(false);
    }
  }

  return (
    <>
      {/* رأس الصفحة */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/students" className="text-gray-400 hover:text-gray-600 transition-colors">
          ← الطلاب
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">تفاصيل الطالب</h1>
      </div>

      {/* بطاقة الطالب */}
      <div className="card mb-4">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-700 font-black text-2xl flex-shrink-0">
            {name[0] || "؟"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              أُضيف في {new Date(student.created_at).toLocaleDateString("ar-SA")}
            </p>
          </div>
        </div>

        {error   && <div className="error-message mb-4">{error}</div>}
        {success && <div className="success-message mb-4">{success}</div>}

        <form onSubmit={handleUpdate} className="flex flex-col gap-5">
          <div className="form-group">
            <label className="form-label">اسم الطالب <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">الصف الدراسي</label>
            <select
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
            <label className="form-label">ملاحظات</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ملاحظات خاصة بالطالب..."
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "جارٍ الحفظ..." : "💾 حفظ التغييرات"}
          </button>
        </form>
      </div>

      {/* منطقة الحذف الخطرة */}
      <div className="card border-2 border-red-100">
        <h3 className="text-base font-bold text-red-700 mb-2">⚠️ منطقة الخطر</h3>
        <p className="text-sm text-gray-500 mb-4">
          حذف الطالب سيزيل جميع بياناته نهائياً ولا يمكن التراجع.
        </p>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="btn-danger text-sm"
          >
            حذف الطالب
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-red-700">هل أنت متأكد؟</span>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn-danger text-sm"
            >
              {deleting ? "جارٍ الحذف..." : "نعم، احذف"}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="btn-secondary text-sm"
            >
              إلغاء
            </button>
          </div>
        )}
      </div>
    </>
  );
}
