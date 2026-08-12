import { useState, useEffect, useMemo, memo } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  Sparkles, 
  Building2, 
  TrendingUp, 
  Plane, 
  Gift, 
  Percent, 
  Award,
  Globe,
  Landmark,
  Bot,
  ChevronRight
} from 'lucide-react';
import GlobalSearchInput from './GlobalSearchInput';
import { debitCards } from '../data/mockData';
import { savingsAccounts } from '../data/mockSavingsAccounts';
import { getCoveredBanksDirectory } from '../utils/bankDirectoryUtils';

const HeroVisual = memo(({ isMobile }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex-1 relative w-full mt-10 lg:mt-0 select-none max-w-[560px] lg:max-w-none mx-auto flex items-center justify-center min-h-[420px] sm:min-h-[480px]">
      
      {/* Moving Blue Gradient Blobs & Glowing Rays */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-tr from-[#0B3D91]/25 via-[#2563EB]/20 to-transparent blur-[90px] pointer-events-none z-0 animate-pulse-glow" />

      {/* Grid Mesh Texture Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-mesh opacity-60 pointer-events-none z-0" />

      {/* Geometric Decorative Rotating Rings */}
      <div className="absolute w-[380px] h-[380px] sm:w-[480px] sm:h-[480px] rounded-full border border-dashed border-[#2563EB]/30 dark:border-[#60A5FA]/20 animate-[spin_45s_linear_infinite] pointer-events-none z-0" />
      <div className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full border border-[#60A5FA]/20 dark:border-[#2563EB]/20 pointer-events-none z-0" />

      {/* Floating 3D Card 1 — D.CARD Elite Royal Blue Gradient Card */}
      <motion.div
        animate={
          isMobile || shouldReduceMotion
            ? { y: 0, rotate: 3 }
            : { y: [0, -12, 0], rotate: [3, 4.5, 3] }
        }
        transition={
          isMobile || shouldReduceMotion
            ? {}
            : { repeat: Infinity, duration: 6.5, ease: 'easeInOut' }
        }
        className="absolute top-4 right-2 sm:right-6 w-[290px] sm:w-[350px] h-[175px] sm:h-[205px] rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#0B3D91] via-[#2563EB] to-[#3B82F6] text-white shadow-[0_25px_60px_rgba(37,99,235,0.35)] border border-white/20 z-20 overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform duration-300 card-reflection"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col justify-between h-full relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5">
                <img src="/logo-mark.png" alt="D.CARD Mark" className="w-6 h-6 object-contain filter brightness-200" />
                <span className="text-xs font-black tracking-widest uppercase text-white">D.CARD ELITE</span>
              </div>
              <span className="text-[10px] text-white/75 tracking-wider uppercase font-semibold block mt-0.5">Fintech Intelligence</span>
            </div>
            <span className="text-xs font-bold tracking-widest text-white/90 bg-white/20 px-3 py-1 rounded-full border border-white/20 shadow-xs">VISA</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 border border-amber-300/40 shadow-inner">
              <div className="w-full h-full border border-black/15 rounded-[2px]" />
            </div>
            <span className="text-white/80 text-sm">📶</span>
          </div>

          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-mono font-bold tracking-[0.2em] text-white/95">5412 •••• •••• 9012</p>
            <div className="flex justify-between items-end text-[10.5px] text-white/80 font-bold">
              <span>ALEX JOHNSON</span>
              <span>08/29</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating 3D Card 2 — High Yield Savings Card */}
      <motion.div
        animate={
          isMobile || shouldReduceMotion
            ? { y: 0, rotate: -4 }
            : { y: [0, 12, 0], rotate: [-4, -5.5, -4] }
        }
        transition={
          isMobile || shouldReduceMotion
            ? {}
            : { repeat: Infinity, duration: 7.5, ease: 'easeInOut', delay: 0.5 }
        }
        className="absolute bottom-4 left-2 sm:left-6 w-[280px] sm:w-[340px] h-[165px] sm:h-[195px] rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] text-white shadow-[0_25px_50px_rgba(15,23,42,0.45)] border border-slate-700/80 z-10 overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform duration-300 card-reflection"
      >
        <div className="flex flex-col justify-between h-full relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black tracking-widest uppercase text-white">HIGH YIELD SAVINGS</span>
              </div>
              <span className="text-[10px] text-emerald-400 tracking-wider uppercase font-semibold block mt-0.5">7.50% p.a. • Zero Balance</span>
            </div>
            <span className="text-xs font-bold tracking-widest text-[#60A5FA] bg-[#2563EB]/15 px-3 py-1 rounded-full border border-[#2563EB]/30">RuPay</span>
          </div>

          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-mono font-bold tracking-[0.2em] text-slate-300">5241 •••• •••• 4410</p>
            <div className="flex justify-between items-end text-[10px] text-slate-400 font-medium">
              <span>PRIYA SHARMA</span>
              <span>11/28</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Glass Badges */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
        className="absolute -top-3 left-4 sm:left-6 z-30 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-md border border-[#E5E7EB] dark:border-slate-700 shadow-lg flex items-center gap-2"
      >
        <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
        <div className="text-[11px]">
          <p className="font-bold text-[#1F2937] dark:text-white leading-none">100% Verified</p>
          <p className="text-[9px] text-[#6B7280] dark:text-slate-400 font-medium">Cards & Savings Accounts</p>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-2 right-4 sm:right-8 z-30 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-md border border-[#E5E7EB] dark:border-slate-700 shadow-lg flex items-center gap-2"
      >
        <Percent className="w-4 h-4 text-emerald-500" />
        <div className="text-[11px]">
          <p className="font-bold text-[#1F2937] dark:text-white leading-none">Interest & Perks</p>
          <p className="text-[9px] text-[#6B7280] dark:text-slate-400 font-medium">Verified Yields</p>
        </div>
      </motion.div>
    </div>
  );
});

function HeroSection({ query = '', setQuery = () => {}, onSearchSubmit = null, onViewDetails = null }) {
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState(query);
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    setSearchVal(query);
  }, [query]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const coveredBanks = useMemo(() => getCoveredBanksDirectory(), []);

  // Categorized Live Search Results
  const searchResults = useMemo(() => {
    const q = searchVal.trim().toLowerCase();
    if (!q) return { banks: [], cards: [], accounts: [] };

    const matchedBanks = coveredBanks.filter(b => b.name.toLowerCase().includes(q)).slice(0, 3);
    const matchedCards = debitCards.filter(c => 
      c.cardName.toLowerCase().includes(q) || 
      c.bank.toLowerCase().includes(q) || 
      (c.network && c.network.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchedAccounts = savingsAccounts.filter(s => 
      s.accountName.toLowerCase().includes(q) || 
      s.bank.toLowerCase().includes(q) || 
      s.accountType.toLowerCase().includes(q)
    ).slice(0, 3);

    return {
      banks: matchedBanks,
      cards: matchedCards,
      accounts: matchedAccounts
    };
  }, [searchVal, coveredBanks]);

  const hasResults = searchResults.banks.length > 0 || searchResults.cards.length > 0 || searchResults.accounts.length > 0;

  const handleSearchSubmit = () => {
    setQuery(searchVal);
    navigate('/cards');
  };

  const scrollToCategories = () => {
    const elem = document.getElementById('product-categories');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/savings-accounts');
    }
  };

  return (
    <section id="home" className="relative z-10 overflow-hidden px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFC] to-[#F8FAFC] dark:from-[#0F172A] dark:via-[#0F172A] dark:to-[#0F172A] border-b border-[#E5E7EB] dark:border-slate-800">
      <div className="mx-auto max-w-7xl relative z-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-12 text-left">

        {/* ── Left Column: Text Content & Input ── */}
        <div className="flex-1 flex flex-col items-start w-full space-y-6">
          
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase border border-[#2563EB]/25 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] shadow-xs select-none">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA] animate-pulse" />
            BANKING PRODUCT DISCOVERY PLATFORM
          </span>

          {/* Core Headline */}
          <h1 className="w-full text-2xl xs:text-3xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.15] sm:leading-[1.12] text-[#1F2937] dark:text-white tracking-tight">
            Compare. Choose. <br className="hidden sm:block" />
            <span className="text-gradient">
              Bank Smarter.
            </span>
          </h1>

          <p className="max-w-xl text-sm sm:text-lg text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
            Explore and compare savings accounts and debit cards from leading banks in one place.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 w-full max-w-lg">
            <button
              onClick={() => navigate('/savings-accounts')}
              className="flex-1 px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#2563EB] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white text-xs font-bold tracking-wide uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[44px]"
            >
              <Landmark className="w-4 h-4" />
              <span>Explore Savings Accounts</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/cards')}
              className="flex-1 px-5 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/30 text-xs font-bold tracking-wide uppercase shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[44px]"
            >
              <CreditCard className="w-4 h-4" />
              <span>Explore Debit Cards</span>
            </button>
          </div>

          {/* Global Search Input Component */}
          <div className="w-full max-w-lg select-none relative z-30 pt-2">
            <GlobalSearchInput 
              query={query} 
              setQuery={setQuery} 
              onSearchSubmit={onSearchSubmit}
              onViewDetails={onViewDetails} 
            />
          </div>

        </div>

        {/* ── Right Column: 3D Floating Vector Cards Infographic ── */}
        <HeroVisual isMobile={isMobile} />
      </div>
    </section>
  );
}

export default HeroSection;
