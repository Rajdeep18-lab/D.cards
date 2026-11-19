import React from 'react';

/**
 * High-quality, lightweight SVG motifs for each festival
 * Low opacity, ambient watermarks designed for fintech background elegance
 */

// 1. HOLI: Soft blurred organic watercolor splashes
export function HoliSplashMotif({ className = "", opacity = 0.12 }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ opacity }}>
      <svg width="420" height="380" viewBox="0 0 420 380" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="holi-blur" x="-30%" y="-30%" width="160%" height="160%" filterUnits="userSpaceOnUse">
            <feGaussianBlur stdDeviation="35" />
          </filter>
        </defs>
        <g filter="url(#holi-blur)">
          <circle cx="150" cy="140" r="110" fill="#E11D48" fillOpacity="0.7" />
          <circle cx="260" cy="180" r="100" fill="#0D9488" fillOpacity="0.65" />
          <circle cx="210" cy="270" r="90" fill="#F59E0B" fillOpacity="0.6" />
          <circle cx="110" cy="240" r="85" fill="#6366F1" fillOpacity="0.65" />
        </g>
      </svg>
    </div>
  );
}

// 2. CHRISTMAS: 6-Point Crystalline Snowflakes & Star Twinkle
export function ChristmasSnowflakeMotif({ className = "", opacity = 0.15 }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ opacity }}>
      <svg width="320" height="320" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 5 L50 95 M5 50 L95 50" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18 18 L82 82 M18 82 L82 18" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
        {/* Crystal branches */}
        <path d="M50 20 L42 28 M50 20 L58 28 M50 80 L42 72 M50 80 L58 72" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 50 L28 42 M20 50 L28 58 M80 50 L72 42 M80 50 L72 58" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="50" r="7" fill="#F59E0B" />
        <circle cx="50" cy="50" r="3" fill="#FFFFFF" />
      </svg>
    </div>
  );
}

// 3. EID: Crescent Moon & 8-Pointed Arabesque Star
export function EidCrescentMotif({ className = "", opacity = 0.15 }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ opacity }}>
      <svg width="340" height="340" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Crescent Moon */}
        <path
          d="M80 15C44.1 15 15 44.1 15 80C15 115.9 44.1 145 80 145C99.2 145 116.3 136.7 128.2 123.4C98.4 125.1 72 101.5 72 71.8C72 47.9 87.2 27.5 108.9 19.8C99.9 16.7 90.2 15 80 15Z"
          fill="#D97706"
        />
        {/* Islamic 8-pointed star */}
        <g transform="translate(112, 58) scale(0.7)">
          <rect x="-18" y="-18" width="36" height="36" fill="#059669" />
          <rect x="-18" y="-18" width="36" height="36" transform="rotate(45)" fill="#059669" />
          <circle cx="0" cy="0" r="6" fill="#F59E0B" />
        </g>
      </svg>
    </div>
  );
}

// 4. GURU NANAK JAYANTI: Sacred Radiant Halo & Lotus Motif
export function GurpurabHaloMotif({ className = "", opacity = 0.15 }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ opacity }}>
      <svg width="360" height="360" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="90" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="100" cy="100" r="75" stroke="#D97706" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="55" stroke="#B45309" strokeWidth="2" />
        {/* 16 Radiant Rays */}
        {Array.from({ length: 16 }).map((_, i) => (
          <line
            key={i}
            x1="100"
            y1="5"
            x2="100"
            y2="20"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinecap="round"
            transform={`rotate(${i * 22.5} 100 100)`}
          />
        ))}
        {/* Center Golden Core */}
        <circle cx="100" cy="100" r="28" fill="#F59E0B" fillOpacity="0.3" />
        <circle cx="100" cy="100" r="14" fill="#D97706" />
      </svg>
    </div>
  );
}

