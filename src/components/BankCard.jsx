import React, { memo } from "react";
import { motion } from "framer-motion";
import { Building2, ShieldCheck, CheckCircle2, ArrowRight, Percent, CreditCard, Sparkles } from "lucide-react";

function BankCard({ bank, onSelect }) {
  if (!bank) return null;

  // Support both legacy mock bank structure and new dynamic JSON structure
  const bankName = bank.name || "Unknown Bank";
  const cardCountText = bank.cardCount !== undefined
    ? `${bank.cardCount} Debit Card${bank.cardCount !== 1 ? 's' : ''} Available`
    : (bank.cardsAvailable ? `${bank.cardsAvailable} Debit Cards Available` : "Debit Cards Available");

  const trustScore = typeof bank.trustScore === 'number' ? bank.trustScore : 8.8;
  const features = Array.isArray(bank.features) && bank.features.length > 0 
    ? bank.features.slice(0, 3)
    : ["Cashback Rewards", "Lounge Access", "Contactless Tap & Pay"];

  const interestRate = bank.interest !== undefined ? bank.interest : 3.0;
  const badges = Array.isArray(bank.badges) ? bank.badges : [];
  const logoText = bank.logoText || bankName.slice(0, 2).toUpperCase();

  return (
    <motion.article 
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative flex flex-col justify-between rounded-3xl p-6 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 hover:border-[#2563EB]/50 hover:shadow-[0_0_25px_rgba(37,99,235,0.18)] transition-all duration-300 cursor-pointer text-left overflow-hidden select-none"
    >
      {/* Background Subtle Gradient Highlight on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div>
        {/* Top Header: Logo + Badges */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl font-black text-sm text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 shadow-xs group-hover:scale-105 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-300 flex-shrink-0">
              {typeof bank.logo === 'string' && bank.logo.length <= 3 ? bank.logo : logoText}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1F2937] dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors leading-snug">
                {bankName}
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6B7280] dark:text-slate-400">
                <CreditCard className="w-3 h-3 text-[#2563EB]" />
                {cardCountText}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {badges.map((b, idx) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${b.bg || 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'}`}
              >
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </span>
            ))}
          </div>
        )}

        {/* Top 3 Debit Card Benefits */}
        <div className="my-3 space-y-2">
          <span className="text-[10px] font-bold text-[#6B7280] dark:text-slate-400 uppercase tracking-wider block">
            Top Debit Card Benefits
          </span>
          <ul className="space-y-2 text-xs text-[#374151] dark:text-slate-200 font-normal">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA] flex-shrink-0 mt-0.5" />
                <span className="leading-tight">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[#E5E7EB] dark:border-slate-800 space-y-3">
        {/* Savings Interest Rate */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#6B7280] dark:text-slate-400 font-medium flex items-center gap-1">
            <Percent className="w-3.5 h-3.5 text-emerald-500" />
            Savings Interest:
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/20">
            {interestRate}% p.a.
          </span>
        </div>

        {/* Trust Rating Bar */}
        <div className="p-3 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800/80">
          <div className="flex justify-between items-center text-xs font-semibold text-[#1F2937] dark:text-slate-200 mb-1.5">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
              Trust Index
            </span>
            <span className="text-[#2563EB] dark:text-[#60A5FA] font-extrabold">
              {trustScore}/10
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(10, trustScore * 10))}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-full shadow-xs" 
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onSelect) onSelect(bankName);
          }}
          className="w-full rounded-xl py-2.5 text-xs font-semibold bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] group-hover:brightness-105"
        >
          <span>View Matched Cards</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.article>
  );
}

export default memo(BankCard, (prevProps, nextProps) => {
  return (
    prevProps.bank?.name === nextProps.bank?.name &&
    prevProps.bank?.cardCount === nextProps.bank?.cardCount &&
    prevProps.bank?.trustScore === nextProps.bank?.trustScore
  );
});
