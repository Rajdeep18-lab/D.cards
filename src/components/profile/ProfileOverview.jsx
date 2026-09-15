import React from 'react';
import { motion } from 'framer-motion';
import {
  Landmark,
  CreditCard,
  GitCompare,
  Clock,
  ChevronRight,
  TrendingUp,
  Heart,
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

/**
 * ProfileOverview — dashboard landing with real stat summary cards.
 */
export default function ProfileOverview({
  savedSavingsCount,
  savedCurrentCount,
  savedDebitCardsCount,
  comparisonsCount,
  recentlyViewedCount,
  totalSavedCount,
  onNavigate,
}) {
  const statCards = [
    {
      label: 'Saved Accounts',
      sublabel: `${savedSavingsCount} Savings · ${savedCurrentCount} Current`,
      value: savedSavingsCount + savedCurrentCount,
      icon: Landmark,
      color: 'emerald',
      section: 'saved-accounts',
      gradient: 'from-emerald-500/15 to-emerald-500/5',
      border: 'border-emerald-500/25',
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-500',
      valueColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Saved Debit Cards',
      sublabel: 'Cards in your wishlist',
      value: savedDebitCardsCount,
      icon: CreditCard,
      color: 'blue',
      section: 'saved-cards',
      gradient: 'from-[#2563EB]/15 to-[#2563EB]/5',
      border: 'border-[#2563EB]/25',
      iconBg: 'bg-[#2563EB]/15',
      iconColor: 'text-[#2563EB]',
      valueColor: 'text-[#2563EB] dark:text-[#60A5FA]',
    },
    {
      label: 'Comparisons',
      sublabel: 'Sessions logged',
      value: comparisonsCount,
      icon: GitCompare,
      color: 'violet',
      section: 'comparisons',
      gradient: 'from-violet-500/15 to-violet-500/5',
      border: 'border-violet-500/25',
      iconBg: 'bg-violet-500/15',
      iconColor: 'text-violet-500',
      valueColor: 'text-violet-600 dark:text-violet-400',
    },
    {
      label: 'Recently Viewed',
      sublabel: 'Products explored',
      value: recentlyViewedCount,
      icon: Clock,
      color: 'amber',
      section: 'recently-viewed',
      gradient: 'from-amber-500/15 to-amber-500/5',
      border: 'border-amber-500/25',
      iconBg: 'bg-amber-500/15',
      iconColor: 'text-amber-500',
      valueColor: 'text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <motion.div {...fadeUp} className="space-y-6">
      {/* Section title */}
      <div>
        <h2 className="text-xl font-black text-[#1F2937] dark:text-white">
          Overview
        </h2>
        <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-0.5">
          Your D.CARD activity at a glance.
        </p>
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(
          ({
            label,
            sublabel,
            value,
            icon: Icon,
            section,
            gradient,
            border,
            iconBg,
            iconColor,
            valueColor,
          }) => (
            <button
              key={section}
              onClick={() => onNavigate(section)}
              className={`group p-5 rounded-2xl bg-gradient-to-br ${gradient} border ${border} text-left transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer w-full`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors mt-0.5" />
              </div>
              <div className={`text-3xl font-black ${valueColor} leading-none`}>
                {value}
              </div>
              <div className="mt-1.5 space-y-0.5">
                <p className="text-xs font-bold text-[#1F2937] dark:text-white leading-tight">
                  {label}
                </p>
                <p className="text-[10.5px] text-[#6B7280] dark:text-slate-400">
                  {sublabel}
                </p>
              </div>
            </button>
          )
        )}
      </div>

      {/* Quick summary strip */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <Heart className="w-4.5 h-4.5 text-rose-500 fill-rose-500" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#1F2937] dark:text-white">
              Your Saved Portfolio
            </h3>
            <p className="text-[11px] text-[#6B7280] dark:text-slate-400">
              {totalSavedCount} product{totalSavedCount !== 1 ? 's' : ''} across your wishlist
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 divide-x divide-[#E5E7EB] dark:divide-slate-700">
          <div className="text-center px-4">
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {savedSavingsCount}
            </div>
            <div className="text-[10.5px] text-[#6B7280] dark:text-slate-400 mt-0.5 font-medium">
              Savings Accounts
            </div>
          </div>
          <div className="text-center px-4">
            <div className="text-xl font-black text-amber-600 dark:text-amber-400">
              {savedCurrentCount}
            </div>
            <div className="text-[10.5px] text-[#6B7280] dark:text-slate-400 mt-0.5 font-medium">
              Current Accounts
            </div>
          </div>
          <div className="text-center px-4">
            <div className="text-xl font-black text-[#2563EB] dark:text-[#60A5FA]">
              {savedDebitCardsCount}
            </div>
            <div className="text-[10.5px] text-[#6B7280] dark:text-slate-400 mt-0.5 font-medium">
              Debit Cards
            </div>
          </div>
        </div>
      </div>

      {totalSavedCount === 0 && comparisonsCount === 0 && recentlyViewedCount === 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#2563EB]/8 to-transparent border border-[#2563EB]/20 text-center space-y-2">
          <p className="text-sm font-bold text-[#1F2937] dark:text-white">
            Your profile dashboard is ready.
          </p>
          <p className="text-xs text-[#6B7280] dark:text-slate-400">
            Start exploring banking products, save your favourites, and compare them side-by-side. Everything will appear here.
          </p>
        </div>
      )}
    </motion.div>
  );
}