// 5. LOHRI & MAKAR SANKRANTI: Diamond Kite Silhouettes & Bonfire Spark
export function LohriKiteMotif({ className = "", opacity = 0.16 }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ opacity }}>
      <svg width="300" height="300" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Diamond Kite */}
        <g transform="translate(80, 70) rotate(-15)">
          <polygon points="0,-45 40,0 0,45 -40,0" fill="#EA580C" stroke="#F59E0B" strokeWidth="2" />
          <line x1="0" y1="-45" x2="0" y2="45" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M-40,0 Q0,25 40,0" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
          {/* Kite tail */}
          <polygon points="0,45 -12,65 12,65" fill="#F59E0B" />
        </g>
        {/* Smaller accent kite */}
        <g transform="translate(130, 30) rotate(18) scale(0.45)">
          <polygon points="0,-45 40,0 0,45 -40,0" fill="#0284C7" stroke="#F59E0B" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

// 6. INDEPENDENCE DAY & REPUBLIC DAY: Ashoka Chakra (24 Spokes) & Tricolour Radiance
export function AshokaChakraMotif({ className = "", opacity = 0.16 }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ opacity }}>
      <svg width="340" height="340" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="88" stroke="#1E3A8A" strokeWidth="4.5" />
        <circle cx="100" cy="100" r="22" stroke="#1E3A8A" strokeWidth="3.5" fill="#FFFFFF" />
        <circle cx="100" cy="100" r="8" fill="#1E3A8A" />
        {/* 24 Exact Spokes */}
        {Array.from({ length: 24 }).map((_, i) => (
          <line
            key={i}
            x1="100"
            y1="22"
            x2="100"
            y2="100"
            stroke="#1E3A8A"
            strokeWidth="2"
            strokeLinecap="round"
            transform={`rotate(${i * 15} 100 100)`}
          />
        ))}
      </svg>
    </div>
  );
}

// 7. JANMASHTAMI: Iridescent Peacock Feather Motif
export function PeacockFeatherMotif({ className = "", opacity = 0.18 }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ opacity }}>
      <svg width="320" height="360" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Feather Stem */}
        <path d="M80 195 Q82 110 80 15" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
        {/* Outer Feather Eye (Teal/Emerald) */}
        <ellipse cx="80" cy="55" rx="42" ry="48" fill="#059669" />
        {/* Middle Eye (Peacock Royal Blue) */}
        <ellipse cx="80" cy="55" rx="30" ry="34" fill="#0284C7" />
        {/* Inner Luminous Ring (Gold) */}
        <ellipse cx="80" cy="58" rx="20" ry="22" fill="#EAB308" />
        {/* Deep Core (Midnight Sapphire) */}
        <ellipse cx="80" cy="62" rx="12" ry="12" fill="#1E1B4B" />
        {/* Radiating feather barbs */}
        <path d="M42 45 Q20 30 15 20 M118 45 Q140 30 145 20 M45 65 Q18 60 10 50 M115 65 Q142 60 150 50" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// 8. NAVRATRI: Dandiya Sticks & Garba Mandala
export function NavratriDandiyaMotif({ className = "", opacity = 0.16 }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ opacity }}>
      <svg width="340" height="340" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background Garba Ring */}
        <circle cx="90" cy="90" r="75" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5 5" />
        <circle cx="90" cy="90" r="55" stroke="#BE185D" strokeWidth="1.5" />
        {/* Crossed Dandiya Sticks */}
        <g transform="translate(90, 90) rotate(45)">
          <rect x="-80" y="-4" width="160" height="8" rx="4" fill="#EA580C" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="-65" cy="0" r="7" fill="#BE185D" />
          <circle cx="65" cy="0" r="7" fill="#BE185D" />
        </g>
        <g transform="translate(90, 90) rotate(-45)">
          <rect x="-80" y="-4" width="160" height="8" rx="4" fill="#F59E0B" stroke="#BE185D" strokeWidth="1.5" />
          <circle cx="-65" cy="0" r="7" fill="#EA580C" />
          <circle cx="65" cy="0" r="7" fill="#EA580C" />
        </g>
      </svg>
    </div>
  );
}

