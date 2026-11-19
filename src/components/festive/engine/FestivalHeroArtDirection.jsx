import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useFestivalTheme } from '../../../hooks/useFestivalTheme';
import DiyaIllustration from '../DiyaIllustration';
import FloatingGoldCoin from '../FloatingGoldCoin';
import { AkashKandilLantern } from '../ToranGarland';

/**
 * FestivalHeroArtDirection
 * 
 * Provides bespoke, art-directed staging for the Hero Section's product cards:
 * - Transforms the visual presentation according to each festival's unique cultural signature.
 * - In Normal Mode: Renders clean, uncluttered fintech styling.
 * - In Festival Mode: Applies rich, culturally authentic decorative frameworks.
 * - Banking data, limits, fees, and callouts remain 100% legible and prioritized.
 */
export default function FestivalHeroArtDirection({ cardType = 'debit' }) {
  const { isFestivalMode, activeFestival, theme } = useFestivalTheme();
  const shouldReduceMotion = useReducedMotion();

  if (!isFestivalMode || !activeFestival) return null;

  const festivalId = activeFestival.id;

  // ── 1. DIWALI STAGING ──
  if (festivalId === 'diwali') {
    return (
      <>
        {cardType === 'debit' ? (
          <>
            {/* Glowing Earthen Diya at bottom-left */}
            <div className="absolute -bottom-3.5 -left-3 z-30 pointer-events-none drop-shadow-[0_4px_16px_rgba(245,158,11,0.65)]">
              <DiyaIllustration size={38} glow={true} animate={!shouldReduceMotion} />
            </div>
            {/* Overhead swaying Kashmiri Akash Kandil lantern */}
            <motion.div 
              className="hidden sm:block absolute -top-8 -left-4 z-20 pointer-events-none"
              animate={!shouldReduceMotion ? { rotate: [-2, 2, -2], y: [0, -3, 0] } : {}}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <AkashKandilLantern size={36} />
            </motion.div>
            {/* Floating Gold Coin Accent */}
            <FloatingGoldCoin size={22} top="8%" right="4%" tilt={14} delay={0.4} duration={5.5} />
          </>
        ) : (
          <>
            {/* Glowing Diya at bottom-right of savings card */}
            <div className="absolute -bottom-3.5 -right-3 z-30 pointer-events-none drop-shadow-[0_4px_16px_rgba(245,158,11,0.65)]">
              <DiyaIllustration size={38} glow={true} animate={!shouldReduceMotion} />
            </div>
            {/* Floating Gold Coin Accent */}
            <FloatingGoldCoin size={24} top="12%" left="4%" tilt={-12} delay={1.1} duration={6} />
          </>
        )}
      </>
    );
  }

  // ── 2. HOLI STAGING ──
  if (festivalId === 'holi') {
    return (
      <>
        {/* Multitone Dynamic Color Mist around card rim */}
        <div 
          className="absolute -inset-1 rounded-3xl opacity-40 blur-md pointer-events-none z-0"
          style={{
            background: 'linear-gradient(135deg, #E11D48, #0D9488, #F59E0B, #159B72)'
          }}
        />
        {cardType === 'debit' ? (
          <div className="absolute -bottom-3 -left-3 z-30 pointer-events-none select-none">
            <span className="text-2xl drop-shadow-md">🎨</span>
          </div>
        ) : (
          <div className="absolute -bottom-3 -right-3 z-30 pointer-events-none select-none">
            <span className="text-2xl drop-shadow-md">✨</span>
          </div>
        )}
      </>
    );
  }

  // ── 3. CHRISTMAS STAGING ──
  if (festivalId === 'christmas') {
    return (
      <>
        {/* Frosted Snow Ridge along top edge */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-white/90 via-emerald-50/90 to-white/90 rounded-t-3xl shadow-[0_2px_8px_rgba(255,255,255,0.7)] pointer-events-none z-20" />
        
        {/* Pine Sprig & Holly Berry Corner */}
        {cardType === 'debit' ? (
          <div className="absolute -top-3 -left-2 z-30 pointer-events-none select-none">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 14 C10 8 20 8 26 4 C24 14 18 20 14 26 C10 20 8 16 4 14 Z" fill="#047857" />
              <circle cx="16" cy="16" r="3.5" fill="#DC2626" />
              <circle cx="21" cy="14" r="3" fill="#EF4444" />
              <circle cx="17" cy="21" r="3" fill="#B91C1C" />
            </svg>
          </div>
        ) : (
          <div className="absolute -top-3 -right-2 z-30 pointer-events-none select-none">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 14 C24 8 14 8 8 4 C10 14 16 20 20 26 C24 20 26 16 30 14 Z" fill="#047857" />
              <circle cx="18" cy="16" r="3.5" fill="#DC2626" />
              <circle cx="13" cy="14" r="3" fill="#EF4444" />
              <circle cx="17" cy="21" r="3" fill="#B91C1C" />
            </svg>
          </div>
        )}
      </>
    );
  }

  // ── 4. EID STAGING ──
  if (festivalId === 'eid') {
    return (
      <>
        {/* Laser-cut Golden Islamic 8-Pointed Star Corner Bracket */}
        {cardType === 'debit' ? (
          <div className="absolute -bottom-3 -left-2 z-30 pointer-events-none select-none">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="8" width="16" height="16" fill="#D97706" />
              <rect x="8" y="8" width="16" height="16" transform="rotate(45 16 16)" fill="#F59E0B" />
              <circle cx="16" cy="16" r="4.5" fill="#065F46" />
            </svg>
          </div>
        ) : (
          <div className="absolute -top-3 -right-2 z-30 pointer-events-none select-none">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 4 C10 4 4 10 4 18 C4 24 8 28 14 28 C10 26 8 20 8 16 C8 10 12 6 18 6 C17 5 16.5 4 16 4 Z" fill="#F59E0B" />
              <circle cx="20" cy="10" r="2.5" fill="#FDE047" />
            </svg>
          </div>
        )}
      </>
    );
  }

  // ── 5. INDEPENDENCE DAY & REPUBLIC DAY STAGING ──
  if (festivalId === 'independence_day' || festivalId === 'republic_day') {
    return (
      <>
        {/* Elegant Silk Tricolor Ribbon along top edge */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex rounded-t-3xl overflow-hidden pointer-events-none z-20">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        {cardType === 'debit' ? (
          <div className="absolute -bottom-3 -left-2.5 z-30 pointer-events-none select-none">
            {/* 24-Spoke Ashoka Chakra Badge */}
            <svg width="30" height="30" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="30" cy="30" r="26" fill="#000080" />
              <circle cx="30" cy="30" r="22" stroke="white" strokeWidth="2" />
              <circle cx="30" cy="30" r="5" fill="white" />
              {Array.from({ length: 12 }).map((_, i) => (
                <line
                  key={i}
                  x1="30"
                  y1="8"
                  x2="30"
                  y2="52"
                  stroke="white"
                  strokeWidth="1.2"
                  transform={`rotate(${i * 15} 30 30)`}
                />
              ))}
            </svg>
          </div>
        ) : null}
      </>
    );
  }

  // ── 6. GURPURAB STAGING ──
  if (festivalId === 'gurpurab') {
    return (
      <>
        {/* Sacred Golden Radiant Halo */}
        <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-amber-400/20 via-yellow-400/30 to-amber-500/20 blur-md pointer-events-none z-0" />
        {cardType === 'debit' && (
          <div className="absolute -bottom-3 -left-2 z-30 pointer-events-none select-none">
            <span className="text-2xl font-serif text-amber-300 drop-shadow-[0_2px_8px_rgba(245,158,11,0.8)]">ੴ</span>
          </div>
        )}
      </>
    );
  }

  // ── 7. NAVRATRI STAGING ──
  if (festivalId === 'navratri') {
    return (
      <>
        {cardType === 'debit' ? (
          <div className="absolute -bottom-3 -left-2 z-30 pointer-events-none select-none">
            {/* Crossed Ceremonial Dandiya Sticks */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="6" y1="30" x2="30" y2="6" stroke="#E11D48" strokeWidth="3" strokeLinecap="round" />
              <line x1="6" y1="30" x2="30" y2="6" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="6" y1="6" x2="30" y2="30" stroke="#0D9488" strokeWidth="3" strokeLinecap="round" />
              <line x1="6" y1="6" x2="30" y2="30" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>
          </div>
        ) : null}
      </>
    );
  }

  // Default fallback
  return null;
}
