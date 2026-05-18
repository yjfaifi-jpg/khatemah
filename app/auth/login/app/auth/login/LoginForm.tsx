"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";

export default function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const redirectTo   = searchParams.get("redirectTo") || "/dashboard";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message === "Invalid login credentials" ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : authError.message);
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-4">خ</div>
          <h1 className="text-2xl font-black text-gray-900">خاتمة</h1>
          <p className="text-gray-500 text-sm mt-1">أدوات ذكاء اصطناعي للمعلم السعودي</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">دخول المعلمين</h2>
          {error && <div className="error-message mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="email">البريد الإلكتروني</label>
              <input id="email" type="email" className="input-field" placeholder="teacher@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required dir="ltr"/>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">كلمة المرور</label>
              <input id="password" type="password" className="input-field" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required dir="ltr"/>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? "جارٍ الدخول..." : "دخول"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            ليس لديك حساب؟{" "}
            <Link href="/auth/register" className="text-primary-600 font-semibold hover:underline">سجّل حساباً جديداً</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
