import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
        initial={{ y: 100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 220 }}
        style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
        className="fixed left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-3xl select-none box-border"
      >
        <div 
          className="rounded-[2rem] p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 border bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-slate-200 dark:border-secondary/15 shadow-[0_20px_50px_rgba(11,61,145,0.25)] text-slate-800 dark:text-slate-100 box-border w-full"
        >
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 w-full sm:w-auto">
            {/* Count Chip */}
            <div className="px-3 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r from-[#0B3D91] to-[#2563EB] shadow-sm flex-shrink-0">
              🏦 {compareQueue.length} / 3 SAVINGS ACCOUNTS
            </div>

            {/* Account Chips */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start max-w-full">
              {compareQueue.map((acc, i) => (
                <div key={acc.id || i} className="relative group max-w-[130px] sm:max-w-[190px]">
                  <div className="rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA] shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />
                    <span className="truncate">{acc.accountName || "Savings Account"}</span>
                  </div>
                  <button
                    onClick={() => onRemove && onRemove(acc.id)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer bg-gradient-to-r from-[#2563EB] to-[#3B82F6] border border-white/10"
                    title="Remove account"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 dark:border-secondary/10 pt-2.5 sm:pt-0">
            <button
              onClick={onClear}
              className="text-xs font-black text-slate-400 dark:text-slate-500 hover:text-rose-500 transition-colors cursor-pointer uppercase tracking-wider px-2 py-1"
            >
              Clear
            </button>
            <button
              onClick={onCompareNow}
              disabled={compareQueue.length < 2}
              className={`px-5 py-2.5 rounded-xl text-xs font-black text-white transition-all shadow cursor-pointer ${
                compareQueue.length >= 2
                  ? 'bg-gradient-to-r from-[#0B3D91] via-[#2563EB] to-[#3B82F6] hover:shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              Compare Accounts
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SavingsAccountComparisonDock;
