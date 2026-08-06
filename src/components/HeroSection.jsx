import { useState, useEffect, memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Search, ArrowRight, ShieldCheck, CheckCircle2, Zap, Sparkles, Building2 } from 'lucide-react';

const HeroVisual = memo(({ isMobile }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex-1 relative w-full mt-8 lg:mt-0 select-none max-w-[540px] lg:max-w-none mx-auto flex items-center justify-center min-h-[380px] sm:min-h-[440px]">
      
      {/* Decorative Vector Blue Circles & Glow Gradient Blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] rounded-full bg-gradient-to-tr from-[#2563EB]/20 via-[#60A5FA]/15 to-transparent blur-[80px] pointer-events-none z-0" />

      {/* Subtle Dotted Background Decoration */}
      <div 
        className="absolute inset-0 opacity-[0.25] dark:opacity-[0.15] z-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#2563EB 1.2px, transparent 1.2px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Geometric Decorative Rings */}
      <div className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full border border-dashed border-[#2563EB]/30 dark:border-[#60A5FA]/20 animate-[spin_40s_linear_infinite] pointer-events-none z-0" />
      <div className="absolute w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] rounded-full border border-[#60A5FA]/20 dark:border-[#2563EB]/20 pointer-events-none z-0" />

      {/* Floating Debit Card 1 — Blue Primary Gradient Card */}
      <motion.div
        animate={
          isMobile || shouldReduceMotion
            ? { y: 0, rotate: 3 }
            : { y: [0, -10, 0], rotate: [3, 4, 3] }
        }
        transition={
          isMobile || shouldReduceMotion
            ? {}
            : { repeat: Infinity, duration: 6, ease: 'easeInOut' }
        }
        className="absolute top-4 right-2 sm:right-6 w-[280px] sm:w-[340px] h-[170px] sm:h-[200px] rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#2563EB] via-[#3B82F6] to-[#60A5FA] text-white shadow-[0_20px_50px_rgba(37,99,235,0.25)] border border-white/20 z-20 overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform duration-300"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col justify-between h-full relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-5 h-5 text-white/90" />
                <span className="text-xs font-bold tracking-widest uppercase text-white/90">D.CARD ELITE</span>
              </div>
              <span className="text-[10px] text-white/70 tracking-wider uppercase font-normal">Financial Platform Layer</span>
            </div>
            <span className="text-xs font-bold tracking-widest text-white/80 bg-white/15 px-2.5 py-1 rounded-full border border-white/20">VISA</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 border border-amber-300/40 shadow-inner">
              <div className="w-full h-full border border-black/10 rounded-[2px]" />
            </div>
            <Zap className="w-4 h-4 text-white/80" />
          </div>

          <div className="space-y-1">
            <p className="text-sm sm:text-base font-semibold tracking-[0.2em] text-white/90">4892 •••• •••• 9012</p>
            <div className="flex justify-between items-end text-[11px] text-white/80 font-normal">
              <span>ALEX JOHNSON</span>
              <span>08/29</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Debit Card 2 — Slate Navy Secondary Card */}
      <motion.div
        animate={
          isMobile || shouldReduceMotion
            ? { y: 0, rotate: -4 }
            : { y: [0, 10, 0], rotate: [-4, -5, -4] }
        }
        transition={
          isMobile || shouldReduceMotion
            ? {}
            : { repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 0.5 }
        }
        className="absolute bottom-4 left-2 sm:left-6 w-[270px] sm:w-[330px] h-[160px] sm:h-[190px] rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] text-white shadow-[0_20px_40px_rgba(15,23,42,0.4)] border border-slate-700 z-10 overflow-hidden cursor-pointer hover:scale-[1.03] transition-transform duration-300"
      >
        <div className="flex flex-col justify-between h-full relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#60A5FA]" />
                <span className="text-xs font-bold tracking-widest uppercase text-white/90">HDFC PLATINUM</span>
              </div>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-normal">Rewards & Lounge Access</span>
            </div>
            <span className="text-xs font-bold tracking-widest text-[#60A5FA] bg-[#2563EB]/10 px-2.5 py-1 rounded-full border border-[#2563EB]/30">RuPay</span>
          </div>

          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-slate-300">5241 •••• •••• 4410</p>
            <div className="flex justify-between items-end text-[10px] text-slate-400 font-normal">
              <span>PRIYA SHARMA</span>
              <span>11/28</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Trust Badge */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
        className="absolute -top-2 left-4 sm:left-8 z-30 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-md border border-[#E5E7EB] dark:border-slate-700 shadow-lg flex items-center gap-2.5"
      >
        <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
        <div className="text-[11px]">
          <p className="font-bold text-[#1F2937] dark:text-white leading-none">100% Independent</p>
          <p className="text-[9.5px] text-[#6B7280] dark:text-slate-400 font-normal">Zero Commission Bias</p>
        </div>
      </motion.div>
    </div>
  );
});

function HeroSection({ query = '', setQuery = () => {} }) {
  const navigate = useNavigate();
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

  const handleSearchSubmit = () => {
    setQuery(searchVal);
    navigate('/cards');
  };

  return (
    <section id="home" className="relative z-10 overflow-hidden px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-14 md:pb-20 bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFC] to-[#F8FAFC] dark:from-[#0F172A] dark:via-[#0F172A] dark:to-[#0F172A] border-b border-[#E5E7EB] dark:border-slate-800">
      <div className="mx-auto max-w-7xl relative z-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-12">

        {/* ── Left Column: Text Content & Input ── */}
        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start w-full space-y-6">
          
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase border border-[#2563EB]/20 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] shadow-sm select-none">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
            DEBIT CARD COMPARISON PLATFORM
          </span>

          {/* Core Headline */}
          <h1 className="w-full text-4xl sm:text-5xl lg:text-[54px] font-bold leading-[1.15] text-[#1F2937] dark:text-white tracking-tight">
            Find the perfect <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#60A5FA] bg-clip-text text-transparent">
              debit card
            </span> for your lifestyle.
          </h1>

          <p className="max-w-xl text-base sm:text-lg text-[#6B7280] dark:text-slate-300 leading-relaxed font-normal">
            Compare annual fees, lounge access, cashback, minimum balance terms, and hidden charges across top banks in India.
          </p>

          {/* Search & Compare Input */}
          <div className="w-full max-w-lg select-none relative z-30 pt-2">
            <div className="flex flex-col sm:flex-row gap-2 bg-white dark:bg-[#1E293B] p-2 rounded-2xl border border-[#E5E7EB] dark:border-slate-700 shadow-md">
              <div className="relative flex-1 flex items-center pl-3">
                <Search className="w-4 h-4 text-[#6B7280] dark:text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchSubmit();
                  }}
                  placeholder="Search card or bank (e.g. HDFC, Lounge, Zero Fee)..."
                  className="w-full bg-transparent border-none text-xs font-normal pl-2.5 py-3 outline-none text-[#1F2937] dark:text-white placeholder-[#9CA3AF]"
                />
              </div>
              
              <button
                onClick={handleSearchSubmit}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:opacity-95 text-white text-xs font-semibold tracking-wide uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Compare Cards</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Key Highlights */}
          <div className="pt-3 flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-normal text-[#6B7280] dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              100% Unbiased Ratings
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              No Hidden Charges
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Real Bank Data
            </span>
          </div>

        </div>

        {/* ── Right Column: Vector Card Infographic Visual ── */}
        <HeroVisual isMobile={isMobile} />
      </div>
    </section>
  );
}

export default HeroSection;
