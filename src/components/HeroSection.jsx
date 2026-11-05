import { useState, useEffect, useMemo, memo } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
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
import HeroFestiveAtmosphere from './festive/HeroFestiveAtmosphere';
import DiyaIllustration from './festive/DiyaIllustration';
import { FESTIVE_CONFIG } from '../config/festiveConfig';

const HeroVisual = memo(({ isMobile }) => {
  const shouldReduceMotion = useReducedMotion();
  const { t, isHindi } = useLanguage();

  return (
    <div className="flex-1 relative w-full mt-8 lg:mt-0 select-none max-w-[620px] lg:max-w-[580px] xl:max-w-[640px] mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      
      {/* Background Decorative Visual Effects bounded to HeroVisual */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-3xl">
        {/* Moving Warm Golden Gradient Glow Blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[460px] sm:h-[460px] rounded-full bg-gradient-to-tr from-amber-500/15 via-yellow-400/10 to-transparent blur-[80px] pointer-events-none" />

        {/* Geometric Decorative Rotating Rings with Golden Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] sm:w-[420px] sm:h-[420px] rounded-full border border-dashed border-amber-400/20 dark:border-amber-400/15 animate-[spin_45s_linear_infinite] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[320px] sm:h-[320px] rounded-full border border-amber-400/15 dark:border-amber-400/10 pointer-events-none" />
      </div>

      {/* ── FLOATING FESTIVE GOLDEN PARTICLES AROUND HERO ILLUSTRATION (Requirement B) ── */}
      {FESTIVE_CONFIG.isFestiveEnabled && FESTIVE_CONFIG.festiveAnimationsEnabled && !shouldReduceMotion && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
          {[
            { id: 1, top: '12%', left: '8%', size: 3.5, delay: 0, duration: 5.5, dx: 6 },
            { id: 2, top: '22%', right: '6%', size: 3, delay: 1.2, duration: 6, dx: -6 },
            { id: 3, top: '68%', left: '5%', size: 2.5, delay: 2.1, duration: 5.2, dx: 4 },
            { id: 4, top: '78%', right: '10%', size: 3, delay: 0.7, duration: 6.2, dx: -5 },
            { id: 5, top: '42%', left: '2%', size: 2, delay: 1.8, duration: 5.8, dx: 5 },
            { id: 6, top: '48%', right: '2%', size: 2.5, delay: 2.5, duration: 6.5, dx: -4 }
          ].map((pt) => (
            <motion.div
              key={pt.id}
              className="absolute rounded-full bg-gradient-to-r from-amber-400 to-yellow-200"
              style={{
                top: pt.top,
                left: pt.left,
                right: pt.right,
                width: pt.size,
                height: pt.size,
                boxShadow: `0 0 ${pt.size * 2}px rgba(245, 158, 11, 0.75)`,
                opacity: 0.7
              }}
              animate={{
                y: [0, -12, 0],
                x: [0, pt.dx, 0],
                opacity: [0.35, 0.85, 0.4]
              }}
              transition={{
                duration: pt.duration,
                repeat: Infinity,
                delay: pt.delay,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      )}

      {/* FLOATING TOP BADGE */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
        className="mb-4 z-30 px-4 py-1.5 rounded-full bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md border border-amber-400/50 shadow-[0_4px_16px_rgba(245,158,11,0.18)] flex items-center gap-2"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <div className="text-[10.5px] sm:text-xs">
          <span className="font-bold text-[#1F2937] dark:text-white">{t('home.independentBadge', '100% Independent')} </span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">{t('home.comparisonPlatform', 'Comparison Platform')}</span>
        </div>
        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
      </motion.div>

      {/* 2 CARDS GRID (DEBIT CARDS & SAVINGS ACCOUNTS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full relative z-20">
        
        {/* VISUAL 1 — DEBIT CARDS CARD (Deep Royal Blue with Glowing Gold Border & Diya) */}
        <div className="relative w-full">
          <motion.div
            animate={
              isMobile || shouldReduceMotion
                ? { y: 0, rotate: 0 }
                : { y: [0, -6, 0], rotate: [0, 1.2, 0] }
            }
            transition={
              isMobile || shouldReduceMotion
                ? {}
                : { repeat: Infinity, duration: 6.5, ease: 'easeInOut' }
            }
            className="w-full h-[190px] sm:h-[210px] rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#1D4ED8] via-[#2563EB] to-[#1E40AF] text-white shadow-[0_16px_36px_rgba(245,158,11,0.22)] border border-amber-400/50 overflow-hidden card-reflection flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col justify-between h-full relative z-10">
              {/* Header */}
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 shrink-0" />
                    <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-white">
                      {isHindi ? 'डेबिट कार्ड्स' : 'DEBIT CARDS'}
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-white/80 tracking-wider uppercase font-semibold block mt-0.5">
                    {isHindi ? 'श्रेणी मैट्रिक्स' : 'Category Matrix'}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-amber-200 bg-white/15 px-2 py-0.5 rounded-full border border-amber-300/40 uppercase shrink-0">
                  {isHindi ? '100+ कार्ड्स' : '100+ Cards'}
                </span>
              </div>

              {/* Micro-text description */}
              <p className="text-[11px] sm:text-xs text-white/90 leading-snug font-medium">
                {isHindi ? 'शुल्क, सीमाएं, रिवॉर्ड व लाभ की तुलना करें' : 'Compare fees, limits, rewards & benefits'}
              </p>

              {/* Features pills */}
              <div className="grid grid-cols-2 gap-1.5 text-[9px] sm:text-[10px] text-white/95 font-semibold">
                <div className="px-2 py-1 rounded-lg bg-white/15 backdrop-blur-xs flex items-center gap-1 border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0" />
                  <span className="truncate">{isHindi ? 'एटीएम / पीओएस सीमा' : 'ATM / POS Limits'}</span>
                </div>
                <div className="px-2 py-1 rounded-lg bg-white/15 backdrop-blur-xs flex items-center gap-1 border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 shrink-0" />
                  <span className="truncate">{isHindi ? 'लाउंज एक्सेस' : 'Lounge Access'}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Diya at bottom-left corner of Debit Cards Card */}
          <div className="absolute -bottom-3 -left-2 sm:-left-3 z-30 pointer-events-none drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)]">
            <DiyaIllustration size={36} glow={true} animate={true} />
          </div>
        </div>

        {/* VISUAL 2 — SAVINGS ACCOUNTS CARD (Deep Slate Grey with Glowing Gold Border & Diya) */}
        <div className="relative w-full">
          <motion.div
            animate={
              isMobile || shouldReduceMotion
                ? { y: 0, rotate: 0 }
                : { y: [0, 6, 0], rotate: [0, -1.2, 0] }
            }
            transition={
              isMobile || shouldReduceMotion
                ? {}
                : { repeat: Infinity, duration: 7.5, ease: 'easeInOut', delay: 0.5 }
            }
            className="w-full h-[190px] sm:h-[210px] rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white shadow-[0_16px_36px_rgba(245,158,11,0.22)] border border-amber-400/50 overflow-hidden card-reflection flex flex-col justify-between"
          >
            <div className="flex flex-col justify-between h-full relative z-10">
              {/* Header */}
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Landmark className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-white">
                      {isHindi ? 'बचत खाते' : 'SAVINGS ACCOUNTS'}
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-emerald-400 tracking-wider uppercase font-semibold block mt-0.5">
                    {isHindi ? 'संस्थागत सूचकांक' : 'Institutional Index'}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-amber-200 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/40 uppercase shrink-0">
                  {isHindi ? 'मल्टी-बैंक' : 'Multi-Bank'}
                </span>
              </div>

              {/* Micro-text description */}
              <p className="text-[11px] sm:text-xs text-slate-300 leading-snug font-medium">
                {isHindi ? 'खाते के प्रकार, आवश्यकताएं व लाभ देखें' : 'Compare account types, requirements & perks'}
              </p>

              {/* Features pills */}
              <div className="grid grid-cols-2 gap-1.5 text-[9px] sm:text-[10px] text-slate-200 font-semibold">
                <div className="px-2 py-1 rounded-lg bg-slate-800/90 border border-slate-700/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="truncate">{isHindi ? 'बैलेंस स्तर' : 'Balance Tiers'}</span>
                </div>
                <div className="px-2 py-1 rounded-lg bg-slate-800/90 border border-slate-700/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shrink-0" />
                  <span className="truncate">{isHindi ? 'ब्याज लाभ' : 'Interest Perks'}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Diya at bottom-right corner of Savings Accounts Card */}
          <div className="absolute -bottom-3 -right-2 sm:-right-3 z-30 pointer-events-none drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)]">
            <DiyaIllustration size={36} glow={true} animate={true} />
          </div>
        </div>

      </div>

      {/* FLOATING BOTTOM BADGE */}
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut', delay: 1 }}
        className="mt-4 z-30 px-4 py-1.5 rounded-full bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-md border border-amber-400/50 shadow-[0_4px_16px_rgba(245,158,11,0.18)] flex items-center gap-2"
      >
        <Percent className="w-4 h-4 text-emerald-500 shrink-0" />
        <div className="text-[10.5px] sm:text-xs">
          <span className="font-bold text-[#1F2937] dark:text-white">{t('home.sideBySide', 'Side-by-Side')} </span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">{t('home.productMatrix', 'Product Matrix')}</span>
        </div>
      </motion.div>
    </div>
  );
});

function HeroSection({ query = '', setQuery = () => {}, onSearchSubmit = null, onViewDetails = null }) {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const { t, isHindi } = useLanguage();
  const [searchVal, setSearchVal] = useState(query);
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <section 
      id="home" 
      className="relative z-30 px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-[#FFF9EE] via-[#F7EEDC] to-[#FFF9EE] dark:from-[#0B132B] dark:via-[#0F172A] dark:to-[#0B132B] border-b border-[#E8D6B3] dark:border-amber-900/40 overflow-hidden"
    >
      {/* ── HERO FESTIVE DIWALI & DHANTERAS ATMOSPHERE (Mandalas, Rangoli, Floating 3D Coins, Glowing Diyas) ── */}
      <HeroFestiveAtmosphere />
      
      <div className="mx-auto max-w-7xl relative z-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-12 text-left">

        {/* ── Left Column: Text Content & Input ── */}
        <div className="flex-1 flex flex-col items-start w-full space-y-6">
          
          {/* Badge: Banking Product Discovery Platform */}
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase border border-[#E8D6B3] bg-amber-500/10 text-amber-900 dark:text-[#F5DFA8] shadow-[0_2px_10px_rgba(214,166,75,0.18)] select-none">
            <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-500/20" />
            {t('home.discoveryBadge', 'BANKING PRODUCT DISCOVERY PLATFORM')}
          </span>

          {/* Core Headline */}
          <h1 className="w-full text-2xl xs:text-3xl sm:text-5xl lg:text-[56px] font-black leading-[1.15] sm:leading-[1.12] text-[#111827] dark:text-white tracking-tight">
            {t('home.heroTitlePrefix', 'Compare. Choose.')} <br className="hidden sm:block" />
            <span className="text-[#111827] dark:text-white">
              {t('home.heroTitleGradient', 'Bank Smarter.')}
            </span>
          </h1>

          <p className="max-w-xl text-sm sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {t('home.heroSubtitle', 'Explore and compare savings accounts and debit cards from leading banks in one place.')}
          </p>

          {/* Primary & Secondary CTAs (Exact match to prompt and mockup) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 w-full max-w-lg">
            {/* Primary Navy CTA: Explore Savings Accounts */}
            <button
              onClick={handleSavingsClick}
              className="flex-1 px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#111827] via-[#1E293B] to-[#111827] hover:from-[#1E293B] hover:to-[#111827] text-white border border-[#D6A64B]/80 hover:border-[#D6A64B] text-xs font-bold tracking-wide uppercase shadow-[0_8px_25px_rgba(17,24,39,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[44px] group"
            >
              <Landmark className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>{t('home.exploreSavings', 'Explore Savings Accounts')}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>

            {/* Secondary Metallic Gold CTA: Explore Debit Cards */}
            <button
              onClick={handleCardsClick}
              className="flex-1 px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#D6A64B] via-[#F3C649] to-[#C59B27] hover:from-[#E5C158] hover:to-[#D6A64B] text-[#2A1800] border border-amber-300/90 text-xs font-black tracking-wide uppercase shadow-[0_8px_25px_rgba(214,166,75,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[44px] group"
            >
              <CreditCard className="w-4 h-4 text-[#2A1800] group-hover:scale-110 transition-transform" />
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

      {/* ── Fixed Floating Bottom-Right D.CARD AI Assistance Pill ── */}
      <Link
        to="/ai-advisor"
        className="fixed bottom-6 right-6 z-40 hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#111827] via-[#291747] to-[#111827] text-[#F5DFA8] border border-[#D6A64B]/70 shadow-[0_8px_25px_rgba(41,23,71,0.5)] hover:shadow-[0_0_20px_rgba(214,166,75,0.5)] hover:scale-105 transition-all text-xs font-bold select-none cursor-pointer group"
        title="D.CARD AI Assistance"
      >
        <Bot className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
        <span>{isHindi ? 'डी.कार्ड एआई सहायता' : 'D.CARD AI Assistance'}</span>
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
      </Link>
    </section>
  );
}

export default HeroSection;
