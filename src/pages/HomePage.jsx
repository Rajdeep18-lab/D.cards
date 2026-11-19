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
import DhanterasHeroCampaign from '../components/festive/DhanterasHeroCampaign';
import AuditCycleSection from '../components/festive/AuditCycleSection';
import DiwaliCampaignBanners from '../components/festive/DiwaliCampaignBanners';
import FestivalCampaignSection from '../components/festive/FestivalCampaignSection';
import { useFestivalTheme } from '../hooks/useFestivalTheme';
import { FESTIVE_CONFIG } from '../config/festiveConfig';

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
  const { isFestivalMode, activeFestival } = useFestivalTheme();

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.dcard.website/#organization",
        "name": "D.Card",
        "url": "https://www.dcard.website/",
        "logo": "https://www.dcard.website/logo.png",
        "description": "Independent banking information and comparison platform for debit cards, savings accounts, and current accounts in India."
      },
      {
        "@type": "WebSite",
        "@id": "https://www.dcard.website/#website",
        "name": "D.Card",
        "url": "https://www.dcard.website/",
        "publisher": {
          "@id": "https://www.dcard.website/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.dcard.website/cards?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  useSEO({
    title: isHindi
      ? "D.Card – भारत में डेबिट कार्ड और बचत खातों की तुलना करें"
      : "D.Card – Compare Debit Cards, Savings & Current Accounts in India",
    description: isHindi
      ? "भारत में डेबिट कार्ड, बचत खाते और चालू खातों की तुलना करें। D.Card पर शुल्क, लाभ और सुविधाओं की जांच करें।"
      : "Compare debit cards, savings accounts and current accounts in India. Explore fees, benefits, eligibility and features with D.Card.",
    canonicalUrl: "https://www.dcard.website/",
    schema: homeSchema
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
    <div className="space-y-8 select-none overflow-x-hidden">
      {/* ── 1. HERO SECTION ── */}
      <HeroSection 
        query={query} 
        setQuery={setQuery}
        onSearchSubmit={handleHeroSearchSubmit}
        onViewDetails={onViewDetails} 
      />

      {/* ── AUTOMATIC FESTIVAL HERO PROMOTIONAL CAMPAIGN (null in Normal Mode) ── */}
      <FestivalCampaignSection />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 space-y-12 sm:space-y-16">
        {/* ── CARD OF THE MONTH PROMOTIONAL BANNER ── */}
        <section aria-label="Card of the Month">
          <CardOfTheMonthBanner 
            activeCardsList={activeCardsList}
            onViewDetails={onViewDetails}
          />
        </section>

        {/* ── SPECIAL HOMEPAGE SECTION: 15-DAY AUDIT CYCLE ── */}
        {FESTIVE_CONFIG.auditCycleSectionEnabled !== false && (
          <AuditCycleSection />
        )}

        {/* ── Main Homepage Content ── */}
        <div className="w-full min-w-0 space-y-16 lg:space-y-20">
            
            {/* ── 2. PRODUCT DISCOVERY SECTION (Explore Banking Products) ── */}
            <section id="product-categories" className="select-none scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#EEF4EE] dark:bg-[#1A2E24] text-[#006B50] dark:text-[#34D399] text-xs font-bold tracking-widest uppercase rounded-full border border-[#DCE9E1] dark:border-[#1F382B]">
              <Sparkles className="w-3.5 h-3.5 text-[#006B50] dark:text-[#34D399]" />
              {t('home.categoriesBadge', 'BANKING PRODUCT DISCOVERY')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#123C30] dark:text-white tracking-tight font-serif">
              {t('home.categoriesTitle', 'Explore Banking Products')}
            </h2>
            <p className="text-xs sm:text-sm text-[#45534D] dark:text-[#B8C9BF] font-normal">
              {t('home.categoriesSubtitle', 'Find products based on the features, benefits and requirements that matter to you.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-left">
            {/* CARD 1: SAVINGS ACCOUNTS */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={() => handleNavigateProtected('/savings-accounts')}
              className="p-8 rounded-3xl bg-white dark:bg-[#13241C] border border-[#DCE9E1] dark:border-[#1F382B] hover:border-[#006B50] shadow-card hover:shadow-cardHover transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF4EE] dark:bg-[#1A2E24] text-[#006B50] dark:text-[#34D399] flex items-center justify-center text-2xl font-bold shadow-xs border border-[#DCE9E1] dark:border-[#1F382B]">
                  🏦
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#006B50] dark:text-[#34D399] uppercase tracking-wider block font-sans">
                    {t('home.catSavingsTitle', 'Savings Accounts')}
                  </span>
                  <h3 className="text-2xl font-bold text-[#123C30] dark:text-white mt-0.5 font-serif">
                    {t('savings.title', 'Savings Accounts')}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#45534D] dark:text-[#B8C9BF] leading-relaxed font-normal">
                  {t('home.catSavingsDesc', 'Compare account types, balance requirements, benefits, eligibility and more.')}
                </p>

                <ul className="grid grid-cols-1 gap-2 pt-2 text-xs text-[#123C30] dark:text-[#FAF9F4] font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006B50] dark:text-[#34D399] shrink-0" />
                    <span>{t('savings.interestRate', 'Account types & interest rates')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006B50] dark:text-[#34D399] shrink-0" />
                    <span>{t('savings.minimumBalance', 'Balance & waiver rules')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006B50] dark:text-[#34D399] shrink-0" />
                    <span>{t('savings.linkedCard', 'Linked debit card perks')}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-[#DCE9E1] dark:border-[#1F382B] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6B8074] dark:text-[#869C8E]">150+ Verified</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNavigateProtected('/savings-accounts'); }}
                  className="px-5 py-2.5 rounded-xl bg-[#006B50] hover:bg-[#064E3B] text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
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
              className="p-8 rounded-3xl bg-white dark:bg-[#13241C] border border-[#DCE9E1] dark:border-[#1F382B] hover:border-[#006B50] shadow-card hover:shadow-cardHover transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF4EE] dark:bg-[#1A2E24] text-[#006B50] dark:text-[#34D399] flex items-center justify-center text-2xl font-bold shadow-xs border border-[#DCE9E1] dark:border-[#1F382B]">
                  💼
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#006B50] dark:text-[#34D399] uppercase tracking-wider block font-sans">
                    {t('currentAccounts.badge', 'BUSINESS CATEGORY')}
                  </span>
                  <h3 className="text-2xl font-bold text-[#123C30] dark:text-white mt-0.5 font-serif">
                    {t('currentAccounts.title', 'Current Accounts')}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#45534D] dark:text-[#B8C9BF] leading-relaxed font-normal">
                  {t('home.catCurrentDesc', 'Compare commercial MAB, cash deposit limits, corporate banking and cheque rules.')}
                </p>

                <ul className="grid grid-cols-1 gap-2 pt-2 text-xs text-[#123C30] dark:text-[#FAF9F4] font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006B50] dark:text-[#34D399] shrink-0" />
                    <span>Proprietorships, LLPs &amp; Pvt Ltd</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006B50] dark:text-[#34D399] shrink-0" />
                    <span>{t('currentAccounts.cashDepositLimit', 'Cash deposit & withdrawal slabs')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006B50] dark:text-[#34D399] shrink-0" />
                    <span>{t('currentAccounts.freeChequeLeaves', 'Free monthly cheque leaves')}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-[#DCE9E1] dark:border-[#1F382B] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6B8074] dark:text-[#869C8E]">Commercial Tiers</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNavigateProtected('/current-accounts'); }}
                  className="px-5 py-2.5 rounded-xl bg-[#006B50] hover:bg-[#064E3B] text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
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
              className="p-8 rounded-3xl bg-white dark:bg-[#13241C] border border-[#DCE9E1] dark:border-[#1F382B] hover:border-[#006B50] shadow-card hover:shadow-cardHover transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF4EE] dark:bg-[#1A2E24] text-[#006B50] dark:text-[#34D399] flex items-center justify-center text-2xl font-bold shadow-xs border border-[#DCE9E1] dark:border-[#1F382B]">
                  💳
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#006B50] dark:text-[#34D399] uppercase tracking-wider block font-sans">
                    {t('debitCards.badge', 'CARD CATEGORY')}
                  </span>
                  <h3 className="text-2xl font-bold text-[#123C30] dark:text-white mt-0.5 font-serif">
                    {t('debitCards.title', 'Debit Cards')}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#45534D] dark:text-[#B8C9BF] leading-relaxed font-normal">
                  {t('home.catCardsDesc', 'Compare fees, limits, rewards, lounge access and other card benefits.')}
                </p>

                <ul className="grid grid-cols-1 gap-2 pt-2 text-xs text-[#123C30] dark:text-[#FAF9F4] font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006B50] dark:text-[#34D399] shrink-0" />
                    <span>{t('debitCards.annualFee', 'Annual fees & spend waivers')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006B50] dark:text-[#34D399] shrink-0" />
                    <span>{t('debitCards.dailyAtmLimit', 'Daily ATM & POS limits')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#006B50] dark:text-[#34D399] shrink-0" />
                    <span>{t('debitCards.loungeAccess', 'Airport lounge access')}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-[#DCE9E1] dark:border-[#1F382B] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#6B8074] dark:text-[#869C8E]">100+ Cards</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNavigateProtected('/cards'); }}
                  className="px-5 py-2.5 rounded-xl bg-[#006B50] hover:bg-[#064E3B] text-white font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
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
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#EEF4EE] dark:bg-[#1A2E24] text-[#006B50] dark:text-[#34D399] text-xs font-bold tracking-widest uppercase rounded-full border border-[#DCE9E1] dark:border-[#1F382B]">
              <ShieldCheck className="w-4 h-4 text-[#006B50] dark:text-[#34D399]" />
              SIMPLE 3-STEP PROCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#123C30] dark:text-white tracking-tight font-serif">
              How D.CARD Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Explore",
                desc: "Browse verified savings accounts and debit cards."
              },
              {
                step: "02",
                title: "Compare",
                desc: "Compare fees, balance tiers and lounge access rules."
              },
              {
                step: "03",
                title: "Choose",
                desc: "Shortlist the best products that fit your financial goals."
              }
            ].map((st, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white dark:bg-[#13241C] border border-[#DCE9E1] dark:border-[#1F382B] shadow-card space-y-3 relative overflow-hidden hover:border-[#006B50] transition-all"
              >
                <span className="text-4xl font-bold text-[#006B50]/20 dark:text-[#34D399]/20 absolute right-6 top-6 font-serif">
                  {st.step}
                </span>
                <h3 className="text-xl font-bold text-[#123C30] dark:text-white pt-2 font-serif">{st.title}</h3>
                <p className="text-xs sm:text-sm text-[#45534D] dark:text-[#B8C9BF] leading-relaxed font-normal">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. SIMPLE TRUST / DISCLAIMER ── */}
        <section className="select-none text-left p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#13241C] border border-[#DCE9E1] dark:border-[#1F382B] shadow-card space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#006B50] dark:text-[#34D399] uppercase tracking-wider block font-sans">
              TRANSPARENT INFORMATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#123C30] dark:text-white font-serif">
              Banking Information, Made Simple
            </h2>
            <p className="text-xs sm:text-sm text-[#45534D] dark:text-[#B8C9BF] leading-relaxed font-normal">
              D.CARD organizes banking product information in a structured, verified format to help Indian consumers make intelligent financial choices.
            </p>
          </div>

          <div className="pt-2 border-t border-[#DCE9E1] dark:border-[#1F382B]">
            <p className="text-[11px] sm:text-xs text-[#6B8074] dark:text-[#869C8E] leading-relaxed font-normal italic">
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
