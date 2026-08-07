import React, { memo } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, ArrowRight, Percent, CreditCard } from "lucide-react";
import BankBrandLogo from "./BankBrandLogo";
import { getBankBrandTheme } from "../utils/bankDirectoryUtils";

function BankCard({ bank, onSelect }) {
  if (!bank) return null;

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
  const brandTheme = bank.brandTheme || getBankBrandTheme(bankName);

  return (
    <motion.article 
      whileHover={{ y: -8, rotate: 0.8 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="group relative flex flex-col justify-between rounded-3xl p-6 glass-card-premium glass-card-hover border border-[#E5E7EB] dark:border-slate-800 hover:border-[#2563EB]/60 hover:shadow-[0_20px_50px_rgba(37,99,235,0.2)] transition-all duration-300 cursor-pointer text-left overflow-hidden select-none gpu-layer"
    >
      {/* Background Subtle Gradient Ambient Glow on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${brandTheme.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />

      <div>
        {/* Top Header: Official Bank Logo + Bank Name */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <BankBrandLogo 
              bankName={bankName} 
              logoText={logoText} 
              className="w-12 h-12 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" 
            />
            <div>
              <h3 className="text-base font-extrabold text-[#1F2937] dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors leading-snug">
                {bankName}
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6B7280] dark:text-slate-400">
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
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${b.bg || 'bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border-[#2563EB]/20'}`}
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
                <CheckCircle2 className={`w-3.5 h-3.5 ${brandTheme.accentText} flex-shrink-0 mt-0.5`} />
                <span className="leading-tight">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[#E5E7EB] dark:border-slate-800/80 space-y-3">
        {/* Savings Interest Rate */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#6B7280] dark:text-slate-400 font-medium flex items-center gap-1">
            <Percent className="w-3.5 h-3.5 text-emerald-500" />
            Savings Interest:
          </span>
          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/20">
            {interestRate}% p.a.
          </span>
        </div>

        {/* Trust Rating Bar */}
        <div className="p-3 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900/90 border border-[#E5E7EB] dark:border-slate-800/80">
          <div className="flex justify-between items-center text-xs font-bold text-[#1F2937] dark:text-slate-200 mb-1.5">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
              Trust Index
            </span>
            <span className={`${brandTheme.accentText} font-extrabold`}>
              {trustScore}/10
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(10, trustScore * 10))}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${brandTheme.progressGradient || 'from-[#2563EB] to-[#60A5FA]'} rounded-full shadow-xs`} 
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onSelect) onSelect(bankName);
          }}
          className={`w-full rounded-xl py-3 text-xs font-bold bg-gradient-to-r ${brandTheme.gradient} hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] group-hover:brightness-110`}
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
