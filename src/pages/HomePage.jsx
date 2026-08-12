import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import DebitCardCard from '../components/DebitCardCard';
import BankCard from '../components/BankCard';
import FaqSection from '../components/FaqSection';
import { debitCards } from '../data/mockData';
import { savingsAccounts } from '../data/mockSavingsAccounts';
import { getCoveredBanksDirectory } from '../utils/bankDirectoryUtils';
import { useWishlist } from '../context/WishlistContext';
import { 
  Sparkles, 
  Bot, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2,
  CreditCard,
  Percent,
  Search,
  Scale,
  Heart,
  Landmark,
  ChevronRight
} from 'lucide-react';

function HomePage({
  query,
  setQuery,
  onViewDetails,
  activeCardsList,
  toggleCompareQueue,
  compareQueue = [],
  savingsCompareQueue = [],
  setSavingsCompareQueue
}) {
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const dynamicBanks = useMemo(() => {
    return getCoveredBanksDirectory(activeCardsList);
  }, [activeCardsList]);

  const handleHeroSearchSubmit = (searchVal) => {
    setQuery(searchVal);
    navigate('/cards');
  };

  const featuredDebitCards = useMemo(() => {
    const source = (activeCardsList && activeCardsList.length > 0) ? activeCardsList : debitCards;
    return source.slice(0, 3);
  }, [activeCardsList]);

  const featuredSavingsAccounts = useMemo(() => {
    return savingsAccounts.slice(0, 3);
  }, []);

  const handleToggleSavingsCompare = (acc) => {
    if (!setSavingsCompareQueue) return;
    setSavingsCompareQueue(prev => {
      if (prev.some(a => String(a.id) === String(acc.id))) {
        return prev.filter(a => String(a.id) !== String(acc.id));
      }
      if (prev.length >= 3) return prev;
      return [...prev, acc];
    });
  };

  return (
    <div className="space-y-12 overflow-hidden select-none">
      
      {/* ── 1. HERO SECTION ── */}
      <HeroSection 
        query={query} 
        setQuery={setQuery}
        onSearchSubmit={handleHeroSearchSubmit}
        onViewDetails={onViewDetails} 
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 space-y-20">
        
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* CARD 1: SAVINGS ACCOUNTS */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={() => navigate('/savings-accounts')}
              className="p-8 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 dark:from-[#1E293B] dark:via-[#1E293B] dark:to-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-soft hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg">
                  <Percent className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                    SAVINGS ACCOUNTS
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">
                    Find a Savings Account
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Explore savings accounts from different banks and compare interest, balance requirements, features, charges and eligibility.
                </p>

                <ul className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Interest rates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Balance requirements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Account charges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Eligibility criteria</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Verified Banks Indexed</span>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/savings-accounts'); }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Savings Accounts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* CARD 2: DEBIT CARDS */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={() => navigate('/cards')}
              className="p-8 rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50/40 dark:from-[#1E293B] dark:via-[#1E293B] dark:to-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#2563EB]/50 shadow-soft hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0B3D91] to-[#2563EB] text-white flex items-center justify-center shadow-lg">
                  <CreditCard className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider block">
                    DEBIT CARDS
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">
                    Find a Debit Card
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Compare debit cards based on fees, transaction limits, rewards, lounge access, network and other benefits.
                </p>

                <ul className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Annual fees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Transaction limits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Airport lounge access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Rewards & cashback</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">100+ Cards Lineup</span>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/cards'); }}
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Debit Cards</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 3. FEATURED SAVINGS ACCOUNTS SECTION ── */}
        <section className="select-none text-left space-y-6">
          <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-widest uppercase block mb-1">
                FEATURED ACCOUNTS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
                Explore Savings Accounts
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
                Compare savings accounts from different banks and find one that fits your requirements.
              </p>
            </div>

            <button
              onClick={() => navigate('/savings-accounts')}
              className="text-xs text-[#2563EB] dark:text-[#60A5FA] font-extrabold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>View All Savings Accounts →</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredSavingsAccounts.map((account) => (
              <div
                key={account.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-xl transition-all duration-300 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider">
                      {account.bank}
                    </span>
                    <button
                      onClick={() => toggleWishlist(account)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                        isWishlisted(account.id)
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-500'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-400 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted(account.id) ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-lg font-black text-slate-800 dark:text-white leading-snug">
                    {account.accountName}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 text-[10.5px]">
                    <span className="px-2.5 py-0.5 rounded-full font-extrabold bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20">
                      {account.accountType}
                    </span>
                    {account.isZeroBalance && (
                      <span className="px-2.5 py-0.5 rounded-full font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Zero Balance
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Interest Rate</span>
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">{account.interestRate}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Min Balance</span>
                      <span className="text-base font-black text-slate-800 dark:text-white mt-0.5 block">{account.minimumBalance}</span>
                    </div>
                  </div>

                  {account.keyBenefits && (
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-normal pt-1">
                      {account.keyBenefits.slice(0, 2).map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <Link
                    to={`/savings-accounts/${account.id}`}
                    className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-xs flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleToggleSavingsCompare(account)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1 ${
                      savingsCompareQueue.some(a => String(a.id) === String(account.id))
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{savingsCompareQueue.some(a => String(a.id) === String(account.id)) ? 'Queued' : 'Compare'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. FEATURED DEBIT CARDS SECTION ── */}
        <section className="select-none text-left space-y-6">
          <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
                FEATURED DEBIT CARDS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
                Explore Debit Cards
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
                Discover debit cards and compare their fees, limits, rewards and additional benefits.
              </p>
            </div>

            <button
              onClick={() => navigate('/cards')}
              className="text-xs text-[#2563EB] dark:text-[#60A5FA] font-extrabold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>View All Debit Cards →</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDebitCards.map((card) => (
              <DebitCardCard
                key={card.id}
                card={card}
                onViewDetails={() => onViewDetails && onViewDetails(card)}
                onCompare={() => toggleCompareQueue && toggleCompareQueue(card)}
                isCompared={compareQueue.some(c => String(c.id) === String(card.id))}
              />
            ))}
          </div>
        </section>

        {/* ── 5. COMPARE BEFORE YOU CHOOSE SECTION ── */}
        <section className="select-none text-left space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2.5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold tracking-widest uppercase rounded-full border border-[#2563EB]/20">
              <Scale className="w-4 h-4 text-[#2563EB]" />
              SIDE-BY-SIDE COMPARISON
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
              Compare Before You Choose
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 font-normal">
              Compare banking products side by side to understand the differences before making a decision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visual representation: Savings Account -> Compare */}
            <div className="p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Savings Account → Compare</span>
                    <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">Savings Accounts Matrix</h3>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-normal">
                  Compare interest rates, balance requirements, video KYC online opening, and account charges side-by-side.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/compare')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Start Comparing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual representation: Debit Card -> Compare */}
            <div className="p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Debit Card → Compare</span>
                    <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">Debit Cards Matrix</h3>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-normal">
                  Compare annual fees, daily ATM/POS limits, airport lounge access passes, and reward programs.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/compare')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Start Comparing</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. D.CARD AI ADVISOR SECTION ── */}
        <section className="select-none text-left">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#0B3D91] via-[#1E3A8A] to-[#1E293B] text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-700/80">
            <div className="space-y-4 max-w-xl text-left z-10">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-[#60A5FA] uppercase tracking-wider border border-white/10">
                <Bot className="w-4 h-4 text-[#60A5FA]" />
                D.CARD AI ADVISOR
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                Not Sure What to Choose?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Tell us what you're looking for and explore banking products that match your requirements.
              </p>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-xs text-slate-200 italic font-medium">
                💡 Example: "I'm a student looking for a low-cost savings account with a useful debit card."
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('/ai-advisor')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white font-bold text-xs tracking-wide uppercase shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <Bot className="w-4 h-4" />
                  <span>Ask D.CARD AI</span>
                </button>

                <span className="text-[11px] text-slate-400 font-normal">
                  * Information-based product discovery.
                </span>
              </div>
            </div>

            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white shadow-2xl relative z-10 flex-shrink-0 p-4 space-y-2 text-center">
              <Bot className="w-16 h-16 text-[#60A5FA] animate-bounce" style={{ animationDuration: '3s' }} />
              <span className="text-xs font-extrabold text-white">Product Discovery Assistant</span>
              <span className="text-[10px] text-emerald-400 font-semibold uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Database Grounded
              </span>
            </div>
          </div>
        </section>

        {/* ── 7. HOW D.CARD WORKS SECTION (01 Explore, 02 Compare, 03 Choose) ── */}
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
                desc: "Browse savings accounts and debit cards from different banks."
              },
              {
                step: "02",
                title: "Compare",
                desc: "Compare fees, features, eligibility and benefits side by side."
              },
              {
                step: "03",
                title: "Choose",
                desc: "Shortlist the products that match your requirements."
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

        {/* ── 8. EXPLORE BANKS SECTION ── */}
        <section className="select-none text-left space-y-6">
          <div className="flex items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
                INSTITUTIONAL DIRECTORY
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
                Explore Banks
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-normal">
                Explore savings accounts and debit cards offered by different banks.
              </p>
            </div>

            <button
              onClick={() => navigate('/banks')}
              className="text-xs text-[#2563EB] dark:text-[#60A5FA] font-extrabold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>View All Banks →</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dynamicBanks.slice(0, 3).map((bank) => (
              <BankCard 
                key={bank.name} 
                bank={bank} 
                onSelect={() => navigate(`/banks/${bank.id}`)}
              />
            ))}
          </div>
        </section>

        {/* ── 9. SAVE PRODUCTS YOU LIKE SECTION ── */}
        <section className="select-none text-left p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-rose-500/10 via-slate-50 to-white dark:from-rose-950/30 dark:via-[#1E293B] dark:to-[#1E293B] border border-rose-200/60 dark:border-rose-900/40 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider border border-rose-500/20">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              SAVED PRODUCTS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
              Save Products You Like
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal">
              Use the heart icon to save savings accounts and debit cards and access them later from your profile.
            </p>
          </div>

          <button
            onClick={() => navigate('/saved-cards')}
            className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>View Saved Products</span>
          </button>
        </section>

        {/* ── 10. TRUST SECTION (Banking Information, Made Simpler) ── */}
        <section className="select-none text-left p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider block">
              TRANSPARENT METHODOLOGY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
              Banking Information, Made Simpler
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal">
              D.CARD organizes banking product information into a clear and easy-to-understand format so users can compare important details in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
            {[
              "Clear Product Information",
              "Easy Comparison",
              "Structured Benefits",
              "Transparent Conditions",
              "Source-Based Information"
            ].map((tp, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{tp}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 11. FAQ SECTION ── */}
        <FaqSection />
      </main>
    </div>
  );
}

export default HomePage;
