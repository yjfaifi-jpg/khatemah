/**
 * components/ToolCard.tsx
 * ────────────────────────
 * مكوّن بطاقة الأداة القابل لإعادة الاستخدام.
 */

import Link from "next/link";

interface ToolCardProps {
  href:        string;
  icon:        string;
  title:       string;
  description: string;
  badge?:      string;
  badgeColor?: string;
  cardColor?:  string;
}

export default function ToolCard({
  href,
  icon,
  title,
  description,
  badge,
  badgeColor = "bg-gray-100 text-gray-600",
  cardColor  = "bg-white",
}: ToolCardProps) {
  return (
    <Link
      href={href}
      className={`flex flex-col gap-4 p-6 rounded-2xl border-2 border-transparent hover:border-primary-200 hover:shadow-md transition-all duration-200 ${cardColor}`}
    >
      <div className="flex items-start justify-between">
        <div className="text-4xl">{icon}</div>
        {badge && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      </div>
      <div className="text-primary-600 font-semibold text-sm flex items-center gap-1 mt-auto">
        ابدأ الآن <span>←</span>
      </div>
    </Link>
  );
}
