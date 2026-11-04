import React from "react";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { FESTIVE_CONFIG } from "../config/festiveConfig";

export default function TopDisclaimerTicker() {
  const { t } = useLanguage();
  const disclaimerText = t(
    'ticker.disclaimer',
    "This data is provided for informational purposes only. Please verify all account details, fees, charges, eligibility, limits and other information with the respective bank before making any financial decision."
  );

  // Array of 4 items: items 0-1 represent the first half (50%), items 2-3 represent the second half (50%)
  // When transform reaches -50%, it seamlessly loops back to 0% with no jump or blank gap.
  const tickerItems = [0, 1, 2, 3];

  const isFestive = FESTIVE_CONFIG.isFestiveEnabled;

  return (
    <aside
      aria-label="Important Bank Data Disclaimer"
      className={`w-full text-[11px] sm:text-xs py-2 overflow-hidden select-none relative z-10 shrink-0 shadow-2xs ${
        isFestive
          ? "bg-[#FFF9EE] dark:bg-[#0B132B] text-[#4B5563] dark:text-amber-200 border-b border-[#E8D6B3] dark:border-amber-900/40"
          : "bg-[#B8860B] dark:bg-[#A87900] text-white border-y border-[#926B08] dark:border-[#855F00]"
      }`}
    >
      {/* Decorative Golden Rangoli Flourish on Right Corner (matches reference design) */}
      {isFestive && (
        <div className="absolute right-0 top-0 bottom-0 pointer-events-none opacity-30 flex items-center pr-2 z-20">
          <svg width="68" height="28" viewBox="0 0 68 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M68 0C52 4 42 14 36 28C42 16 54 8 68 0Z" fill="#D6A64B" />
            <circle cx="58" cy="12" r="2.5" fill="#D6A64B" />
            <circle cx="48" cy="20" r="2" fill="#D6A64B" />
            <path d="M64 4C54 10 46 18 32 28" stroke="#D6A64B" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
        </div>
      )}
      <div className="flex w-max animate-marquee-continuous whitespace-nowrap items-center">
        {tickerItems.map((idx) => (
          <div key={idx} className="flex items-center gap-2.5 mx-6 sm:mx-10 shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase tracking-wider shadow-2xs ${
                isFestive
                  ? "bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-500/30"
                  : "bg-black/25 text-white border border-white/35"
              }`}
            >
              <AlertTriangle className={`w-3 h-3 shrink-0 ${isFestive ? "text-amber-600 dark:text-amber-400" : "text-amber-200"}`} />
              <span>{t('ticker.important', 'Important')}</span>
            </span>
            <span className="font-semibold tracking-normal leading-normal">
              {disclaimerText}
            </span>
            <span className={`${isFestive ? "text-amber-500/60" : "text-white/60"} select-none font-black text-sm ml-4`}>
              ✦
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
