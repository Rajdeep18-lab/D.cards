import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * DiwaliHeroRangoli
 * Traditional Indian Rangoli decoration for the D.CARD Homepage Hero side illustration area.
 * 
 * Features:
 * - Authentic circular Indian Rangoli in Burgundy, Gold, Saffron, Crimson Red & Subtle Orange.
 * - Traditional earthen terracotta Diya resting directly on the central pedestal.
 * - Realistic flickering flame with warm golden ambient glow.
 * - Scattered decorative marigold (saffron/yellow) and rose (burgundy/crimson) flower petals.
 * - Subtle twinkling golden sparkles.
 * - Fully responsive, lightweight SVG & CSS, pointer-events-none, strictly zero overflow.
 */
const DiwaliHeroRangoli = memo(({ className = "" }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div 
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Ambient Warm Golden Glow behind Rangoli & Diya */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-60 h-48 sm:h-60 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.22)_0%,rgba(180,83,9,0.12)_45%,transparent_70%)] blur-xl pointer-events-none" 
      />

      {/* Main SVG Container */}
      <svg
        viewBox="0 0 320 280"
        className="w-[220px] sm:w-[270px] md:w-[300px] h-auto drop-shadow-[0_8px_24px_rgba(112,26,43,0.35)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* ── Gradients ── */}
          {/* Rangoli Burgundy Base */}
          <radialGradient id="rgBurgundy" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4A051A" />
            <stop offset="60%" stopColor="#670A24" />
            <stop offset="100%" stopColor="#2A020D" />
          </radialGradient>

          {/* Saffron & Red Petal Gradient */}
          <linearGradient id="rgSaffronRed" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="35%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </linearGradient>

          {/* Golden Yellow Accent Gradient */}
          <linearGradient id="rgGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Orange Accent Gradient */}
          <linearGradient id="rgOrange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>

          {/* Earthen Clay Diya Base */}
          <linearGradient id="clayBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C2410C" />
            <stop offset="30%" stopColor="#9A3412" />
            <stop offset="70%" stopColor="#7C2D12" />
            <stop offset="100%" stopColor="#431407" />
          </linearGradient>

          {/* Diya Gold Rim */}
          <linearGradient id="diyaGoldRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="30%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#FFFBEB" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>

          {/* Flame Core Gradient */}
          <radialGradient id="flameCore" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#FEF08A" />
            <stop offset="75%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#DC2626" />
          </radialGradient>

          {/* Ambient Flame Radial Glow */}
          <radialGradient id="diyaCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE047" stopOpacity="0.8" />
            <stop offset="45%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ════════════════════════════════════════════════════════
            PART 1: TRADITIONAL INDIAN RANGOLI BASE (Center: 160, 160)
           ════════════════════════════════════════════════════════ */}
        <g id="rangoli-pattern" transform="translate(160, 165)">
          
          {/* Base Outer Circular Shadow & Dark Burgundy Border */}
          <circle cx="0" cy="0" r="102" fill="url(#rgBurgundy)" stroke="#D4AF37" strokeWidth="1.5" />
          
          {/* Outer Golden Bindis / Pearls Ring */}
          <circle cx="0" cy="0" r="98" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2.5 4" opacity="0.85" />
          <circle cx="0" cy="0" r="94" stroke="#DC2626" strokeWidth="1.2" opacity="0.7" />

          {/* 16 Radiating Lotus Rangoli Petals (Burgundy to Saffron-Red with Gold Tips) */}
          {Array.from({ length: 16 }).map((_, i) => {
            const rot = (i * 360) / 16;
            return (
              <g key={`outer-p-${i}`} transform={`rotate(${rot})`}>
                <path
                  d="M 0 -96 C -12 -72 -14 -42 0 -24 C 14 -42 12 -72 0 -96 Z"
                  fill="url(#rgSaffronRed)"
                  stroke="#F59E0B"
                  strokeWidth="0.8"
                />
                {/* Golden Pearled Accent on Petal */}
                <circle cx="0" cy="-80" r="2" fill="#FEF08A" />
                <circle cx="0" cy="-56" r="1.5" fill="#FDE047" opacity="0.9" />
              </g>
            );
          })}

          {/* Mid Layer: Concentric Rosette Ring (Deep Saffron & Crimson) */}
          <circle cx="0" cy="0" r="66" fill="#78081E" stroke="#F59E0B" strokeWidth="1.2" />
          <circle cx="0" cy="0" r="62" stroke="#FEF08A" strokeWidth="0.8" strokeDasharray="3 3" />

          {/* 12 Inner Petal Flourishes (Golden Saffron) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const rot = (i * 360) / 12 + 15;
            return (
              <g key={`inner-p-${i}`} transform={`rotate(${rot})`}>
                <path
                  d="M 0 -64 C -8 -48 -8 -26 0 -14 C 8 -26 8 -48 0 -64 Z"
                  fill="url(#rgOrange)"
                  stroke="#FEF08A"
                  strokeWidth="0.75"
                />
                <circle cx="0" cy="-48" r="1.5" fill="#FEF08A" />
              </g>
            );
          })}

          {/* Central Diya Pedestal (Rich Burgundy & Gold Filigree Rings) */}
          <circle cx="0" cy="0" r="38" fill="url(#rgBurgundy)" stroke="#D4AF37" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="34" stroke="#DC2626" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="0" cy="0" r="28" fill="#991B1B" opacity="0.6" stroke="#FEF08A" strokeWidth="0.8" />

          {/* 8-Point Sacred Geometric Star in Gold */}
          {Array.from({ length: 4 }).map((_, i) => {
            const rot = (i * 180) / 4;
            return (
              <line
                key={`star-l-${i}`}
                x1="0"
                y1="-24"
                x2="0"
                y2="24"
                stroke="#FEF08A"
                strokeWidth="0.9"
                transform={`rotate(${rot})`}
                opacity="0.85"
              />
            );
          })}

          {/* Warm Ambient Reflection on the Rangoli center */}
          <circle cx="0" cy="-4" r="32" fill="url(#diyaCenterGlow)" />
        </g>

        {/* ════════════════════════════════════════════════════════
            PART 2: DECORATIVE FLOWER PETALS SCATTERED AROUND
           ════════════════════════════════════════════════════════ */}
        {/* Marigold Petals (Saffron & Gold) */}
        <g id="scattered-petals">
          {/* Top Left Marigold Petals */}
          <path
            d="M 98 120 C 92 114 84 116 88 124 C 92 128 100 126 98 120 Z"
            fill="#F59E0B"
            stroke="#D97706"
            strokeWidth="0.5"
            transform="rotate(-15 94 122)"
          />
          <path
            d="M 112 110 C 108 104 102 108 106 114 C 110 118 116 114 112 110 Z"
            fill="#EA580C"
            stroke="#C2410C"
            strokeWidth="0.5"
            transform="rotate(25 108 112)"
          />
          
          {/* Top Right Marigold & Rose Petals */}
          <path
            d="M 222 118 C 218 112 210 115 214 122 C 218 126 226 122 222 118 Z"
            fill="#DC2626"
            stroke="#991B1B"
            strokeWidth="0.5"
            transform="rotate(35 218 120)"
          />
          <path
            d="M 234 128 C 228 122 224 128 228 134 C 232 138 238 132 234 128 Z"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="0.5"
            transform="rotate(-20 230 130)"
          />

          {/* Bottom Left Petals */}
          <path
            d="M 92 208 C 86 204 82 210 88 216 C 92 220 98 214 92 208 Z"
            fill="#EA580C"
            stroke="#C2410C"
            strokeWidth="0.5"
            transform="rotate(10 90 212)"
          />
          <path
            d="M 110 226 C 104 222 102 230 108 234 C 114 238 116 230 110 226 Z"
            fill="#991B1B"
            stroke="#7F1D1D"
            strokeWidth="0.5"
            transform="rotate(-40 108 230)"
          />

          {/* Bottom Right Petals */}
          <path
            d="M 218 214 C 214 208 222 204 226 210 C 230 216 222 220 218 214 Z"
            fill="#F59E0B"
            stroke="#D97706"
            strokeWidth="0.5"
            transform="rotate(45 220 212)"
          />
          <path
            d="M 204 232 C 198 228 196 236 202 240 C 208 244 210 236 204 232 Z"
            fill="#DC2626"
            stroke="#B91C1C"
            strokeWidth="0.5"
            transform="rotate(-15 202 234)"
          />

          {/* Center Front Petal Accents */}
          <path
            d="M 152 208 C 146 204 144 212 150 216 C 156 218 158 212 152 208 Z"
            fill="#FEF08A"
            stroke="#F59E0B"
            strokeWidth="0.5"
          />
          <path
            d="M 168 208 C 164 204 172 202 174 208 C 176 214 170 214 168 208 Z"
            fill="#F97316"
            stroke="#C2410C"
            strokeWidth="0.5"
          />
        </g>

        {/* ════════════════════════════════════════════════════════
            PART 3: TRADITIONAL EARTHEN CLAY DIYA RESTING ON CENTER
           ════════════════════════════════════════════════════════ */}
        <g id="traditional-earthen-diya">
          {/* Diya Ground Contact Shadow on Rangoli */}
          <ellipse cx="160" cy="174" rx="36" ry="10" fill="#2A020D" opacity="0.65" />

          {/* Clay Bowl Base (Terracotta) */}
          <path
            d="M 124 160 C 124 182, 196 182, 196 160 C 200 156, 204 152, 194 150 C 172 154, 148 154, 126 150 C 116 152, 120 156, 124 160 Z"
            fill="url(#clayBody)"
            stroke="#7C2D12"
            strokeWidth="1.2"
          />

          {/* Diya Inner Oil Reservoir */}
          <ellipse cx="160" cy="154" rx="34" ry="7.5" fill="#451A03" stroke="#9A3412" strokeWidth="0.8" />

          {/* Golden Brass Rim on Top Lip of Diya */}
          <path
            d="M 126 150 C 148 154, 172 154, 194 150 C 198 152, 196 154, 192 156 C 170 160, 150 160, 128 156 C 124 154, 122 152, 126 150 Z"
            fill="url(#diyaGoldRim)"
            stroke="#F59E0B"
            strokeWidth="0.6"
          />

          {/* Diya Spout / Lip Bevel on Left & Right */}
          <circle cx="160" cy="155" r="2" fill="#78350F" />
          {/* Cotton Wick (Baati) */}
          <path
            d="M 160 155 Q 159 146 160 142"
            stroke="#FEF3C7"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* ── Realistic Flickering Flame ── */}
          <g transform="translate(160, 140)">
            {/* Outer Flame Glow */}
            <circle cx="0" cy="-14" r="22" fill="url(#diyaCenterGlow)" opacity="0.85" />

            {/* Dynamic Animated Flame */}
            <motion.g
              animate={
                !shouldReduceMotion
                  ? {
                      scaleY: [1, 1.09, 0.94, 1.06, 1],
                      scaleX: [1, 0.93, 1.05, 0.96, 1],
                      rotate: [0, -1.8, 1.6, -1, 0],
                    }
                  : {}
              }
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "0px 0px" }}
            >
              {/* Outer Saffron/Red Flame Tear */}
              <path
                d="M 0 -38 C 7 -26, 14 -16, 12 -4 C 10 5, -10 5, -12 -4 C -14 -16, -7 -26, 0 -38 Z"
                fill="url(#rgSaffronRed)"
              />

              {/* Inner Radiant Golden/White Core */}
              <path
                d="M 0 -32 C 4 -22, 9 -14, 7 -4 C 5 2, -5 2, -7 -4 C -9 -14, -4 -22, 0 -32 Z"
                fill="url(#flameCore)"
              />

              {/* Brilliant White Filament Flame Tip */}
              <ellipse cx="0" cy="-6" rx="3.5" ry="5.5" fill="#FFFFFF" opacity="0.95" />
            </motion.g>
          </g>
        </g>

        {/* ════════════════════════════════════════════════════════
            PART 4: TINY GOLDEN SPARKLES
           ════════════════════════════════════════════════════════ */}
        <g id="golden-sparkles">
          {/* Sparkle 1: Top Left above Diya */}
          <g transform="translate(132, 96)">
            <path d="M 0 -6 L 1.5 -1.5 L 6 0 L 1.5 1.5 L 0 6 L -1.5 1.5 L -6 0 L -1.5 -1.5 Z" fill="#FEF08A" />
            <circle cx="0" cy="0" r="1.5" fill="#FFFFFF" />
          </g>

          {/* Sparkle 2: Top Right above Diya */}
          <g transform="translate(188, 102)">
            <path d="M 0 -5 L 1 -1 L 5 0 L 1 1 L 0 5 L -1 1 L -5 0 L -1 -1 Z" fill="#FDE047" />
            <circle cx="0" cy="0" r="1" fill="#FFFFFF" />
          </g>

          {/* Sparkle 3: Far Left on Rangoli Rim */}
          <g transform="translate(74, 158)">
            <path d="M 0 -4 L 1 -1 L 4 0 L 1 1 L 0 4 L -1 1 L -4 0 L -1 -1 Z" fill="#F59E0B" />
          </g>

          {/* Sparkle 4: Far Right on Rangoli Rim */}
          <g transform="translate(246, 164)">
            <path d="M 0 -4.5 L 1 -1 L 4.5 0 L 1 1 L 0 4.5 L -1 1 L -4.5 0 L -1 -1 Z" fill="#FEF08A" />
          </g>
        </g>
      </svg>
    </div>
  );
});

DiwaliHeroRangoli.displayName = 'DiwaliHeroRangoli';

export default DiwaliHeroRangoli;
