import { useState, useEffect, memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CreditCard, 
  ArrowRight, 
  Sparkles, 
  Landmark, 
  Bot
} from 'lucide-react';
import GlobalSearchInput from './GlobalSearchInput';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';

/**
 * HeroVisual (Right Column)
 * 
 * High-quality, natural editorial presentation matching the approved reference design.
 * Features the woman holding the premium D.CARD with subtle organic sage leafy shapes
 * and faint concentric circular grid lines.
 */
const HeroVisual = memo(({ isMobile }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex-1 relative w-full mt-6 lg:mt-0 select-none max-w-[560px] lg:max-w-[580px] xl:max-w-[620px] mx-auto flex items-center justify-center">
      {/* Background Subtle Mint Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full bg-gradient-to-tr from-[#159B72]/12 via-[#006B50]/8 to-transparent blur-[80px]" />
      </div>

      <motion.div
        animate={
          isMobile || shouldReduceMotion
            ? { y: 0 }
            : { y: [0, -6, 0] }
        }
        transition={
          isMobile || shouldReduceMotion
            ? {}
            : { repeat: Infinity, duration: 8, ease: 'easeInOut' }
        }
        className="relative z-10 w-full flex items-center justify-center"
      >
        <img
          src="/assets/hero-woman-blend.png"
          alt="D.CARD banking product discovery platform - Compare & Choose debit cards and savings accounts"
          width="1118"
          height="1008"
          fetchpriority="high"
          decoding="async"
          className="w-full h-auto max-h-[480px] sm:max-h-[520px] lg:max-h-[580px] object-contain object-right-bottom drop-shadow-sm select-none pointer-events-none"
        />
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
      className="relative z-30 px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-14 md:pb-22 bg-gradient-to-b from-[#FAF9F4] via-[#FFFFFF] to-[#FAF9F4] dark:from-[#0C1813] dark:via-[#13241C] dark:to-[#0C1813] border-b border-[#DCE9E1] dark:border-[#1F382B] overflow-hidden"
    >
      <div className="mx-auto max-w-7xl relative z-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-14 text-left">

        {/* ── Left Column: Editorial Fintech Headline, Subtitle, CTAs & Search ── */}
        <div className="flex-1 flex flex-col items-start w-full space-y-6">
          
          {/* Badge: Banking Product Discovery Platform */}
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase border border-[#DCE9E1] bg-[#EEF4EE] text-[#006B50] dark:bg-[#1A2E24] dark:text-[#34D399] dark:border-[#1F382B] shadow-2xs select-none">
            <span>⚡</span>
            <span>{t('home.discoveryBadge', 'BANKING PRODUCT DISCOVERY PLATFORM')}</span>
          </span>

          {/* Core Headline in Elegant Serif Typography */}
          <h1 className="w-full text-4xl sm:text-5xl lg:text-[58px] font-bold leading-[1.08] sm:leading-[1.06] tracking-tight font-serif text-left">
            <span className="block text-[#123C30] dark:text-white">
              {isHindi ? 'तुलना करें और चुनें' : 'Compare & Choose'}
            </span>
            <span className="block text-[#006B50] dark:text-[#159B72] italic font-semibold mt-1">
              {isHindi ? 'सर्वश्रेष्ठ बैंकिंग उत्पाद।' : 'Finest Banking Products.'}
            </span>
          </h1>

          <p className="max-w-xl text-base sm:text-lg text-[#45534D] dark:text-[#B8C9BF] leading-relaxed font-sans font-normal text-left">
            {t('home.heroSubtitle', 'Explore and compare savings accounts and debit cards from leading banks in one place.')}
          </p>

          {/* Primary & Secondary CTAs with Emerald-Green Styling and White Text */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1 w-full max-w-lg">
            {/* Primary CTA: Explore Savings Accounts */}
            <button
              onClick={handleSavingsClick}
              className="flex-1 px-6 py-3.5 rounded-xl bg-[#006B50] hover:bg-[#064E3B] text-white text-xs sm:text-sm font-bold tracking-wide uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[48px] group"
            >
              <Landmark className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform" />
              <span>{isHindi ? 'बचत खाते देखें →' : 'EXPLORE SAVINGS ACCOUNTS →'}</span>
            </button>

            {/* Secondary CTA: Explore Debit Cards (White button with dark green border matching reference mockup) */}
            <button
              onClick={handleCardsClick}
              className="flex-1 px-6 py-3.5 rounded-xl bg-white hover:bg-[#FAF9F4] dark:bg-[#13241C] dark:hover:bg-[#1A2E24] text-[#123C30] dark:text-white text-xs sm:text-sm font-bold tracking-wide uppercase shadow-sm hover:shadow-md border border-[#123C30]/40 dark:border-[#34D399]/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 min-h-[48px] group"
            >
              <CreditCard className="w-4 h-4 text-[#006B50] dark:text-[#34D399] group-hover:scale-110 transition-transform" />
              <span>{isHindi ? 'डेबिट कार्ड्स देखें' : 'EXPLORE DEBIT CARDS'}</span>
            </button>
          </div>

          {/* Global Search Input Component with White/Pale-Mint Input & Emerald Search Button */}
          <div className="w-full max-w-lg select-none relative z-50 pt-1">
            <GlobalSearchInput 
              query={query} 
              setQuery={setQuery} 
              onSearchSubmit={onSearchSubmit}
              onViewDetails={onViewDetails} 
            />
          </div>

        </div>

        {/* ── Right Column: High-Quality Realistic Portrait of Woman with D.CARD ── */}
        <HeroVisual isMobile={isMobile} />
      </div>

      {/* ── Fixed Floating Bottom-Right D.CARD AI Assistance Pill ── */}
      <Link
        to="/ai-advisor"
        className="fixed bottom-6 right-6 z-40 hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#006B50] hover:bg-[#064E3B] text-white border border-[#34D399]/40 shadow-lg hover:shadow-emerald-900/30 hover:scale-105 transition-all text-xs font-bold select-none cursor-pointer group"
        title="D.CARD AI Assistance"
      >
        <Bot className="w-4 h-4 text-emerald-200 group-hover:rotate-12 transition-transform" />
        <span>{isHindi ? 'डी.कार्ड एआई सहायता' : 'D.CARD AI Assistance'}</span>
        <Sparkles className="w-3.5 h-3.5 text-[#34D399] animate-pulse" />
      </Link>
    </section>
  );
}

export default HeroSection;
