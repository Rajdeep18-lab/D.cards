import React from 'react';
import { Check } from 'lucide-react';

/**
 * AuthInput — reusable accessible form input for auth forms.
 *
 * Props:
 *  id          — unique HTML id (required for label association)
 *  label       — visible field label
 *  type        — input type (default: 'text')
 *  value       — controlled value
 *  onChange    — change handler
 *  error       — error message string (shows below input)
 *  placeholder — placeholder text
 *  icon        — optional Lucide icon component (renders left)
 *  isValid     — if true, shows green checkmark on right
 *  autoComplete— HTML autocomplete attribute
 *  required    — HTML required attribute
 *  disabled    — HTML disabled attribute
 *  className   — extra wrapper classes
 */
export default function AuthInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  icon: Icon,
  isValid = false,
  autoComplete,
  required = false,
  disabled = false,
  className = '',
  hint,
  ...rest
}) {
  const hasError = Boolean(error);
  const borderClass = hasError
    ? 'border-rose-400 dark:border-rose-500 focus:border-rose-400 focus:ring-rose-400/15'
    : isValid
    ? 'border-emerald-400 dark:border-emerald-500 focus:border-emerald-400 focus:ring-emerald-400/15'
    : 'border-[#E5E7EB] dark:border-slate-700 focus:border-[#2563EB] focus:ring-[#2563EB]/15';

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-[11px] font-extrabold text-[#374151] dark:text-slate-300 uppercase tracking-wider"
      >
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>

      {/* Input wrapper */}
      <div className="relative">
        {/* Leading icon */}
        {Icon && (
          <Icon
            className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
              hasError ? 'text-rose-400' : 'text-slate-400 dark:text-slate-500'
            }`}
            aria-hidden="true"
          />
        )}

        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`
            w-full rounded-xl border bg-white dark:bg-slate-900 
            ${Icon ? 'pl-10' : 'pl-4'} ${isValid || hasError ? 'pr-10' : 'pr-4'} py-3
            text-sm font-medium text-[#1F2937] dark:text-white
            outline-none focus:ring-4 transition-all duration-150
            placeholder:text-slate-400 dark:placeholder:text-slate-600
            disabled:opacity-50 disabled:cursor-not-allowed
            ${borderClass}
          `}
          {...rest}
        />

        {/* Trailing icon: checkmark or error */}
        {isValid && !hasError && (
          <Check
            className="w-4 h-4 text-emerald-500 absolute right-3.5 top-1/2 -translate-y-1/2 stroke-[2.5] pointer-events-none"
            aria-hidden="true"
          />
        )}
        {hasError && (
          <svg
            className="w-4 h-4 text-rose-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        )}
      </div>

      {/* Error message */}
      {hasError && (
        <p id={`${id}-error`} role="alert" className="text-xs text-rose-500 font-semibold flex items-start gap-1 mt-1">
          <span className="shrink-0 mt-px">⚠</span>
          <span>{error}</span>
        </p>
      )}

      {/* Hint (shown when no error) */}
      {hint && !hasError && (
        <p id={`${id}-hint`} className="text-[11px] text-slate-400 dark:text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
}
