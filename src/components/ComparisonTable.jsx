import { useMemo, memo } from "react";
import { Scale, CheckCircle2, XCircle, Star, Trophy, Bot, Plane, Globe } from "lucide-react";
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
      <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-[#E5E7EB] dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#EFF6FF] dark:bg-slate-800 text-[#2563EB] flex items-center justify-center text-2xl">
          <Scale className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#1F2937] dark:text-white mb-1">
          No Cards Selected for Comparison
        </h3>
        <p className="text-xs text-[#6B7280] dark:text-slate-400 max-w-md mx-auto leading-relaxed font-normal">
          Select up to 3 debit cards using the "Add to Compare" button to view side-by-side analytics.
        </p>
      </div>
    );
  }

  // 2. Exactly one card selected state
  if (normalizedCards.length === 1) {
    const singleCard = normalizedCards[0];
    return (
      <div className="py-8 px-5 rounded-3xl border border-amber-500/25 bg-amber-500/5 text-center shadow-soft">
        <div className="max-w-xs mx-auto mb-5 p-4 rounded-2xl border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-[#1E293B] shadow-sm flex items-center justify-center gap-3">
          <DebitCardVisual mode="mini" card={singleCard} />
          <div className="text-left">
            <span className="text-[10px] font-semibold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider block">
              {singleCard.bank || "Debit Card"}
            </span>
            <span className="text-xs font-bold text-[#1F2937] dark:text-white block">
              {singleCard.cardName || "Queued Card"}
            </span>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold tracking-wide">
          <span>💡 Select one more card to compare side by side.</span>
        </div>
      </div>
    );
  }

  // 3. Side-by-side Matrix rows definitions
  const rowDefinitions = [
    {
      key: "bank",
      label: "Bank",
      render: (card) => (
        <span className="font-bold text-[#1F2937] dark:text-white">
          {card.bank || "N/A"}
        </span>
      )
    },
    {
      key: "cardName",
      label: "Card Name",
      render: (card) => (
        <span className="font-bold text-[#1F2937] dark:text-[#60A5FA]">
          {card.cardName || "N/A"}
        </span>
      )
    },
    {
      key: "network",
      label: "Network",
      render: (card) => (
        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#EFF6FF] dark:bg-slate-800 text-[#2563EB] dark:text-[#60A5FA]">
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
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span className="font-semibold">{text}</span>
            {isWaived && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
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
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/35">
              <Trophy className="w-3.5 h-3.5 text-emerald-600" />
              <span>{text}</span>
            </span>
          );
        }
        return <span className="font-semibold">{text}</span>;
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
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/35">
              <Trophy className="w-3.5 h-3.5 text-emerald-600" />
              <span>{text}</span>
            </span>
          );
        }
        return <span className="font-normal text-[#1F2937] dark:text-slate-300">{text}</span>;
      }
    },
    {
      key: "rewards",
      label: "Rewards",
      render: (card) => (
        <span className="text-xs font-normal leading-relaxed text-[#1F2937] dark:text-slate-300">
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
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/35">
              <Plane className="w-3.5 h-3.5 text-emerald-600" />
              <span>{text}</span>
            </span>
          );
        }
        return <span className="font-normal text-[#1F2937] dark:text-slate-300">{text}</span>;
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
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/35">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{text}</span>
            </span>
          );
        }
        return <span className="font-semibold text-[#1F2937] dark:text-slate-300">{text}</span>;
      }
    },
    {
      key: "contactless",
      label: "Contactless",
      render: (card) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
          card.contactless 
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
            : "bg-slate-100 dark:bg-slate-800 text-[#6B7280]"
        }`}>
          {card.contactless ? <><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Supported</> : <><XCircle className="w-3 h-3 text-slate-400" /> Not Supported</>}
        </span>
      )
    },
    {
      key: "internationalUsage",
      label: "International Usage",
      render: (card) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
          card.internationalUsage 
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
            : "bg-slate-100 dark:bg-slate-800 text-[#6B7280]"
        }`}>
          {card.internationalUsage ? <><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Supported</> : <><XCircle className="w-3 h-3 text-slate-400" /> Domestic Only</>}
        </span>
      )
    },
    {
      key: "bestFor",
      label: "Best For",
      render: (card) => {
        const list = Array.isArray(card.bestFor) ? card.bestFor : [];
        if (list.length === 0) return <span className="text-[#6B7280]">N/A</span>;
        return (
          <div className="flex flex-wrap gap-1 justify-center">
            {list.map((item, idx) => (
              <span key={idx} className="bg-[#EFF6FF] dark:bg-slate-800 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/15 text-[10px] font-semibold px-2 py-0.5 rounded-md">
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
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/35 shadow-sm">
              <Bot className="w-3.5 h-3.5 text-emerald-600" />
              <span>{score} / 100</span>
            </span>
          );
        }
        return (
          <span className="font-bold text-[#2563EB] dark:text-[#60A5FA]">
            {score} / 100
          </span>
        );
      }
    },
    {
      key: "rating",
      label: "Rating",
      render: (card) => (
        <span className="font-bold text-amber-500 text-xs flex items-center gap-1 justify-center">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{card.rating ? card.rating.toFixed(1) : "N/A"}</span>
        </span>
      )
    },
    {
      key: "eligibility",
      label: "Eligibility",
      render: (card) => (
        <span className="text-xs text-[#1F2937] dark:text-slate-300 font-normal">
          {card.eligibility || "Standard Bank Customer"}
        </span>
      )
    },
    {
      key: "features",
      label: "Features",
      render: (card) => {
        const list = Array.isArray(card.features) ? card.features : [];
        if (list.length === 0) return <span className="text-[#6B7280]">N/A</span>;
        return (
          <ul className="space-y-1 text-[11px] text-[#6B7280] dark:text-slate-300 text-left pl-2">
            {list.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-1">
                <span className="text-[#2563EB] font-bold">•</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        );
      }
    }
  ];

  return (
    <div className="overflow-x-auto rounded-3xl border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-[#1E293B] shadow-soft">
      <table className="w-full text-left text-xs text-[#1F2937] dark:text-slate-200 border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-[#F8FAFC] dark:bg-slate-900 border-b border-[#E5E7EB] dark:border-slate-800">
            <th className="sticky left-0 z-20 bg-[#F8FAFC] dark:bg-slate-900 px-4 py-4 text-[#6B7280] dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider min-w-[140px]">
              Features Matrix
            </th>
            {normalizedCards.map((card, idx) => (
              <th key={card.id || idx} className="px-4 py-4 text-center min-w-[200px] max-w-[260px] align-top">
                <div className="flex justify-center mb-2 transform hover:scale-105 transition-transform duration-300">
                  <DebitCardVisual mode="compare" card={card} />
                </div>
                <div className="font-bold text-[#1F2937] dark:text-white text-xs">
                  {card.cardName}
                </div>
                <div className="text-[10px] font-semibold text-[#2563EB] dark:text-[#60A5FA] mt-0.5">
                  {card.bank}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB] dark:divide-slate-800">
          {rowDefinitions.map((row) => (
            <tr key={row.key} className="hover:bg-[#F8FAFC] dark:hover:bg-slate-800/50 transition-colors">
              <td className="sticky left-0 z-10 bg-white dark:bg-[#1E293B] px-4 py-3.5 font-semibold text-[#1F2937] dark:text-slate-300 text-[11px] uppercase tracking-wide border-r border-[#E5E7EB] dark:border-slate-800">
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
