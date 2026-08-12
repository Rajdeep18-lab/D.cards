import React, { useState, useMemo } from 'react';
import { calculateIDFCFirstTierEligibility } from '../utils/idfcDataUtils';
import { Calculator, CheckCircle2, AlertCircle, Info, Sparkles, Star } from 'lucide-react';

function IDFCTierEligibilityCalculator() {
  const [amb, setAmb] = useState('');
  const [salary, setSalary] = useState('');
  const [aum, setAum] = useState('');
  const [orv, setOrv] = useState('');

  const result = useMemo(() => {
    return calculateIDFCFirstTierEligibility({ amb, salary, aum, orv });
  }, [amb, salary, aum, orv]);

  const handleReset = () => {
    setAmb('');
    setSalary('');
    setAum('');
    setOrv('');
  };

  const renderStars = (rating) => {
    const starsCount = Math.round(rating || 0);
    return (
      <span className="inline-flex items-center text-amber-400 gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className={`w-3.5 h-3.5 ${s <= starsCount ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
        ))}
      </span>
    );
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-6 text-left select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold uppercase tracking-wider border border-[#2563EB]/20 mb-1">
            <Calculator className="w-3.5 h-3.5 text-[#2563EB]" />
            ELIGIBILITY ENGINE
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white">
            Which tier can I qualify for?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Enter whichever values you know. Meeting <strong className="text-slate-700 dark:text-slate-200 font-bold">ANY ONE</strong> required criterion qualifies you for that tier.
          </p>
        </div>

        {(amb || salary || aum || orv) && (
          <button
            onClick={handleReset}
            className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline cursor-pointer self-start sm:self-auto"
          >
            Clear Fields
          </button>
        )}
      </div>

      {/* Input Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold">
        <div className="space-y-1.5">
          <label className="text-slate-600 dark:text-slate-300 block text-[11px] font-bold uppercase tracking-wider">
            Savings Account AMB (₹)
          </label>
          <input
            type="number"
            value={amb}
            onChange={(e) => setAmb(e.target.value)}
            placeholder="e.g. 100000"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-600 dark:text-slate-300 block text-[11px] font-bold uppercase tracking-wider">
            Net Monthly Salary Credit (₹)
          </label>
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="e.g. 100000"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-600 dark:text-slate-300 block text-[11px] font-bold uppercase tracking-wider">
            Assets Under Mgt (AUM) (₹)
          </label>
          <input
            type="number"
            value={aum}
            onChange={(e) => setAum(e.target.value)}
            placeholder="e.g. 500000"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-600 dark:text-slate-300 block text-[11px] font-bold uppercase tracking-wider">
            Overall Rel. Value (ORV) (₹)
          </label>
          <input
            type="number"
            value={orv}
            onChange={(e) => setOrv(e.target.value)}
            placeholder="e.g. 1000000"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
          />
        </div>
      </div>

      {/* Output Results Box */}
      {result.eligible ? (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Highest Eligible Tier
            </span>
            {renderStars(result.rating)}
          </div>
          <h4 className="text-2xl font-black text-slate-800 dark:text-white">
            {result.tier}
          </h4>
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 dark:text-emerald-300 pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Why you qualify: Eligible through {result.criterionUsed} ({result.criterionValue})</span>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>No matching tier found based on the information provided.</span>
          </div>
          <p>
            Please enter your known AMB, monthly salary, AUM, or ORV above. If you meet at least one criterion (minimum ₹25,000 AMB for standard savings tier), your highest eligible privilege tier will be displayed automatically.
          </p>
        </div>
      )}

      {/* Disclaimers */}
      <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-slate-900/40 border border-blue-100 dark:border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-500 dark:text-slate-400 font-normal">
        <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
        <span>
          * Estimated eligibility based on the provided criteria. Illustrative only, based on provided brochure data. Confirm current T&Cs with IDFC FIRST Bank before making decisions.
        </span>
      </div>

    </div>
  );
}

export default IDFCTierEligibilityCalculator;
