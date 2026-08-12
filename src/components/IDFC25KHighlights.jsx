import React from 'react';
import { IDFC_7_AMAZING_BENEFITS } from '../utils/idfcDataUtils';
import { Sparkles, CheckCircle2, ShieldCheck, Zap, HeartHandshake } from 'lucide-react';

function IDFC25KHighlights() {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50/50 dark:from-[#1E293B] dark:via-[#1E293B] dark:to-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft space-y-6 text-left select-none">
      
      {/* Header */}
      <div className="space-y-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold uppercase tracking-wider border border-[#2563EB]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
          ₹25K AMB SAVINGS FEATURE HIGHLIGHT
        </span>
        <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white pt-1">
          7 Amazing Benefits
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Source-backed highlights for the IDFC FIRST Bank ₹25K Average Monthly Balance Savings Account.
        </p>
      </div>

      {/* 7 Benefits Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {IDFC_7_AMAZING_BENEFITS.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2 hover:border-[#2563EB]/40 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-xl bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-black flex items-center justify-center border border-[#2563EB]/20">
                0{item.id}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>

            <div>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-white leading-snug">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-normal">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default IDFC25KHighlights;
