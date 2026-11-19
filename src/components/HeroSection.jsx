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
import { useFestivalTheme } from '../hooks/useFestivalTheme';
import FestivalAmbientAtmosphere from './festive/FestivalAmbientAtmosphere';
import FestivalInteractiveCanvas from './festive/engine/FestivalInteractiveCanvas';
import FestivalHeroArtDirection from './festive/engine/FestivalHeroArtDirection';
import DiyaIllustration from './festive/DiyaIllustration';
import { FESTIVE_CONFIG } from '../config/festiveConfig';

const HeroVisual = memo(({ isMobile }) => {
  const shouldReduceMotion = useReducedMotion();
  const { t, isHindi } = useLanguage();

  return (
    <div className="flex-1 relative w-full mt-8 lg:mt-0 select-none max-w-[620px] lg:max-w-[580px] xl:max-w-[640px] mx-auto flex flex-col items-center justify-center p-2 sm:p-4">
      
      {/* Background Decorative Visual Effects bounded to HeroVisual */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 rounded-3xl">
        {/* Soft Sage & Emerald Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[460px] sm:h-[460px] rounded-full bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-transparent blur-[80px] pointer-events-none" />

        {/* Geometric Decorative Subtle Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] sm:w-[420px] sm:h-[420px] rounded-full border border-dashed border-[#E0E6DC] dark:border-[#1F382B] animate-[spin_60s_linear_infinite] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[320px] sm:h-[320px] rounded-full border border-[#E0E6DC]/60 dark:border-[#1F382B]/50 pointer-events-none" />
      </div>

      {/* FLOATING TOP BADGE — RBI Regulated Bank Data */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
        className="mb-4 z-30 px-4 py-1.5 rounded-full bg-white/95 dark:bg-[#13241C]/95 backdrop-blur-md border border-[#E0E6DC] dark:border-[#1F382B] shadow-soft flex items-center gap-2"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-[#0E5C3E] dark:text-[#34D399] shrink-0" />
        <div className="text-[10.5px] sm:text-xs">
          <span className="font-bold text-[#14291F] dark:text-white">{isHindi ? '100% आरबीआई विनियमित' : '100% RBI Regulated'} </span>
          <span className="text-[#445B4D] dark:text-[#B8C9BF] font-medium">{isHindi ? 'बैंक डेटा' : 'Bank Data'}</span>
        </div>
        <Sparkles className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
      </motion.div>

      {/* 2 CARDS GRID (DEBIT CARDS & SAVINGS ACCOUNTS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full relative z-20">
        
        {/* VISUAL 1 — DEBIT CARDS CARD (Deep Forest Green & Rich Emerald Elegance) */}
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
            className="w-full h-[195px] sm:h-[215px] rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#0E3D2A] via-[#14533C] to-[#0A2E1F] text-white shadow-card border border-emerald-500/20 overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col justify-between h-full relative z-10">
              {/* Header */}
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-white font-sans">
                      {isHindi ? 'डेबिट कार्ड्स' : 'DEBIT CARDS'}
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-emerald-200/80 tracking-wider uppercase font-semibold block mt-0.5">
                    {isHindi ? 'श्रेणी मैट्रिक्स' : 'Category Matrix'}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-emerald-200 bg-white/10 px-2 py-0.5 rounded-full border border-emerald-300/30 uppercase shrink-0">
                  {isHindi ? '100+ कार्ड्स' : '100+ Cards'}
                </span>
              </div>

              {/* Micro-text description */}
              <p className="text-[11px] sm:text-xs text-white/90 leading-snug font-normal">
                {isHindi ? 'शुल्क, सीमाएं, रिवॉर्ड व लाभ की तुलना करें' : 'Compare fees, limits, rewards & benefits'}
              </p>

              {/* Features pills */}
              <div className="grid grid-cols-2 gap-1.5 text-[9px] sm:text-[10px] text-white/95 font-semibold">
                <div className="px-2 py-1 rounded-lg bg-white/10 backdrop-blur-xs flex items-center gap-1 border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 shrink-0" />
                  <span className="truncate">{isHindi ? 'एटीएम / पीओएस' : 'ATM / POS Limits'}</span>
                </div>
                <div className="px-2 py-1 rounded-lg bg-white/10 backdrop-blur-xs flex items-center gap-1 border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-300 shrink-0" />
                  <span className="truncate">{isHindi ? 'लाउंज एक्सेस' : 'Lounge Access'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* VISUAL 2 — SAVINGS ACCOUNTS CARD (Soft Ivory & Warm Sage) */}
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
            className="w-full h-[195px] sm:h-[215px] rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-[#FFFFFF] via-[#F5F3EC] to-[#EEF4EE] dark:from-[#13241C] dark:via-[#1A2E24] dark:to-[#0C1813] text-[#14291F] dark:text-white shadow-card border border-[#E0E6DC] dark:border-[#1F382B] overflow-hidden flex flex-col justify-between"
          >
            <div className="flex flex-col justify-between h-full relative z-10">
              {/* Header */}
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Landmark className="w-4 h-4 sm:w-5 sm:h-5 text-[#0E5C3E] dark:text-[#34D399] shrink-0" />
                    <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-[#14291F] dark:text-white font-sans">
                      {isHindi ? 'बचत खाते' : 'SAVINGS ACCOUNTS'}
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-[#0E5C3E] dark:text-[#34D399] tracking-wider uppercase font-semibold block mt-0.5">
                    {isHindi ? 'संस्थागत सूचकांक' : 'Institutional Index'}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-[#0E5C3E] dark:text-[#34D399] bg-[#EEF4EE] dark:bg-[#1A2E24] px-2 py-0.5 rounded-full border border-[#0E5C3E]/20 uppercase shrink-0">
                  {isHindi ? 'मल्टी-बैंक' : 'Multi-Bank'}
                </span>
              </div>

              {/* Micro-text description */}
              <p className="text-[11px] sm:text-xs text-[#445B4D] dark:text-[#B8C9BF] leading-snug font-normal">
                {isHindi ? 'खाते के प्रकार, आवश्यकताएं व लाभ देखें' : 'Compare account types, requirements & perks'}
              </p>

              {/* Features pills */}
              <div className="grid grid-cols-2 gap-1.5 text-[9px] sm:text-[10px] font-semibold">
                <div className="px-2 py-1 rounded-lg bg-white dark:bg-[#13241C] border border-[#E0E6DC] dark:border-[#1F382B] flex items-center gap-1 text-[#14291F] dark:text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0E5C3E] dark:bg-[#34D399] shrink-0" />
                  <span className="truncate">{isHindi ? 'बैलेंस स्तर' : 'Balance Tiers'}</span>
                </div>
                <div className="px-2 py-1 rounded-lg bg-white dark:bg-[#13241C] border border-[#E0E6DC] dark:border-[#1F382B] flex items-center gap-1 text-[#14291F] dark:text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">{isHindi ? 'ब्याज दरें' : 'Interest Perks'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* FLOATING BOTTOM BADGE — 15-Day Audit Cycle */}
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut', delay: 1 }}
        className="mt-4 z-30 px-4 py-1.5 rounded-full bg-white/95 dark:bg-[#13241C]/95 backdrop-blur-md border border-[#E0E6DC] dark:border-[#1F382B] shadow-soft flex items-center gap-2"
      >
        <CheckCircle2 className="w-4 h-4 text-[#0E5C3E] dark:text-[#34D399] shrink-0" />
        <div className="text-[10.5px] sm:text-xs">
          <span className="font-bold text-[#14291F] dark:text-white">{isHindi ? '15-दिवसीय ऑडिट चक्र' : '15-Day Data Audit Cycle'} </span>
          <span className="text-[#445B4D] dark:text-[#B8C9BF] font-medium">• {isHindi ? 'शून्य गुप्त कमीशन' : 'Zero Hidden Commission'}</span>
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
      className="relative z-30 px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-[#FAF8F5] via-[#F5F3EC] to-[#FAF8F5] dark:from-[#0C1813] dark:via-[#13241C] dark:to-[#0C1813] border-b border-[#E0E6DC] dark:border-[#1F382B] overflow-hidden"
    >
      <div className="mx-auto max-w-7xl relative z-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-14 text-left">

        {/* ── Left Column: Editorial Fintech Headline, Subtitle, CTAs & Search ── */}
        <div className="flex-1 flex flex-col items-start w-full space-y-6">
          
          {/* Badge: Banking Product Discovery Platform */}
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase border border-[#E0E6DC] bg-[#EEF4EE] text-[#0E5C3E] dark:bg-[#1A2E24] dark:text-[#34D399] dark:border-[#1F382B] shadow-2xs select-none">
            <Zap className="w-3.5 h-3.5 text-[#0E5C3E] dark:text-[#34D399] fill-current" />
            {t('home.discoveryBadge', 'BANKING PRODUCT DISCOVERY PLATFORM')}
          </span>

          {/* Core Headline in Elegant Serif Typography */}
          <h1 className="w-full text-3xl xs:text-4xl sm:text-5xl lg:text-[54px] font-bold leading-[1.12] sm:leading-[1.10] text-[#14291F] dark:text-white tracking-tight font-serif">
            {isHindi ? (
              <>
                भारत के सर्वश्रेष्ठ बैंकिंग उत्पाद। <br className="hidden sm:block" />
                <span className="italic font-normal text-[#0E5C3E] dark:text-[#34D399]">
                  पारदर्शी तुलना।
                </span>
              </>
            ) : (
              <>
                Compare &amp; Choose <br className="hidden sm:block" />
                <span className="italic font-normal text-[#0E5C3E] dark:text-[#34D399]">
                  Finest Banking Products.
                </span>
              </>
            )}
          </h1>

          <p className="max-w-xl text-sm sm:text-base lg:text-lg text-[#445B4D] dark:text-[#B8C9BF] leading-relaxed font-sans font-normal">
            {t('home.heroSubtitle', 'Explore and compare savings accounts, debit cards and commercial tiers from leading RBI-regulated banks in one place with zero hidden fees.')}
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 w-full max-w-lg">
            {/* Primary Rich Emerald CTA: Explore Savings Accounts */}
            <button
              onClick={handleSavingsClick}
              className="flex-1 px-6 py-3.5 rounded-xl bg-[#0E5C3E] hover:bg-[#0A4730] text-white text-xs sm:text-sm font-bold tracking-wide uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[46px] group"
            >
              <Landmark className="w-4 h-4 text-[#A7F3D0] group-hover:scale-110 transition-transform" />
              <span>{t('home.exploreSavings', 'Explore Savings Accounts')}</span>
              <ArrowRight className="w-4 h-4 text-[#A7F3D0]" />
            </button>

            {/* Secondary Warm Ivory CTA: Explore Debit Cards */}
            <button
              onClick={handleCardsClick}
              className="flex-1 px-6 py-3.5 rounded-xl bg-white dark:bg-[#13241C] hover:bg-[#EEF4EE] dark:hover:bg-[#1A2E24] text-[#14291F] dark:text-white border border-[#E0E6DC] dark:border-[#1F382B] text-xs sm:text-sm font-bold tracking-wide uppercase shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[46px] group"
            >
              <CreditCard className="w-4 h-4 text-[#0E5C3E] dark:text-[#34D399] group-hover:scale-110 transition-transform" />
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
        className="fixed bottom-6 right-6 z-40 hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0E5C3E] hover:bg-[#0A4730] text-white border border-[#34D399]/40 shadow-lg hover:shadow-emerald-900/30 hover:scale-105 transition-all text-xs font-bold select-none cursor-pointer group"
        title="D.CARD AI Assistance"
      >
        <Bot className="w-4 h-4 text-[#A7F3D0] group-hover:rotate-12 transition-transform" />
        <span>{isHindi ? 'डी.कार्ड एआई सहायता' : 'D.CARD AI Assistance'}</span>
        <Sparkles className="w-3.5 h-3.5 text-[#34D399] animate-pulse" />
      </Link>
    </section>
  );
}

export default HeroSection;
