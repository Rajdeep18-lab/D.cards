import { useMemo, memo } from "react";
import DebitCardVisual from "./DebitCardVisual";
import {
  normalizeCard,
  deduplicateCards,
  getBestMetrics,
  parseAnnualFeeVal,
  parseCashbackVal,
  parseForexVal,
  safeStr,
  safeMap
} from "../utils/compareUtils";

function ComparisonTable({ cards = [] }) {
  // Normalize & deduplicate cards input
  const normalizedCards = useMemo(() => {
    const rawList = Array.isArray(cards) ? cards.filter(Boolean) : [];
    return deduplicateCards(rawList);
  }, [cards]);

  // Compute best metric thresholds for green highlighting
  const bestMetrics = useMemo(() => {
    return getBestMetrics(normalizedCards);
  }, [normalizedCards]);

  // 1. Zero cards selected state
  if (normalizedCards.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-secondary/20 bg-slate-50/50 dark:bg-[#0a060d]/50 backdrop-blur-xl">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-secondary/10 flex items-center justify-center text-2xl select-none">
          📊
        </div>
        <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mb-1">
          No Cards Selected for Comparison
        </h3>
        <p className="text-xs text-textSoft dark:text-slate-400 max-w-md mx-auto leading-relaxed font-sans font-medium">
          Select up to 3 debit cards using the "Add to Compare" button to view side-by-side analytics.
        </p>
      </div>
    );
  }

  // 2. Exactly one card selected state
  if (normalizedCards.length === 1) {
    const singleCard = normalizedCards[0];
    return (
      <div className="py-8 px-5 rounded-3xl border border-amber-500/25 bg-amber-500/5 dark:bg-amber-500/10 backdrop-blur-xl text-center shadow-soft">
        <div className="max-w-xs mx-auto mb-5 p-4 rounded-2xl border border-slate-200 dark:border-secondary/15 bg-white dark:bg-black/60 shadow-sm flex items-center justify-center gap-3">
          <DebitCardVisual mode="mini" card={singleCard} />
          <div className="text-left">
            <span className="text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-wider block">
              {singleCard.bank || "Debit Card"}
            </span>
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 block">
              {singleCard.cardName || "Queued Card"}
            </span>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-black tracking-wide">
          <span>💡</span> Select one more card to compare.
        </div>
      </div>
    );
  }

  // 3. Side-by-side Matrix rows definitions for 16 required fields
  const rowDefinitions = [
    {
      key: "bank",
      label: "Bank",
      render: (card) => (
        <span className="font-extrabold text-slate-900 dark:text-slate-100">
          {card.bank || "N/A"}
        </span>
      )
    },
    {
      key: "cardName",
      label: "Card Name",
      render: (card) => (
        <span className="font-bold text-slate-800 dark:text-slate-200">
          {card.cardName || "N/A"}
        </span>
      )
    },
    {
      key: "network",
      label: "Network",
      render: (card) => (
        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-black bg-slate-100 dark:bg-secondary/15 text-slate-700 dark:text-roseGold">
          {card.network || "N/A"}
        </span>
      )
    },
    {
      key: "joiningFee",
      label: "Joining Fee",
      render: (card) => {
        const text = card.joiningFee || "Free";
        const isWaived = card.joiningFeeWaived;
        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold">{text}</span>
            {isWaived && (
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Waived
              </span>
            )}
          </div>
        );
      }
    },
    {
      key: "annualFee",
      label: "Annual Fee",
      render: (card) => {
        const feeVal = parseAnnualFeeVal(card.annualFee);
        const isBestFee = bestMetrics.minFee !== null && feeVal === bestMetrics.minFee;
        const text = card.annualFee || "Free";

        if (isBestFee) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/35">
              <span>🏆</span> {text}
            </span>
          );
        }
        return <span className="font-bold">{text}</span>;
      }
    },
    {
      key: "cashback",
      label: "Cashback",
      render: (card) => {
        const cbVal = parseCashbackVal(card.cashback);
        const isBestCb = bestMetrics.maxCashback !== null && cbVal === bestMetrics.maxCashback && cbVal > 0;
        const text = card.cashback || "N/A";

        if (isBestCb) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/35">
              <span>🏆</span> {text}
            </span>
          );
        }
        return <span className="font-medium text-slate-700 dark:text-slate-300">{text}</span>;
      }
    },
    {
      key: "rewards",
      label: "Rewards",
      render: (card) => (
        <span className="text-xs font-medium leading-relaxed text-slate-700 dark:text-slate-300">
          {card.rewards || "N/A"}
        </span>
      )
    },
    {
      key: "loungeAccess",
      label: "Lounge Access",
      render: (card) => {
        const visits = card.loungeVisits || 0;
        const isBestLounge = bestMetrics.maxLoungeVisits !== null && visits === bestMetrics.maxLoungeVisits && visits > 0;
        const text = card.loungeAccess || "Not Available";

        if (isBestLounge) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/35">
              <span>✈️</span> {text}
            </span>
          );
        }
        return <span className="font-medium text-slate-700 dark:text-slate-300">{text}</span>;
      }
    },
    {
      key: "forexMarkup",
      label: "Forex Markup",
      render: (card) => {
        const fxVal = parseForexVal(card.forexMarkup);
        const isBestFx = bestMetrics.minForex !== null && fxVal === bestMetrics.minForex;
        const text = card.forexMarkup || "Not Available";

        if (isBestFx) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/35">
              <span>💱</span> {text}
            </span>
          );
        }
        return <span className="font-semibold text-slate-700 dark:text-slate-300">{text}</span>;
      }
    },
    {
      key: "contactless",
      label: "Contactless",
      render: (card) => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
          card.contactless 
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
            : "bg-slate-100 dark:bg-slate-800 text-slate-400"
        }`}>
          {card.contactless ? "Supported ✓" : "Not Supported ✗"}
        </span>
      )
    },
    {
      key: "internationalUsage",
      label: "International Usage",
      render: (card) => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
          card.internationalUsage 
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
            : "bg-slate-100 dark:bg-slate-800 text-slate-400"
        }`}>
          {card.internationalUsage ? "Supported ✓" : "Domestic Only ✗"}
        </span>
      )
    },
    {
      key: "bestFor",
      label: "Best For",
      render: (card) => {
        const list = Array.isArray(card.bestFor) ? card.bestFor : [];
        if (list.length === 0) return <span className="text-slate-400">N/A</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {list.map((item, idx) => (
              <span key={idx} className="bg-secondary/10 text-secondary dark:text-roseGold border border-secondary/15 text-[10px] font-bold px-2 py-0.5 rounded-md">
                {item}
              </span>
            ))}
          </div>
        );
      }
    },
    {
      key: "aiScore",
      label: "AI Score",
      render: (card) => {
        const score = card.aiScore || 0;
        const isBestAi = bestMetrics.maxAIScore !== null && score === bestMetrics.maxAIScore && score > 0;

        if (isBestAi) {
          return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/35 shadow-sm">
              <span>🤖</span> {score} / 100
            </span>
          );
        }
        return (
          <span className="font-extrabold text-secondary dark:text-roseGold">
            {score} / 100
          </span>
        );
      }
    },
    {
      key: "rating",
      label: "Rating",
      render: (card) => (
        <span className="font-black text-amber-500 dark:text-amber-400 text-xs">
          ★ {card.rating ? card.rating.toFixed(1) : "N/A"}
        </span>
      )
    },
    {
      key: "eligibility",
      label: "Eligibility",
      render: (card) => (
        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
          {card.eligibility || "Standard Bank Customer"}
        </span>
      )
    },
    {
      key: "features",
      label: "Features",
      render: (card) => {
        const list = Array.isArray(card.features) ? card.features : [];
        if (list.length === 0) return <span className="text-slate-400">N/A</span>;
        return (
          <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-600 dark:text-slate-300">
            {list.map((feat, idx) => (
              <li key={idx}>{feat}</li>
            ))}
          </ul>
        );
      }
    }
  ];

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-secondary/15 bg-white/60 dark:bg-[#09050a]/60 backdrop-blur-xl shadow-lg">
      <table className="w-full text-left text-xs text-slate-800 dark:text-slate-200 border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-slate-100/90 dark:bg-secondary/10 border-b border-slate-200 dark:border-secondary/20">
            <th className="sticky left-0 z-20 bg-slate-100 dark:bg-[#120a17] px-4 py-4 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-wider min-w-[140px]">
              Features Matrix
            </th>
            {normalizedCards.map((card, idx) => (
              <th key={card.id || idx} className="px-4 py-4 text-center min-w-[200px] max-w-[260px] align-top">
                <div className="flex justify-center mb-2 transform hover:scale-105 transition-transform duration-300">
                  <DebitCardVisual mode="compare" card={card} />
                </div>
                <div className="font-black text-slate-800 dark:text-slate-100 text-xs">
                  {card.cardName}
                </div>
                <div className="text-[10px] font-bold text-secondary dark:text-roseGold mt-0.5">
                  {card.bank}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-secondary/10">
          {rowDefinitions.map((row) => (
            <tr key={row.key} className="hover:bg-slate-50/60 dark:hover:bg-secondary/5 transition-colors">
              <td className="sticky left-0 z-10 bg-white/95 dark:bg-[#0d0712]/95 px-4 py-3.5 font-black text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wide border-r border-slate-100 dark:border-secondary/10">
                {row.label}
              </td>
              {normalizedCards.map((card, idx) => (
                <td key={card.id || idx} className="px-4 py-3.5 text-center min-w-[200px] align-middle">
                  <div className="flex justify-center">
                    {row.render(card)}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default memo(ComparisonTable);
