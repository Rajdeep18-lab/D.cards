import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Single Marigold Blossom SVG
 */
export const MarigoldFlower = memo(({ size = 18, color = '#F97316', secondaryColor = '#FACC15', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    className={`shrink-0 drop-shadow-[0_2px_4px_rgba(180,83,9,0.35)] ${className}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Outer Petals */}
    {Array.from({ length: 8 }).map((_, i) => (
      <circle
        key={`mp-out-${i}`}
        cx={20 + 10 * Math.cos((i * Math.PI) / 4)}
        cy={20 + 10 * Math.sin((i * Math.PI) / 4)}
        r="7.5"
        fill={color}
      />
    ))}
    {/* Mid Petals */}
    {Array.from({ length: 8 }).map((_, i) => (
      <circle
        key={`mp-mid-${i}`}
        cx={20 + 6 * Math.cos((i * Math.PI) / 4 + Math.PI / 8)}
        cy={20 + 6 * Math.sin((i * Math.PI) / 4 + Math.PI / 8)}
        r="5.5"
        fill={secondaryColor}
      />
    ))}
    {/* Center Florets */}
    <circle cx="20" cy="20" r="4.5" fill="#EA580C" />
    <circle cx="20" cy="20" r="2.5" fill="#FEF08A" />
  </svg>
));

/**
 * Hanging Traditional Akash Kandil (Diwali Paper Lantern)
 */
export const AkashKandilLantern = memo(({ size = 44, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`absolute pointer-events-none select-none z-30 ${className}`}
      animate={
        shouldReduceMotion
          ? {}
          : {
              rotate: [-2, 2, -2],
              transformOrigin: 'top center'
            }
      }
      transition={{
        duration: 4.8,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size * 2.2}
        viewBox="0 0 60 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_4px_14px_rgba(245,158,11,0.5)]"
      >
        {/* Hanging Thread */}
        <line x1="30" y1="0" x2="30" y2="15" stroke="#D97706" strokeWidth="1.5" />

        {/* Top Ring / Cap */}
        <ellipse cx="30" cy="15" rx="14" ry="4" fill="#B45309" stroke="#FEF08A" strokeWidth="0.8" />

        {/* Diamond Lantern Body */}
        <polygon
          points="30,16 54,48 30,80 6,48"
          fill="url(#lantern-glow-body)"
          stroke="#F59E0B"
          strokeWidth="1.5"
        />

        {/* Internal Triangular Facets */}
        <polygon points="30,16 30,80 54,48" fill="#F97316" fillOpacity="0.4" />
        <polygon points="30,16 30,80 6,48" fill="#FACC15" fillOpacity="0.35" />
        <polygon points="30,36 46,48 30,60 14,48" fill="#FEF08A" fillOpacity="0.8" />

        {/* Bottom Ring */}
        <ellipse cx="30" cy="80" rx="12" ry="3.5" fill="#B45309" stroke="#FEF08A" strokeWidth="0.8" />

        {/* Trailing Silk / Paper Tassels */}
        {[-8, -4, 0, 4, 8].map((offset, idx) => (
          <path
            key={`tassel-${idx}`}
            d={`M ${30 + offset} 82 Q ${30 + offset * 1.2} 105 ${30 + offset * 0.8} 128`}
            stroke={idx % 2 === 0 ? '#E11D48' : '#F59E0B'}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        ))}

        <defs>
          <linearGradient id="lantern-glow-body" x1="6" y1="16" x2="54" y2="80">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="45%" stopColor="#F59E0B" />
            <stop offset="80%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#BE123C" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
});

/**
 * ToranGarland
 * Minimalistic Marigold Flower Garland across Navbar header.
 */
export const ToranGarland = memo(({ className = '' }) => {
  return (
    <div 
      className={`w-full overflow-hidden pointer-events-none select-none z-20 ${className}`}
      aria-hidden="true"
    >
      {/* ── Left Hanging Garland Drop ── */}
      <div className="absolute top-0 left-2 sm:left-4 flex flex-col items-center gap-0.5 z-20">
        <MarigoldFlower size={20} color="#F97316" secondaryColor="#FACC15" />
        <MarigoldFlower size={18} color="#EAB308" secondaryColor="#F97316" />
        <MarigoldFlower size={18} color="#F97316" secondaryColor="#FEF08A" />
        <MarigoldFlower size={16} color="#EA580C" secondaryColor="#FACC15" />
        <MarigoldFlower size={14} color="#F97316" secondaryColor="#FDE047" />
        <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-amber-500 to-rose-600 shadow-xs" />
      </div>

      {/* ── Right Hanging Garland & Akash Kandil Lantern ── */}
      <div className="absolute top-0 right-2 sm:right-4 flex flex-col items-center z-20">
        <AkashKandilLantern size={42} className="top-0 -right-1" />
        <div className="hidden sm:flex flex-col items-center gap-0.5 mt-2 mr-10">
          <MarigoldFlower size={18} color="#FACC15" secondaryColor="#EA580C" />
          <MarigoldFlower size={17} color="#F97316" secondaryColor="#FDE047" />
          <MarigoldFlower size={15} color="#EA580C" secondaryColor="#FACC15" />
        </div>
      </div>
    </div>
  );
});

export default ToranGarland;

