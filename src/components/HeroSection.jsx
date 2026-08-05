import { useState, useEffect, memo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

// Extract the heavy 3D visual layout to a memoized subcomponent.
// This prevents typing search inputs from triggering complex 3D frame recalculations.
const HeroVisual = memo(({ isMobile }) => {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered1, setIsHovered1] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);

  // Motion values for smooth 3D mouse parallax tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (isMobile) {
      mouseX.set(0);
      mouseY.set(0);
    }
  }, [isMobile, mouseX, mouseY]);

  // Spring damping physics for premium smooth inertia
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  // Map mouse positions to 3D rotation & translation for Card 1 (Top Card)
  const card1RotateX = useTransform(springY, [-0.5, 0.5], [15, -15]);
  const card1RotateY = useTransform(springX, [-0.5, 0.5], [-15, 15]);
  const card1X = useTransform(springX, [-0.5, 0.5], [-12, 12]);
  const card1Y = useTransform(springY, [-0.5, 0.5], [-12, 12]);

  // Map mouse positions to opposite 3D rotation & translation for Card 2 (Bottom Card)
  const card2RotateX = useTransform(springY, [-0.5, 0.5], [20, -20]);
  const card2RotateY = useTransform(springX, [-0.5, 0.5], [-20, 20]);
  const card2X = useTransform(springX, [-0.5, 0.5], [16, -16]); // Opposite direction for 3D depth parallax
  const card2Y = useTransform(springY, [-0.5, 0.5], [16, -16]);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
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
      className="flex-1 relative hero-visual-container w-full mt-6 lg:mt-0 select-none block max-w-[500px] lg:max-w-none mx-auto flex items-center justify-center overflow-hidden lg:overflow-visible z-10"
      style={{ perspective: 1200, transformStyle: "preserve-3d" }}
    >
      {/* Central Portal Glow */}
      {!isMobile && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[380px] sm:h-[380px] rounded-full blur-[100px] select-none pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(194,24,117,0.16) 0%, rgba(122,15,82,0.12) 50%, transparent 70%)' }} />
      )}

      {/* Atmospheric background floating particles */}
      {!isMobile && [...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-secondary/35 dark:bg-roseGold/30"
          style={{
            top: `${20 + i * 15}%`,
            left: `${15 + (i * 23) % 70}%`,
            filter: "blur(0.5px)"
          }}
          animate={{
            y: [0, -25, 0],
            x: [0, (i % 2 === 0 ? 15 : -15), 0],
            scale: [1, 1.4, 1],
            opacity: [0.15, 0.5, 0.15]
          }}
          transition={{
            repeat: Infinity,
            duration: 6 + i * 2,
            ease: "easeInOut",
            delay: i * 0.5
          }}
        />
      ))}

      {/* Concentric Glowing Orbit Rings (behind the cards) */}
      {!isMobile && (
        <>
          <div className="absolute w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] rounded-full border border-dashed border-secondary/25 dark:border-roseGold/20 animate-[spin_45s_linear_infinite] pointer-events-none z-0 flex items-center justify-center"
               style={{ transform: 'rotateX(60deg) rotateY(-15deg)', transformStyle: 'preserve-3d' }}>
            {/* Orbit Node points */}
            <div className="absolute w-3 h-3 rounded-full bg-secondary shadow-[0_0_15px_#c21875] -top-1.5" />
            <div className="absolute w-2 h-2 rounded-full bg-[#f59e0b] shadow-[0_0_10px_#f59e0b] -bottom-1" />
            <div className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] left-10 top-20" />
          </div>
          
          <div className="absolute w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full border border-dashed border-slate-300/20 dark:border-slate-700/25 animate-[spin_25s_linear_infinite_reverse] pointer-events-none z-0"
               style={{ transform: 'rotateX(55deg) rotateY(20deg)' }}>
            <div className="absolute w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_8px_#f472b6] right-4 top-10" />
          </div>
        </>
      )}

      {/* Card 1 — Midnight Gold Executive Card Floating Wrapper */}
      <motion.div
        animate={
          isMobile || shouldReduceMotion
            ? { y: 0, rotate: 2 }
            : { y: [0, -12, 0], rotate: [2, 3, 2] }
        }
        transition={
          isMobile || shouldReduceMotion
            ? {}
            : { repeat: Infinity, duration: 7, ease: 'easeInOut' }
        }
        className="absolute top-2 right-2 sm:right-6 hero-card-1 z-10"
        style={{ transformStyle: "preserve-3d", perspective: 1000, willChange: "transform" }}
      >
        {/* Inner Interactive Card */}
        <motion.div
          style={{
            rotateX: card1RotateX,
            rotateY: card1RotateY,
            x: card1X,
            y: card1Y,
            transformStyle: "preserve-3d",
            borderColor: 'rgba(245, 158, 11, 0.4)',
          }}
          whileHover={{
            scale: 1.05,
            z: 30,
            boxShadow: '0 35px 80px rgba(0,0,0,0.85), 0 12px 30px rgba(245,158,11,0.25)'
          }}
          onMouseEnter={() => setIsHovered1(true)}
          onMouseLeave={() => setIsHovered1(false)}
          className="w-full h-full rounded-3xl p-6 cursor-pointer border bg-gradient-to-br from-[#020108] via-[#150f29] to-[#030209] transition-all duration-300 relative overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.85)]"
        >
          {/* Metallic Brushed Overlay */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-slate-400 to-black mix-blend-overlay" />
          
          {/* Soft sweep glare light reflection */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent pointer-events-none z-20"
            style={{ skewX: -25 }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", repeatDelay: 2 }}
          />
          
          {/* Soft hover glow reflection */}
          <motion.div 
            className="absolute inset-0 bg-white/5 pointer-events-none z-20 opacity-0 transition-opacity duration-300"
            style={{ opacity: isHovered1 ? 1 : 0 }}
          />

          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs sm:text-sm font-black tracking-[0.2em] text-[#f59e0b] uppercase block">D.Card Royale</span>
                <span className="text-[9.5px] sm:text-[11px] font-bold text-slate-400 tracking-[0.1em] uppercase">Limited Edition</span>
              </div>
              <svg width="34" height="24" viewBox="0 0 42 28" fill="none">
                <circle cx="14" cy="14" r="14" fill="#f59e0b" fillOpacity="0.8" />
                <circle cx="28" cy="14" r="14" fill="#fbbf24" fillOpacity="0.5" />
              </svg>
            </div>

            {/* Gold Plated 3D EMV Chip */}
            <div className="w-12 h-9 sm:w-14 sm:h-10 rounded-lg border border-[#f59e0b]/40 bg-gradient-to-br from-[#fef08a] via-[#f59e0b] to-[#b45309] p-1 flex flex-wrap gap-0.5 shadow-[0_2px_10px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="w-[45%] h-[40%] border-r border-b border-black/15" />
              <div className="w-[45%] h-[40%] border-b border-black/15" />
              <div className="w-[45%] h-[45%] border-r border-black/15" />
              <div className="w-[45%] h-[45%]" />
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/10" />
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-black/10" />
            </div>

            <div>
              <p className="font-mono text-base sm:text-lg md:text-xl tracking-[0.22em] text-slate-200 mb-1.5 drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.6)]">5412 8899 0041 3302</p>
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[8.5px] text-slate-500 uppercase font-black tracking-wider block">Cardholder</span>
                  <span className="text-xs sm:text-sm font-black tracking-widest text-[#f59e0b] uppercase font-sans">Royale Member</span>
                </div>
                <div className="text-right">
                  <span className="text-[8.5px] text-slate-550 uppercase font-black tracking-wider block">Valid Thru</span>
                  <span className="text-xs sm:text-sm font-black tracking-widest text-[#f59e0b] font-mono">12/32</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#f59e0b]/40 to-transparent" />
        </motion.div>
      </motion.div>

      {/* Card 2 — Cyberpunk Neon Rose Gold Glass Card Floating Wrapper */}
      <motion.div
        animate={
          isMobile || shouldReduceMotion
            ? { y: 0, rotate: -2 }
            : { y: [0, 12, 0], rotate: [-2, -3, -2] }
        }
        transition={
          isMobile || shouldReduceMotion
            ? {}
            : { repeat: Infinity, duration: 8.2, ease: 'easeInOut', delay: 0.8 }
        }
        className="absolute bottom-2 left-2 sm:left-4 hero-card-2 z-20"
        style={{ transformStyle: "preserve-3d", perspective: 1000, willChange: "transform" }}
      >
        {/* Inner Interactive Card */}
        <motion.div
          style={{
            rotateX: card2RotateX,
            rotateY: card2RotateY,
            x: card2X,
            y: card2Y,
            transformStyle: "preserve-3d",
            borderColor: 'rgba(194, 24, 117, 0.35)',
          }}
          whileHover={{
            scale: 1.05,
            z: 30,
            boxShadow: '0 30px 75px rgba(0,0,0,0.7), 0 15px 35px rgba(194,24,117,0.25)'
          }}
          onMouseEnter={() => setIsHovered2(true)}
          onMouseLeave={() => setIsHovered2(false)}
          className="w-full h-full rounded-3xl p-6 cursor-pointer border bg-gradient-to-br from-[rgba(3,1,10,0.8)] via-[rgba(194,24,117,0.22)] to-[rgba(163,13,98,0.12)] backdrop-blur-3xl transition-all duration-300 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
        >
          {/* Holographic Glowing Border Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/10 opacity-70 pointer-events-none mix-blend-screen" />
          
          {/* Soft sweep glare light reflection */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none z-20"
            style={{ skewX: -25 }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 6.8, ease: "easeInOut", repeatDelay: 2.5 }}
          />
          
          {/* Soft hover glow reflection */}
          <motion.div 
            className="absolute inset-0 bg-white/5 pointer-events-none z-20 opacity-0 transition-opacity duration-300"
            style={{ opacity: isHovered2 ? 1 : 0 }}
          />

          <div className="flex flex-col h-full justify-between relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs sm:text-sm font-black tracking-[0.2em] text-secondary uppercase block">D.Card Rose</span>
                <span className="text-[9.5px] sm:text-[11px] font-bold text-slate-400 tracking-[0.1em] uppercase">Holoshield Rose</span>
              </div>
              <span className="italic font-black text-xl text-slate-200 tracking-tighter drop-shadow-[0_2px_8px_rgba(194,24,117,0.3)]">VISA</span>
            </div>

            {/* Platinum Plated EMV chip */}
            <div className="w-12 h-9 sm:w-14 sm:h-10 rounded-lg border border-white/20 bg-gradient-to-br from-slate-100 via-slate-300 to-slate-400 p-1 flex flex-wrap gap-0.5 shadow-[0_2px_10px_rgba(0,0,0,0.35)] relative overflow-hidden">
              <div className="w-[45%] h-[40%] border-r border-b border-black/10" />
              <div className="w-[45%] h-[40%] border-b border-black/10" />
              <div className="w-[45%] h-[45%] border-r border-black/10" />
              <div className="w-[45%] h-[45%]" />
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/10" />
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-black/10" />
            </div>

            <div>
              <p className="font-mono text-base sm:text-lg md:text-xl tracking-[0.22em] text-slate-200 mb-1.5 drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.5)]">4090 1122 8856 0914</p>
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[8.5px] text-slate-550 uppercase font-black tracking-wider block">Cardholder</span>
                  <span className="text-xs sm:text-sm font-black tracking-widest text-slate-200 uppercase font-sans">Cyber Member</span>
                </div>
                <div className="text-right">
                  <span className="text-[8.5px] text-slate-550 uppercase font-black tracking-wider block">Valid Thru</span>
                  <span className="text-xs sm:text-sm font-black tracking-widest text-slate-200 font-mono">08/30</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
        </motion.div>
      </motion.div>
    </div>
  );
});

function HeroSection({ query = '', setQuery = () => {} }) {
  const [searchVal, setSearchVal] = useState(query);
  const [isMobile, setIsMobile] = useState(false);

  // Sync internal input value if parent query changes (e.g. on reset or preset click)
  useEffect(() => {
    setSearchVal(query);
  }, [query]);

  // Debounce the parent query state update
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
      setIsMobile(window.innerWidth < 1024); // LG breakpoint is 1024px where layout goes side-by-side
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="home" className="relative z-10 overflow-hidden px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-16 md:pb-20 bg-gradient-to-b from-primary/10 via-transparent to-transparent">
      {/* Ambient Pink and Plum Light Orbs */}
      <div className="orb-pink w-[700px] h-[700px] top-0 right-0 -translate-y-1/3 translate-x-1/4 z-0" />
      <div className="orb-plum w-[600px] h-[600px] bottom-0 left-0 translate-y-1/3 -translate-x-1/4 z-0" />
      <div className="orb-gold w-[400px] h-[400px] top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 z-0" />

      <div className="mx-auto max-w-7xl relative z-20 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

        {/* ── Left Column: Text Content ── */}
        <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start w-full">
          {/* Tagline Badge */}
          <span className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black tracking-widest uppercase border border-secondary/20 bg-secondary/10 text-secondary dark:text-roseGold shadow-sm shimmer-effect select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary dark:bg-roseGold animate-pulse" />
            ⚡ PREMIUM DEBIT CARD PLATFORM
          </span>

          {/* Core Headline */}
          <h1 className="w-full font-serif text-4xl sm:text-5xl font-black leading-tight text-slate-900 dark:text-slate-100 md:text-[56px] tracking-tight">
            Find the best <br className="hidden sm:block" />
            <span className="text-gradient">debit card</span> <br className="hidden lg:block" />
            <span>for you.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base sm:text-lg text-textSoft dark:text-slate-300 leading-relaxed font-medium">
            Compare features, charges, cashback, and benefits across banks. Make an informed financial decision in minutes.
          </p>

          {/* Search & Compare Input Section */}
          <div className="mt-6 w-full max-w-lg select-none relative z-30">
            <div className="flex flex-col sm:flex-row gap-3 bg-white/40 dark:bg-black/20 p-2 rounded-3xl border border-slate-150 dark:border-secondary/15 shadow-md backdrop-blur-xl">
              <div className="relative flex-1 flex items-center pl-3">
                <span className="text-slate-450 text-base select-none">🔍</span>
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
                  className="w-full bg-transparent border-none text-xs font-semibold pl-2.5 py-2.5 outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-505"
                />
              </div>
              
              <button
                onClick={() => {
                  setQuery(searchVal);
                  document.querySelector("#cards")?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-cta text-xs px-6 py-3.5 font-extrabold tracking-wide uppercase transition-all duration-300 relative group overflow-hidden rounded-2xl shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                {/* Glow Overlay */}
                <span className="absolute inset-0 bg-gradient-to-r from-secondary via-[#e02f88] to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                <span className="relative z-10 flex items-center gap-1.5">
                  Compare Now 🚀
                </span>
              </button>
            </div>
          </div>

        </div>

        {/* ── Right Column: Interactive 3D Metallic Cards with Parallax ── */}
        <HeroVisual isMobile={isMobile} />
      </div>
    </section>
  );
}

export default HeroSection;

