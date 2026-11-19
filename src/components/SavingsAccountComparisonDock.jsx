import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, ArrowRight, X } from 'lucide-react';
import { getAssociatedDebitCard } from '../data/mockSavingsAccounts';

/**
 * SavingsAccountComparisonDock
 * Redesigned for D.CARD Editorial Luxury:
 * - Warm Cream & Soft Ivory background (#FAF8F5 / #F5F3EC)
 * - Deep Forest Green typography (#14291F)
 * - Rich Emerald Green accents and CTA (#0E5C3E)
 * - Subtle Sage borders (#E0E6DC)
 * - Compact, sleek layout with ZERO awkward whitespace
 */
function SavingsAccountComparisonDock({ compareQueue = [], onRemove, onCompareNow, onClear, onHeightChange }) {
  const dockRef = useRef(null);

  useEffect(() => {
    if (compareQueue.length === 0) {
      document.documentElement.style.setProperty('--savings-compare-dock-height', '0px');
      if (onHeightChange) onHeightChange(0);
      return;
    }

    const updateHeight = () => {
      if (dockRef.current) {
        const height = dockRef.current.offsetHeight;
        document.documentElement.style.setProperty('--savings-compare-dock-height', `${height}px`);
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
      document.documentElement.style.setProperty('--savings-compare-dock-height', '0px');
      if (onHeightChange) onHeightChange(0);
    };
  }, [compareQueue.length, onHeightChange]);

  if (compareQueue.length === 0) return null;

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
        <div className="relative rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 border border-[#E0E6DC] bg-[#FAF8F5]/98 backdrop-blur-xl shadow-[0_16px_40px_rgba(20,41,31,0.12)] text-[#14291F] box-border w-full overflow-hidden">
          
          {/* DESKTOP ROW */}
          <div className="hidden md:flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#0E5C3E] shadow-sm flex items-center gap-1.5 flex-shrink-0">
                <Scale className="w-3.5 h-3.5 text-emerald-200" />
                <span>🏦 {compareQueue.length} / 3 SAVINGS ACCOUNTS</span>
              </div>
            </div>

            {/* Account Chips */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-[400px] custom-scrollbar py-0.5 px-1">
              {compareQueue.map((acc, i) => (
                <div key={acc.id || i} className="relative group flex-shrink-0">
                  <div className="rounded-xl px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 bg-[#F5F3EC] border border-[#E0E6DC] text-[#14291F] shadow-xs max-w-[180px] hover:border-[#0E5C3E]/50 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0E5C3E] flex-shrink-0" />
                    <span className="truncate">{acc.accountName || "Savings Account"}</span>
                  </div>
                  <button
                    onClick={() => onRemove && onRemove(acc.id)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white bg-[#14291F] hover:bg-[#800020] border border-white shadow-xs cursor-pointer transition-transform hover:scale-110 active:scale-95"
                    title="Remove account"
                    aria-label="Remove account"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={onClear}
                className="text-xs font-bold text-[#445B4D] hover:text-[#14291F] transition-colors cursor-pointer uppercase tracking-wider px-2 py-1.5"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={onCompareNow}
                disabled={compareQueue.length < 2}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                  compareQueue.length >= 2
                    ? 'bg-[#0E5C3E] hover:bg-[#0A4730] text-white shadow-emerald-950/20 hover:shadow-md'
                    : 'bg-[#EEF4EE] text-[#445B4D]/50 cursor-not-allowed border border-[#E0E6DC]'
                }`}
              >
                <span>Compare Accounts</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClear}
                aria-label="Close comparison panel"
                className="w-7 h-7 rounded-full bg-[#EEF4EE] hover:bg-[#E0E6DC] text-[#445B4D] hover:text-[#14291F] flex items-center justify-center transition-all cursor-pointer flex-shrink-0 border border-[#E0E6DC] active:scale-90 ml-1"
                title="Close panel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* MOBILE MULTI-TIER */}
          <div className="flex md:hidden flex-col gap-2">
            <div className="flex items-center justify-between gap-1.5">
              <div className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white bg-[#0E5C3E] shadow-sm flex items-center gap-1">
                <Scale className="w-3 h-3 text-emerald-200" />
                <span>🏦 {compareQueue.length}/3 Savings</span>
              </div>

              <button
                onClick={onClear}
                aria-label="Close panel"
                className="w-6 h-6 rounded-full bg-[#EEF4EE] hover:bg-[#E0E6DC] text-[#445B4D] flex items-center justify-center transition-all cursor-pointer flex-shrink-0 border border-[#E0E6DC]"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto py-1 custom-scrollbar">
              {compareQueue.map((acc, i) => (
                <div key={acc.id || i} className="relative group flex-shrink-0">
                  <div className="rounded-lg px-2 py-1 text-[11px] font-medium flex items-center gap-1 bg-[#F5F3EC] border border-[#E0E6DC] text-[#14291F] max-w-[130px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0E5C3E] flex-shrink-0" />
                    <span className="truncate">{acc.accountName || "Account"}</span>
                  </div>
                  <button
                    onClick={() => onRemove && onRemove(acc.id)}
                    className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] text-white bg-[#14291F] border border-white"
                  >
                    <X className="w-2 h-2" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E0E6DC]">
              <button
                type="button"
                onClick={onClear}
                className="text-[11px] font-bold text-[#445B4D] uppercase px-1 py-1"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={onCompareNow}
                disabled={compareQueue.length < 2}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                  compareQueue.length >= 2
                    ? 'bg-[#0E5C3E] text-white'
                    : 'bg-[#EEF4EE] text-[#445B4D]/50 cursor-not-allowed border border-[#E0E6DC]'
                }`}
              >
                <span>Compare</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SavingsAccountComparisonDock;