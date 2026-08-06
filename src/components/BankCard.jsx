import { memo } from "react";

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
    <article className="group flex flex-col rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-2 premium-border bg-white/45 dark:bg-[#07030a]/45 backdrop-blur-xl border border-slate-200 dark:border-secondary/15 hover:border-secondary/35 cursor-pointer shadow-soft hover:shadow-[0_15px_35px_rgba(194,24,117,0.08)]">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl font-black text-secondary shadow-inner transition-all group-hover:scale-110 bg-slate-100 dark:bg-secondary/10 border border-slate-250 dark:border-secondary/15">
          {bank.logo}
        </div>
        {bank.lowCharges && (
          <span className="rounded-full px-3 py-1 text-xs font-black border bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            Low Charges
          </span>
        )}
      </div>

      <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 group-hover:text-secondary transition-colors font-serif leading-tight">{bank.name}</h3>

      <ul className="mt-4 space-y-2 text-sm text-textSoft dark:text-slate-300 font-semibold font-sans">
        {bank.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="mt-0.5 w-4 h-4 flex-shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-gradient-to-r from-primary to-secondary">✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-sm font-black text-[#A30D62] dark:text-roseGold">Interest: {bank.interest}% p.a.</p>

      {/* ── Bank Trust Meter ── */}
      <div className="mt-4 p-3 rounded-2xl bg-slate-100/50 dark:bg-secondary/5 border border-slate-200/50 dark:border-secondary/15 select-none">
        <div className="flex justify-between items-center text-xs font-black text-slate-800 dark:text-[#F5D9E8]">
          <span className="flex items-center gap-1">🛡️ Trust Index</span>
          <span>{score}/10</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-secondary/10 h-2 rounded-full mt-1.5 overflow-hidden border border-slate-300/30 dark:border-secondary/5">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
            style={{ width: `${score * 10}%` }}
          />
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (onSelect) onSelect();
        }}
        className="mt-6 w-full rounded-xl py-2.5 text-xs font-black border border-secondary/25 hover:border-secondary/50 text-secondary dark:text-roseGold bg-transparent hover:bg-secondary/5 transition-all cursor-pointer">
        View Matched Cards
      </button>
    </article>
  );
}

export default memo(BankCard, (prevProps, nextProps) => {
  return prevProps.bank?.name === nextProps.bank?.name;
});
