import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, ArrowRight, X, Sparkles } from 'lucide-react';
import { normalizeCard, safeMap } from '../utils/compareUtils';
import { useLanguage } from '../context/LanguageContext';

/**
 * ComparisonDock (Card Selection Panel)
 * 
 * Redesigned for D.CARD Editorial Luxury:
 * - Warm Cream & Soft Ivory background (#FAF8F5 / #F5F3EC)
 * - Deep Forest Green typography (#14291F)
 * - Rich Emerald Green accents and CTA (#0E5C3E)
 * - Subtle Sage borders (#E0E6DC)
 * - Compact, sleek layout with ZERO awkward whitespace
 * - Responsive single-line flow on desktop and neat multi-tier on mobile
 */
function ComparisonDock({ compareQueue = [], onRemove, onCompareNow, onClear, onHeightChange }) {
  const queueList = safeMap(Array.isArray(compareQueue) ? compareQueue : [], normalizeCard);
  const dockRef = useRef(null);
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  useEffect(() => {
    if (queueList.length === 0) {
      document.documentElement.style.setProperty('--compare-dock-height', '0px');
      if (onHeightChange) onHeightChange(0);
      return;
    }

    const updateHeight = () => {
      if (dockRef.current) {
        const height = dockRef.current.offsetHeight;
        document.documentElement.style.setProperty('--compare-dock-height', `${height}px`);
        if (onHeightChange) onHeightChange(height);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    if (dockRef.current) {
      resizeObserver.observe(dockRef.current);
    }
    window.addEventListener('resize', updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeight);
      document.documentElement.style.setProperty('--compare-dock-height', '0px');
      if (onHeightChange) onHeightChange(0);
    };
  }, [queueList.length, onHeightChange]);

  if (queueList.length === 0) return null;

  const potentialSavings = queueList.length >= 2 ? (isHindi ? "₹1,800/वर्ष" : "₹1,800/year") : null;

  return (
    <AnimatePresence>
      <motion.div
        ref={dockRef}
        initial={{ y: 80, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260 }}
        style={{
          bottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))',
          maxWidth: 'min(58rem, calc(100vw - 1rem))',
        }}
        className="fixed inset-x-2 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-[100] w-auto select-none box-border pointer-events-auto"
      >
        <div className="relative rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 border border-[#E0E6DC] bg-[#FAF8F5]/98 backdrop-blur-xl shadow-[0_16px_40px_rgba(20,41,31,0.12)] text-[#14291F] w-full overflow-hidden">
          
          {/* DESKTOP LAYOUT (Single Row, sleek and tight) */}
          <div className="hidden md:flex items-center justify-between gap-3">
            {/* Left Badges */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#0E5C3E] shadow-sm flex items-center gap-1.5 flex-shrink-0">
                <Scale className="w-3.5 h-3.5 text-emerald-200" />
                <span>{isHindi ? `${queueList.length} / 3 चयनित` : `${queueList.length} / 3 QUEUED`}</span>
              </div>

              {potentialSavings && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EEF4EE] text-[#0E5C3E] text-xs font-semibold border border-[#C5D7C2] flex-shrink-0">
                  <span>💰</span>
                  <span>{isHindi ? `अनुमानित बचत: ${potentialSavings}` : `EST. SAVINGS: ${potentialSavings}`}</span>
                </span>
              )}
            </div>

            {/* Middle: Card Chips */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-[380px] custom-scrollbar py-0.5 px-1">
              {queueList.map((card, i) => (
                <div key={card.id || i} className="relative group flex-shrink-0">
                  <div className="rounded-xl px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 bg-[#F5F3EC] border border-[#E0E6DC] text-[#14291F] shadow-xs max-w-[170px] hover:border-[#0E5C3E]/50 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0E5C3E] flex-shrink-0" />
                    <span className="truncate">{card.cardName || (isHindi ? "डेबिट कार्ड" : "Debit Card")}</span>
                  </div>
                  <button
                    onClick={() => onRemove && onRemove(card.id)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white bg-[#14291F] hover:bg-[#800020] border border-white shadow-xs cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    title={isHindi ? "कार्ड हटाएं" : "Remove card"}
                    aria-label={isHindi ? "कार्ड हटाएं" : "Remove card"}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={onClear}
                style={{ touchAction: 'manipulation' }}
                className="text-xs font-bold text-[#445B4D] hover:text-[#14291F] transition-colors cursor-pointer uppercase tracking-wider px-2 py-1.5"
              >
                {isHindi ? "सब हटाएं" : "CLEAR ALL"}
              </button>

              <button
                type="button"
                onClick={onCompareNow}
                disabled={queueList.length < 2}
                style={{ touchAction: 'manipulation' }}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                  queueList.length >= 2
                    ? 'bg-[#0E5C3E] hover:bg-[#0A4730] text-white shadow-emerald-950/20 hover:shadow-md'
                    : 'bg-[#EEF4EE] text-[#445B4D]/50 cursor-not-allowed shadow-none border border-[#E0E6DC]'
                }`}
              >
                <span>{isHindi ? "तुलना करें" : "Compare Now"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClear}
                aria-label={isHindi ? "पैनल बंद करें" : "Close comparison panel"}
                className="w-7 h-7 rounded-full bg-[#EEF4EE] hover:bg-[#E0E6DC] text-[#445B4D] hover:text-[#14291F] flex items-center justify-center transition-all cursor-pointer flex-shrink-0 border border-[#E0E6DC] active:scale-90 ml-1"
                title={isHindi ? "पैनल बंद करें" : "Close panel"}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* MOBILE LAYOUT (Compact multi-tier, zero wasted gap) */}
          <div className="flex md:hidden flex-col gap-2">
            {/* Top row: Badges + Close */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                <div className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-[#0E5C3E] shadow-sm flex items-center gap-1">
                  <Scale className="w-3 h-3 text-emerald-200" />
                  <span>{queueList.length}/3</span>
                </div>

                {potentialSavings && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EEF4EE] text-[#0E5C3E] text-[10px] font-semibold border border-[#C5D7C2]">
                    <span>💰</span>
                    <span>{potentialSavings}</span>
                  </span>
                )}
              </div>

              <button
                onClick={onClear}
                aria-label={isHindi ? "पैनल बंद करें" : "Close comparison panel"}
                className="w-6 h-6 rounded-full bg-[#EEF4EE] hover:bg-[#E0E6DC] text-[#445B4D] flex items-center justify-center transition-all cursor-pointer flex-shrink-0 border border-[#E0E6DC]"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Chips scroll row */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 custom-scrollbar">
              {queueList.map((card, i) => (
                <div key={card.id || i} className="relative group flex-shrink-0">
                  <div className="rounded-lg px-2 py-1 text-[11px] font-medium flex items-center gap-1 bg-[#F5F3EC] border border-[#E0E6DC] text-[#14291F] max-w-[130px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0E5C3E] flex-shrink-0" />
                    <span className="truncate">{card.cardName || "Card"}</span>
                  </div>
                  <button
                    onClick={() => onRemove && onRemove(card.id)}
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] text-white bg-[#14291F] border border-white"
                  >
                    <X className="w-2 h-2" />
                  </button>
                </div>
              ))}
            </div>

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E0E6DC]">
              <button
                type="button"
                onClick={onClear}
                className="text-[11px] font-bold text-[#445B4D] hover:text-[#14291F] uppercase tracking-wider px-1 py-1"
              >
                {isHindi ? "हटाएं" : "Clear"}
              </button>

              <button
                type="button"
                onClick={onCompareNow}
                disabled={queueList.length < 2}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                  queueList.length >= 2
                    ? 'bg-[#0E5C3E] text-white'
                    : 'bg-[#EEF4EE] text-[#445B4D]/50 cursor-not-allowed border border-[#E0E6DC]'
                }`}
              >
                <span>{isHindi ? "तुलना करें" : "Compare Now"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ComparisonDock;