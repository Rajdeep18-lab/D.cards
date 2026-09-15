import React, { useState, useEffect, useRef } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

/** Password strength evaluator — returns score 0–5 and display info */
function evaluateStrength(pass) {
  if (!pass) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[a-z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-500' };
  if (score <= 4) return { score, label: 'Medium', color: 'bg-amber-400', textColor: 'text-amber-500' };
  return { score, label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400' };
}

/**
 * PasswordInput — password field with show/hide toggle.
 *
 * Props:
 *  id            — HTML id (required for label association)
 *  label         — visible field label
 *  value         — controlled value
 *  onChange      — change handler
 *  error         — error message string
 *  placeholder   — placeholder text (default: ••••••••)
 *  autoComplete  — HTML autocomplete (e.g. 'current-password' or 'new-password')
 *  required      — HTML required
 *  showStrength  — if true, renders strength indicator bar below (for signup)
 *  disabled      — HTML disabled
 */
export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  error,
  placeholder = '••••••••',
  autoComplete = 'current-password',
  required = false,
  showStrength = false,
  disabled = false,
  hint,
}) {
  const [showText, setShowText] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const inputRef = useRef(null);

  const strength = showStrength ? evaluateStrength(value) : null;
  const hasError = Boolean(error);

  // Detect Caps Lock
  const handleKeyDown = (e) => {
    if (e.getModifierState) {
      setCapsLock(e.getModifierState('CapsLock'));
    }
  };

  const borderClass = hasError
    ? 'border-rose-400 dark:border-rose-500 focus:border-rose-400 focus:ring-rose-400/15'
    : 'border-[#E5E7EB] dark:border-slate-700 focus:border-[#2563EB] focus:ring-[#2563EB]/15';

  return (
    <div className="space-y-1.5">
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
        {/* Lock icon */}
        <Lock
          className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${
            hasError ? 'text-rose-400' : 'text-slate-400 dark:text-slate-500'
          }`}
          aria-hidden="true"
        />

        <input
          ref={inputRef}
          id={id}
          type={showText ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={[
            hasError ? `${id}-error` : null,
            hint ? `${id}-hint` : null,
            showStrength && strength?.label ? `${id}-strength` : null,
          ].filter(Boolean).join(' ') || undefined}
          className={`
            w-full rounded-xl border bg-white dark:bg-slate-900
            pl-10 pr-11 py-3
            text-sm font-medium text-[#1F2937] dark:text-white
            outline-none focus:ring-4 transition-all duration-150
            placeholder:text-slate-400 dark:placeholder:text-slate-600
            disabled:opacity-50 disabled:cursor-not-allowed
            ${borderClass}
          `}
        />

        {/* Show/hide toggle */}
        <button
          type="button"
          onClick={() => setShowText((v) => !v)}
          aria-label={showText ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors rounded focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 cursor-pointer"
        >
          {showText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Strength bar (signup only) */}
      {showStrength && value && (
        <div id={`${id}-strength`} className="space-y-1">
          <div className="flex gap-1 h-1 rounded-full overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`flex-1 rounded-full transition-all duration-300 ${
                  i <= strength.score ? strength.color : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
          <p className={`text-[10.5px] font-bold ${strength.textColor}`}>
            Password strength: {strength.label}
          </p>
        </div>
      )}

      {/* Caps Lock warning */}
      {capsLock && (
        <p className="text-[10.5px] font-bold text-amber-500 flex items-center gap-1 mt-0.5">
          <span aria-hidden="true">⚠</span>
          Caps Lock is on
        </p>
      )}

      {/* Error */}
      {hasError && (
        <p id={`${id}-error`} role="alert" className="text-xs text-rose-500 font-semibold flex items-start gap-1">
          <span className="shrink-0 mt-px" aria-hidden="true">⚠</span>
          <span>{error}</span>
        </p>
      )}

      {/* Hint */}
      {hint && !hasError && (
        <p id={`${id}-hint`} className="text-[11px] text-slate-400 dark:text-slate-500">{hint}</p>
      )}
    </div>
  );
}
