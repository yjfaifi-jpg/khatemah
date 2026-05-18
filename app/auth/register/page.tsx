/**
 * app/auth/register/page.tsx
 * ──────────────────────────
 * صفحة تسجيل حساب معلم جديد.
 * تحفظ الاسم في user_metadata عند التسجيل,
 * والـ trigger في Supabase يحفظه تلقائياً في جدول profiles.
 */

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    // التحقق من تطابق كلمة المرور
    if (password !== confirm) {
      setError("كلمة المرور وتأكيدها غير متطابقتين");
      return;
    }
    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },                           // يُحفظ في user_metadata
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (authError) {
        const msgMap: Record<string, string> = {
          "User already registered": "هذا البريد الإلكتروني مسجّل مسبقاً",
          "Password should be at least 6 characters": "كلمة المرور قصيرة جداً",
        };
        setError(msgMap[authError.message] || authError.message);
        return;
      }

      setSuccess(true);
      // بعد 2 ثانية → الانتقال للوحة التحكم
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch {
      setError("حدث خطأ غير متوقع، يرجى المحاولة مجدداً");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* الشعار */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-4">
            خ
          </div>
          <h1 className="text-2xl font-black text-gray-900">خاتمة</h1>
          <p className="text-gray-500 text-sm mt-1">أدوات ذكاء اصطناعي للمعلم السعودي</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">تسجيل حساب معلم</h2>

          {success ? (
            <div className="success-message text-center py-4">
              <div className="text-3xl mb-3">🎉</div>
              <p className="font-bold text-base">تم إنشاء حسابك بنجاح!</p>
              <p className="text-sm mt-1">جارٍ التوجيه للوحة التحكم...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="error-message mb-4">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">
                    الاسم الكامل
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="input-field"
                    placeholder="مثال: محمد عبدالله"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">
                    البريد الإلكتروني
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="input-field"
                    placeholder="teacher@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    dir="ltr"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="password">
                    كلمة المرور
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="input-field"
                    placeholder="6 أحرف على الأقل"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    dir="ltr"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="confirm">
                    تأكيد كلمة المرور
                  </label>
                  <input
                    id="confirm"
                    type="password"
                    className="input-field"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    dir="ltr"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full mt-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      جارٍ إنشاء الحساب...
                    </>
                  ) : (
                    "إنشاء الحساب"
                  )}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            لديك حساب بالفعل؟{" "}
            <Link href="/auth/login" className="text-primary-600 font-semibold hover:underline">
              سجّل دخولك
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
