import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, ArrowRight, X } from 'lucide-react';
import { getAssociatedDebitCard } from '../data/mockSavingsAccounts';

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
          maxWidth: 'min(50rem, calc(100vw - 1.5rem))',
        }}
        className="fixed inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-[100] w-auto select-none box-border pointer-events-auto"
      >
        <div 
          className="relative rounded-[22px] sm:rounded-[28px] p-3 sm:p-4 border-2 border-amber-400/40 dark:border-amber-400/30 bg-white/98 dark:bg-[#1A0A14]/98 backdrop-blur-2xl shadow-[0_15px_45px_rgba(128,0,32,0.22)] text-slate-800 dark:text-slate-100 box-border w-full overflow-hidden flex flex-col max-h-[82vh]"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-rose-100 dark:border-amber-900/20 flex-shrink-0">
            <div className="px-3 py-1 rounded-full text-xs font-black text-amber-200 bg-gradient-to-r from-[#800020] via-[#9F1239] to-[#800020] border border-amber-400/30 shadow-xs flex items-center gap-1.5 flex-shrink-0">
              <Scale className="w-3.5 h-3.5 text-amber-300" />
              <span>🏦 {compareQueue.length} / 3 SAVINGS ACCOUNTS</span>
            </div>

            <button
              onClick={onClear}
              aria-label="Close comparison panel"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-50 dark:bg-white/10 hover:bg-rose-100 dark:hover:bg-white/20 text-slate-500 hover:text-[#800020] dark:text-slate-300 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer flex-shrink-0 border border-rose-100 dark:border-white/10 active:scale-90"
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Account Chips */}
          <div className="py-2.5 flex flex-wrap items-center gap-2 overflow-y-auto max-h-[140px] sm:max-h-[180px] custom-scrollbar">
            {compareQueue.map((acc, i) => (
              <div key={acc.id || i} className="relative group flex-shrink-0">
                <div className="rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 bg-rose-50/80 dark:bg-white/5 border border-rose-200 dark:border-white/10 text-[#800020] dark:text-amber-200 shadow-xs max-w-[150px] sm:max-w-[210px] hover:border-amber-400/50 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#800020] dark:bg-amber-400 flex-shrink-0" />
                  <span className="truncate">{acc.accountName || "Savings Account"}</span>
                </div>
                <button
                  onClick={() => onRemove && onRemove(acc.id)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white bg-gradient-to-r from-[#800020] to-[#9F1239] hover:from-rose-700 hover:to-rose-800 border border-white/20 shadow-md cursor-pointer transition-transform hover:scale-110 active:scale-95"
                  title="Remove account"
                  aria-label="Remove account"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-rose-100 dark:border-amber-900/20 flex-shrink-0">
            <button
              onClick={onClear}
              className="text-xs font-black text-slate-500 dark:text-slate-400 hover:text-[#800020] dark:hover:text-amber-300 transition-colors cursor-pointer uppercase tracking-wider px-2 py-1.5 min-h-[36px]"
            >
              Clear
            </button>
            <button
              onClick={onCompareNow}
              disabled={compareQueue.length < 2}
              className={`px-5 sm:px-7 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all shadow-md cursor-pointer flex items-center gap-2 active:scale-95 min-h-[40px] ${
                compareQueue.length >= 2
                  ? 'bg-gradient-to-r from-[#800020] via-[#9F1239] to-[#800020] hover:from-[#6B001B] hover:to-[#881337] text-white border border-amber-400/40 shadow-rose-900/25 hover:shadow-lg'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none border border-transparent'
              }`}
            >
              <span>Compare Accounts</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SavingsAccountComparisonDock;
