/**
 * components/ui/Input.tsx
 * ────────────────────────
 * مكوّن حقل الإدخال القابل لإعادة الاستخدام.
 */

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:    string;
  error?:    string;
  helpText?: string;
}

export default function Input({
  label,
  error,
  helpText,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-gray-700">
          {label}
          {props.required && <span className="text-red-500 mr-0.5">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-2.5 rounded-lg border
          bg-white text-gray-900 placeholder-gray-400
          transition-shadow duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          ${error ? "border-red-300 focus:ring-red-400" : "border-gray-200"}
          ${className}
        `}
        {...props}
      />
      {error    && <p className="text-xs text-red-600">{error}</p>}
      {helpText && <p className="text-xs text-gray-400">{helpText}</p>}
    </div>
  );
}
