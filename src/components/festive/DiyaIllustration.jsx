import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Premium Diya Illustration
 * Luxurious handcrafted SVG with animated flickering flame and soft golden glow.
 * Non-intrusive and pointer-events-none.
 */
export default function DiyaIllustration({ 
  size = 48, 
  glow = true, 
  animate = true, 
  className = "" 
}) {
  const shouldReduceMotion = useReducedMotion();
  const width = size;
  const height = Math.round(size * 0.95);

  return (
    <div 
      className={`relative inline-block pointer-events-none select-none ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    >
      {/* Ambient Radial Golden Glow */}
      {glow && (
        <div 
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-t from-amber-500/25 via-yellow-400/20 to-transparent blur-md pointer-events-none"
        />
      )}

      <svg
        viewBox="0 0 100 95"
        width={width}
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(234,179,8,0.35)]"
      >
        <defs>
          {/* Flame Gradients */}
          <radialGradient id="flameInner" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#FEF08A" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </radialGradient>

          <linearGradient id="flameOuter" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#DC2626" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#F97316" />
            <stop offset="80%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0.9" />
          </linearGradient>

          {/* Diya Clay Base Gradient */}
          <linearGradient id="diyaClay" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="35%" stopColor="#D97706" />
            <stop offset="70%" stopColor="#92400E" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Brass / Gold Rim Gradient */}
          <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#CA8A04" />
            <stop offset="25%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="75%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#A16207" />
          </linearGradient>

          <radialGradient id="wickGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── 1. FLICKERING FLAME ── */}
        <g className="origin-bottom">
          {/* Outer Flame with gentle flicker */}
          <motion.path
            d="M50 10 C53 22, 63 32, 60 44 C57 54, 43 54, 40 44 C37 32, 47 22, 50 10 Z"
            fill="url(#flameOuter)"
            animate={
              animate && !shouldReduceMotion
                ? {
                    scaleY: [1, 1.08, 0.96, 1.05, 1],
                    scaleX: [1, 0.94, 1.04, 0.97, 1],
                    rotate: [0, -1.8, 1.5, -0.8, 0],
                  }
                : {}
            }
            transition={{
              repeat: Infinity,
              duration: 1.8,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "50px 52px" }}
          />

          {/* Inner Core Flame */}
          <motion.path
            d="M50 20 C52 28, 57 35, 55 43 C53 49, 47 49, 45 43 C43 35, 48 28, 50 20 Z"
            fill="url(#flameInner)"
            animate={
              animate && !shouldReduceMotion
                ? {
                    scaleY: [1, 1.1, 0.94, 1.06, 1],
                    scaleX: [1, 0.92, 1.05, 0.95, 1],
                    opacity: [0.95, 1, 0.88, 1, 0.95]
                  }
                : {}
            }
            transition={{
              repeat: Infinity,
              duration: 1.4,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "50px 50px" }}
          />

          {/* Wick Tip */}
          <ellipse cx="50" cy="49" rx="2" ry="3.5" fill="#1F2937" />
        </g>

        {/* ── 2. DIYA CLAY BODY ── */}
        {/* Base shadow ellipse */}
        <ellipse cx="50" cy="85" rx="34" ry="7" fill="#000000" fillOpacity="0.25" />

        {/* Traditional Deep Clay Base */}
        <path
          d="M14 56 C14 74, 30 84, 50 84 C70 84, 86 74, 86 56 C74 61, 62 63, 50 63 C38 63, 26 61, 14 56 Z"
          fill="url(#diyaClay)"
          stroke="#92400E"
          strokeWidth="1.2"
        />

        {/* Diya Golden Rim / Lip */}
        <path
          d="M14 56 C26 62, 74 62, 86 56 C74 51, 26 51, 14 56 Z"
          fill="url(#goldRim)"
          stroke="#78350F"
          strokeWidth="0.8"
        />

        {/* Traditional Embossed Dots on Rim */}
        <circle cx="28" cy="58" r="1.4" fill="#FEF08A" />
        <circle cx="39" cy="60" r="1.4" fill="#FEF08A" />
        <circle cx="50" cy="60.5" r="1.6" fill="#FEF08A" />
        <circle cx="61" cy="60" r="1.4" fill="#FEF08A" />
        <circle cx="72" cy="58" r="1.4" fill="#FEF08A" />

        {/* Subtle center golden reflection */}
        <path
          d="M32 70 C42 75, 58 75, 68 70 C62 76, 38 76, 32 70 Z"
          fill="#F59E0B"
          fillOpacity="0.35"
        />
      </svg>
    </div>
  );
}

