import React, { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  ShieldCheck, 
  Calendar, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Info,
  Sparkles,
} from 'lucide-react';
import { FESTIVE_CONFIG } from '../../config/festiveConfig';
import { useLanguage } from '../../context/LanguageContext';
import { calculateAuditCycleMetrics } from '../../services/auditCycleService';

/**
 * 15-DAY AUDIT CYCLE — Live Fintech Trust & Verification Indicator
 * 
 * Features:
 * - Real-time countdown automatically updating with system time.
 * - Dynamic 15-day visual circular indicator with 15 numbered segments.
 * - Dynamic golden progress ring filling according to active day in cycle.
 * - Prominent status: "Up to Date", "Review Due Soon", or "Pending Verification".
 * - Real last verified date & next scheduled review date from actual bank records.
 * - Transparent product breakdown: verified vs pending verification.
 * - 100% mobile-responsive from 320px to 1440px+ without any horizontal overflow.
 */
export default function AuditCycleSection() {
  const shouldReduceMotion = useReducedMotion();
  const { isHindi } = useLanguage();
  const config = FESTIVE_CONFIG.auditCycle;

  // Live metrics updated dynamically every second
  const [metrics, setMetrics] = useState(() => calculateAuditCycleMetrics());

  useEffect(() => {
    // Immediate calculation
    setMetrics(calculateAuditCycleMetrics());

    // Update every second for live countdown precision
    const timer = setInterval(() => {
      setMetrics(calculateAuditCycleMetrics());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Pre-calculate 15 circular segment positions on a 280x280 coordinate plane (radius = 108, center = 140, 140)
  const segments = useMemo(() => {
    const total = 15;
    const radius = 108;
    const cx = 140;
    const cy = 140;

    return Array.from({ length: total }, (_, i) => {
      const dayNum = i + 1;
      // Start from top (-90 degrees) and proceed clockwise
      const angleDeg = (i * 360) / total - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = cx + radius * Math.cos(angleRad);
      const y = cy + radius * Math.sin(angleRad);
      const isPastOrCurrent = dayNum <= metrics.currentDayInCycle;
      const isCurrent = dayNum === metrics.currentDayInCycle;

      return {
        dayNum,
        x,
        y,
        isPastOrCurrent,
        isCurrent
      };
    });
  }, [metrics.currentDayInCycle]);

  // Status badge styling helper
  const statusBadgeConfig = useMemo(() => {
    switch (metrics.status) {
      case 'up_to_date':
        return {
          icon: ShieldCheck,
          bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
          border: 'border-emerald-500/30',
          text: 'text-emerald-700 dark:text-emerald-300',
          dot: 'bg-emerald-500',
          pulse: false
        };
      case 'review_due':
        return {
          icon: AlertCircle,
          bg: 'bg-amber-500/15 dark:bg-amber-500/20',
          border: 'border-amber-500/40',
          text: 'text-amber-800 dark:text-amber-300',
          dot: 'bg-amber-500',
          pulse: true
        };
      case 'pending':
      default:
        return {
          icon: Clock,
          bg: 'bg-slate-500/10 dark:bg-slate-500/20',
          border: 'border-slate-400/30',
          text: 'text-slate-700 dark:text-slate-300',
          dot: 'bg-slate-400',
          pulse: false
        };
    }
  }, [metrics.status]);

  const StatusIcon = statusBadgeConfig.icon;

  return (
    <section 
      id="audit-cycle"
      aria-label="15-Day Audit Cycle"
      className="relative z-20 w-full select-none"
    >
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-[#111827] border border-amber-500/25 dark:border-amber-400/20 shadow-[0_12px_40px_rgba(245,158,11,0.08)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.4)] p-4 sm:p-8 lg:p-10">
        
        {/* Subtle Decorative Golden Gradient Top Trim */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
        
        {/* Ambient Warm Golden Corner Accents */}
        <div className="absolute -top-20 -right-20 w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-amber-500/5 dark:bg-amber-400/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-yellow-500/5 dark:bg-yellow-400/5 blur-3xl pointer-events-none" />

        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-8 sm:mb-10">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold tracking-widest uppercase rounded-full border border-amber-500/25">
              <RefreshCw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-[spin_10s_linear_infinite]" />
              {isHindi ? (config.cycleLabelHi || 'आंतरिक डेटा समीक्षा चक्र') : (config.cycleLabel || 'Internal Information Audit Cycle')}
            </span>

            {/* LIVE STATUS PILL */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${statusBadgeConfig.bg} ${statusBadgeConfig.text} text-xs font-black tracking-wide rounded-full border ${statusBadgeConfig.border} shadow-sm`}>
              <span className={`w-2 h-2 rounded-full ${statusBadgeConfig.dot} ${statusBadgeConfig.pulse ? 'animate-ping' : ''}`} />
              <StatusIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{isHindi ? metrics.statusLabelHi : metrics.statusLabel}</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
            {isHindi ? (config.mainHeadingHi || '15-दिवसीय ऑडिट चक्र') : (config.mainHeading || '15-DAY AUDIT CYCLE')}
          </h2>

          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-300 font-normal max-w-2xl mx-auto">
            {isHindi 
              ? (config.supportingTextHi || 'आपकी बैंकिंग जानकारी नियमित सत्यापन की हकदार है।') 
              : (config.supportingText || 'Your banking information deserves regular verification.')}
          </p>
        </div>

        {/* ── Main Content: 15-Day Circular Indicator + Audit Metadata Cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Responsive 15-Day Circular Progress Ring */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center w-full min-w-0">
            <div className="relative w-[230px] h-[230px] xs:w-[260px] xs:h-[260px] sm:w-[300px] sm:h-[300px] flex items-center justify-center mx-auto">
              
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

                {/* Active Golden Progress Ring Arc (Day 1 through Day X of 15) */}
                <circle
                  cx="140"
                  cy="140"
                  r="108"
                  fill="none"
                  stroke="url(#goldCycleGradient)"
                  strokeWidth="5"
                  strokeDasharray="678.58"
                  strokeDashoffset={678.58 * (1 - metrics.currentDayInCycle / metrics.cycleDays)}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* 15 Numbered Segment Nodes placed around the perimeter */}
              <div className="absolute inset-0 pointer-events-none">
                {segments.map((seg) => (
                  <div
                    key={seg.dayNum}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[9px] xs:text-[10px] sm:text-[11px] font-black transition-all ${
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

              {/* Center Card of Ring: Displays Real-time Days Remaining */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-2.5 sm:p-4 rounded-full bg-white dark:bg-[#1E293B] shadow-md border border-amber-500/30 w-28 h-28 xs:w-32 xs:h-32 sm:w-36 sm:h-36">
                <span className="text-[8.5px] xs:text-[9.5px] font-extrabold tracking-widest uppercase text-amber-600 dark:text-amber-400">
                  {isHindi ? 'शेष समय' : 'DAYS REMAINING'}
                </span>
                <div className="flex items-baseline gap-0.5 my-0.5">
                  <span className="text-2xl xs:text-3xl sm:text-4xl font-black text-[#1F2937] dark:text-white tracking-tight">
                    {metrics.daysRemaining}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {isHindi ? 'दिन' : 'DAYS'}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1 px-1.5 xs:px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[8.5px] xs:text-[9.5px] font-bold max-w-[95%] truncate">
                  <Clock className="w-2.5 h-2.5 text-amber-500 shrink-0" />
                  <span className="truncate">{isHindi ? `दिन ${metrics.currentDayInCycle}/15` : `Day ${metrics.currentDayInCycle} of 15`}</span>
                </div>
              </div>

            </div>

            {/* Live Subtitle Countdown Indicator */}
            <div className="mt-3 text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isHindi ? 'लाइव उल्टी गिनती:' : 'Live Cycle Clock:'}</span>
                <span className="font-mono text-amber-600 dark:text-amber-400 font-extrabold">
                  {metrics.daysRemaining}d {String(metrics.hoursRemaining).padStart(2, '0')}h {String(metrics.minutesRemaining).padStart(2, '0')}m {String(metrics.secondsRemaining).padStart(2, '0')}s
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {isHindi ? '15 चक्र खंड • निरंतर डेटा समीक्षा' : '15 Active Cadence Segments • Automatic Time Sync'}
              </p>
            </div>
          </div>

          {/* Right Column: Audit Dates Grid, Status Description & Scope Breakdown */}
          <div className="lg:col-span-7 space-y-5 text-left min-w-0">
            
            {/* Core Message Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-[#1F2937] dark:text-white space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <h3 className="text-sm sm:text-base font-black">
                  {isHindi ? 'विश्वसनीय बैंकिंग डेटा की प्रतिबद्धता' : 'Our Commitment to Data Fidelity'}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                "{isHindi ? (config.shortMessageHi || 'हम D.CARD के डेटा को सटीक और अद्यतित रखने के लिए बैंकिंग उत्पाद जानकारी की निरंतर समीक्षा करते हैं।') : (config.shortMessage || 'We continuously review banking product information to help keep D.CARD data accurate and up to date.')}"
              </p>
            </div>

            {/* Audit Dates Grid (Explicit, Live Dates) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              
              {/* Card 1: Last Internal Audit Date */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1E293B]/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10.5px] font-bold uppercase tracking-wider">
                    {isHindi ? 'अंतिम सत्यापन तिथि' : 'Last Verified Date'}
                  </span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-800 dark:text-white">
                  {isHindi ? metrics.lastAuditDateFormattedHi : metrics.lastAuditDateFormatted}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {isHindi 
                      ? `${metrics.datasetMeta.totalVerifiedCount} उत्पाद टैरिफ सत्यापित` 
                      : `${metrics.datasetMeta.totalVerifiedCount} Product Tariffs Verified`}
                  </span>
                </div>
              </div>

              {/* Card 2: Next Scheduled Review Date */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1E293B]/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10.5px] font-bold uppercase tracking-wider">
                    {isHindi ? 'अगली निर्धारित समीक्षा' : 'Next Scheduled Review'}
                  </span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-800 dark:text-white">
                  {isHindi ? metrics.nextAuditDateFormattedHi : metrics.nextAuditDateFormatted}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {isHindi 
                      ? `${metrics.daysRemaining} दिन शेष • नियमित चक्र` 
                      : `${metrics.daysRemaining} Days Left • Active Cadence`}
                  </span>
                </div>
              </div>

            </div>

            {/* Verification Scope Details: Real Counts from Dataset */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 min-w-0">
                <span className="text-base sm:text-lg font-black text-slate-800 dark:text-white block truncate">
                  {metrics.datasetMeta.totalCards}+
                </span>
                <span className="text-[9.5px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase truncate block">
                  {isHindi ? 'डेबिट कार्ड' : 'Debit Cards'}
                </span>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 min-w-0">
                <span className="text-base sm:text-lg font-black text-slate-800 dark:text-white block truncate">
                  {metrics.datasetMeta.totalAccounts}+
                </span>
                <span className="text-[9.5px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase truncate block">
                  {isHindi ? 'बचत खाते' : 'Savings Accs'}
                </span>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 min-w-0">
                <span className="text-base sm:text-lg font-black text-slate-800 dark:text-white block truncate">
                  {metrics.datasetMeta.totalBranches}+
                </span>
                <span className="text-[9.5px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase truncate block">
                  {isHindi ? 'बैंक शाखाएँ' : 'Bank Branches'}
                </span>
              </div>
            </div>

            </div>

        </div>

      </div>
    </section>
  );
}
