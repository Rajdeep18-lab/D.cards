import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import CardOfTheMonthBanner from '../components/CardOfTheMonthBanner';
import AIAssistanceSection from '../components/AIAssistanceSection';
import { 
  Sparkles, 
  Bot, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2,
  Scale
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';

function HomePage({
  query,
  setQuery,
  onViewDetails,
  activeCardsList = [],
  toggleCompareQueue,
  compareQueue = [],
  savingsCompareQueue = [],
  setSavingsCompareQueue
}) {
  const { t, isHindi } = useLanguage();

  useSEO({
    title: isHindi
      ? "D.Card – भारत में डेबिट कार्ड और बचत खातों की तुलना करें"
      : "D.Card – Compare Debit Cards, Savings & Current Accounts in India",
    description: isHindi
      ? "भारत में डेबिट कार्ड, बचत खाते और चालू खातों की तुलना करें। D.Card पर शुल्क, लाभ और सुविधाओं की जांच करें।"
      : "Compare debit cards, savings accounts and current accounts in India. Explore fees, benefits, eligibility and features with D.Card.",
    canonicalUrl: "https://www.dcard.website/"
  });

  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();

  const handleNavigateProtected = (path) => {
    if (!user) {
      if (openAuthModal) openAuthModal('login', path);
    } else {
      navigate(path);
    }
  };

  const handleHeroSearchSubmit = (searchVal) => {
    setQuery(searchVal);
    handleNavigateProtected('/cards');
  };

  return (
    <div className="space-y-8 select-none">
      {/* ── 1. HERO SECTION ── */}
      <HeroSection 
        query={query} 
        setQuery={setQuery}
        onSearchSubmit={handleHeroSearchSubmit}
        onViewDetails={onViewDetails} 
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 space-y-12 sm:space-y-16">
        {/* ── CARD OF THE MONTH PROMOTIONAL BANNER ── */}
        <section aria-label="Card of the Month">
          <CardOfTheMonthBanner 
            activeCardsList={activeCardsList}
            onViewDetails={onViewDetails}
          />
        </section>

        {/* ── Main Homepage Content ── */}
        <div className="w-full min-w-0 space-y-16 lg:space-y-20">
            
            {/* ── 2. PRODUCT DISCOVERY SECTION (Explore Banking Products) ── */}
            <section id="product-categories" className="select-none scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold tracking-widest uppercase rounded-full border border-[#2563EB]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              {t('home.categoriesBadge', 'BANKING PRODUCT DISCOVERY')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
              {t('home.categoriesTitle', 'Explore Banking Products')}
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 font-normal">
              {t('home.categoriesSubtitle', 'Find products based on the features, benefits and requirements that matter to you.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-left">
            {/* CARD 1: SAVINGS ACCOUNTS */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={() => handleNavigateProtected('/savings-accounts')}
              className="p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-[#2563EB]/50 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center text-2xl font-bold shadow-sm border border-[#2563EB]/20">
                  🏦
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider block">
                    {t('home.catSavingsTitle', 'Savings Accounts')}
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">
                    {t('savings.title', 'Savings Accounts')}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {t('home.catSavingsDesc', 'Compare account types, balance requirements, benefits, eligibility and more.')}
                </p>

                <ul className="grid grid-cols-1 gap-2 pt-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>{t('savings.interestRate', 'Account types & interest rates')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>{t('savings.minimumBalance', 'Balance & waiver rules')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>{t('savings.linkedCard', 'Linked debit card perks')}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">150+ Verified</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNavigateProtected('/savings-accounts'); }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t('home.exploreNow', 'Explore Savings')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* CARD 2: CURRENT ACCOUNTS */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={() => handleNavigateProtected('/current-accounts')}
              className="p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-[#2563EB]/50 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl font-bold shadow-sm border border-emerald-500/20">
                  💼
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                    {t('currentAccounts.badge', 'BUSINESS CATEGORY')}
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">
                    {t('currentAccounts.title', 'Current Accounts')}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {t('home.catCurrentDesc', 'Compare commercial MAB, cash deposit limits, corporate banking and cheque rules.')}
                </p>

                <ul className="grid grid-cols-1 gap-2 pt-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Proprietorships, LLPs & Pvt Ltd</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{t('currentAccounts.cashDepositLimit', 'Cash deposit & withdrawal slabs')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{t('currentAccounts.freeChequeLeaves', 'Free monthly cheque leaves')}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Commercial Tiers</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNavigateProtected('/current-accounts'); }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t('home.exploreNow', 'Explore Current')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* CARD 3: DEBIT CARDS */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={() => handleNavigateProtected('/cards')}
              className="p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-[#2563EB]/50 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center text-2xl font-bold shadow-sm border border-[#2563EB]/20">
                  💳
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider block">
                    {t('debitCards.badge', 'CARD CATEGORY')}
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">
                    {t('debitCards.title', 'Debit Cards')}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {t('home.catCardsDesc', 'Compare fees, limits, rewards, lounge access and other card benefits.')}
                </p>

                <ul className="grid grid-cols-1 gap-2 pt-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>{t('debitCards.annualFee', 'Annual fees & spend waivers')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>{t('debitCards.dailyAtmLimit', 'Daily ATM & POS limits')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>{t('debitCards.loungeAccess', 'Airport lounge access')}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">100+ Cards</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNavigateProtected('/cards'); }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t('home.exploreNow', 'Explore Cards')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 3. D.CARD AI ASSISTANCE SECTION ── */}
        <AIAssistanceSection
          onSelectDebitCard={onViewDetails}
          toggleCompareQueue={toggleCompareQueue}
          compareQueue={compareQueue}
          setSavingsCompareQueue={setSavingsCompareQueue}
        />

        {/* ── 4. HOW D.CARD WORKS ── */}
        <section className="select-none text-left space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold tracking-widest uppercase rounded-full border border-[#2563EB]/20">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              SIMPLE 3-STEP PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
              How D.CARD Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Explore",
                desc: "Browse savings accounts and debit cards."
              },
              {
                step: "02",
                title: "Compare",
                desc: "Compare important features and requirements."
              },
              {
                step: "03",
                title: "Choose",
                desc: "Shortlist products that fit your needs."
              }
            ].map((st, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-3 relative overflow-hidden hover:border-[#2563EB]/40 transition-all"
              >
                <span className="text-4xl font-black text-[#2563EB]/20 dark:text-[#60A5FA]/20 absolute right-6 top-6">
                  {st.step}
                </span>
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white pt-2">{st.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. SIMPLE TRUST / DISCLAIMER ── */}
        <section className="select-none text-left p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider block">
              TRANSPARENT INFORMATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
              Banking Information, Made Simple
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              D.CARD organizes banking product information in a clear format to help users understand and compare available options.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal italic">
              * Information shown is for comparison and informational purposes only. Savings Account and Debit Card features, fees, charges, eligibility, limits, and benefits may change. Please verify the latest details with the respective bank before making a decision.
            </p>
          </div>
        </section>

        </div>
      </main>
    </div>
  );
}

export default HomePage;
