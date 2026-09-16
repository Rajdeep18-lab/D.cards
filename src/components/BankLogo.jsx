import React, { useState, memo } from 'react';
import { Landmark } from 'lucide-react';
import { getBankLogoInfo } from '../utils/bankLogos';

/**
 * Standard sizes for the BankLogo container
 */
const SIZE_CLASSES = {
  xs: "w-6 h-6 p-0.5 rounded-lg",
  sm: "w-8 h-8 p-1 rounded-xl",
  md: "w-11 h-11 p-1.5 rounded-2xl",
  lg: "w-14 h-14 p-2 rounded-2xl",
  xl: "w-16 h-16 p-2 rounded-2xl",
  auto: "p-1 rounded-xl"
};

/**
 * Reusable Bank Logo Component
 * 
 * Displays the official bank logo inside a clean, high-contrast, responsive
 * container with strict aspect-ratio containment (object-fit: contain).
 * Gracefully falls back to a clean banking icon if the logo fails to load.
 */
function BankLogo({
  bankName = '',
  size = 'md',
  className = '',
  imgClassName = '',
  title = '',
  priority = false
}) {
  const [imageError, setImageError] = useState(false);
  const { canonicalName, logoUrl, altText } = getBankLogoInfo(bankName);

  const containerSize = SIZE_CLASSES[size] || size;
  const tooltipText = title || canonicalName || "Bank";

  // Base container styling: white/light card background, thin subtle border, centered layout
  const baseClasses = `relative inline-flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/90 shadow-xs shrink-0 select-none overflow-hidden transition-all duration-200 ${containerSize} ${className}`;

  if (!logoUrl || imageError) {
    return (
      <div 
        className={`${baseClasses} text-slate-400 dark:text-slate-500`} 
        title={tooltipText}
        role="img"
        aria-label={altText}
      >
        <Landmark className="w-5/6 h-5/6 stroke-[1.75]" />
      </div>
    );
  }

  return (
    <div 
      className={baseClasses}
      title={tooltipText}
    >
      <img
        src={logoUrl}
        alt={altText}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setImageError(true)}
        className={`w-full h-full object-contain pointer-events-none transition-transform duration-200 ${imgClassName}`}
      />
    </div>
  );
}

export default memo(BankLogo);
