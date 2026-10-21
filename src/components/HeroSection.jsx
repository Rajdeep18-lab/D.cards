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
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';

const HeroVisual = memo(({ isMobile }) => {
  const shouldReduceMotion = useReducedMotion();
  const { t } = useLanguage();

  return (
    <div className="flex-1 relative w-full mt-8 lg:mt-0 select-none max-w-[620px] lg:max-w-[580px] xl:max-w-[640px] mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      
      {/* Background Decorative Visual Effects bounded to HeroVisual */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-3xl">
        {/* Moving Blue Gradient Blobs & Glowing Rays */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[460px] sm:h-[460px] rounded-full bg-gradient-to-tr from-[#0B3D91]/20 via-[#2563EB]/15 to-transparent blur-[80px] pointer-events-none animate-pulse-glow" />

        {/* Grid Mesh Texture Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-mesh opacity-50 pointer-events-none rounded-3xl" />

        {/* Geometric Decorative Rotating Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] sm:w-[420px] sm:h-[420px] rounded-full border border-dashed border-[#2563EB]/25 dark:border-[#60A5FA]/20 animate-[spin_45s_linear_infinite] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[320px] sm:h-[320px] rounded-full border border-[#60A5FA]/20 dark:border-[#2563EB]/20 pointer-events-none" />
      </div>

      {/* FLOATING TOP BADGE */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
        className="mb-4 z-30 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-md border border-[#E5E7EB] dark:border-slate-700 shadow-md flex items-center gap-2"
      >
        <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
        <div className="text-[10.5px] sm:text-xs">
          <span className="font-bold text-[#1F2937] dark:text-white">{t('home.independentBadge', '100% Independent')} </span>
          <span className="text-[#6B7280] dark:text-slate-400 font-medium">{t('home.comparisonPlatform', 'Comparison Platform')}</span>
        </div>
      </motion.div>

      {/* 2 CARDS GRID (DEBIT CARDS & SAVINGS ACCOUNTS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full relative z-20">
        
        {/* VISUAL 1 — DEBIT CARDS CARD */}
        <motion.div
          animate={
            isMobile || shouldReduceMotion
              ? { y: 0, rotate: 0 }
              : { y: [0, -6, 0], rotate: [0, 1.5, 0] }
          }
          transition={
            isMobile || shouldReduceMotion
              ? {}
              : { repeat: Infinity, duration: 6.5, ease: 'easeInOut' }
          }
          className="w-full h-[190px] sm:h-[210px] rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#0B3D91] via-[#2563EB] to-[#3B82F6] text-white shadow-[0_20px_50px_rgba(37,99,235,0.3)] border border-white/20 overflow-hidden card-reflection flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col justify-between h-full relative z-10">
            {/* Header */}
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
                  <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-white">DEBIT CARDS</span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-white/80 tracking-wider uppercase font-semibold block mt-0.5">Category Matrix</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-white/90 bg-white/20 px-2 py-0.5 rounded-full border border-white/20 uppercase shrink-0">
                100+ Cards
              </span>
            </div>

            {/* Micro-text description */}
            <p className="text-[11px] sm:text-xs text-white/90 leading-snug font-medium">
              Compare fees, limits, rewards & benefits
            </p>

            {/* Features pills */}
            <div className="grid grid-cols-2 gap-1.5 text-[9px] sm:text-[10px] text-white/95 font-semibold">
              <div className="px-2 py-1 rounded-lg bg-white/15 backdrop-blur-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0" />
                <span className="truncate">ATM / POS Limits</span>
              </div>
              <div className="px-2 py-1 rounded-lg bg-white/15 backdrop-blur-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 shrink-0" />
                <span className="truncate">Lounge Access</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* VISUAL 2 — SAVINGS ACCOUNTS CARD */}
        <motion.div
          animate={
            isMobile || shouldReduceMotion
              ? { y: 0, rotate: 0 }
              : { y: [0, 6, 0], rotate: [0, -1.5, 0] }
          }
          transition={
            isMobile || shouldReduceMotion
              ? {}
              : { repeat: Infinity, duration: 7.5, ease: 'easeInOut', delay: 0.5 }
          }
          className="w-full h-[190px] sm:h-[210px] rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] text-white shadow-[0_20px_50px_rgba(15,23,42,0.4)] border border-slate-700/80 overflow-hidden card-reflection flex flex-col justify-between"
        >
          <div className="flex flex-col justify-between h-full relative z-10">
            {/* Header */}
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Landmark className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-white">SAVINGS ACCOUNTS</span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-emerald-400 tracking-wider uppercase font-semibold block mt-0.5">Institutional Index</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#60A5FA] bg-[#2563EB]/20 px-2 py-0.5 rounded-full border border-[#2563EB]/40 uppercase shrink-0">
                Multi-Bank
              </span>
            </div>

            {/* Micro-text description */}
            <p className="text-[11px] sm:text-xs text-slate-300 leading-snug font-medium">
              Compare account types, requirements & perks
            </p>

            {/* Features pills */}
            <div className="grid grid-cols-2 gap-1.5 text-[9px] sm:text-[10px] text-slate-200 font-semibold">
              <div className="px-2 py-1 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="truncate">Balance Tiers</span>
              </div>
              <div className="px-2 py-1 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#60A5FA] shrink-0" />
                <span className="truncate">Interest Perks</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* FLOATING BOTTOM BADGE */}
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut', delay: 1 }}
        className="mt-4 z-30 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-md border border-[#E5E7EB] dark:border-slate-700 shadow-md flex items-center gap-2"
      >
        <Percent className="w-4 h-4 text-emerald-500 shrink-0" />
        <div className="text-[10.5px] sm:text-xs">
          <span className="font-bold text-[#1F2937] dark:text-white">{t('home.sideBySide', 'Side-by-Side')} </span>
          <span className="text-[#6B7280] dark:text-slate-400 font-medium">{t('home.productMatrix', 'Product Matrix')}</span>
        </div>
      </motion.div>
    </div>
  );
});

function HeroSection({ query = '', setQuery = () => {}, onSearchSubmit = null, onViewDetails = null }) {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const { t } = useLanguage();
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
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSearchSubmit = () => {
    setQuery(searchVal);
    if (!user) {
      if (openAuthModal) openAuthModal('login', '/cards');
    } else {
      navigate('/cards');
    }
  };

  const handleSavingsClick = () => {
    if (!user) {
      if (openAuthModal) openAuthModal('login', '/savings-accounts');
    } else {
      navigate('/savings-accounts');
    }
  };

  const handleCardsClick = () => {
    if (!user) {
      if (openAuthModal) openAuthModal('login', '/cards');
    } else {
      navigate('/cards');
    }
  };

  const scrollToCategories = () => {
    const elem = document.getElementById('product-categories');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleSavingsClick();
    }
  };

  return (
    <section id="home" className="relative z-30 px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFC] to-[#F8FAFC] dark:from-[#0F172A] dark:via-[#0F172A] dark:to-[#0F172A] border-b border-[#E5E7EB] dark:border-slate-800">
      <div className="mx-auto max-w-7xl relative z-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-12 text-left">

        {/* ── Left Column: Text Content & Input ── */}
        <div className="flex-1 flex flex-col items-start w-full space-y-6">
          
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase border border-[#2563EB]/25 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] shadow-xs select-none">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA] animate-pulse" />
            {t('home.discoveryBadge', 'BANKING PRODUCT DISCOVERY PLATFORM')}
          </span>

          {/* Core Headline */}
          <h1 className="w-full text-2xl xs:text-3xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.15] sm:leading-[1.12] text-[#1F2937] dark:text-white tracking-tight">
            {t('home.heroTitlePrefix', 'Compare. Choose.')} <br className="hidden sm:block" />
            <span className="text-gradient">
              {t('home.heroTitleGradient', 'Bank Smarter.')}
            </span>
          </h1>

          <p className="max-w-xl text-sm sm:text-lg text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
            {t('home.heroSubtitle', 'Explore and compare savings accounts and debit cards from leading banks in one place.')}
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 w-full max-w-lg">
            <button
              onClick={handleSavingsClick}
              className="flex-1 px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#2563EB] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white text-xs font-bold tracking-wide uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[44px]"
            >
              <Landmark className="w-4 h-4" />
              <span>{t('home.exploreSavings', 'Explore Savings Accounts')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleCardsClick}
              className="flex-1 px-5 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/30 text-xs font-bold tracking-wide uppercase shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[44px]"
            >
              <CreditCard className="w-4 h-4" />
              <span>{t('home.exploreCards', 'Explore Debit Cards')}</span>
            </button>
          </div>

          {/* Global Search Input Component */}
          <div className="w-full max-w-lg select-none relative z-50 pt-2">
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
