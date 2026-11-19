import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Scale, ArrowRight, Trash2, CheckCircle2, CreditCard, Building2, Briefcase } from 'lucide-react';
import ComparisonTable from '../components/ComparisonTable';
import SavingsCalculator from '../components/SavingsCalculator';
import { useSEO } from '../hooks/useSEO';

import { useLanguage } from '../context/LanguageContext';

function ComparePage({ compareQueue, setCompareQueue, setSelectedCard }) {
  const { isHindi, t } = useLanguage();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.dcard.website/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Compare Debit Cards",
        "item": "https://www.dcard.website/compare"
      }
    ]
  };

  useSEO({
    title: isHindi 
      ? "डेबिट कार्ड तुलना — वार्षिक शुल्क, लाउंज व एटीएम सीमा | D.Card"
      : "Compare Debit Cards Side by Side – Fees, Limits & Benefits | D.Card",
    description: isHindi
      ? "वार्षिक शुल्क, लाउंज एक्सेस, एटीएम निकासी सीमा और कैश बैक रिवार्ड्स की आमने-सामने तुलना करें।"
      : "Compare features, annual charges, daily ATM limits, and rewards across top Indian debit cards side by side on D.Card.",
    canonicalUrl: "https://www.dcard.website/compare",
    schema: breadcrumbSchema
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Restore queued cards from navigation state or sessionStorage if initial array is empty
  useEffect(() => {
    if (!compareQueue || compareQueue.length === 0) {
      if (location.state?.queue && Array.isArray(location.state.queue) && location.state.queue.length > 0) {
        setCompareQueue(location.state.queue);
      } else {
        try {
          const saved = sessionStorage.getItem('dcard_compare_queue');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setCompareQueue(parsed);
            }
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }, [compareQueue, location.state, setCompareQueue]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E0E6DC] pb-6">
        <div>
          <span className="text-xs font-semibold text-[#0E5C3E] tracking-widest uppercase block mb-1">
            {t('compare.badge', 'FEATURE COMPARISON ENGINE')}
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#14291F]">
            {t('compare.title', 'Side-by-Side Card Comparison')}
          </h1>
          <p className="text-xs sm:text-sm text-[#445B4D] mt-1 font-normal">
            {t('compare.subtitle', 'Detailed matrix comparing annual fees, lounge access, withdrawal limits, forex markup, and rewards')}
          </p>
        </div>

        {compareQueue.length > 0 && (
          <button 
            onClick={() => setCompareQueue([])} 
            className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold text-xs border border-red-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('compare.clearCards', 'Clear Cards ({{count}})', { count: compareQueue.length })}</span>
          </button>
        )}
      </div>

      {/* Comparison Category Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#F5F3EC] border border-[#E0E6DC] w-fit">
        <button
          onClick={() => navigate('/compare')}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0E5C3E] text-white border border-[#0E5C3E] shadow-sm cursor-pointer flex items-center gap-1.5"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>{t('compare.debitCardsTab', 'Debit Cards')}</span>
        </button>
        <button
          onClick={() => navigate('/compare-savings')}
          className="px-4 py-2 rounded-xl text-xs font-bold text-[#445B4D] hover:text-[#14291F] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>{t('compare.savingsAccountsTab', 'Savings Accounts')}</span>
        </button>
        <button
          onClick={() => navigate('/compare-current')}
          className="px-4 py-2 rounded-xl text-xs font-bold text-[#445B4D] hover:text-[#14291F] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>{t('compare.currentAccountsTab', 'Current Accounts')}</span>
        </button>
      </div>

      {/* Main Comparison Section */}
      <section className="bg-white rounded-3xl p-4 sm:p-8 shadow-sm border border-[#E0E6DC] transition-colors">
        {compareQueue.length === 0 ? (
          <div className="py-16 px-6 text-center max-w-lg mx-auto space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#EEF4EE] text-[#0E5C3E] border border-[#C5D7C2] flex items-center justify-center text-3xl mx-auto shadow-sm">
              <Scale className="w-8 h-8 text-[#0E5C3E]" />
            </div>
            <h2 className="text-xl font-bold text-[#14291F]">
              {t('compare.noCardsTitle', 'No Cards Selected for Comparison')}
            </h2>
            <p className="text-xs sm:text-sm text-[#445B4D] leading-relaxed font-normal">
              {t('compare.noCardsDesc', 'You can add up to 3 debit cards to compare their annual fees, daily limits, lounge rules, and charges side by side.')}
            </p>
            <button
              onClick={() => navigate('/cards')}
              className="px-6 py-3 rounded-xl bg-[#0E5C3E] hover:bg-[#0A4730] text-white font-bold text-xs tracking-wide uppercase shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>{t('compare.browseCardsBtn', 'Browse & Select Cards')}</span>
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
