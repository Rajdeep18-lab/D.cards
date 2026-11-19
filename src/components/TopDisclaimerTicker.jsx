import React from "react";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useFestivalTheme } from "../hooks/useFestivalTheme";

export default function TopDisclaimerTicker() {
  const { t } = useLanguage();
  const { isFestivalMode } = useFestivalTheme();
  const disclaimerText = t(
    'ticker.disclaimer',
    "This data is provided for informational purposes only. Please verify all account details, fees, charges, eligibility, limits and other information with the respective bank before making any financial decision."
  );

  // Array of 4 items: items 0-1 represent the first half (50%), items 2-3 represent the second half (50%)
  // When transform reaches -50%, it seamlessly loops back to 0% with no jump or blank gap.
  const tickerItems = [0, 1, 2, 3];

  const isFestive = isFestivalMode;

  return (
    <aside
      aria-label="Important Bank Data Disclaimer"
      className="w-full text-[11px] sm:text-xs py-2 overflow-hidden select-none relative z-10 shrink-0 shadow-2xs bg-[#EEF4EE] dark:bg-[#0C1813] text-[#14291F] dark:text-[#E2ECE5] border-b border-[#E0E6DC] dark:border-[#1F382B]"
    >
      <div className="flex w-max animate-marquee-continuous whitespace-nowrap items-center">
        {tickerItems.map((idx) => (
          <div key={idx} className="flex items-center gap-2.5 mx-6 sm:mx-10 shrink-0">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-2xs bg-[#0E5C3E] text-white border border-[#0E5C3E]"
            >
              <AlertTriangle className="w-3 h-3 shrink-0 text-[#34D399]" />
              <span>{t('ticker.important', 'Important')}</span>
            </span>
            <span className="font-medium tracking-normal leading-normal text-[#14291F] dark:text-[#E2ECE5]">
              {disclaimerText}
            </span>
            <span className="text-[#10B981] select-none font-black text-sm ml-4">
              ✦
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
