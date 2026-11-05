import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Coins, Flame, ArrowRight, ShieldCheck, Gift } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import DiyaIllustration from './DiyaIllustration';
import { GoldenMandala } from './MandalaWatermark';
import { MarigoldFlower, AkashKandilLantern } from './ToranGarland';
import { FloatingGoldCoin } from './FloatingGoldCoin';
import { FESTIVE_CONFIG } from '../../config/festiveConfig';

/**
 * Returns current date string 'YYYY-MM-DD' in Asia/Kolkata timezone.
 * Supports window.__DCARD_FESTIVE_DATE_OVERRIDE__ or URL ?festive_date=YYYY-MM-DD for testing.
 */
export function getIndiaDateString(date = new Date()) {
  if (typeof window !== 'undefined') {
    // 1. In-memory test override
    if (window.__DCARD_FESTIVE_DATE_OVERRIDE__) {
      return String(window.__DCARD_FESTIVE_DATE_OVERRIDE__).trim();
    }
    // 2. URL search param override (for automated headless test suites)
    try {
      const params = new URLSearchParams(window.location.search);
      const queryDate = params.get('festive_date');
      if (queryDate && /^\d{4}-\d{2}-\d{2}$/.test(queryDate)) {
        return queryDate;
      }
    } catch (_) {
      // Ignore URL parsing errors
    }
  }

  // Live Asia/Kolkata (IST) production date
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(date);
  } catch (e) {
    // Fallback if timezone formatting fails
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);
    return istDate.toISOString().slice(0, 10);
  }
}

/**
 * FestiveWelcomeModal
 * 
 * Automatically shows:
 * 1. Dhanteras Popup on 6 November 2026 (IST Asia/Kolkata)
 * 2. Diwali Popup on 8 November 2026 (IST Asia/Kolkata)
 * 
 * Rules:
 * - Strictly once per visitor using localStorage keys.
 * - Timezone: Asia/Kolkata.
 * - Never shows Dhanteras popup on Diwali or vice-versa.
 * - Never shows expired popups after event dates.
 * - Fully responsive across 320px to 4K displays.
 * - Non-intrusive, smooth dismiss via button, backdrop, or Escape.
 */
