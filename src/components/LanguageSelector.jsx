import React, { useState, useRef, useEffect } from 'react';
import { Languages, Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSelector({ variant = 'dropdown', className = '' }) {
  const { language, setLanguage, isHindi } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    if (variant !== 'dropdown') return;
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [variant]);

  // Keyboard navigation (Escape closes)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`} role="group" aria-label="Language selection">
        <button
          type="button"
          onClick={() => handleSelect('en')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            !isHindi
              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
              : 'bg-white dark:bg-slate-800 text-[#4B5563] dark:text-slate-300 border-[#E5E7EB] dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/60'
          }`}
          aria-pressed={!isHindi}
        >
          <span>English</span>
          {!isHindi && <Check className="w-3.5 h-3.5" />}
        </button>
        <button
          type="button"
          onClick={() => handleSelect('hi')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            isHindi
              ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
              : 'bg-white dark:bg-slate-800 text-[#4B5563] dark:text-slate-300 border-[#E5E7EB] dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/60'
          }`}
          aria-pressed={isHindi}
        >
          <span>हिंदी</span>
          {isHindi && <Check className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  return (
    <div className={`relative shrink-0 ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 h-8 min-[380px]:h-9 sm:h-10 rounded-lg sm:rounded-xl border border-amber-300/60 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 hover:bg-amber-50/80 dark:hover:bg-slate-700/60 hover:border-amber-400/80 dark:hover:border-amber-400/50 text-[#1F2937] dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-xs group focus:outline-none focus:ring-2 focus:ring-amber-500/40"
        aria-label="Change language"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title={isHindi ? "भाषा बदलें (हिंदी / English)" : "Change Language (English / हिंदी)"}
      >
        <Globe className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA] group-hover:scale-110 transition-transform shrink-0" />
        <span className="font-sans tracking-wide">
          {isHindi ? 'हिंदी' : 'EN'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#2563EB]' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Languages"
          className="absolute right-0 mt-1.5 w-40 rounded-2xl bg-white dark:bg-[#1E293B] border border-amber-200/80 dark:border-slate-700 shadow-2xl py-1.5 z-[70] animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
        >
          <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-800/70 dark:text-amber-400/70 border-b border-amber-100 dark:border-slate-800 mb-1">
            Language / भाषा
          </div>

          <button
            type="button"
            role="option"
            aria-selected={!isHindi}
            onClick={() => handleSelect('en')}
            className={`w-full flex items-center justify-between px-3 py-2.5 min-h-[44px] text-xs font-semibold text-left transition-colors cursor-pointer ${
              !isHindi
                ? 'bg-amber-50/80 dark:bg-slate-800 text-[#2563EB] dark:text-[#60A5FA] font-bold'
                : 'text-[#1F2937] dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">🇬🇧</span>
              <span>English</span>
            </div>
            {!isHindi && <Check className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />}
          </button>

          <button
            type="button"
            role="option"
            aria-selected={isHindi}
            onClick={() => handleSelect('hi')}
            className={`w-full flex items-center justify-between px-3 py-2.5 min-h-[44px] text-xs font-semibold text-left transition-colors cursor-pointer ${
              isHindi
                ? 'bg-amber-50/80 dark:bg-slate-800 text-[#2563EB] dark:text-[#60A5FA] font-bold'
                : 'text-[#1F2937] dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">🇮🇳</span>
              <span>हिंदी</span>
            </div>
            {isHindi && <Check className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />}
          </button>
        </div>
      )}
    </div>
  );
}
