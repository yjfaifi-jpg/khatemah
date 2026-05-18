/**
 * app/dashboard/tools/lesson-plan/page.tsx
 * ─────────────────────────────────────────
 * أداة توليد خطة درس بالذكاء الاصطناعي.
 * Client Component: يستدعي /api/ai/lesson-plan ويعرض النتيجة.
 */

"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import type { LessonPlanInput } from "@/lib/types";

const SUBJECTS = ["الرياضيات","العلوم","اللغة العربية","اللغة الإنجليزية","الدراسات الاجتماعية","التربية الإسلامية","الحاسب الآلي","الفيزياء","الكيمياء","الأحياء","التاريخ","الجغرافيا"];
const GRADES   = ["الأول الابتدائي","الثاني الابتدائي","الثالث الابتدائي","الرابع الابتدائي","الخامس الابتدائي","السادس الابتدائي","الأول المتوسط","الثاني المتوسط","الثالث المتوسط","الأول الثانوي","الثاني الثانوي","الثالث الثانوي"];

export default function LessonPlanPage() {
  const [form,    setForm]    = useState<LessonPlanInput>({ subject:"",grade:"",objective:"",sessions:1 });
  const [result,  setResult]  = useState("");
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [saved,   setSaved]   = useState(false);
  const [copied,  setCopied]  = useState(false);

  function upd<K extends keyof LessonPlanInput>(k: K, v: LessonPlanInput[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    setError(""); setResult(""); setSaved(false);

    if (!form.subject || !form.grade || !form.objective) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch("/api/ai/lesson-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل الاتصال بالخادم");
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError("يجب تسجيل الدخول أولاً"); return; }

      await supabase.from("ai_tools_history").insert({
        teacher_id: user.id,
        tool_name: "lesson_plan",
        input:  form,
        output: { result },
      });
      setSaved(true);
    } catch {
      setError("فشل حفظ النتيجة");
    } finally {
      setSaving(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* رأس الصفحة */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/tools" className="text-gray-400 hover:text-gray-600">← الأدوات</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">📖 مولّد خطة الدرس</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* نموذج الإدخال */}
        <div className="card">
          <h2 className="text-base font-bold text-gray-700 mb-4">بيانات الدرس</h2>

          {error && <div className="error-message mb-4">{error}</div>}

          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            <div className="form-group">
              <label className="form-label">المادة الدراسية <span className="text-red-500">*</span></label>
              <select className="input-field" value={form.subject} onChange={e=>upd("subject",e.target.value)} required>
                <option value="">— اختر المادة —</option>
                {SUBJECTS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">الصف الدراسي <span className="text-red-500">*</span></label>
              <select className="input-field" value={form.grade} onChange={e=>upd("grade",e.target.value)} required>
                <option value="">— اختر الصف —</option>
                {GRADES.map(g=><option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">الهدف التعليمي الرئيسي <span className="text-red-500">*</span></label>
              <textarea
                className="input-field resize-none"
                rows={3}
                placeholder="مثال: أن يتعرف الطالب على أساسيات الضرب ويطبقها..."
                value={form.objective}
                onChange={e=>upd("objective",e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">عدد الحصص</label>
              <select className="input-field" value={form.sessions} onChange={e=>upd("sessions",Number(e.target.value))}>
                {[1,2,3,4,5].map(n=><option key={n} value={n}>{n} {n===1?"حصة":"حصص"}</option>)}
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <><span className="animate-spin">⏳</span> جارٍ الإنشاء...</>
              ) : (
                "✨ إنشاء خطة الدرس"
              )}
            </button>
          </form>
        </div>

        {/* النتيجة */}
        <div className="card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-700">النتيجة</h2>
            {result && (
              <div className="flex gap-2">
                <button onClick={handleCopy} className="btn-secondary text-xs py-1.5 px-3">
                  {copied ? "✓ تم النسخ" : "📋 نسخ"}
                </button>
                <button onClick={handleSave} disabled={saving||saved} className="btn-primary text-xs py-1.5 px-3">
                  {saved ? "✓ محفوظ" : saving ? "حفظ..." : "💾 حفظ في حسابي"}
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-4xl animate-pulse mb-3">🤖</div>
                <p>جارٍ إنشاء خطة الدرس...</p>
              </div>
            </div>
          ) : result ? (
            <div className="flex-1 bg-gray-50 rounded-xl p-4 text-sm text-gray-800 leading-relaxed overflow-auto whitespace-pre-wrap font-arabic">
              {result}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-3">📖</div>
                <p className="text-sm">ستظهر خطة الدرس هنا</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
