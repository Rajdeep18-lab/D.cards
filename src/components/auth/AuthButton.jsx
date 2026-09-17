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
 *  variant     — 'primary' | 'ghost'
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

  return null;
}
