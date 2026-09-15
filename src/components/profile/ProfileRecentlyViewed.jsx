import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ExternalLink, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { removeRecentlyViewed } from '../../utils/recentlyViewedUtils';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

function formatTime(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function getCategoryBadge(item) {
  if (item.type === 'currentAccount')
    return {
      label: '💼 Current Account',
      cls: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    };
  if (item.type === 'savingsAccount')
    return {
      label: '🏦 Savings Account',
      cls: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    };
  return {
    label: '💳 Debit Card',
    cls: 'bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border-[#2563EB]/20',
  };
}

function RecentItem({ item, onViewDetails, onDismiss }) {
  const { label, cls } = getCategoryBadge(item);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center gap-3">
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
        <Clock className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider border ${cls}`}>
          {label}
        </span>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {item.bank}
        </p>
        <p className="text-sm font-extrabold text-[#1F2937] dark:text-white truncate">
          {item.name}
        </p>
        {item.viewedAt && (
          <p className="text-[10px] text-[#6B7280] dark:text-slate-500">
            Viewed {formatTime(item.viewedAt)}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onViewDetails(item)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F8FAFC] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 text-xs font-bold text-[#1F2937] dark:text-white hover:border-[#2563EB]/40 hover:text-[#2563EB] transition-all cursor-pointer"
        >
          View Details
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDismiss(item.id)}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all cursor-pointer"
          title="Remove from recently viewed"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * ProfileRecentlyViewed — reads from localStorage recently viewed tracker.
 */
export default function ProfileRecentlyViewed({
  recentItems,
  onRefresh,
  onViewDetails,
}) {
  const navigate = useNavigate();

  const handleDismiss = (id) => {
    removeRecentlyViewed(id);
    onRefresh();
  };

  return (
    <motion.div {...fadeUp} className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#1F2937] dark:text-white">Recently Viewed</h2>
          <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-0.5">
            Banking products you've explored recently.
          </p>
        </div>
        {recentItems.length > 0 && (
          <span className="text-[11px] font-bold text-[#6B7280] dark:text-slate-400 shrink-0 mt-1">
            {recentItems.length} item{recentItems.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {recentItems.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/50 border border-dashed border-[#E5E7EB] dark:border-slate-700 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6 text-slate-400 dark:text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1F2937] dark:text-white">No recently viewed products yet.</p>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-1 max-w-xs mx-auto">
              Open any card or account detail to track it here automatically.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-bold hover:bg-[#1D4ED8] transition-all cursor-pointer shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Explore Products
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {recentItems.map((item) => (
            <RecentItem
              key={item.id}
              item={item}
              onViewDetails={onViewDetails}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
