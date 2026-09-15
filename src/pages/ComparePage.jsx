import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Scale, ArrowRight, Trash2, CheckCircle2, CreditCard, Building2, Briefcase } from 'lucide-react';
import ComparisonTable from '../components/ComparisonTable';
import SavingsCalculator from '../components/SavingsCalculator';
import { useSEO } from '../hooks/useSEO';

function ComparePage({ compareQueue, setCompareQueue, setSelectedCard }) {
  useSEO({
    title: "Compare Debit Cards Side by Side | D.Card",
    description: "Compare features, annual charges, daily ATM limits, and rewards across debit cards side by side on D.Card.",
    canonicalUrl: "https://www.dcard.website/compare"
  });

  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5E7EB] dark:border-slate-800 pb-6">
        <div>
          <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
            FEATURE COMPARISON ENGINE
          </span>
          <h1 className="text-3xl font-bold text-[#1F2937] dark:text-white">
            Side-by-Side Card Comparison
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1 font-normal">
            Detailed matrix comparing annual fees, lounge access, withdrawal limits, forex markup, and rewards
          </p>
        </div>

        {compareQueue.length > 0 && (
          <button 
            onClick={() => setCompareQueue([])} 
            className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold text-xs border border-red-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Cards ({compareQueue.length})</span>
          </button>
        )}
      </div>

      {/* Comparison Category Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
        <button
          onClick={() => navigate('/compare')}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2563EB] text-white shadow-xs cursor-pointer flex items-center gap-1.5"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Debit Cards</span>
        </button>
        <button
          onClick={() => navigate('/compare-savings')}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Savings Accounts</span>
        </button>
        <button
          onClick={() => navigate('/compare-current')}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Current Accounts</span>
        </button>
      </div>

      {/* Main Comparison Section */}
      <section className="bg-white dark:bg-[#1E293B] rounded-3xl p-4 sm:p-8 shadow-soft border border-[#E5E7EB] dark:border-slate-800 transition-colors">
        {compareQueue.length === 0 ? (
          <div className="py-16 px-6 text-center max-w-lg mx-auto space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/20 flex items-center justify-center text-3xl mx-auto shadow-sm">
              <Scale className="w-8 h-8 text-[#2563EB]" />
            </div>
            <h2 className="text-xl font-bold text-[#1F2937] dark:text-white">
              No Cards Selected for Comparison
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 leading-relaxed font-normal">
              You can add up to 3 debit cards to compare their annual fees, daily limits, lounge rules, and hidden charges side by side.
            </p>
            <button
              onClick={() => navigate('/cards')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 text-white font-semibold text-xs tracking-wide uppercase shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Browse & Select Cards</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <ComparisonTable cards={compareQueue} />
        )}
      </section>

      {/* Interactive Savings Calculator */}
      <SavingsCalculator />
    </main>
  );
}

export default ComparePage;
