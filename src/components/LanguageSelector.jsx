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
        className="flex items-center gap-1.5 px-2.5 h-9 rounded-xl border border-[#E5E7EB] dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-[#EFF6FF] dark:hover:bg-slate-700/60 hover:border-[#2563EB]/40 dark:hover:border-[#60A5FA]/40 text-[#4B5563] dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs group focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20"
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
          className="absolute right-0 mt-1.5 w-36 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
        >
          <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-slate-400 border-b border-gray-100 dark:border-slate-800 mb-1">
            Language / भाषा
          </div>

          <button
            type="button"
            role="option"
            aria-selected={!isHindi}
            onClick={() => handleSelect('en')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-left transition-colors cursor-pointer ${
              !isHindi
                ? 'bg-[#EFF6FF] dark:bg-slate-800 text-[#2563EB] dark:text-[#60A5FA] font-bold'
                : 'text-[#1F2937] dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">🇬🇧</span>
              <span>English</span>
            </div>
            {!isHindi && <Check className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />}
          </button>

          <button
            type="button"
            role="option"
            aria-selected={isHindi}
            onClick={() => handleSelect('hi')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-left transition-colors cursor-pointer ${
              isHindi
                ? 'bg-[#EFF6FF] dark:bg-slate-800 text-[#2563EB] dark:text-[#60A5FA] font-bold'
                : 'text-[#1F2937] dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">🇮🇳</span>
              <span>हिंदी</span>
            </div>
            {isHindi && <Check className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />}
          </button>
        </div>
      )}
    </div>
  );
}
