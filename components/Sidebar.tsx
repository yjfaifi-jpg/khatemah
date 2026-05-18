/**
 * components/Sidebar.tsx
 * ───────────────────────
 * الشريط الجانبي لجميع صفحات لوحة التحكم.
 * يستقبل اسم المعلم ويعرض روابط التنقل.
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";

interface NavItem {
  href:  string;
  icon:  string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard",          icon: "🏠", label: "الرئيسية"             },
  { href: "/dashboard/students", icon: "👥", label: "إدارة الطلاب"         },
  { href: "/dashboard/tools",    icon: "🤖", label: "أدوات الذكاء الاصطناعي" },
];

const TOOL_ITEMS: NavItem[] = [
  { href: "/dashboard/tools/lesson-plan", icon: "📖", label: "مولّد خطة الدرس"  },
  { href: "/dashboard/tools/questions",   icon: "❓", label: "مولّد الأسئلة"     },
  { href: "/dashboard/tools/worksheets",  icon: "📝", label: "مولّد أوراق العمل" },
];

export default function Sidebar({ teacherName }: { teacherName: string }) {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-64 min-h-screen bg-white border-l border-gray-100 flex flex-col shadow-sm">

      {/* الشعار */}
      <div className="p-5 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black text-lg">
            خ
          </div>
          <div>
            <p className="font-black text-gray-900">خاتمة</p>
            <p className="text-xs text-gray-400">للمعلم السعودي</p>
          </div>
        </Link>
      </div>

      {/* معلومات المعلم */}
      <div className="p-4 border-b border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm flex-shrink-0">
            {teacherName[0] || "م"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{teacherName}</p>
            <p className="text-xs text-gray-400">معلم</p>
          </div>
        </div>
      </div>

      {/* روابط التنقل */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        <p className="text-xs font-semibold text-gray-400 px-3 mb-1 mt-2">القائمة الرئيسية</p>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive(item.href)
                ? "bg-primary-50 text-primary-700 font-semibold"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
            {isActive(item.href) && (
              <span className="mr-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
            )}
          </Link>
        ))}

        <p className="text-xs font-semibold text-gray-400 px-3 mb-1 mt-4">الأدوات السريعة</p>
        {TOOL_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
              pathname === item.href
                ? "bg-primary-50 text-primary-700 font-semibold"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <span className="text-sm">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* زر تسجيل الخروج */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
        >
          <span className="text-base">🚪</span>
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
