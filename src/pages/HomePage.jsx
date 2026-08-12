import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import DebitCardCard from '../components/DebitCardCard';
import BankCard from '../components/BankCard';
import FaqSection from '../components/FaqSection';
import { debitCards } from '../data/mockData';
import { savingsAccounts, getAssociatedDebitCards } from '../data/mockSavingsAccounts';
import { getCoveredBanksDirectory } from '../utils/bankDirectoryUtils';
import { useWishlist } from '../context/WishlistContext';
import { 
  GraduationCap, 
  UserCheck, 
  HeartHandshake, 
  Plane, 
  DollarSign, 
  Crown, 
  ShieldPlus, 
  Sparkles, 
  Bot, 
  ArrowRight, 
  ShieldCheck, 
  BarChart3, 
  CheckCircle2,
  Layers,
  CreditCard,
  Percent,
  Search,
  Scale,
  Heart,
  HelpCircle,
  Landmark,
  ChevronRight,
  ArrowDown
} from 'lucide-react';

function HomePage({
  query,
  setQuery,
  onViewDetails,
  activeFilters,
  setActiveFilters,
  STATIC_AI_PILL_COUNTS,
  toggleBank,
  selectSingleBank,
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
    return savingsAccounts.slice(0, 4);
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

  const handlePillClick = (pillText) => {
    if (pillText.toLowerCase().includes('savings') || pillText.toLowerCase().includes('interest') || pillText.toLowerCase().includes('student account') || pillText.toLowerCase().includes('zero balance')) {
      navigate('/savings-accounts');
    } else {
      setQuery(pillText);
      navigate('/cards');
    }
  };

  return (
    <div className="space-y-12 overflow-hidden select-none">
      
      {/* ── 1. Hero Section ── */}
      <HeroSection 
        query={query} 
        setQuery={setQuery}
        onSearchSubmit={handleHeroSearchSubmit}
        onViewDetails={onViewDetails} 
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 space-y-20">
        
        {/* ── 2. PRODUCT CATEGORY SECTION (Explore Banking Products) ── */}
        <section id="product-categories" className="select-none scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold tracking-widest uppercase rounded-full border border-[#2563EB]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              EXPLORE BANKING PRODUCTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
              Explore Banking Products
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 font-normal">
              Discover products based on what matters to you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* 🏦 SAVINGS ACCOUNTS CARD */}
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
                    Savings Accounts
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Find a savings account that fits your needs.
                </p>

                <ul className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Interest rates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Minimum balance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Account charges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Account features</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Eligibility</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Associated debit cards</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">40+ Accounts Indexed</span>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/savings-accounts'); }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Savings Accounts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>

            {/* 💳 DEBIT CARDS CARD */}
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
                    Debit Cards
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Compare debit cards based on fees, limits and benefits.
                </p>

                <ul className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Annual fees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>ATM & transaction limits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Lounge access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Rewards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>International usage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span>Card benefits</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">106+ Cards Indexed</span>
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

        {/* ── 3. ACCOUNT + CARD CONNECTION SECTION ── */}
        <section className="select-none text-left p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-[#1E293B] to-[#0F172A] text-white shadow-xl space-y-8 border border-slate-800 relative overflow-hidden">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2563EB]/20 text-[#60A5FA] text-xs font-bold uppercase tracking-wider border border-[#2563EB]/30">
              <Layers className="w-3.5 h-3.5 text-[#60A5FA]" />
              INTEGRATED PRODUCT VIEW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              See the Complete Banking Picture
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Understand which debit cards are available with different savings accounts and compare the features and charges together.
            </p>
          </div>

          {/* Visual Flow Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pt-2">
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Percent className="w-5 h-5" />
              </div>
              <h4 className="text-base font-extrabold text-white">Savings Account</h4>
              <p className="text-xs text-slate-300">Interest rate, MAB, Video KYC, charges</p>
            </div>

            <div className="flex flex-col items-center justify-center text-[#60A5FA] py-2 md:py-0">
              <div className="hidden md:flex items-center gap-1 text-xs font-bold uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                <span>Associated Card</span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <div className="flex md:hidden items-center gap-1 text-xs font-bold uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                <ArrowDown className="w-4 h-4" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB]/20 text-[#60A5FA] flex items-center justify-center mx-auto">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="text-base font-extrabold text-white">Associated Debit Card</h4>
              <p className="text-xs text-slate-300">Annual fees, ATM limits, lounge perks, rewards</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 italic text-center sm:text-left pt-2 font-medium">
            "Instead of comparing an account and card separately, D.CARD helps you understand how they work together."
          </p>
        </section>

        {/* ── 4. HOW D.CARD WORKS SECTION ── */}
        <section className="select-none text-left space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold tracking-widest uppercase rounded-full border border-[#2563EB]/20">
              <BarChart3 className="w-4 h-4 text-[#2563EB]" />
              SIMPLE WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
              How D.CARD Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Explore",
                desc: "Browse savings accounts and debit cards from different banks."
              },
              {
                step: "02",
                title: "Compare",
                desc: "Compare rates, fees, limits, features and benefits side by side."
              },
              {
                step: "03",
                title: "Choose",
                desc: "Shortlist products based on your requirements."
              },
              {
                step: "04",
                title: "Verify",
                desc: "Review the official source and applicable conditions before making a decision."
              }
            ].map((st, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-3 relative overflow-hidden hover:border-[#2563EB]/40 transition-all"
              >
                <span className="text-3xl font-black text-[#2563EB]/20 dark:text-[#60A5FA]/20 absolute right-4 top-4">
                  {st.step}
                </span>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white pt-2">{st.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. SEARCH BANKING PRODUCTS YOUR WAY ── */}
        <section className="select-none text-left p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider block">
              INSTANT FEATURE FILTERING
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
              Search Banking Products Your Way
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal">
              Looking for a specific feature? Search across banks, savings accounts and debit cards in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {[
              "Student account",
              "Zero balance",
              "High interest",
              "RuPay",
              "Lounge access",
              "Low annual fee",
              "Online account opening"
            ].map((pillText, idx) => (
              <button
                key={idx}
                onClick={() => handlePillClick(pillText)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#2563EB] hover:text-white text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                🔍 {pillText}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => navigate('/cards')}
              className="px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Start Searching</span>
            </button>
          </div>
        </section>

        {/* ── 6. COMPARISON SECTION (Compare Before You Choose) ── */}
        <section className="select-none text-left space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold tracking-widest uppercase rounded-full border border-[#2563EB]/20">
              <Scale className="w-4 h-4 text-[#2563EB]" />
              SIDE-BY-SIDE MATRIX
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
              Compare Before You Choose
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 font-normal">
              Make informed comparisons using the information that matters to you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <Percent className="w-5 h-5 text-emerald-600" />
                Savings Account Comparison
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-normal">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Interest rate</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Minimum balance requirement</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Account maintenance charges</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Digital Video KYC features</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Eligibility criteria</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Debit card availability</li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/compare')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer"
                >
                  Start Comparing Savings →
                </button>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-4">
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#2563EB]" />
                Debit Card Comparison
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-normal">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" /> Annual fee breakdown</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" /> Daily ATM withdrawal limits</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" /> POS & online transaction limits</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" /> Network (RuPay, Visa, Mastercard)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" /> Airport & railway lounge access</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" /> Rewards & cashback points</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" /> International usage fees</li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/compare')}
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer"
                >
                  Start Comparing Cards →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. EXPLORE BANKS SECTION ── */}
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
                Discover savings accounts and debit cards offered by leading banks.
              </p>
            </div>

            <button
              onClick={() => navigate('/banks')}
              className="text-xs text-[#2563EB] dark:text-[#60A5FA] font-bold hover:underline flex items-center gap-1 cursor-pointer"
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

        {/* ── 8. AI ADVISOR SECTION ── */}
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
                Tell D.CARD what you're looking for and get product suggestions based on the information available on our platform.
              </p>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-xs text-slate-200 italic font-medium">
                💡 Example: "I am a student looking for a low-cost savings account with a useful debit card."
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
                  * Product discovery assistance & information-based recommendations.
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

        {/* ── 9. TRUST & TRANSPARENCY SECTION ── */}
        <section className="select-none text-left p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider block">
              DATA METHODOLOGY & TRANSPARENCY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
              Banking Information, Structured for You
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-normal">
              D.CARD organizes banking product information into a simple format so you can review features, charges and conditions more easily.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
            {[
              "Structured Product Information",
              "Official Sources",
              "Clear Fees & Charges",
              "Applicable Conditions",
              "Easy Comparison"
            ].map((tp, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{tp}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 10. FAQ Section ── */}
        <FaqSection />
      </main>
    </div>
  );
}

export default HomePage;
