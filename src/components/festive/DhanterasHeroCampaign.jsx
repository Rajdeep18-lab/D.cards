import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard,
  Landmark
} from 'lucide-react';
import DiyaIllustration from './DiyaIllustration';
import { FESTIVE_CONFIG } from '../../config/festiveConfig';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Dhanteras & Diwali Homepage Hero Campaign Section
 * Modern fintech platform celebrating prosperity with deep burgundy, champagne gold,
 * and elegant Indian festive accents.
 */
export default function DhanterasHeroCampaign() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const { isHindi } = useLanguage();
  const config = FESTIVE_CONFIG.dhanterasCampaign;

  if (!FESTIVE_CONFIG.dhanterasHeroCampaignEnabled || !FESTIVE_CONFIG.isFestiveEnabled) {
    return null;
  }

  const handleExploreClick = () => {
    const target = document.getElementById(config.ctaExplore.targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/cards');
    }
  };

  const handleCompareClick = () => {
    navigate(config.ctaCompare.path);
  };

  return (
    <section 
      id="dhanteras-hero"
      aria-label="Dhanteras Festive Campaign"
      className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 select-none"
    >
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#2B080C] via-[#1A050A] to-[#0B0F19] border border-amber-500/35 shadow-[0_16px_50px_rgba(217,119,6,0.18)] text-white">
        
        {/* ── Background Subtle Golden Lighting & Indian Festive Watermark ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Radial warm lighting blooms */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-amber-600/20 via-yellow-600/10 to-transparent blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-tl from-yellow-500/15 via-amber-600/10 to-transparent blur-3xl" />

          {/* Elegant Indian Mandala / Rangoli Geometric Watermark */}
          <svg 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[480px] h-[480px] opacity-[0.05] pointer-events-none"
            viewBox="0 0 200 200" 
            fill="none" 
            stroke="currentColor"
          >
            <circle cx="100" cy="100" r="90" strokeWidth="0.8" stroke="#F5D061" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="70" strokeWidth="0.8" stroke="#F5D061" />
            <circle cx="100" cy="100" r="50" strokeWidth="0.8" stroke="#F5D061" strokeDasharray="2 2" />
            <circle cx="100" cy="100" r="30" strokeWidth="0.8" stroke="#F5D061" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line 
                key={deg} 
                x1="100" 
                y1="100" 
                x2={100 + 90 * Math.cos((deg * Math.PI) / 180)} 
                y2={100 + 90 * Math.sin((deg * Math.PI) / 180)} 
                stroke="#F5D061" 
                strokeWidth="0.6" 
              />
            ))}
          </svg>

          {/* Thin Champagne Gold Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
        </div>

        {/* ── Main Content Grid ── */}
        <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Left Column: Text & Calls to Action */}
          <div className="flex-1 space-y-6 text-left max-w-2xl">
            
            {/* Festive Campaign Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{isHindi ? 'शुभ धनतेरस व दीपावली उत्सव' : 'Shubh Dhanteras & Diwali Special'}</span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-black tracking-tight leading-[1.2] text-white">
                {isHindi ? config.headlineHi : config.headline}
              </h2>
              <p className="text-sm sm:text-base text-amber-100/80 leading-relaxed font-normal pt-1">
                {isHindi ? config.supportingTextHi : config.supportingText}
              </p>
            </div>

            {/* Trust Mini-Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-amber-200/90 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isHindi ? '100% निष्पक्ष व पारदर्शी तुलना' : '100% Unbiased Banking Comparison'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isHindi ? 'सत्यापित शुल्क और लाउंज एक्सेस' : 'Verified Fees & Lounge Privileges'}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
              <button
                type="button"
                onClick={handleExploreClick}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-[#1F1600] font-black text-xs sm:text-sm tracking-wide transition-all shadow-[0_8px_25px_rgba(245,158,11,0.35)] flex items-center justify-center gap-2 cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{isHindi ? config.ctaExplore.labelHi : config.ctaExplore.label}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={handleCompareClick}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-amber-400/40 font-bold text-xs sm:text-sm tracking-wide transition-all backdrop-blur-md flex items-center justify-center gap-2 cursor-pointer hover:border-amber-400 group active:scale-[0.98]"
              >
                <Scale className="w-4 h-4 text-amber-300" />
                <span>{isHindi ? config.ctaCompare.labelHi : config.ctaCompare.label}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Festive Visual Focal Point */}
          <div className="relative flex flex-col items-center justify-center shrink-0 w-full sm:w-auto">
            <motion.div
              animate={!shouldReduceMotion ? { y: [0, -6, 0] } : {}}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-amber-500/10 via-black/40 to-black/60 border border-amber-500/30 backdrop-blur-md shadow-2xl flex flex-col items-center text-center space-y-4 max-w-xs"
            >
              {/* Diya Centerpiece */}
              <div className="relative py-2">
                <DiyaIllustration size={72} glow={true} />
              </div>

              {/* Festive Card Caption */}
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold tracking-widest text-amber-300 uppercase block">
                  {isHindi ? 'वित्तीय सुरक्षा व समृद्धि' : 'FINANCIAL PROSPERITY'}
                </span>
                <h3 className="text-base font-extrabold text-white">
                  {isHindi ? 'पारदर्शी डेटा, बेहतर चयन' : 'Transparent Data, Better Choices'}
                </h3>
                <p className="text-[11px] text-amber-100/70 leading-relaxed">
                  {isHindi 
                    ? '130+ कार्ड और 70+ खातों के सत्यापित शुल्क और लाभ'
                    : 'Verified schedules of charges & perks across 130+ cards and 70+ accounts'}
                </p>
              </div>

              {/* Status Pill */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isHindi ? 'आंतरिक समीक्षा सक्रिय' : 'Active 15-Day Review'}</span>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}

