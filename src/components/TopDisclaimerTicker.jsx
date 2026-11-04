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
      className={`w-full text-[11px] sm:text-xs py-2 overflow-hidden select-none relative z-10 shrink-0 shadow-xs ${
        isFestive
          ? "bg-[#FEF9EE] dark:bg-[#1A1508] text-[#78350F] dark:text-amber-200 border-y border-[#F3E8D0] dark:border-amber-900/40"
          : "bg-[#B8860B] dark:bg-[#A87900] text-white border-y border-[#926B08] dark:border-[#855F00]"
      }`}
    >
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
