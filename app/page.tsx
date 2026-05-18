import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-blue-900 font-black text-lg">خ</div>
          <span className="text-white font-bold text-xl">خاتمة</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-white/80 hover:text-white font-medium px-4 py-2 rounded-lg transition-colors">دخول المعلمين</Link>
          <Link href="/auth/register" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-5 py-2 rounded-lg transition-colors">تسجيل حساب معلم</Link>
        </div>
      </nav>
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-black text-white leading-tight mb-6">
          أدوات ذكاء اصطناعي
          <br />
          <span className="text-yellow-400">للمعلم السعودي</span>
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
          وفّر وقتك وطوّر دروسك مع منصة خاتمة
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/register" className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-black text-lg px-8 py-4 rounded-xl transition-colors">ابدأ مجاناً الآن</Link>
          <Link href="/auth/login" className="bg-white/10 hover:bg-white/20 text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors border border-white/20">دخول المعلمين</Link>
        </div>
      </section>
    </main>
  );
}
