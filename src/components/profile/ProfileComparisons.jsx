import React from 'react';
import { motion } from 'framer-motion';
import { GitCompare, ExternalLink, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

function formatDate(dateStr) {
  if (!dateStr) return 'Recently';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function getCategoryStyle(log) {
  const isSavings =
    log.comparisonType === 'savingsAccount' ||
    String((log.compared_cards || log.comparedCards || []).join(' ')).toLowerCase().includes('savings');
  const isCurrent =
    log.comparisonType === 'currentAccount' ||
    String((log.compared_cards || log.comparedCards || []).join(' ')).toLowerCase().includes('current');

  if (isCurrent)
    return {
      label: '💼 Current Account',
      cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      link: '/compare-current',
    };
  if (isSavings)
    return {
      label: '🏦 Savings Account',
      cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      link: '/compare-savings',
    };
  return {
    label: '💳 Debit Card',
    cls: 'bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border-[#2563EB]/20',
    link: '/compare',
  };
}

function ComparisonRow({ log, navigate }) {
  const cards = log.compared_cards || log.comparedCards || [];
  const displayCards = cards.length > 0 ? cards : [log.firstCard, log.secondCard].filter(Boolean);
  const { label, cls, link } = getCategoryStyle(log);
  const dateStr = formatDate(log.created_at || log.comparedAt || log.timestamp);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/60 border border-[#E5E7EB] dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-[#2563EB]/30 dark:hover:border-[#2563EB]/30 transition-all">
      <div className="flex-1 min-w-0 space-y-1.5">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider border ${cls}`}>
          {label}
        </span>
        <p className="text-sm font-extrabold text-[#1F2937] dark:text-white truncate">
          {displayCards.join(' vs ') || 'Comparison'}
        </p>
        <div className="flex items-center gap-1.5 text-[10.5px] text-[#6B7280] dark:text-slate-400">
          <Calendar className="w-3 h-3 shrink-0" />
          {dateStr}
        </div>
      </div>

      <button
        onClick={() => navigate(link)}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 text-xs font-bold text-[#1F2937] dark:text-white hover:border-[#2563EB]/40 hover:text-[#2563EB] transition-all cursor-pointer shrink-0"
      >
        View Comparison
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/**
 * ProfileComparisons — shows comparison history from Firestore via compareService.
 */
export default function ProfileComparisons({ compareLogs, loading }) {
  const navigate = useNavigate();

  return (
    <motion.div {...fadeUp} className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#1F2937] dark:text-white">Comparisons</h2>
          <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-0.5">
            Your previously run product comparison sessions.
          </p>
        </div>
        <span className="text-[11px] font-bold text-[#6B7280] dark:text-slate-400 shrink-0 mt-1">
          {compareLogs.length} session{compareLogs.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16 flex flex-col items-center gap-3 text-[#6B7280] dark:text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
          <span className="text-xs font-medium">Loading comparison history…</span>
        </div>
      ) : compareLogs.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/50 border border-dashed border-[#E5E7EB] dark:border-slate-700 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
            <GitCompare className="w-6 h-6 text-slate-400 dark:text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1F2937] dark:text-white">No comparisons yet.</p>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-1 max-w-xs mx-auto">
              Select products to compare and they'll be logged here automatically.
            </p>
          </div>
          <button
            onClick={() => navigate('/compare')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-[#1D4ED8] transition-all cursor-pointer shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Compare Products
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {compareLogs.map((log) => (
            <ComparisonRow key={log.id} log={log} navigate={navigate} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
