import { useState, useEffect, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { debitCards } from '../data/mockData';

// Featured Card details for Hero Section
const FEATURED_CARD = debitCards[0] || {
  id: 1,
  bank: "HDFC Bank",
  cardName: "EasyShop Platinum Debit Card",
  network: "Visa Platinum",
  applyUrl: "https://www.hdfcbank.com",
};

const CARD_SPECS = [
  { label: "Annual Fee", value: "₹850 / yr" },
  { label: "Joining Fee", value: "₹0 / Nil" },
  { label: "ATM Withdrawal", value: "₹1,00,000 / day" },
  { label: "International Usage", value: "Worldwide" },
  { label: "Forex Markup", value: "2.0%" },
  { label: "Lounge Access", value: "4 Visits / yr" },
  { label: "Cashback", value: "1% Unlimited" },
  { label: "Reward Rate", value: "2% Spends" },
  { label: "Contactless Payment", value: "Enabled" },
  { label: "Network", value: "Visa Platinum" },
  { label: "Eligibility", value: "Savings Account" },
  { label: "Best For", value: "Travel & Rewards" },
];

/**
 * Large Realistic Debit Card Preview Component
 */
const RealisticCardPreview = memo(({ isMobile }) => {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tracking for subtle premium 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (isMobile) {
      mouseX.set(0);
      mouseY.set(0);
    }
  }, [isMobile, mouseX, mouseY]);

  const springX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 25 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width - 0.5;
    const yVal = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xVal);
    mouseY.set(yVal);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full flex flex-col items-center justify-center relative select-none py-4"
      style={{ perspective: 1200 }}
    >
      {/* Outer Floating Animation Container */}
      <motion.div
        animate={
          isMobile || shouldReduceMotion
            ? { y: 0 }
            : { y: [0, -10, 0] }
        }
        transition={
          isMobile || shouldReduceMotion
            ? {}
            : { repeat: Infinity, duration: 6, ease: 'easeInOut' }
        }
        className="w-full max-w-[460px] relative group"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Subtle Ambient Hover Glow (70% reduced) */}
        <div
          className={`absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#2563EB]/30 to-[#38BDF8]/30 blur-2xl transition-opacity duration-500 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-20'
          }`}
        />

        {/* Realistic Debit Card Visual */}
        <motion.div
          style={{
            rotateX: isMobile ? 0 : rotateX,
            rotateY: isMobile ? 0 : rotateY,
            transformStyle: 'preserve-3d',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="w-full aspect-[1.586/1] rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#1E1E24] via-[#141418] to-[#09090B] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative overflow-hidden flex flex-col justify-between transition-all duration-300"
        >
          {/* Subtle Metallic Brushed Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-slate-400 to-black mix-blend-overlay" />

          {/* Soft Sweep Reflection Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-10"
            style={{ skewX: -25 }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', repeatDelay: 3 }}
          />

          {/* Top Section: Issuer, Card Name & Badges */}
          <div className="relative z-20 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#2563EB]/20 text-[#38BDF8] border border-[#2563EB]/30">
                  PREMIUM
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  98% Match
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight pt-1">
                {FEATURED_CARD.cardName}
              </h3>
              <p className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
                {FEATURED_CARD.bank}
              </p>
            </div>

            {/* Contactless Symbol */}
            <svg className="w-6 h-6 text-white/60 flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8.5 14.5A5 5 0 0 0 8.5 9.5" />
              <path d="M12 17a8 8 0 0 0 0-10" />
              <path d="M15.5 19.5a11 11 0 0 0 0-15" />
            </svg>
          </div>

          {/* Middle Section: Gold 3D EMV Chip */}
          <div className="relative z-20 flex items-center justify-between my-2">
            <div className="w-12 h-9 sm:w-14 sm:h-10 rounded-lg border border-[#F59E0B]/40 bg-gradient-to-br from-[#FEF08A] via-[#F59E0B] to-[#B45309] p-1 flex flex-wrap gap-0.5 shadow-md relative overflow-hidden">
              <div className="w-[45%] h-[40%] border-r border-b border-black/20" />
              <div className="w-[45%] h-[40%] border-b border-black/20" />
              <div className="w-[45%] h-[45%] border-r border-black/20" />
              <div className="w-[45%] h-[45%]" />
            </div>
            <span className="text-[11px] font-mono tracking-widest text-[#A1A1AA] font-semibold">DEBIT</span>
          </div>

          {/* Bottom Section: Card Number & Network Logo */}
          <div className="relative z-20 flex items-end justify-between">
            <div>
              <p className="font-mono text-base sm:text-lg tracking-[0.2em] text-white/90 font-medium">
                4532 •••• •••• 8892
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-[#A1A1AA] block">CARDHOLDER</span>
                  <span className="text-xs font-bold text-white tracking-wider uppercase">VALUED MEMBER</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase tracking-wider text-[#A1A1AA] block">EXPIRES</span>
                  <span className="text-xs font-bold text-white font-mono">09/29</span>
                </div>
              </div>
            </div>

            {/* Network Logo */}
            <div className="text-right">
              <span className="font-black italic text-xl sm:text-2xl text-white tracking-tighter drop-shadow-md">
                VISA
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
});

function HeroSection({ query = '', setQuery = () => {}, onViewDetails }) {
  const [searchVal, setSearchVal] = useState(query);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setSearchVal(query);
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchVal !== query) {
        setQuery(searchVal);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchVal, query, setQuery]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleOpenSpecs = () => {
    if (onViewDetails) {
      onViewDetails(FEATURED_CARD);
    } else {
      const el = document.querySelector('#cards');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOfficialWebsite = () => {
    window.open(FEATURED_CARD.applyUrl || 'https://www.hdfcbank.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="home" className="relative z-10 bg-[#09090B] text-white pt-10 pb-16 md:pt-14 md:pb-20 border-b border-white/5 overflow-hidden">
      {/* Clean Ambient Background Orbs (Reduced Glow by 70%) */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* ── Left Column: Content & Specs ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex-1 w-full flex flex-col items-start space-y-6"
          >
            {/* Issuer Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18181B] border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
              <span className="text-sm sm:text-base font-semibold text-[#38BDF8] tracking-wide uppercase">
                {FEATURED_CARD.bank}
              </span>
            </div>

            {/* Card Name */}
            <h1 className="text-4xl sm:text-5xl md:text-[56px] font-bold text-white tracking-tight leading-[1.1]">
              {FEATURED_CARD.cardName}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#A1A1AA] leading-[1.6] max-w-2xl font-normal">
              Compare features, ATM limits, forex charges, and reward points across premier Indian banks. Make informed financial decisions with full transparency in seconds.
            </p>

            {/* ── 12-Spec Glassmorphism Information Cards Grid ── */}
            <div className="w-full pt-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA] mb-3">
                Key Card Specifications
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {CARD_SPECS.map((spec) => (
                  <div
                    key={spec.label}
                    className="p-3.5 rounded-xl bg-[#18181B] border border-white/10 hover:border-[#38BDF8]/40 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA] mb-1 font-medium">
                      <span className="text-[#38BDF8] text-sm">✔</span>
                      <span className="truncate">{spec.label}</span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Action Buttons ── */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              {/* Primary CTA */}
              <button
                type="button"
                onClick={handleOpenSpecs}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-[#2563EB]/25 hover:-translate-y-0.5 active:scale-98 transition-all flex items-center justify-center gap-2.5 text-base cursor-pointer"
              >
                <span>View Full Specifications</span>
                <span className="text-lg">→</span>
              </button>

              {/* Secondary CTA */}
              <button
                type="button"
                onClick={handleOfficialWebsite}
                className="bg-[#27272A] hover:bg-[#3F3F46] text-white border border-white/15 font-semibold px-7 py-3.5 rounded-xl hover:-translate-y-0.5 active:scale-98 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <span>Official Website</span>
                <span className="text-xs">↗</span>
              </button>
            </div>

            {/* Search Input Filter */}
            <div className="pt-2 w-full max-w-xl">
              <div className="relative flex items-center bg-[#18181B] border border-white/10 rounded-2xl px-4 py-2.5 shadow-sm focus-within:border-[#38BDF8]/50 transition-all">
                <span className="text-[#A1A1AA] text-sm mr-2 select-none">🔍</span>
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setQuery(searchVal);
                      document.querySelector("#cards")?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  placeholder="Search bank, card, or perk (e.g. HDFC, Lounge)..."
                  className="w-full bg-transparent border-none text-xs sm:text-sm text-white placeholder-[#A1A1AA] outline-none font-medium"
                />
              </div>
            </div>
          </motion.div>

          {/* ── Right Column: Large Realistic Debit Card Preview ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="flex-1 w-full"
          >
            <RealisticCardPreview isMobile={isMobile} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;
