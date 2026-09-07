import React from "react";
import { AlertCircle } from "lucide-react";

export default function TopDisclaimerTicker() {
  const disclaimerText =
    "This data is provided for informational purposes only. Please verify all account details, fees, charges, eligibility, limits and other information with the respective bank before making any financial decision.";

  // Array of 4 items: items 0-1 represent the first half (50%), items 2-3 represent the second half (50%)
  // When transform reaches -50%, it seamlessly loops back to 0% with no jump or blank gap.
  const tickerItems = [0, 1, 2, 3];

  return (
    <aside
      aria-label="Important Bank Data Disclaimer"
      className="w-full bg-[#0B1329] dark:bg-[#080D1A] text-slate-200 border-b border-blue-900/40 text-[11px] sm:text-xs py-1.5 sm:py-2 overflow-hidden select-none relative z-50 shrink-0"
    >
      <div className="flex w-max animate-marquee-continuous whitespace-nowrap items-center">
        {tickerItems.map((idx) => (
          <div key={idx} className="flex items-center gap-2.5 mx-6 sm:mx-10 shrink-0">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/35 font-extrabold text-[10px] uppercase tracking-wider shadow-xs">
              <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Notice</span>
            </span>
            <span className="font-medium text-slate-200/95 dark:text-slate-300 tracking-normal leading-normal">
              {disclaimerText}
            </span>
            <span className="text-blue-500/60 dark:text-blue-400/40 select-none font-black text-sm ml-4">
              ✦
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
