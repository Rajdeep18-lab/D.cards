import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useFestivalTheme } from '../../hooks/useFestivalTheme';
import DiyaIllustration from './DiyaIllustration';
import { GoldenMandala, FestiveCornerRangoli } from './MandalaWatermark';
import FloatingGoldCoin from './FloatingGoldCoin';
import {
  HoliSplashMotif,
  ChristmasSnowflakeMotif,
  EidCrescentMotif,
  GurpurabHaloMotif,
  LohriBonfireMotif,
  IndependenceChakraMotif,
  JanmashtamiPeacockMotif,
  NavratriGarbaMotif,
  DussehraArrowMotif,
  NewYearSparkleMotif,
  GaneshLotusMotif,
  RakhiThreadMotif
} from './FestivalMotifWatermarks';

/**
 * FestivalAmbientAtmosphere
 * 
 * Replaces hardcoded Diwali atmosphere with an automatic, multi-festival ambient engine:
 * - If NORMAL MODE: returns null (100% clean D.CARD fintech design, zero leftover elements).
 * - If FESTIVAL MODE: renders festival-specific ambient radial glow, delicate watermarks, and subtle accents.
 * - Strictly pointer-events-none & respects prefers-reduced-motion.
 */
export default function FestivalAmbientAtmosphere() {
  const { isFestivalMode, activeFestival, theme } = useFestivalTheme();
  const shouldReduceMotion = useReducedMotion();

  // If Normal Mode or disabled, render absolutely nothing
  if (!isFestivalMode || !activeFestival) {
    return null;
  }

  const festivalId = activeFestival.id;

  // Custom motif selector
  const renderMotif = () => {
    switch (festivalId) {
      case 'diwali':
        return (
          <>
            <GoldenMandala size={520} className="absolute -top-36 left-1/2 -translate-x-1/2" opacity={0.14} />
            <GoldenMandala size={440} className="absolute -bottom-32 right-[10%]" opacity={0.1} />
            <div className="absolute -bottom-16 -left-10 z-10">
              <FestiveCornerRangoli size={220} />
            </div>
            <motion.div
              className="absolute bottom-5 left-8 z-20"
              animate={!shouldReduceMotion ? { y: [0, -3, 0] } : {}}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <DiyaIllustration size={42} glow={true} animate={true} />
            </motion.div>
            {/* Minimal floating gold coin accent */}
            <FloatingGoldCoin size={26} top="12%" left="4%" tilt={12} delay={0} duration={5.5} />
            <FloatingGoldCoin size={22} top="52%" right="4%" tilt={-12} delay={1} duration={6} />
          </>
        );

      case 'holi':
        return (
          <>
            <HoliSplashMotif className="absolute -top-20 -left-16" opacity={0.16} />
            <HoliSplashMotif className="absolute -bottom-24 -right-16 scale-110" opacity={0.14} />
          </>
        );

      case 'christmas':
        return (
          <>
            <ChristmasSnowflakeMotif className="absolute -top-16 right-10" opacity={0.16} />
            <ChristmasSnowflakeMotif className="absolute bottom-6 left-8 scale-75" opacity={0.12} />
          </>
        );

      case 'eid':
        return (
          <>
            <EidCrescentMotif className="absolute -top-16 right-12" opacity={0.16} />
            <EidCrescentMotif className="absolute bottom-8 left-10 scale-75" opacity={0.12} />
          </>
        );

      case 'gurpurab':
        return (
          <>
            <GurpurabHaloMotif className="absolute -top-20 left-1/2 -translate-x-1/2" opacity={0.16} />
            <GurpurabHaloMotif className="absolute bottom-4 right-10 scale-90" opacity={0.12} />
          </>
        );

      case 'lohri':
        return (
          <>
            <LohriBonfireMotif className="absolute -bottom-12 left-10" opacity={0.18} />
            <LohriBonfireMotif className="absolute -top-10 right-16 scale-90" opacity={0.12} />
          </>
        );

      case 'independence_day':
      case 'republic_day':
        return (
          <>
            <IndependenceChakraMotif className="absolute -top-20 left-1/2 -translate-x-1/2" opacity={0.15} />
            <IndependenceChakraMotif className="absolute -bottom-16 right-10 scale-90" opacity={0.12} />
          </>
        );

      case 'janmashtami':
        return (
          <>
            <JanmashtamiPeacockMotif className="absolute -top-14 right-10" opacity={0.18} />
            <JanmashtamiPeacockMotif className="absolute bottom-6 left-12 scale-80" opacity={0.14} />
          </>
        );

      case 'navratri':
        return (
          <>
            <NavratriGarbaMotif className="absolute -top-20 left-1/2 -translate-x-1/2" opacity={0.16} />
            <NavratriGarbaMotif className="absolute -bottom-14 right-12 scale-85" opacity={0.14} />
          </>
        );

      case 'dussehra':
        return (
          <>
            <DussehraArrowMotif className="absolute -top-12 right-12" opacity={0.18} />
            <DussehraArrowMotif className="absolute bottom-10 left-10 scale-85" opacity={0.14} />
          </>
        );

      case 'new_year':
        return (
          <>
            <NewYearSparkleMotif className="absolute -top-10 left-16" opacity={0.2} />
            <NewYearSparkleMotif className="absolute bottom-8 right-16 scale-110" opacity={0.18} />
          </>
        );

      case 'ganesh_chaturthi':
        return (
          <>
            <GaneshLotusMotif className="absolute -top-16 right-12" opacity={0.16} />
            <GaneshLotusMotif className="absolute bottom-8 left-10 scale-85" opacity={0.12} />
          </>
        );

      case 'raksha_bandhan':
        return (
          <>
            <RakhiThreadMotif className="absolute -top-16 left-1/2 -translate-x-1/2" opacity={0.18} />
            <RakhiThreadMotif className="absolute bottom-6 right-12 scale-80" opacity={0.14} />
          </>
        );

      default:
        // Default subtle mandala for any other festive occasion
        return (
          <GoldenMandala size={480} className="absolute -top-28 left-1/2 -translate-x-1/2" opacity={0.12} />
        );
    }
  };

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10 transition-opacity duration-700"
      aria-hidden="true"
    >
      {/* ── 1. AMBIENT RADIAL GLOW ── */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[450px] rounded-full blur-3xl pointer-events-none"
        style={{ background: theme?.ambientGlow || 'radial-gradient(ellipse_at_center, rgba(245,158,11,0.12) 0%, transparent 70%)' }}
      />
      <div 
        className="absolute -bottom-24 right-1/4 w-[480px] h-[320px] rounded-full blur-3xl pointer-events-none opacity-60"
        style={{ background: theme?.ambientGlow || 'radial-gradient(ellipse_at_center, rgba(245,158,11,0.08) 0%, transparent 70%)' }}
      />

      {/* ── 2. SUBTLE BOTTOM ACCENT BORDER ── */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[1.5px] pointer-events-none"
        style={{ 
          background: `linear-gradient(to right, transparent, ${theme?.accentColor || '#D4AF37'}40, transparent)` 
        }}
      />

      {/* ── 3. CULTURALLY CURATED MOTIF WATERMARKS ── */}
      {renderMotif()}
    </div>
  );
}