// 9. DUSSEHRA: Golden Bow & Arrow (Triumph of Good)
export function DussehraBowMotif({ className = "", opacity = 0.18 }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ opacity }}>
      <svg width="340" height="340" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Bow Curve */}
        <path d="M30 150 Q110 90 150 30" stroke="#D97706" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M30 150 Q105 95 150 30" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Bow String */}
        <line x1="30" y1="150" x2="150" y2="30" stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="3 3" />
        {/* Arrow passing through */}
        <line x1="15" y1="165" x2="165" y2="15" stroke="#991B1B" strokeWidth="3" strokeLinecap="round" />
        {/* Arrowhead */}
        <polygon points="165,15 145,20 160,35" fill="#D97706" />
        <polygon points="15,165 25,150 30,160" fill="#991B1B" />
      </svg>
    </div>
  );
}

// 10. NEW YEAR: Starburst Sparkles & Champagne Shimmer
export function NewYearSparkleMotif({ className = "", opacity = 0.18 }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ opacity }}>
      <svg width="320" height="320" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(80, 80)">
          {/* Main 4-point Diamond Starburst */}
          <path d="M0 -60 Q0 0 60 0 Q0 0 0 60 Q0 0 -60 0 Q0 0 0 -60" fill="#F59E0B" />
          <circle cx="0" cy="0" r="10" fill="#FFFFFF" />
          {/* Diagonal secondary bursts */}
          <line x1="-35" y1="-35" x2="35" y2="35" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <line x1="-35" y1="35" x2="35" y2="-35" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        </g>
        <circle cx="130" cy="40" r="4" fill="#F59E0B" />
        <circle cx="30" cy="120" r="3" fill="#F59E0B" />
        <circle cx="120" cy="130" r="5" fill="#FFFFFF" fillOpacity="0.8" />
      </svg>
    </div>
  );
}

// 11. GANESH CHATURTHI: Sacred Modak & Lotus
export function GaneshLotusMotif({ className = "", opacity = 0.18 }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ opacity }}>
      <svg width="320" height="320" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Modak Contour */}
        <path d="M80 30 C72 50 45 75 45 105 C45 125 60 135 80 135 C100 135 115 125 115 105 C115 75 88 50 80 30 Z" fill="#C2410C" stroke="#F59E0B" strokeWidth="2" />
        <path d="M80 30 L80 135" stroke="#F59E0B" strokeWidth="1.5" />
        <path d="M60 85 Q75 110 65 130" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
        <path d="M100 85 Q85 110 95 130" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
}

// 12. RAKSHA BANDHAN: Ornamental Silk Thread Rakhi
export function RakhiThreadMotif({ className = "", opacity = 0.18 }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ opacity }}>
      <svg width="340" height="340" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Silk Strings */}
        <line x1="0" y1="100" x2="200" y2="100" stroke="#E11D48" strokeWidth="3" strokeDasharray="6 3" />
        <line x1="10" y1="96" x2="190" y2="96" stroke="#F59E0B" strokeWidth="1.5" />
        {/* Center Floral Badge */}
        <circle cx="100" cy="100" r="38" fill="#BE185D" stroke="#F59E0B" strokeWidth="2.5" />
        <circle cx="100" cy="100" r="28" fill="#E11D48" />
        <circle cx="100" cy="100" r="16" fill="#F59E0B" />
        <circle cx="100" cy="100" r="8" fill="#FFFFFF" />
        {/* 8 Flower Petals around badge */}
        {Array.from({ length: 8 }).map((_, i) => (
          <circle
            key={i}
            cx="100"
            cy="60"
            r="6"
            fill="#F59E0B"
            transform={`rotate(${i * 45} 100 100)`}
          />
        ))}
      </svg>
    </div>
  );
}

// Convenient Aliases
export const LohriBonfireMotif = LohriKiteMotif;
export const IndependenceChakraMotif = AshokaChakraMotif;
export const JanmashtamiPeacockMotif = PeacockFeatherMotif;
export const NavratriGarbaMotif = NavratriDandiyaMotif;
export const DussehraArrowMotif = DussehraBowMotif;

