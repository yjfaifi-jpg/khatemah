/**
 * app/dashboard/tools/questions/page.tsx
 * ─────────────────────────────────────────
 * أداة توليد بنك أسئلة بالذكاء الاصطناعي.
 */

"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import type { QuestionsInput } from "@/lib/types";

const SUBJECTS = ["الرياضيات","العلوم","اللغة العربية","اللغة الإنجليزية","الدراسات الاجتماعية","التربية الإسلامية","الحاسب الآلي","الفيزياء","الكيمياء","الأحياء"];
const GRADES   = ["الأول الابتدائي","الثاني الابتدائي","الثالث الابتدائي","الرابع الابتدائي","الخامس الابتدائي","السادس الابتدائي","الأول المتوسط","الثاني المتوسط","الثالث المتوسط","الأول الثانوي","الثاني الثانوي","الثالث الثانوي"];

const QUESTION_TYPES = [
  { value: "multiple_choice", label: "اختيار من متعدد" },
  { value: "true_false",      label: "صح / خطأ" },
  { value: "essay",           label: "مقالية / شرح وتحليل" },
];

export default function QuestionsPage() {
  const [form,    setForm]    = useState<QuestionsInput>({ subject:"",grade:"",topic:"",questionType:"multiple_choice",count:5 });
  const [result,  setResult]  = useState("");
  const [loading, setLoading] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [saved,   setSaved]   = useState(false);
  const [copied,  setCopied]  = useState(false);

  function upd<K extends keyof QuestionsInput>(k: K, v: QuestionsInput[K]) {
    setForm(f => ({ ...f, [k]: v }));
  }

  async function handleGenerate(e: FormEvent) {
    e.preventDefault();
    setError(""); setResult(""); setSaved(false);
    if (!form.subject || !form.grade || !form.topic) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch("/api/ai/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل الاتصال");
      setResult(data.result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
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
      if (!user) return;
      await supabase.from("ai_tools_history").insert({
        teacher_id: user.id,
        tool_name: "questions",
        input: form,
        output: { result },
      });
      setSaved(true);
    } catch {
      setError("فشل الحفظ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/tools" className="text-gray-400 hover:text-gray-600">← الأدوات</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">❓ مولّد الأسئلة</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* نموذج */}
        <div className="card">
          <h2 className="text-base font-bold text-gray-700 mb-4">إعدادات الأسئلة</h2>
          {error && <div className="error-message mb-4">{error}</div>}

          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            <div className="form-group">
              <label className="form-label">المادة <span className="text-red-500">*</span></label>
              <select className="input-field" value={form.subject} onChange={e=>upd("subject",e.target.value)} required>
                <option value="">— اختر —</option>
                {SUBJECTS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">الصف <span className="text-red-500">*</span></label>
              <select className="input-field" value={form.grade} onChange={e=>upd("grade",e.target.value)} required>
                <option value="">— اختر —</option>
                {GRADES.map(g=><option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">الموضوع / الوحدة <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="input-field"
                placeholder="مثال: الكسور العشرية، النظام الشمسي..."
                value={form.topic}
                onChange={e=>upd("topic",e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">نوع الأسئلة</label>
              <div className="flex flex-col gap-2 mt-1">
                {QUESTION_TYPES.map(t=>(
                  <label key={t.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="questionType"
                      value={t.value}
                      checked={form.questionType===t.value}
                      onChange={()=>upd("questionType",t.value as QuestionsInput["questionType"])}
                      className="accent-primary-600"
                    />
                    <span className="text-sm text-gray-700">{t.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">عدد الأسئلة</label>
              <select className="input-field" value={form.count} onChange={e=>upd("count",Number(e.target.value))}>
                {[3,5,10,15,20].map(n=><option key={n} value={n}>{n} أسئلة</option>)}
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? <><span className="animate-spin">⏳</span> جارٍ الإنشاء...</> : "✨ إنشاء الأسئلة"}
            </button>
          </form>
        </div>

        {/* نتيجة */}
        <div className="card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-700">بنك الأسئلة</h2>
            {result && (
              <div className="flex gap-2">
                <button onClick={()=>{navigator.clipboard.writeText(result);setCopied(true);setTimeout(()=>setCopied(false),2000);}} className="btn-secondary text-xs py-1.5 px-3">
                  {copied?"✓ تم":"📋 نسخ"}
                </button>
                <button onClick={handleSave} disabled={saving||saved} className="btn-primary text-xs py-1.5 px-3">
                  {saved?"✓ محفوظ":saving?"...":"💾 حفظ"}
                </button>
              </div>
            )}
          </div>
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-400"><div className="text-4xl animate-pulse mb-3">🤖</div><p>جارٍ إنشاء الأسئلة...</p></div>
            </div>
          ) : result ? (
            <div className="flex-1 bg-gray-50 rounded-xl p-4 text-sm text-gray-800 leading-relaxed overflow-auto whitespace-pre-wrap">{result}</div>
          ) : (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
              <div className="text-center text-gray-400"><div className="text-4xl mb-3">❓</div><p className="text-sm">ستظهر الأسئلة هنا</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
