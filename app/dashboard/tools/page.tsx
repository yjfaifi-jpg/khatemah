/**
 * app/dashboard/tools/page.tsx
 * ─────────────────────────────
 * صفحة استعراض جميع أدوات الذكاء الاصطناعي المتاحة.
 */

import Link from "next/link";

export const metadata = { title: "أدوات الذكاء الاصطناعي" };

const TOOLS = [
  {
    id:    "lesson-plan",
    icon:  "📖",
    title: "مولّد خطة الدرس",
    desc:  "أنشئ خطة درس احترافية ومفصّلة بناءً على المادة والصف والأهداف التعليمية.",
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
    badge: "الأكثر استخداماً",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    id:    "questions",
    icon:  "❓",
    title: "مولّد الأسئلة",
    desc:  "اختر نوع الأسئلة (اختيار متعدد، صح/خطأ، مقالية) وعددها واحصل عليها فوراً.",
    color: "bg-green-50 border-green-200 hover:border-green-400",
    badge: null,
    badgeColor: "",
  },
  {
    id:    "worksheets",
    icon:  "📝",
    title: "مولّد أوراق العمل",
    desc:  "صمّم أوراق عمل تفاعلية ومتنوعة مناسبة لكل صف ومادة دراسية.",
    color: "bg-orange-50 border-orange-200 hover:border-orange-400",
    badge: "جديد",
    badgeColor: "bg-orange-100 text-orange-700",
  },
];

export default function ToolsPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">أدوات الذكاء الاصطناعي</h1>
        <p className="text-gray-500 mt-1">
          اختر الأداة المناسبة لإنشاء محتوى تعليمي بسرعة واحترافية
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map((tool) => (
          <Link
            key={tool.id}
            href={`/dashboard/tools/${tool.id}`}
            className={`card border-2 transition-all duration-200 hover:shadow-md flex flex-col gap-4 ${tool.color}`}
          >
            <div className="flex items-start justify-between">
              <div className="text-4xl">{tool.icon}</div>
              {tool.badge && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${tool.badgeColor}`}>
                  {tool.badge}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">{tool.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{tool.desc}</p>
            </div>
            <div className="text-primary-600 font-semibold text-sm mt-auto flex items-center gap-1">
              ابدأ الآن <span>←</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
