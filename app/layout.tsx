/**
 * app/layout.tsx
 * ──────────────
 * الـ layout الجذر للتطبيق.
 * يُطبّق الخط العربي واتجاه RTL على كل الصفحات.
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "منصة خاتمة — أدوات ذكاء اصطناعي للمعلم السعودي",
    template: "%s | خاتمة",
  },
  description:
    "منصة خاتمة التعليمية — أدوات ذكاء اصطناعي تساعد المعلم السعودي في إعداد الدروس وإنشاء الأسئلة وإدارة الطلاب",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-arabic">{children}</body>
    </html>
  );
}
