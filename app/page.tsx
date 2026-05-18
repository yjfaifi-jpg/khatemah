/**
 * app/page.tsx
 * ────────────
 * الصفحة الرئيسية العامة للمنصة.
 * تعرض شرحاً للمنصة وأزرار الدخول والتسجيل.
 */

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">

      {/* شريط التنقل العلوي */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center text-primary-900 font-black text-lg">
            خ
          </div>
          <span className="text-white font-bold text-xl">خاتمة</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-white/80 hover:text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            دخول المعلمين
          </Link>
          <Link
            href="/auth/register"
            className="bg-gold-400 hover:bg-gold-500 text-primary-900 font-bold px-5 py-2 rounded-lg transition-colors"
          >
            تسجيل حساب معلم
          </Link>
        </div>
      </nav>

      {/* القسم الرئيسي Hero */}
      <section className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
          منصة مدعومة بالذكاء الاصطناعي
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-6">
          أدوات ذكاء اصطناعي
          <br />
          <span className="text-gold-400">للمعلم السعودي</span>
        </h1>

        <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
          وفّر وقتك وطوّر دروسك مع منصة خاتمة — أنشئ خطط الدروس، الأسئلة،
          وأوراق العمل في ثوانٍ بمساعدة الذكاء الاصطناعي.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/register"
            className="bg-gold-400 hover:bg-gold-500 text-primary-900 font-black text-lg px-8 py-4 rounded-xl transition-colors shadow-lg"
          >
            ابدأ مجاناً الآن
          </Link>
          <Link
            href="/auth/login"
            className="bg-white/10 hover:bg-white/20 text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors border border-white/20"
          >
            دخول المعلمين
          </Link>
        </div>
      </section>

      {/* بطاقات الميزات */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: "📖",
            title: "خطط الدروس",
            desc: "أنشئ خطط دروس احترافية مفصّلة في ثوانٍ معدودة مع مراعاة المنهج السعودي.",
          },
          {
            icon: "❓",
            title: "مولّد الأسئلة",
            desc: "اختر نوع الأسئلة وعددها والمستوى، واحصل على بنك أسئلة جاهز فوراً.",
          },
          {
            icon: "📝",
            title: "أوراق العمل",
            desc: "صمّم أوراق عمل تفاعلية ومتنوعة تناسب كل مرحلة دراسية.",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center"
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-white font-bold text-xl mb-2">{feature.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* تذييل */}
      <footer className="text-center py-6 text-white/40 text-sm border-t border-white/10">
        © {new Date().getFullYear()} منصة خاتمة التعليمية — جميع الحقوق محفوظة
      </footer>
    </main>
  );
}
