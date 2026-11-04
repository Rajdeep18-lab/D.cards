import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import DiyaIllustration from './DiyaIllustration';
import { GoldenMandala, FestiveCornerRangoli } from './MandalaWatermark';
import FloatingGoldCoin from './FloatingGoldCoin';
import { FESTIVE_CONFIG } from '../../config/festiveConfig';

/**
 * HeroFestiveAtmosphere
 * Comprehensive Diwali & Dhanteras Festive UI Atmosphere:
 * - Soft cream / warm golden ambient lighting.
 * - Subtle low-opacity golden mandala and rangoli watermarks.
 * - Antigravity floating 3D gold coins with soft luminous drop shadows.
 * - Glowing traditional clay diyas with soft flame flickers and warm drop shadows.
 * - Golden star sparkles and ambient warm rays.
 * - Strictly pointer-events-none & respects prefers-reduced-motion.
 */
export default function HeroFestiveAtmosphere() {
  const shouldReduceMotion = useReducedMotion();

  if (!FESTIVE_CONFIG.isFestiveEnabled || !FESTIVE_CONFIG.festiveAnimationsEnabled) {
    return null;
  }

  // Pre-calculated gentle golden sparkles in safe background positions
  const sparkles = useMemo(() => [
    { id: 1, top: '10%', left: '7%', size: 3, delay: 0, duration: 4 },
    { id: 2, top: '18%', left: '48%', size: 2.5, delay: 1.2, duration: 4.5 },
    { id: 3, top: '6%', left: '76%', size: 3.5, delay: 0.6, duration: 3.8 },
    { id: 4, top: '34%', left: '3%', size: 2, delay: 2.1, duration: 5 },
    { id: 5, top: '75%', left: '4%', size: 3, delay: 1.5, duration: 4.2 },
    { id: 6, top: '88%', left: '42%', size: 2.5, delay: 2.8, duration: 4.8 },
    { id: 7, top: '82%', left: '92%', size: 3, delay: 0.9, duration: 3.9 },
    { id: 8, top: '14%', left: '94%', size: 2.5, delay: 2.3, duration: 4.4 },
    { id: 9, top: '62%', left: '96%', size: 3, delay: 1.8, duration: 4.1 },
    { id: 10, top: '5%', left: '32%', size: 2, delay: 3.0, duration: 5.2 }
  ], []);

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10"
      aria-hidden="true"
    >
      {/* ── 1. WARM GOLDEN AMBIENT LIGHTING (Cream/off-white lighting) ── */}
      {/* Center Top Golden Radial Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.18)_0%,rgba(245,158,11,0.06)_50%,transparent_75%)] blur-2xl pointer-events-none" />
      {/* Bottom Center Golden Radiant Glow */}
      <div className="absolute -bottom-24 right-1/4 w-[500px] h-[350px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.14)_0%,rgba(245,158,11,0.04)_55%,transparent_75%)] blur-3xl pointer-events-none" />
      {/* Bottom Subtle Golden Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

      {/* ── 2. SUBTLE GOLDEN MANDALA & RANGOLI WATERMARKS ── */}
      {/* Top Center Golden Mandala */}
      <GoldenMandala 
        size={540} 
        className="absolute -top-40 left-1/2 -translate-x-1/2" 
        opacity={0.15} 
      />
      {/* Bottom Right Golden Mandala */}
      <GoldenMandala 
        size={460} 
        className="absolute -bottom-36 right-[12%]" 
        opacity={0.12} 
      />
      {/* Bottom-Left Colorful Indian Rangoli */}
      <div className="absolute -bottom-20 -left-12 z-10">
        <FestiveCornerRangoli size={250} />
      </div>

      {/* ── 3. ANTIGRAVITY FLOATING 3D GOLD COINS (Dhanteras Prosperity Theme) ── */}
      {/* Top-Left Cluster (Near Discovery Badge) */}
      <FloatingGoldCoin size={32} top="9%" left="3%" tilt={14} delay={0} duration={5.5} />
      <FloatingGoldCoin size={22} top="18%" left="6%" tilt={-12} delay={0.9} duration={6.2} />
      <FloatingGoldCoin size={20} top="25%" left="2%" tilt={8} delay={1.6} duration={5.8} />

      {/* Mid Left (Near Feature Cards) */}
      <FloatingGoldCoin size={26} top="48%" left="48%" tilt={-15} delay={0.5} duration={5.2} />
      <FloatingGoldCoin size={21} top="58%" left="48%" tilt={12} delay={1.3} duration={6.0} />

      {/* Right Cluster (Around Cards & Illustration) */}
      <FloatingGoldCoin size={28} top="44%" right="2.5%" tilt={-14} delay={0.7} duration={5.6} />
      <FloatingGoldCoin size={22} top="54%" right="3%" tilt={16} delay={1.9} duration={6.4} />
      <FloatingGoldCoin size={25} top="70%" right="6%" tilt={-8} delay={1.1} duration={5.0} />

      {/* ── 4. GLOWING TRADITIONAL CLAY DIYAS WITH LUMINOUS DROP SHADOWS ── */}
      {/* Diya 1: Atop Bottom-Left Rangoli */}
      <motion.div
        className="absolute bottom-5 left-8 z-20"
        animate={!shouldReduceMotion ? { y: [0, -3, 0] } : {}}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <DiyaIllustration size={44} glow={true} animate={true} />
      </motion.div>

      {/* Diya 2: Below Main CTAs (Far Left Edge) */}
      <motion.div
        className="hidden md:block absolute bottom-[27%] -left-3 z-10"
        animate={!shouldReduceMotion ? { y: [0, -4, 0] } : {}}
        transition={{ duration: 5.2, repeat: Infinity, delay: 0.8, ease: 'easeInOut' }}
      >
        <DiyaIllustration size={38} glow={true} animate={true} />
      </motion.div>

      {/* Diya 3: Under the Feature Cards (Center Left) */}
      <motion.div
        className="hidden lg:block absolute bottom-[24%] left-[49%] -translate-x-1/2 z-20"
        animate={!shouldReduceMotion ? { y: [0, -3, 0] } : {}}
        transition={{ duration: 4.8, repeat: Infinity, delay: 1.4, ease: 'easeInOut' }}
      >
        <DiyaIllustration size={34} glow={true} animate={true} />
      </motion.div>

      {/* Diya 4: Under the Feature Cards (Center Right) */}
      <motion.div
        className="hidden lg:block absolute bottom-[24%] right-[8%] z-20"
        animate={!shouldReduceMotion ? { y: [0, -3, 0] } : {}}
        transition={{ duration: 5.0, repeat: Infinity, delay: 0.4, ease: 'easeInOut' }}
      >
        <DiyaIllustration size={34} glow={true} animate={true} />
      </motion.div>

      {/* Diya 5: Bottom Center Diya */}
      <motion.div
        className="hidden sm:block absolute bottom-3 left-[51%] -translate-x-1/2 z-10"
        animate={!shouldReduceMotion ? { y: [0, -3, 0] } : {}}
        transition={{ duration: 5.5, repeat: Infinity, delay: 1.8, ease: 'easeInOut' }}
      >
        <DiyaIllustration size={36} glow={true} animate={true} />
      </motion.div>

      {/* Diya 6: Bottom Right Corner Diya */}
      <motion.div
        className="hidden md:block absolute bottom-3 right-5 sm:right-10 z-10"
        animate={!shouldReduceMotion ? { y: [0, -4, 0] } : {}}
        transition={{ duration: 4.6, repeat: Infinity, delay: 1.0, ease: 'easeInOut' }}
      >
        <DiyaIllustration size={40} glow={true} animate={true} />
      </motion.div>

      {/* ── 5. ELEGANT GOLDEN SPARKLES ── */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0">
          {sparkles.map((sp) => (
            <motion.div
              key={sp.id}
              className="absolute"
              style={{
                top: sp.top,
                left: sp.left,
                width: sp.size * 2,
                height: sp.size * 2
              }}
              animate={{
                opacity: [0.2, 0.8, 0.25],
                scale: [0.8, 1.25, 0.85]
              }}
              transition={{
                duration: sp.duration,
                repeat: Infinity,
                delay: sp.delay,
                ease: 'easeInOut'
              }}
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="#F59E0B" 
                className="w-full h-full drop-shadow-[0_0_6px_rgba(245,158,11,0.6)] opacity-85"
              >
                <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
              </svg>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