export default function FestiveWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFestival, setActiveFestival] = useState(null); // 'dhanteras' | 'diwali' | null
  const { isHindi } = useLanguage();
  const navigate = useNavigate();

  const config = FESTIVE_CONFIG.festiveWelcomePopups || {
    enabled: true,
    dhanterasDate: '2026-11-06',
    diwaliDate: '2026-11-08',
    storageKeys: {
      dhanteras: 'dcard_festive_seen_dhanteras_2026',
      diwali: 'dcard_festive_seen_diwali_2026',
    },
  };

  const evaluatePopupEligibility = useCallback(() => {
    if (!FESTIVE_CONFIG.isFestiveEnabled || !config.enabled) {
      setIsOpen(false);
      setActiveFestival(null);
      return;
    }

    const todayIST = getIndiaDateString();

    if (todayIST === config.dhanterasDate) {
      try {
        const seen = localStorage.getItem(config.storageKeys.dhanteras);
        if (seen === 'true') {
          setIsOpen(false);
          setActiveFestival(null);
          return;
        }
      } catch (_) {}
      setActiveFestival('dhanteras');
      setIsOpen(true);
      return;
    }

    if (todayIST === config.diwaliDate) {
      try {
        const seen = localStorage.getItem(config.storageKeys.diwali);
        if (seen === 'true') {
          setIsOpen(false);
          setActiveFestival(null);
          return;
        }
      } catch (_) {}
      setActiveFestival('diwali');
      setIsOpen(true);
      return;
    }

    // Any other date: do not show any festive popup
    setIsOpen(false);
    setActiveFestival(null);
  }, [config]);

  useEffect(() => {
    evaluatePopupEligibility();

    // Listen to custom date override events if testing
    const handleOverrideChange = () => evaluatePopupEligibility();
    window.addEventListener('dcard-festive-date-change', handleOverrideChange);
    return () => window.removeEventListener('dcard-festive-date-change', handleOverrideChange);
  }, [evaluatePopupEligibility]);

  const handleClose = useCallback((targetRoute = null) => {
    try {
      if (activeFestival === 'dhanteras') {
        localStorage.setItem(config.storageKeys.dhanteras, 'true');
      } else if (activeFestival === 'diwali') {
        localStorage.setItem(config.storageKeys.diwali, 'true');
      }
    } catch (e) {
      console.warn('Failed to record festive popup seen in localStorage:', e);
    }

    setIsOpen(false);

    if (typeof targetRoute === 'string' && targetRoute) {
      navigate(targetRoute);
    }
  }, [activeFestival, config.storageKeys, navigate]);

  // Handle ESC key dismiss
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen || !activeFestival) return null;

  const isDhanteras = activeFestival === 'dhanteras';
  const isDiwali = activeFestival === 'diwali';

  return (
    <AnimatePresence>
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="festive-modal-title"
        className="fixed inset-0 z-[99990] flex items-center justify-center p-3.5 sm:p-6 overflow-y-auto font-sans"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => handleClose()}
          className="fixed inset-0 bg-[#0B060D]/85 backdrop-blur-md z-0 cursor-pointer"
          aria-hidden="true"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          className={`relative z-10 w-full max-w-lg my-auto rounded-[28px] sm:rounded-[36px] overflow-hidden border shadow-2xl transition-all select-none ${
            isDhanteras
              ? 'bg-gradient-to-br from-[#2D060F] via-[#450A17] to-[#1F0307] border-amber-400/40 shadow-[0_25px_60px_rgba(217,119,6,0.35)]'
              : 'bg-gradient-to-br from-[#290823] via-[#480E30] to-[#1A0318] border-yellow-400/40 shadow-[0_25px_60px_rgba(234,179,8,0.35)]'
          }`}
          style={{ maxHeight: '92vh' }}
        >
          {/* Subtle Ambient Background Halos */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 right-0 w-64 h-64 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Background Sacred Mandala Watermark */}
          <div className="absolute -top-12 -right-12 pointer-events-none opacity-20">
            <GoldenMandala size={300} opacity={0.3} />
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => handleClose()}
            aria-label={isHindi ? "संवाद बंद करें" : "Close festive greeting"}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/60 active:scale-95 text-amber-200 hover:text-white border border-amber-400/30 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Content Container */}
          <div className="relative p-6 sm:p-8 text-center text-white overflow-y-auto max-h-[90vh]">
            
            {/* Header Badge */}
            <div className="flex items-center justify-center gap-1.5 mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-widest border backdrop-blur-md shadow-sm ${
                isDhanteras 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-amber-500/20' 
                  : 'bg-yellow-500/20 text-yellow-200 border-yellow-400/40 shadow-yellow-500/20'
              }`}>
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
                <span>
                  {isDhanteras
                    ? (isHindi ? '✨ शुभ धनतेरस महोत्सव • 6 नवंबर 2026' : '✨ DHANTERAS MAHOTSAV • 6 NOVEMBER 2026')
                    : (isHindi ? '🪔 दीपावली महापर्व • 8 नवंबर 2026' : '🪔 DIWALI CELEBRATION • 8 NOVEMBER 2026')}
                </span>
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              </span>
            </div>

            {/* ════════════════════════════════════════════════════════════
                FESTIVE VISUAL HERO (Dhanteras vs Diwali)
               ════════════════════════════════════════════════════════════ */}
            {isDhanteras && (
              <div className="relative flex items-center justify-center py-2 sm:py-3">
                {/* Floating Gold Coins */}
                <FloatingGoldCoin size={36} top="5%" left="8%" delay={0.2} duration={4.5} tilt={-14} />
                <FloatingGoldCoin size={30} top="25%" right="10%" delay={0.8} duration={5.2} tilt={18} />
                <FloatingGoldCoin size={24} bottom="0%" left="15%" delay={1.4} duration={4} tilt={8} />

                {/* Earthen Diyas Pair with Golden Centerpiece */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 my-1">
                  <div className="transform -scale-x-100">
                    <DiyaIllustration size={44} glow animate />
                  </div>

                  {/* Sacred Kalash / Pot of Prosperity Icon Graphic */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400/25 via-yellow-500/20 to-amber-700/30 border border-amber-300/40 p-2.5 flex items-center justify-center shadow-[0_10px_30px_rgba(245,158,11,0.35)] backdrop-blur-sm">
                    <div className="absolute -top-1.5 -right-1.5">
                      <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
                    </div>
                    <Coins className="w-9 h-9 sm:w-11 sm:h-11 text-amber-300 drop-shadow-[0_4px_12px_rgba(251,191,36,0.6)]" />
                  </div>

                  <div>
                    <DiyaIllustration size={44} glow animate />
                  </div>
                </div>
              </div>
            )}

            {isDiwali && (
              <div className="relative flex items-center justify-center py-2 sm:py-3">
                {/* Floating Lanterns & Marigold Florets */}
                <div className="absolute top-0 left-6 pointer-events-none">
                  <AkashKandilLantern size={38} />
                </div>
                <div className="absolute top-0 right-6 pointer-events-none">
                  <AkashKandilLantern size={38} />
                </div>

                {/* Central Rangoli Pattern with Diya */}
                <div className="relative flex items-center justify-center">
                  {/* Subtle Circular Rangoli Pattern */}
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-2 border-dashed border-amber-400/40 flex items-center justify-center bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-yellow-500/10 shadow-[0_0_35px_rgba(234,179,8,0.3)]">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-amber-300/40 flex items-center justify-center">
                      {/* Earthen Clay Diya Resting at Rangoli Center */}
                      <DiyaIllustration size={56} glow animate />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════════════════════════
                WARM GREETING HEADLINE & BODY TEXT
               ════════════════════════════════════════════════════════════ */}
            <div className="mt-3 space-y-2">
              <h2 
                id="festive-modal-title"
                className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 drop-shadow-sm"
              >
                {isDhanteras
                  ? (isHindi ? 'शुभ धनतेरस!' : 'Happy Dhanteras!')
                  : (isHindi ? 'दीपावली की हार्दिक शुभकामनाएँ!' : 'Wishing You a Happy Diwali!')}
              </h2>

              <p className="text-xs sm:text-sm font-semibold text-amber-200/90 leading-snug">
                {isDhanteras
                  ? (isHindi ? 'सुख, शांति और वित्तीय संपन्नता का महापर्व' : 'Auspicious Beginnings & Enduring Prosperity')
                  : (isHindi ? 'दीपों का पावन उत्सव, समृद्धि का उजियारा' : 'May the Festival of Lights Illuminate Your Financial Journey')}
              </p>

              <p className="text-xs sm:text-sm text-slate-200/85 leading-relaxed max-w-md mx-auto pt-1 font-normal">
                {isDhanteras
                  ? (isHindi
                      ? 'माँ लक्ष्मी और भगवान धन्वंतरि की कृपा से आपके घर-परिवार में उत्तम स्वास्थ्य, अटूट शांति और वित्तीय समृद्धि का वास हो। D.CARD के साथ करें समझदारी भरे बैंकिंग निर्णय।'
                      : 'May this divine festival of prosperity illuminate your life with good health, enduring abundance, and enlightened financial choices. Celebrate smarter banking with D.CARD.')
                  : (isHindi
                      ? 'दीपों का यह पावन महापर्व आपके और आपके परिवार के जीवन में सुख, शांति, नई उमंग और वित्तीय स्पष्टता का उजाला फैलाए। D.CARD परिवार की ओर से सप्रेम शुभकामनाएँ।'
                      : 'May the festival of lights brighten your path with boundless joy, peace, and financial clarity. Wishing you and your family abundant happiness and prosperous banking.')}
              </p>
            </div>

            {/* ════════════════════════════════════════════════════════════
                TRANSPARENT VALUE PILLARS (Festive Benefits)
               ════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-5 text-left">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-amber-300/20 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs mb-0.5">
                  <Coins className="w-3.5 h-3.5 shrink-0" />
                  <span>{isHindi ? 'वित्तीय स्पष्टता' : 'Financial Clarity'}</span>
                </div>
                <p className="text-[11px] text-slate-300/80 leading-tight">
                  {isHindi ? '130+ कार्ड्स व खातों की 100% निष्पक्ष तुलना' : '100% unbiased review across 130+ cards & accounts'}
                </p>
              </div>

              <div className="p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-amber-300/20 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-yellow-300 font-bold text-xs mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>{isHindi ? 'शून्य छिपे शुल्क' : 'Zero Hidden Fees'}</span>
                </div>
                <p className="text-[11px] text-slate-300/80 leading-tight">
                  {isHindi ? 'सत्यापित नियम, पारदर्शी सीमाएं और ऑफर्स' : 'Verified tariffs, transparent limits & festive perks'}
                </p>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════
                CALL TO ACTION & CLOSE BUTTONS
               ════════════════════════════════════════════════════════════ */}
            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                onClick={() => handleClose('/cards')}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-[0_10px_25px_rgba(245,158,11,0.4)] hover:shadow-[0_12px_30px_rgba(245,158,11,0.55)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 min-h-[44px]"
              >
                <span>
                  {isDhanteras
                    ? (isHindi ? 'धनतेरस बैंकिंग डील्स देखें' : 'Explore Festive Banking Deals')
                    : (isHindi ? 'दीवाली स्पेशल कार्ड्स देखें' : 'Discover Diwali Offers')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleClose()}
                className="w-full py-2 px-4 rounded-xl text-amber-200/80 hover:text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer min-h-[36px]"
              >
                {isHindi ? 'वेबसाइट पर जारी रखें' : 'Continue to D.CARD'}
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

