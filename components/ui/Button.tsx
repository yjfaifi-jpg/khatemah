/**
 * components/ui/Button.tsx
 * ─────────────────────────
 * مكوّن الزر القابل لإعادة الاستخدام.
 */

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?:    "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

const VARIANTS = {
  primary:   "bg-primary-600 hover:bg-primary-700 text-white border-transparent",
  secondary: "bg-white hover:bg-gray-50 text-gray-700 border-gray-200",
  danger:    "bg-red-50 hover:bg-red-100 text-red-700 border-red-200",
  ghost:     "bg-transparent hover:bg-gray-100 text-gray-600 border-transparent",
};

const SIZES = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-6 py-3",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-lg border
        transition-colors duration-200
        disabled:opacity-60 disabled:cursor-not-allowed
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          جارٍ المعالجة...
        </>
      ) : children}
    </button>
  );
}
