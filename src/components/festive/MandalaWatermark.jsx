import React, { memo } from 'react';

/**
 * MandalaWatermark
 * Pure mathematical SVG Indian Mandala & Rangoli Watermarks.
 * Rendered with subtle, low-opacity warm gold strokes for an elegant fintech backdrop.
 */
export const GoldenMandala = memo(({ size = 480, className = '', opacity = 0.14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`pointer-events-none select-none ${className}`}
    style={{ opacity }}
    aria-hidden="true"
  >
    {/* Concentric Sacred Geometry Rings */}
    <circle cx="200" cy="200" r="190" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 3" />
    <circle cx="200" cy="200" r="180" stroke="#D4AF37" strokeWidth="1.2" />
    <circle cx="200" cy="200" r="160" stroke="#D4AF37" strokeWidth="0.8" />
    <circle cx="200" cy="200" r="130" stroke="#D4AF37" strokeWidth="1.2" strokeDasharray="4 4" />
    <circle cx="200" cy="200" r="100" stroke="#D4AF37" strokeWidth="1" />
    <circle cx="200" cy="200" r="70" stroke="#D4AF37" strokeWidth="1.2" />
    <circle cx="200" cy="200" r="40" stroke="#D4AF37" strokeWidth="1" />
    <circle cx="200" cy="200" r="15" stroke="#D4AF37" strokeWidth="1.5" />

    {/* 16 Radiating Lotus Petals (Outer Ring) */}
    {Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 360) / 16;
      return (
        <g key={`petal-outer-${i}`} transform={`rotate(${angle} 200 200)`}>
          <path
            d="M 200 20 C 185 60 175 110 200 130 C 225 110 215 60 200 20 Z"
            stroke="#D4AF37"
            strokeWidth="1.2"
            fill="none"
          />
          <circle cx="200" cy="35" r="2.5" fill="#D4AF37" />
        </g>
      );
    })}

    {/* 12 Radiating Inner Petals */}
    {Array.from({ length: 12 }).map((_, i) => {
      const angle = (i * 360) / 12 + 15;
      return (
        <g key={`petal-inner-${i}`} transform={`rotate(${angle} 200 200)`}>
          <path
            d="M 200 70 C 190 100 185 140 200 160 C 215 140 210 100 200 70 Z"
            stroke="#D4AF37"
            strokeWidth="1"
            fill="none"
          />
          <circle cx="200" cy="85" r="2" fill="#D4AF37" />
        </g>
      );
    })}

    {/* Central 8-Point Starburst */}
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 360) / 8;
      return (
        <line
          key={`star-${i}`}
          x1="200"
          y1="160"
          x2="200"
          y2="240"
          stroke="#D4AF37"
          strokeWidth="1"
          transform={`rotate(${angle} 200 200)`}
        />
      );
    })}
  </svg>
));

/**
 * Bottom-Left Festive Indian Rangoli with Vibrant Circular Motif
 */
export const FestiveCornerRangoli = memo(({ size = 260, className = '' }) => (
  <div 
    className={`relative pointer-events-none select-none ${className}`}
    style={{ width: size, height: size }}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full drop-shadow-[0_4px_16px_rgba(217,119,6,0.25)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Rangoli Petal Ring (Crimson & Gold) */}
      <circle cx="100" cy="100" r="94" stroke="#DC2626" strokeWidth="2" strokeDasharray="3 3" />
      <circle cx="100" cy="100" r="88" stroke="#F59E0B" strokeWidth="1.5" />

      {/* Rangoli Petals */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 360) / 12;
        return (
          <g key={`rangoli-p-${i}`} transform={`rotate(${angle} 100 100)`}>
            <path
              d="M 100 10 C 88 40 85 70 100 85 C 115 70 112 40 100 10 Z"
              fill="url(#rangoli-grad-petal)"
              stroke="#B45309"
              strokeWidth="0.8"
            />
            <circle cx="100" cy="22" r="3" fill="#FEF08A" />
          </g>
        );
      })}

      {/* Inner Floral Rosette (Saffron & Amber) */}
      <circle cx="100" cy="100" r="54" fill="url(#rangoli-grad-inner)" stroke="#D97706" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="42" stroke="#DC2626" strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="100" cy="100" r="28" fill="#F59E0B" fillOpacity="0.4" stroke="#B45309" strokeWidth="1" />

      {/* Gradients */}
      <defs>
        <radialGradient id="rangoli-grad-petal" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#EA580C" />
          <stop offset="60%" stopColor="#C2410C" />
          <stop offset="100%" stopColor="#991B1B" />
        </radialGradient>
        <radialGradient id="rangoli-grad-inner" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#DC2626" />
        </radialGradient>
      </defs>
    </svg>
  </div>
));

