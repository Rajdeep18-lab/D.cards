import { useMemo, memo } from "react";
import { Scale, CheckCircle2, XCircle, Star, Trophy, Bot, Plane, Globe } from "lucide-react";
import DebitCardVisual from "./DebitCardVisual";
import BankLogo from "./BankLogo";
import { useLanguage } from "../context/LanguageContext";
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
  const { isHindi, t } = useLanguage();

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
          {t('compare.noCardsTitle', 'No Cards Selected for Comparison')}
        </h3>
        <p className="text-xs text-[#6B7280] dark:text-slate-400 max-w-md mx-auto leading-relaxed font-normal">
          {isHindi 
            ? 'आमने-सामने तुलना देखने के लिए "तुलना करें" बटन का उपयोग करके अधिकतम 3 डेबिट कार्ड चुनें।'
            : 'Select up to 3 debit cards using the "Add to Compare" button to view side-by-side analytics.'}
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
              {singleCard.bank || (isHindi ? 'डेबिट कार्ड' : "Debit Card")}
            </span>
            <span className="text-xs font-bold text-[#1F2937] dark:text-white block">
              {singleCard.cardName || (isHindi ? 'चयनित कार्ड' : "Queued Card")}
            </span>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold tracking-wide">
          <span>{t('compare.selectOneMore', '💡 Select one more product to compare side by side.')}</span>
        </div>
      </div>
    );
  }

  // 3. Side-by-side Matrix rows definitions
  const rowDefinitions = [
    {
      key: "bank",
      label: t('compare.metricBank', 'Bank'),
      render: (card) => (
        <div className="flex items-center justify-center gap-2">
          <BankLogo bankName={card.bank} size="xs" />
          <span className="font-bold text-[#1F2937] dark:text-white">
            {card.bank || "N/A"}
          </span>
        </div>
      )
    },
    {
      key: "cardName",
      label: t('compare.metricCardName', 'Card Name'),
      render: (card) => (
        <span className="font-bold text-[#1F2937] dark:text-[#60A5FA]">
          {card.cardName || "N/A"}
        </span>
      )
    },
    {
      key: "network",
      label: t('compare.metricNetwork', 'Network'),
      render: (card) => (
        <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#EFF6FF] dark:bg-slate-800 text-[#2563EB] dark:text-[#60A5FA]">
          {card.network || "N/A"}
        </span>
      )
    },
    {
      key: "joiningFee",
      label: isHindi ? 'प्रारंभिक शुल्क' : 'Joining Fee',
      render: (card) => {
        const text = card.joiningFee || (isHindi ? "मुफ़्त (₹0)" : "Free");
        const isWaived = card.joiningFeeWaived;
        return (
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <span className="font-semibold">{text}</span>
            {isWaived && (
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {isHindi ? 'माफ़' : 'Waived'}
              </span>
            )}
          </div>
        );
      }
    },
    {
      key: "annualFee",
      label: t('compare.metricAnnualFee', 'Annual Fee'),
      render: (card) => {
        const feeVal = parseAnnualFeeVal(card.annualFee);
        const isBestFee = bestMetrics.minFee !== null && feeVal === bestMetrics.minFee;
        const text = card.annualFee || (isHindi ? "मुफ़्त (₹0)" : "Free");

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
      label: isHindi ? 'कैशबैक' : 'Cashback',
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
      label: t('compare.metricCashback', 'Rewards & Cashback'),
      render: (card) => (
        <span className="text-xs font-normal leading-relaxed text-[#1F2937] dark:text-slate-300">
          {card.rewards || "N/A"}
        </span>
      )
    },
    {
      key: "loungeAccess",
      label: t('compare.metricLounge', 'Lounge Access'),
      render: (card) => {
        const visits = card.loungeVisits || 0;
        const isBestLounge = bestMetrics.maxLoungeVisits !== null && visits === bestMetrics.maxLoungeVisits && visits > 0;
        const text = card.loungeAccess || (isHindi ? "उपलब्ध नहीं" : "Not Available");

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
      label: t('compare.metricForex', 'Forex Markup'),
      render: (card) => {
        const fxVal = parseForexVal(card.forexMarkup);
        const isBestFx = bestMetrics.minForex !== null && fxVal === bestMetrics.minForex;
        const text = card.forexMarkup || (isHindi ? "उपलब्ध नहीं" : "Not Available");

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
      label: isHindi ? 'कॉन्टैक्टलेस' : 'Contactless',
      render: (card) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
          card.contactless 
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
            : "bg-slate-100 dark:bg-slate-800 text-[#6B7280]"
        }`}>
          {card.contactless 
            ? <><CheckCircle2 className="w-3 h-3 text-emerald-500" /> {isHindi ? 'समर्थित' : 'Supported'}</> 
            : <><XCircle className="w-3 h-3 text-slate-400" /> {isHindi ? 'समर्थित नहीं' : 'Not Supported'}</>}
        </span>
      )
    },
    {
      key: "internationalUsage",
      label: isHindi ? 'अंतरराष्ट्रीय उपयोग' : 'International Usage',
      render: (card) => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
          card.internationalUsage 
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" 
            : "bg-slate-100 dark:bg-slate-800 text-[#6B7280]"
        }`}>
          {card.internationalUsage 
            ? <><CheckCircle2 className="w-3 h-3 text-emerald-500" /> {isHindi ? 'समर्थित' : 'Supported'}</> 
            : <><XCircle className="w-3 h-3 text-slate-400" /> {isHindi ? 'केवल घरेलू' : 'Domestic Only'}</>}
        </span>
      )
    },
    {
      key: "bestFor",
      label: isHindi ? 'सर्वोत्तम उपयोग' : 'Best For',
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
      label: isHindi ? 'AI स्कोर' : 'AI Score',
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
      label: isHindi ? 'रेटिंग' : 'Rating',
      render: (card) => (
        <span className="font-bold text-amber-500 text-xs flex items-center gap-1 justify-center">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{card.rating ? card.rating.toFixed(1) : "N/A"}</span>
        </span>
      )
    },
    {
      key: "eligibility",
      label: isHindi ? 'पात्रता' : 'Eligibility',
      render: (card) => (
        <span className="text-xs text-[#1F2937] dark:text-slate-300 font-normal">
          {card.eligibility || (isHindi ? "नियमित बैंक खाताधारक" : "Standard Bank Customer")}
        </span>
      )
    },
    {
      key: "features",
      label: isHindi ? 'मुख्य विशेषताएं' : 'Features',
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
    <div className="w-full space-y-6">
      {/* ── MOBILE CARD COMPARISON VIEW (320px - 767px) ── */}
      <div className="block md:hidden space-y-4">
        <div className="text-center pb-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA]">
            {isHindi 
              ? `आमने-सामने कार्ड तुलना (${normalizedCards.length})` 
              : `Side-by-Side Mobile Comparison Cards (${normalizedCards.length})`}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {normalizedCards.map((card, idx) => (
            <div 
              key={card.id || idx}
              className="p-5 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft space-y-4 text-left"
            >
              {/* Card Header & Visual */}
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="w-20 shrink-0">
                  <DebitCardVisual mode="mini" card={card} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <BankLogo bankName={card.bank} size="xs" />
                    <span className="text-[10px] font-bold text-[#2563EB] dark:text-[#60A5FA] uppercase block truncate">
                      {card.bank || "Bank"}
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-[#1F2937] dark:text-white leading-tight truncate">
                    {card.cardName}
                  </h4>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] dark:bg-slate-800 text-[#2563EB] dark:text-[#60A5FA]">
                    {card.network || "Visa"}
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {rowDefinitions.map((row) => {
                  if (row.key === 'bank' || row.key === 'cardName' || row.key === 'network') return null;
                  return (
                    <div key={row.key} className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
                      <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        {row.label}
                      </span>
                      <div className="text-xs font-semibold text-[#1F2937] dark:text-slate-200">
                        {row.render(card)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DESKTOP MATRIX TABLE VIEW (>=768px) ── */}
      <div className="hidden md:block overflow-x-auto rounded-3xl border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-[#1E293B] shadow-soft">
        <table className="w-full text-left text-xs text-[#1F2937] dark:text-slate-200 border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#F8FAFC] dark:bg-slate-900 border-b border-[#E5E7EB] dark:border-slate-800">
              <th className="sticky left-0 z-20 bg-[#F8FAFC] dark:bg-slate-900 px-4 py-4 text-[#6B7280] dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider min-w-[140px]">
                {isHindi ? 'सुविधा तुलना' : 'Features Matrix'}
              </th>
              {normalizedCards.map((card, idx) => (
                <th key={card.id || idx} className="px-4 py-4 text-center min-w-[200px] max-w-[260px] align-top">
                  <div className="flex justify-center mb-2 transform hover:scale-105 transition-transform duration-300">
                    <DebitCardVisual mode="compare" card={card} />
                  </div>
                  <div className="font-bold text-[#1F2937] dark:text-white text-xs">
                    {card.cardName}
                  </div>
                  <div className="text-[10px] font-semibold text-[#2563EB] dark:text-[#60A5FA] mt-0.5 flex items-center justify-center gap-1.5">
                    <BankLogo bankName={card.bank} size="xs" />
                    <span>{card.bank}</span>
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
    </div>
  );
}

export default memo(ComparisonTable);
