import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * FloatingGoldCoin
 * Authentic Dhanteras 3D Gold Coin with antigravity levitation.
 * Features:
 * - Realistic metallic bevels & coin milled rim.
 * - Embossed geometric sacred coin center (prosperity/rupee motif).
 * - Soft luminous golden drop shadow: rgba(255, 215, 0, 0.25).
 * - Smooth floating animation with configurable duration, delay, and amplitude.
 */
export const FloatingGoldCoin = memo(({
  size = 28,
  top = '10%',
  left,
  right,
  bottom,
  delay = 0,
  duration = 5,
  tilt = 12,
  className = ''
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`absolute pointer-events-none select-none z-10 ${className}`}
      style={{
        top,
        left,
        right,
        bottom,
        width: size,
        height: size,
        filter: 'drop-shadow(0 8px 16px rgba(245, 158, 11, 0.28))'
      }}
      animate={
        shouldReduceMotion
          ? { rotate: tilt }
          : {
              y: [0, -10, 0],
              rotate: [tilt, tilt - 6, tilt],
              scale: [1, 1.04, 1]
            }
      }
      transition={
        shouldReduceMotion
          ? {}
          : {
              duration,
              repeat: Infinity,
              delay,
              ease: 'easeInOut'
            }
      }
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer 3D Coin Edge & Shadow */}
        <ellipse cx="50" cy="53" rx="46" ry="46" fill="#92400E" opacity="0.6" />
        
        {/* Outer Rim Milled Edge */}
        <circle cx="50" cy="50" r="46" fill="url(#coin-edge-gradient)" />
        <circle cx="50" cy="50" r="43" fill="none" stroke="#FEF08A" strokeWidth="1" strokeDasharray="2 2" />

        {/* Coin Face (Rich Metallic Gold Gradient) */}
        <circle cx="50" cy="50" r="41" fill="url(#coin-face-gradient)" />

        {/* Embossed Inner Bevel */}
        <circle cx="50" cy="50" r="33" fill="url(#coin-inner-gradient)" stroke="#B45309" strokeWidth="1.2" />

        {/* Central Embossed Sacred Prosperity Emblem (Dhanteras Gold Symbol) */}
        <path
          d="M 50 28 L 54 44 L 70 48 L 54 52 L 50 68 L 46 52 L 30 48 L 46 44 Z"
          fill="url(#coin-symbol-gradient)"
          stroke="#78350F"
          strokeWidth="0.8"
        />
        <circle cx="50" cy="48" r="4" fill="#FEF08A" />

        {/* Diagonal Light Glint Reflection */}
        <path
          d="M 22 32 Q 50 18 78 32 Q 50 24 22 32 Z"
          fill="#FFFFFF"
          fillOpacity="0.45"
        />

        {/* Metallic Gradients */}
        <defs>
          <linearGradient id="coin-edge-gradient" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="35%" stopColor="#EAB308" />
            <stop offset="70%" stopColor="#CA8A04" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          <linearGradient id="coin-face-gradient" x1="20" y1="10" x2="80" y2="90">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="25%" stopColor="#FACC15" />
            <stop offset="65%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#A16207" />
          </linearGradient>

          <radialGradient id="coin-inner-gradient" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="60%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </radialGradient>

          <linearGradient id="coin-symbol-gradient" x1="30" y1="30" x2="70" y2="70">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="50%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
});

export default FloatingGoldCoin;

