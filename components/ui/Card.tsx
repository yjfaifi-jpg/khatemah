/**
 * components/ui/Card.tsx
 * ───────────────────────
 * مكوّن البطاقة القابل لإعادة الاستخدام.
 */

import React from "react";

interface CardProps {
  children:  React.ReactNode;
  className?: string;
  title?:    string;
  subtitle?: string;
}

export default function Card({ children, className = "", title, subtitle }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title    && <h2 className="text-lg font-bold text-gray-900">{title}</h2>}
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
