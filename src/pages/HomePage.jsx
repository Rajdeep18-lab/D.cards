import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import KotakRightSideAd from '../components/KotakRightSideAd';
import { 
  Sparkles, 
  Bot, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2,
  Scale
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

function HomePage({
  query,
  setQuery,
  onViewDetails,
  activeCardsList = [],
  toggleCompareQueue,
  compareQueue = []
}) {
  useSEO({
    title: "D.Card – Compare Debit Cards, Savings & Current Accounts in India",
    description: "Compare debit cards, savings accounts and current accounts in India. Explore fees, benefits, eligibility and features with D.Card.",
    canonicalUrl: "https://www.dcard.website/"
  });

  const navigate = useNavigate();

  const handleHeroSearchSubmit = (searchVal) => {
    setQuery(searchVal);
    navigate('/cards');
  };

  return (
    <div className="space-y-8 overflow-hidden select-none">
      {/* ── 1. HERO SECTION ── */}
      <HeroSection 
        query={query} 
        setQuery={setQuery}
        onSearchSubmit={handleHeroSearchSubmit}
        onViewDetails={onViewDetails} 
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-10 xl:gap-12">
          
          {/* ── Left Column: Main Homepage Content ── */}
          <div className="flex-1 w-full min-w-0 space-y-16 lg:space-y-20 order-1">
            
            {/* ── 2. PRODUCT DISCOVERY SECTION (Explore Banking Products) ── */}
            <section id="product-categories" className="select-none scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold tracking-widest uppercase rounded-full border border-[#2563EB]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              BANKING PRODUCT DISCOVERY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
              Explore Banking Products
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 font-normal">
              Find products based on the features, benefits and requirements that matter to you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-left">
            {/* CARD 1: SAVINGS ACCOUNTS */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={() => navigate('/savings-accounts')}
              className="p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-[#2563EB]/50 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center text-2xl font-bold shadow-sm border border-[#2563EB]/20">
                  🏦
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider block">
                    PRIMARY CATEGORY
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">
                    Savings Accounts
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Compare account types, balance requirements, benefits, eligibility and more.
                </p>

                <ul className="grid grid-cols-1 gap-2 pt-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Account types & interest rates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Balance & waiver rules</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Linked debit card perks</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Verified Banks</span>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/savings-accounts'); }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Savings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* CARD 2: CURRENT ACCOUNTS */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={() => navigate('/current-accounts')}
              className="p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-[#2563EB]/50 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl font-bold shadow-sm border border-emerald-500/20">
                  💼
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                    BUSINESS CATEGORY
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">
                    Current Accounts
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Compare commercial MAB, cash deposit limits, corporate banking and cheque rules.
                </p>

                <ul className="grid grid-cols-1 gap-2 pt-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Proprietorships, LLPs & Pvt Ltd</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Cash deposit & withdrawal slabs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Free monthly cheque leaves</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Commercial Tiers</span>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/current-accounts'); }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Current</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* CARD 3: DEBIT CARDS */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={() => navigate('/cards')}
              className="p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 hover:border-[#2563EB]/50 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center text-2xl font-bold shadow-sm border border-[#2563EB]/20">
                  💳
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider block">
                    CARD CATEGORY
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">
                    Debit Cards
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Compare fees, limits, rewards, lounge access and other card benefits.
                </p>

                <ul className="grid grid-cols-1 gap-2 pt-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Annual fees & spend waivers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Daily ATM & POS limits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Airport lounge access</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">100+ Cards Lineup</span>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/cards'); }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Cards</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 3. COMPARISON + AI ADVISOR FEATURE ── */}
        <section className="select-none text-left">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0B3D91] via-[#1E3A8A] to-[#1E293B] text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-700/80">
            <div className="space-y-4 max-w-xl text-left z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-[#60A5FA] uppercase tracking-wider border border-white/10">
                <Scale className="w-4 h-4 text-[#60A5FA]" />
                PRODUCT COMPARISON & AI DISCOVERY
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Make Better Banking Choices
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Compare products side by side or ask D.CARD AI to help you explore available banking products.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => navigate('/compare')}
                  className="px-6 py-3.5 rounded-xl bg-white text-[#2563EB] hover:bg-slate-100 font-bold text-xs tracking-wide uppercase shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 min-h-[44px]"
                >
                  <Scale className="w-4 h-4" />
                  <span>Compare Products</span>
                </button>

                <button
                  onClick={() => navigate('/ai-advisor')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white font-bold text-xs tracking-wide uppercase shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 min-h-[44px]"
                >
                  <Bot className="w-4 h-4" />
                  <span>Ask D.CARD AI</span>
                </button>
              </div>
            </div>

            <div className="w-full md:w-56 h-40 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white shadow-2xl relative z-10 flex-shrink-0 p-4 space-y-2 text-center">
              <Bot className="w-10 h-10 text-[#60A5FA]" />
              <span className="text-xs font-extrabold text-white">Product Discovery Assistant</span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Side-by-Side Matrix
              </span>
            </div>
          </div>
        </section>

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

          {/* ── Right Column: Dedicated Right-Side Advertisement Area ── */}
          <aside 
            aria-label="Card of the Month Advertisement"
            className="w-full lg:w-[380px] xl:w-[420px] shrink-0 order-2 lg:sticky lg:top-24 z-20 pt-8 lg:pt-0"
          >
            <KotakRightSideAd 
              activeCardsList={activeCardsList}
              onViewDetails={onViewDetails}
            />
          </aside>

        </div>
      </main>
    </div>
  );
}

export default HomePage;
