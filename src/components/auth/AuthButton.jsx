import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/**
 * AuthButton — primary CTA and secondary/ghost button for auth forms.
 *
 * Props:
 *  type        — 'submit' | 'button' (default: 'submit')
 *  loading     — shows spinner and disables interaction
 *  disabled    — force disabled state
 *  onClick     — click handler (for type='button')
 *  variant     — 'primary' | 'ghost' | 'google'
 *  fullWidth   — if true (default), button takes full container width
 *  loadingText — text to show while loading (default: 'Please wait…')
 *  icon        — optional trailing icon component
 *  children    — button label content
 */
export default function AuthButton({
  type = 'submit',
  loading = false,
  disabled = false,
  onClick,
  variant = 'primary',
  fullWidth = true,
  loadingText = 'Please wait…',
  icon: Icon = ArrowRight,
  children,
  className = '',
}) {
  const isDisabled = disabled || loading;

  const base = `
    ${fullWidth ? 'w-full' : 'w-auto'}
    flex items-center justify-center gap-2
    px-6 py-3 rounded-xl text-sm font-extrabold
    transition-all duration-200
    focus:outline-none focus:ring-4
    cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed
    ${className}
  `;

  if (variant === 'primary') {
    return (
      <motion.button
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        whileHover={isDisabled ? {} : { scale: 1.015 }}
        whileTap={isDisabled ? {} : { scale: 0.98 }}
        className={`${base} bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#3B82F6] text-white shadow-lg shadow-[#2563EB]/30 hover:shadow-xl hover:shadow-[#2563EB]/40 focus:ring-[#2563EB]/30`}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" aria-hidden="true" />
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            <span>{children}</span>
            {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
          </>
        )}
      </motion.button>
    );
  }

  if (variant === 'ghost') {
    return (
      <button
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        className={`${base} bg-transparent text-[#6B7280] dark:text-slate-400 hover:text-[#1F2937] dark:hover:text-white focus:ring-slate-400/20`}
      >
        {children}
      </button>
    );
  }

  if (variant === 'google') {
    return (
      <motion.button
        type="button"
        disabled={isDisabled}
        onClick={onClick}
        whileHover={isDisabled ? {} : { scale: 1.01 }}
        whileTap={isDisabled ? {} : { scale: 0.99 }}
        className={`${base} bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 text-[#374151] dark:text-white shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 focus:ring-slate-300/40`}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin shrink-0" />
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            {/* Google SVG */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>{children}</span>
          </>
        )}
      </motion.button>
    );
  }

  return null;
}
