import React, { useState, useMemo } from 'react';
import { IDFC_BENEFITS_COMPARISON_MATRIX, IDFC_TIER_RATINGS } from '../utils/idfcDataUtils';
import { Scale, Star, Filter, CheckCircle2, ChevronRight } from 'lucide-react';

function IDFCTierBenefitsComparison() {
  const [activeFilterCategory, setActiveFilterCategory] = useState('All');
  const [selectedMobileTier, setSelectedMobileTier] = useState('FIRST Wealth');

  const filteredMatrix = useMemo(() => {
    if (activeFilterCategory === 'All') return IDFC_BENEFITS_COMPARISON_MATRIX;
    return IDFC_BENEFITS_COMPARISON_MATRIX.filter(item => item.category === activeFilterCategory);
  }, [activeFilterCategory]);

  const renderStars = (rating) => {
    const starsCount = Math.round(rating || 0);
    return (
      <span className="inline-flex items-center text-amber-400 gap-0.5 text-[10px]">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className={`w-3 h-3 ${s <= starsCount ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
        ))}
      </span>
    );
  };

  const getTierValueKey = (tierName) => {
    if (tierName === '₹25K AMB Savings') return 'amb25k';
    if (tierName === 'FIRST Select') return 'select';
    if (tierName === 'FIRST Wealth') return 'wealth';
    if (tierName === 'FIRST Private') return 'private';
    return 'wealth';
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-6 text-left select-none">
      
      {/* Header & Filter Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold uppercase tracking-wider border border-[#2563EB]/20 mb-1">
            <Scale className="w-3.5 h-3.5 text-[#2563EB]" />
            PRIVILEGE MATRIX
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white">
            Compare IDFC FIRST Bank Savings Tiers
          </h3>
        </div>

        {/* Filter Toggle Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['All', 'Travel Benefits', 'Value Added Services'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeFilterCategory === cat
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-[#2563EB]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── DESKTOP COMPARISON TABLE (Sticky First Column) ── */}
      <div className="hidden md:block overflow-x-auto custom-scrollbar border border-slate-200 dark:border-slate-800 rounded-2xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white">
              <th className="p-4 sticky left-0 z-20 bg-slate-50 dark:bg-slate-900 font-extrabold min-w-[200px] border-r border-slate-200 dark:border-slate-800">
                Benefit Feature
              </th>
              <th className="p-4 font-extrabold min-w-[160px] text-center border-r border-slate-200 dark:border-slate-800">
                <div>₹25K AMB</div>
                {renderStars(2.0)}
              </th>
              <th className="p-4 font-extrabold min-w-[160px] text-center border-r border-slate-200 dark:border-slate-800">
                <div>FIRST Select</div>
                {renderStars(3.0)}
              </th>
              <th className="p-4 font-extrabold min-w-[160px] text-center border-r border-slate-200 dark:border-slate-800 bg-[#2563EB]/5">
                <div className="text-[#2563EB] dark:text-[#60A5FA]">FIRST Wealth</div>
                {renderStars(4.0)}
              </th>
              <th className="p-4 font-extrabold min-w-[160px] text-center">
                <div className="text-amber-600 dark:text-amber-400">FIRST Private</div>
                {renderStars(5.0)}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {filteredMatrix.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold sticky left-0 z-10 bg-white dark:bg-[#1E293B] border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                    {row.category}
                  </span>
                  {row.benefitName}
                </td>
                <td className="p-4 text-center border-r border-slate-200 dark:border-slate-800 font-medium">
                  {row.amb25k}
                </td>
                <td className="p-4 text-center border-r border-slate-200 dark:border-slate-800 font-medium">
                  {row.select}
                </td>
                <td className="p-4 text-center border-r border-slate-200 dark:border-slate-800 font-bold text-[#2563EB] dark:text-[#60A5FA] bg-[#2563EB]/5">
                  {row.wealth}
                </td>
                <td className="p-4 text-center font-bold text-amber-600 dark:text-amber-400">
                  {row.private}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE EXPERIENCE (Tier Switcher Tabs - Fits 320px-430px) ── */}
      <div className="md:hidden space-y-4">
        {/* Tier Tabs */}
        <div className="grid grid-cols-2 xs:grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-extrabold">
          {[
            { name: '₹25K AMB Savings', label: '₹25K AMB', rating: 2.0 },
            { name: 'FIRST Select', label: 'Select', rating: 3.0 },
            { name: 'FIRST Wealth', label: 'Wealth', rating: 4.0 },
            { name: 'FIRST Private', label: 'Private', rating: 5.0 }
          ].map((t) => (
            <button
              key={t.name}
              onClick={() => setSelectedMobileTier(t.name)}
              className={`py-2 px-1.5 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                selectedMobileTier === t.name
                  ? 'bg-white dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA] shadow-xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span className="text-[11px] font-black leading-none">{t.label}</span>
              <span className="text-[9px] text-amber-400 font-normal mt-0.5">★ {t.rating}</span>
            </button>
          ))}
        </div>

        {/* Selected Tier Mobile Benefit Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA]">
            <span className="text-xs font-black uppercase tracking-wider">{selectedMobileTier}</span>
            {renderStars(IDFC_TIER_RATINGS[selectedMobileTier] || 4.0)}
          </div>

          <div className="space-y-2 text-xs">
            {filteredMatrix.map((item, idx) => {
              const valKey = getTierValueKey(selectedMobileTier);
              const valText = item[valKey];

              return (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[9.5px] font-bold text-slate-400 uppercase block">{item.category}</span>
                    <span className="font-extrabold text-slate-800 dark:text-white block mt-0.5">{item.benefitName}</span>
                  </div>
                  <span className="font-bold text-[#2563EB] dark:text-[#60A5FA] text-right shrink-0 max-w-[140px]">
                    {valText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}

export default IDFCTierBenefitsComparison;
