import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import DiyaIllustration from './DiyaIllustration';
import { FESTIVE_CONFIG } from '../../config/festiveConfig';

/**
 * Festive Background Effects
 * - Ambient warm golden lighting
 * - Floating diyas on safe margins
 * - Subtle drifting golden particles (lightweight CSS/SVG)
 * - Occasional subtle fireworks bursts
 * - Strictly pointer-events-none and non-intrusive
 */
export default function FestiveBackgroundEffects({ showDiyas = true, showParticles = true, showFireworks = true }) {
  const shouldReduceMotion = useReducedMotion();

  // If animations are globally disabled in config, return null
  if (!FESTIVE_CONFIG.festiveAnimationsEnabled || !FESTIVE_CONFIG.isFestiveEnabled) {
    return null;
  }

  // Pre-calculated golden particles (16 lightweight points with random drifts)
  const particles = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: `${(i * 6.25 + 3.125) % 100}%`,
      y: `${(i * 19.3 + 15) % 85}%`,
      size: (i % 3) + 2, // 2px to 4px
      duration: 6 + (i % 5) * 1.5,
      delay: (i * 0.4) % 4,
      opacity: 0.25 + (i % 4) * 0.08
    }));
  }, []);

  // Pre-calculated occasional fireworks bursts (4 distinct burst locations)
  const fireworkBursts = useMemo(() => [
    { id: 'fw-1', left: '15%', top: '22%', color: '#F59E0B', delay: 1, duration: 8 },
    { id: 'fw-2', left: '82%', top: '28%', color: '#D97706', delay: 4.5, duration: 8.5 },
    { id: 'fw-3', left: '28%', top: '48%', color: '#FBBF24', delay: 2.8, duration: 9 },
    { id: 'fw-4', left: '72%', top: '65%', color: '#F59E0B', delay: 6.2, duration: 7.8 }
  ], []);

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0"
      aria-hidden="true"
    >
      {/* ── 1. AMBIENT WARM GOLDEN RADIAL GLOWS ── */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/10 via-yellow-500/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute top-2/3 -right-32 w-80 h-80 bg-gradient-to-tl from-yellow-500/10 to-transparent rounded-full blur-3xl" />

      {/* ── 2. SUBTLE GOLDEN PARTICLES (Drifting dust specks) ── */}
      {showParticles && !shouldReduceMotion && (
        <div className="absolute inset-0">
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full bg-gradient-to-r from-amber-300 to-yellow-200"
              style={{
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                boxShadow: `0 0 ${p.size * 2}px rgba(245, 158, 11, 0.6)`,
                opacity: p.opacity
              }}
              animate={{
                y: [0, -18, 0],
                x: [0, (p.id % 2 === 0 ? 8 : -8), 0],
                opacity: [p.opacity, p.opacity * 1.5, p.opacity * 0.7, p.opacity]
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: 'easeInOut'
              }}
            />
          ))}
        </div>
      )}

      {/* ── 3. OCCASIONAL SUBTLE FIREWORKS (Gentle golden radial spark bursts) ── */}
      {showFireworks && !shouldReduceMotion && (
        <div className="absolute inset-0">
          {fireworkBursts.map((fw) => (
            <motion.div
              key={fw.id}
              className="absolute w-28 h-28 -translate-x-1/2 -translate-y-1/2"
              style={{ left: fw.left, top: fw.top }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0, 0.75, 0.85, 0, 0],
                scale: [0.3, 0.3, 1, 1.25, 1.35, 0.3]
              }}
              transition={{
                duration: fw.duration,
                repeat: Infinity,
                delay: fw.delay,
                ease: 'easeOut',
                times: [0, 0.45, 0.5, 0.65, 0.75, 1]
              }}
            >
              {/* Central flash */}
              <div 
                className="absolute inset-0 m-auto w-3 h-3 rounded-full blur-xs"
                style={{ backgroundColor: fw.color }}
              />

              {/* 8 Radial Spark Rays */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, rayIdx) => (
                <div
                  key={rayIdx}
                  className="absolute top-1/2 left-1/2 w-8 h-[1.5px] -translate-y-1/2 origin-left rounded-full"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    background: `linear-gradient(90deg, ${fw.color}, rgba(254, 240, 138, 0.8), transparent)`
                  }}
                />
              ))}
            </motion.div>
          ))}
        </div>
      )}

      {/* ── 4. FLOATING CORNER DIYAS (Placed in safe margins) ── */}
      {showDiyas && (
        <>
          {/* Top-Right Floating Diya */}
          <motion.div
            className="hidden sm:block absolute top-6 right-6 lg:right-12 z-10"
            animate={
              !shouldReduceMotion
                ? { y: [0, -8, 0], rotate: [0, 1, 0] }
                : {}
            }
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <DiyaIllustration size={44} glow={true} />
          </motion.div>

          {/* Top-Left Floating Diya */}
          <motion.div
            className="hidden sm:block absolute top-10 left-6 lg:left-12 z-10"
            animate={
              !shouldReduceMotion
                ? { y: [0, -7, 0], rotate: [0, -1, 0] }
                : {}
            }
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: 1.2,
              ease: "easeInOut"
            }}
          >
            <DiyaIllustration size={40} glow={true} />
          </motion.div>
        </>
      )}
    </div>
  );
}

