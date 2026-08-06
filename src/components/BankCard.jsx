import { memo } from "react";
import { Building2, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

function BankCard({ bank, onSelect }) {
  const trustScores = {
    "HDFC Bank": 9.4,
    "ICICI Bank": 9.2,
    "SBI": 8.9,
    "State Bank of India": 8.9,
    "Axis Bank": 9.0,
    "IDFC First": 9.1,
    "Kotak Mahindra": 8.8,
    "IndusInd Bank": 8.7,
    "Fi Money": 8.5
  };
  const score = trustScores[bank.name] || 8.6;

  return (
    <article className="group flex flex-col rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 hover:border-[#2563EB]/40 cursor-pointer shadow-soft hover:shadow-cardHover text-left">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl font-bold text-[#2563EB] bg-[#EFF6FF] dark:bg-slate-800 border border-[#2563EB]/20 group-hover:scale-105 transition-transform">
          {bank.logo || <Building2 className="w-6 h-6 text-[#2563EB]" />}
        </div>
        {bank.lowCharges && (
          <span className="rounded-full px-3 py-1 text-[11px] font-semibold border bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            Low Charges
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-[#1F2937] dark:text-white group-hover:text-[#2563EB] transition-colors leading-tight">
        {bank.name}
      </h3>

      <ul className="mt-4 space-y-2 text-xs text-[#6B7280] dark:text-slate-300 font-normal flex-1">
        {bank.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA] flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA]">
        Savings Rate: {bank.interest}% p.a.
      </p>

      {/* Trust Rating Bar */}
      <div className="mt-3 p-3 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E5E7EB] dark:border-slate-800 select-none">
        <div className="flex justify-between items-center text-xs font-semibold text-[#1F2937] dark:text-slate-200">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" /> Trust Index
          </span>
          <span>{score}/10</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-full" 
            style={{ width: `${score * 10}%` }}
          />
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (onSelect) onSelect();
        }}
        className="mt-5 w-full rounded-xl py-2.5 text-xs font-semibold bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 text-white transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
      >
        <span>View Matched Cards</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </article>
  );
}

export default memo(BankCard, (prevProps, nextProps) => {
  return prevProps.bank?.name === nextProps.bank?.name;
});
