import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { normalizeCard, safeMap } from '../utils/compareUtils';

function ComparisonDock({ compareQueue = [], onRemove, onCompareNow, onClear }) {
  const queueList = safeMap(Array.isArray(compareQueue) ? compareQueue : [], normalizeCard);

  if (queueList.length === 0) return null;

  const potentialSavings = queueList.length >= 2 ? "₹1,800/year" : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 220 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-3xl px-4 select-none"
      >
        <div 
          className="rounded-[2rem] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border bg-white/90 dark:bg-black/90 backdrop-blur-2xl border-slate-200 dark:border-secondary/15 shadow-[0_20px_50px_rgba(122,15,82,0.2)] text-slate-800 dark:text-slate-100"
        >
          <div className="flex flex-wrap items-center gap-3">
            {/* Count Chip */}
            <div className="px-3 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r from-primary to-secondary shadow-sm">
              {queueList.length} / 3 QUEUED
            </div>

            {/* Potential Savings Badge */}
            {potentialSavings && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] font-black border border-white/20 shadow-[0_4px_12px_rgba(16,185,129,0.25)] animate-pulse tracking-wider leading-none">
                💰 EST. SAVINGS: {potentialSavings}
              </span>
            )}

            {/* Card Chips */}
            <div className="flex flex-wrap gap-2">
              {queueList.map((card, i) => (
                <div key={card.id || i} className="relative group">
                  <div className="rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA] shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                    {card.cardName || "Debit Card"}
                  </div>
                  <button
                    onClick={() => onRemove && onRemove(card.id)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer bg-gradient-to-r from-[#2563EB] to-[#3B82F6] border border-white/10"
                    title="Remove card"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-100 dark:border-secondary/10 pt-3 sm:pt-0">
            <button
              onClick={onClear}
              className="text-xs font-black text-slate-400 dark:text-slate-500 hover:text-secondary dark:hover:text-roseGold transition-colors cursor-pointer uppercase tracking-wider"
            >
              Clear
            </button>
            <button
              onClick={onCompareNow}
              disabled={queueList.length < 2}
              className={`px-5 py-2.5 rounded-xl text-xs font-black text-white transition-all shadow cursor-pointer ${
                queueList.length >= 2
                  ? 'bg-gradient-to-r from-primary to-secondary hover:shadow-indigo'
                  : 'bg-slate-100 dark:bg-secondary/5 border border-slate-200 dark:border-secondary/10 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              Compare Now
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ComparisonDock;
