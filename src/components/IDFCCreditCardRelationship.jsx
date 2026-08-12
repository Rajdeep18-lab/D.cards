import React from 'react';
import { IDFC_ASSOCIATED_CREDIT_CARDS, IDFC_FIRST_WOW_CREDIT_CARD } from '../utils/idfcDataUtils';
import { CreditCard, CheckCircle2, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

function IDFCCreditCardRelationship({ currentTier }) {
  const cardData = IDFC_ASSOCIATED_CREDIT_CARDS[currentTier];

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* 1. Associated Tier Credit Card */}
      {cardData && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-[#1E293B] to-slate-900 text-white border border-slate-800 shadow-xl space-y-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#2563EB]/20 text-[#60A5FA] border border-[#2563EB]/30 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#60A5FA]">
                  SAVINGS TIER → ASSOCIATED CREDIT CARD
                </span>
                <h4 className="text-xl font-extrabold text-white">
                  {cardData.cardName}
                </h4>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-500/30 shrink-0 self-start sm:self-auto">
              ✓ {cardData.lifetimeFee}
            </span>
          </div>

          <p className="text-xs text-slate-300 font-medium">
            <strong className="text-white">Eligibility:</strong> {cardData.incomeReq}
          </p>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Key Card Benefits:</span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
              {cardData.keyBenefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#60A5FA] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 2. Additional Credit Card Option (FIRST WOW Credit Card) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              ADDITIONAL CREDIT CARD OPTION (FD BACKED)
            </span>
            <h4 className="text-xl font-extrabold text-slate-800 dark:text-white">
              {IDFC_FIRST_WOW_CREDIT_CARD.cardName}
            </h4>
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold border border-amber-500/20 shrink-0 self-start sm:self-auto">
            {IDFC_FIRST_WOW_CREDIT_CARD.lifetimeFee}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Eligibility</span>
            <p className="font-extrabold text-slate-800 dark:text-white">{IDFC_FIRST_WOW_CREDIT_CARD.eligibility}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Income Proof</span>
            <p className="font-extrabold text-slate-800 dark:text-white">{IDFC_FIRST_WOW_CREDIT_CARD.incomeProof}</p>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">FIRST WOW Card Highlights:</span>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
            {IDFC_FIRST_WOW_CREDIT_CARD.keyBenefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
}

export default IDFCCreditCardRelationship;
