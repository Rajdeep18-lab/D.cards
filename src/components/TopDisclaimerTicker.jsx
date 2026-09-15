import React from "react";
import { AlertTriangle } from "lucide-react";

export default function TopDisclaimerTicker() {
  const disclaimerText =
    "This data is provided for informational purposes only. Please verify all account details, fees, charges, eligibility, limits and other information with the respective bank before making any financial decision.";

  // Array of 4 items: items 0-1 represent the first half (50%), items 2-3 represent the second half (50%)
  // When transform reaches -50%, it seamlessly loops back to 0% with no jump or blank gap.
  const tickerItems = [0, 1, 2, 3];

  return (
    <aside
      aria-label="Important Bank Data Disclaimer"
      className="w-full bg-[#B8860B] dark:bg-[#A87900] text-white border-b border-[#926B08] dark:border-[#855F00] text-[11px] sm:text-xs py-1.5 sm:py-2 overflow-hidden select-none relative z-50 shrink-0 shadow-xs"
    >
      <div className="flex w-max animate-marquee-continuous whitespace-nowrap items-center">
        {tickerItems.map((idx) => (
          <div key={idx} className="flex items-center gap-2.5 mx-6 sm:mx-10 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/25 text-white border border-white/35 font-extrabold text-[10px] uppercase tracking-wider shadow-2xs">
              <AlertTriangle className="w-3 h-3 text-amber-200 shrink-0" />
              <span>Important</span>
            </span>
            <span className="font-semibold text-white tracking-normal leading-normal">
              {disclaimerText}
            </span>
            <span className="text-white/60 select-none font-black text-sm ml-4">
              ✦
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
