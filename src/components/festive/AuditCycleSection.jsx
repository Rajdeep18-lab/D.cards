import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  ShieldCheck, 
  Calendar, 
  RefreshCw, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Info,
  Sparkles,
  Layers
} from 'lucide-react';
import { FESTIVE_CONFIG } from '../../config/festiveConfig';
import { useLanguage } from '../../context/LanguageContext';

/**
 * 15-DAY AUDIT CYCLE — Premium Fintech Trust Indicator
 * 
 * Features:
 * - 15-day visual circular indicator with 15 numbered segments.
 * - Golden progress ring with subtle pulse.
 * - Explicitly represents D.CARD's internal scheduled review cadence.
 * - Does not invent bank endorsements or fake completion percentages.
 * - Reusable and configurable via festiveConfig.
 */
export default function AuditCycleSection() {
  const shouldReduceMotion = useReducedMotion();
  const { isHindi } = useLanguage();
  const config = FESTIVE_CONFIG.auditCycle;

  if (!FESTIVE_CONFIG.auditCycleSectionEnabled || !FESTIVE_CONFIG.isFestiveEnabled) {
    return null;
  }

  // Pre-calculate 15 circular segment positions on a 280x280 coordinate plane (radius = 110, center = 140, 140)
  const segments = useMemo(() => {
    const total = 15;
    const radius = 108;
    const cx = 140;
    const cy = 140;

    return Array.from({ length: total }, (_, i) => {
      const dayNum = i + 1;
      // Start from top (-90 degrees) and go clockwise
      const angleDeg = (i * 360) / total - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = cx + radius * Math.cos(angleRad);
      const y = cy + radius * Math.sin(angleRad);
      const isPastOrCurrent = dayNum <= config.currentDayInCycle;
      const isCurrent = dayNum === config.currentDayInCycle;

      return {
        dayNum,
        x,
        y,
        isPastOrCurrent,
        isCurrent
      };
    });
  }, [config.currentDayInCycle]);

  return (
    <section 
      id="audit-cycle"
      aria-label="15-Day Audit Cycle"
      className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 select-none"
    >
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#111827] border border-amber-500/25 dark:border-amber-400/20 shadow-[0_12px_40px_rgba(245,158,11,0.08)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.4)] p-6 sm:p-10 lg:p-12">
        
        {/* Subtle Decorative Golden Gradient Top Trim */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
        
        {/* Ambient Warm Golden Corner Accents */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-amber-500/5 dark:bg-amber-400/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-yellow-500/5 dark:bg-yellow-400/5 blur-3xl pointer-events-none" />

        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold tracking-widest uppercase rounded-full border border-amber-500/25">
            <RefreshCw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-[spin_10s_linear_infinite]" />
            {isHindi ? config.cycleLabelHi : config.cycleLabel}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
            {isHindi ? config.mainHeadingHi : config.mainHeading}
          </h2>
          <p className="text-sm sm:text-base text-[#6B7280] dark:text-slate-300 font-normal">
            {isHindi ? config.supportingTextHi : config.supportingText}
          </p>
        </div>

        {/* ── Main Content: 15-Day Circular Indicator + Audit Metadata Cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: 15-Day Circular Visual Progress Ring */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-[280px] h-[280px] sm:w-[310px] sm:h-[310px] flex items-center justify-center">
              
              {/* Outer Golden Ambient Halo */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/10 via-yellow-400/15 to-transparent blur-xl pointer-events-none" />

              <svg 
                viewBox="0 0 280 280" 
                className="w-full h-full transform -rotate-90 select-none pointer-events-none"
              >
                <defs>
                  {/* Golden Gradient for Ring Arc */}
                  <linearGradient id="goldCycleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D97706" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#FBBF24" />
                  </linearGradient>

                  {/* Filter for glowing current node */}
                  <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#F59E0B" floodOpacity="0.7" />
                  </filter>
                </defs>

                {/* Base Circular Track */}
                <circle
                  cx="140"
                  cy="140"
                  r="108"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-slate-200 dark:text-slate-800"
                />

                {/* Active Golden Progress Ring Arc (Day 1 through Day 7 of 15) */}
                <circle
                  cx="140"
                  cy="140"
                  r="108"
                  fill="none"
                  stroke="url(#goldCycleGradient)"
                  strokeWidth="5"
                  strokeDasharray="678.58"
                  strokeDashoffset={678.58 * (1 - config.currentDayInCycle / config.cycleDays)}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>

              {/* 15 Numbered Segment Nodes placed around the perimeter */}
              <div className="absolute inset-0 pointer-events-none">
                {segments.map((seg) => (
                  <div
                    key={seg.dayNum}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-black transition-all ${
                      seg.isCurrent
                        ? 'bg-amber-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.8)] ring-2 ring-amber-300 scale-110 z-20 animate-pulse'
                        : seg.isPastOrCurrent
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 z-10'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-700 z-0'
                    }`}
                    style={{
                      left: `${(seg.x / 280) * 100}%`,
                      top: `${(seg.y / 280) * 100}%`
                    }}
                    title={`Day ${seg.dayNum} of 15-day audit cycle`}
                  >
                    {seg.dayNum}
                  </div>
                ))}
              </div>

              {/* Center Card of Ring */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-4 rounded-full bg-white dark:bg-[#1E293B] shadow-md border border-amber-500/30 w-36 h-36 sm:w-40 sm:h-40">
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-amber-600 dark:text-amber-400">
                  {isHindi ? 'समीक्षा चक्र' : 'AUDIT CADENCE'}
                </span>
                <div className="flex items-baseline gap-0.5 my-0.5">
                  <span className="text-3xl sm:text-4xl font-black text-[#1F2937] dark:text-white tracking-tight">
                    15
                  </span>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    {isHindi ? 'दिन' : 'DAYS'}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                  <Clock className="w-3 h-3 text-amber-500" />
                  <span>{isHindi ? `दिन ${config.currentDayInCycle}/15 सक्रिय` : `Day ${config.currentDayInCycle} of 15`}</span>
                </div>
              </div>

            </div>

            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-4 text-center">
              {isHindi ? '15 चक्र खंड • निरंतर डेटा समीक्षा' : '15 Numbered Segments • Continuous Data Oversight'}
            </p>
          </div>

          {/* Right Column: Audit Schedule, Key Message & Methodology */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Core Message Callout */}
            <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-[#1F2937] dark:text-white space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <h3 className="text-base sm:text-lg font-black">
                  {isHindi ? 'विश्वसनीय बैंकिंग डेटा की प्रतिबद्धता' : 'Our Commitment to Data Fidelity'}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                "{isHindi ? config.shortMessageHi : config.shortMessage}"
              </p>
            </div>

            {/* Audit Dates Grid (Explicit, Transparent Dates) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card 1: Last Internal Audit */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#1E293B]/80 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {isHindi ? 'अंतिम आंतरिक समीक्षा' : 'Last Internal Audit'}
                  </span>
                </div>
                <div className="text-lg font-black text-slate-800 dark:text-white">
                  {isHindi ? config.lastAuditDateHi : config.lastAuditDate}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{isHindi ? '220+ उत्पाद टैरिफ सत्यापित' : '220+ Product Tariffs Checked'}</span>
                </div>
              </div>

              {/* Card 2: Next Scheduled Review */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#1E293B]/80 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {isHindi ? 'अगली निर्धारित समीक्षा' : 'Next Scheduled Review'}
                  </span>
                </div>
                <div className="text-lg font-black text-slate-800 dark:text-white">
                  {isHindi ? config.nextScheduledAuditDateHi : config.nextScheduledAuditDate}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{isHindi ? 'नियमित 15-दिवसीय चक्र' : 'Standard 15-Day Cadence'}</span>
                </div>
              </div>

            </div>

            {/* Verification Scope Details */}
            <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
              <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-lg font-black text-slate-800 dark:text-white block">136+</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase">{isHindi ? 'डेबिट कार्ड' : 'Debit Cards'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-lg font-black text-slate-800 dark:text-white block">74+</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase">{isHindi ? 'बचत खाते' : 'Savings Accs'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
                <span className="text-lg font-black text-slate-800 dark:text-white block">19+</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase">{isHindi ? 'चालू खाते' : 'Current Accs'}</span>
              </div>
            </div>

            {/* Clear Governance Notice */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                {isHindi ? config.disclaimerHi : config.disclaimer}
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

