import { useMemo, memo } from "react";
import DebitCardVisual from "./DebitCardVisual";

function ComparisonTable({ cards = [] }) {
  const safeCards = Array.isArray(cards) ? cards.filter(Boolean) : [];

  const lowestFee = safeCards.length > 0 
    ? Math.min(...safeCards.map(c => typeof c.annualFee === 'number' ? c.annualFee : parseFloat(String(c.annualFee || '').replace(/[^0-9.]/g, '')) || 0)) 
    : 0;
  const highestCashback = safeCards.length > 0 ? Math.max(...safeCards.map(c => c.cashbackPct || 0)) : 0;
  const highestLimit = safeCards.length > 0 ? Math.max(...safeCards.map(c => c.maxLimit || 0)) : 0;

  // Algorithmic Overall Winner Calculator
  const winnerCard = useMemo(() => {
    if (safeCards.length < 2) return null;
    let best = safeCards[0];
    let maxScore = -1000;
    
    safeCards.forEach(card => {
      if (!card) return;
      let score = 0;
      score += (card.rating || 0) * 15;
      score += (card.cashbackPct || 0) * 20;
      score += (card.interestRate || 0) * 12;
      const fee = typeof card.annualFee === 'number' ? card.annualFee : parseFloat(String(card.annualFee || '').replace(/[^0-9.]/g, '')) || 0;
      const minBal = typeof card.minBalance === 'number' ? card.minBalance : parseFloat(String(card.minBalance || '').replace(/[^0-9.]/g, '')) || 0;
      score -= (fee / 50); // fee penalty
      score -= (minBal / 10000); // min balance penalty
      if (card.studentFriendly) score += 8;
      if (card.travelZeroForex) score += 12;
      if (card.healthcareFriendly) score += 10;
      if (card.isPopular) score += 5;
      
      if (score > maxScore) {
        maxScore = score;
        best = card;
      }
    });
    return best;
  }, [safeCards]);

  if (safeCards.length === 0) {
    return (
      <div className="text-center py-10 text-textMuted dark:text-slate-400 font-bold select-none leading-relaxed">
        📊 Select cards above to populate the comparative analytics matrix.
      </div>
    );
  }

  return (
    <div 
      className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-secondary/15 bg-white/45 dark:bg-[#09050a]/45 backdrop-blur-xl shadow-lg"
    >
      <table className="min-w-full text-left text-xs text-slate-800 dark:text-slate-200 border-collapse">
        <thead>
          <tr className="bg-slate-100 dark:bg-secondary/10 border-b border-slate-200 dark:border-secondary/20">
            {['Bank Name', 'Debit Card Model', 'Annual Maintenance', 'Savings Rate', 'Cashback Spends', 'Min Balance Req', 'Key Features', 'Specs Rating'].map(h => (
              <th key={h} className="px-5 py-4 font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap text-[9px]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-secondary/10">
          {safeCards.map((card, i) => {
            if (!card) return null;
            const isWinner = winnerCard && card.id === winnerCard.id;
            const feeNum = typeof card.annualFee === 'number' ? card.annualFee : parseFloat(String(card.annualFee || '').replace(/[^0-9.]/g, '')) || 0;
            const minBalNum = typeof card.minBalance === 'number' ? card.minBalance : (card.minBalance != null ? parseFloat(String(card.minBalance).replace(/[^0-9.]/g, '')) : null);

            return (
              <tr 
                key={card.id || i}
                className={`transition-all duration-300 ${
                  isWinner 
                    ? "bg-secondary/5 dark:bg-secondary/10 hover:bg-secondary/10 dark:hover:bg-secondary/15" 
                    : "hover:bg-slate-50 dark:hover:bg-secondary/5"
                }`}
                style={{
                  outline: isWinner ? "1.5px solid rgba(245, 158, 11, 0.5)" : "none",
                  outlineOffset: "-1.5px"
                }}
              >
                <td className="px-5 py-5 font-extrabold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    {card.bank || "Unknown Bank"}
                    {isWinner && (
                      <span className="text-[10px] animate-bounce" title="Overall Best Matrix Score">👑</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-5 min-w-[200px]">
                  <div className="mb-3 w-full flex justify-center transform hover:scale-105 transition-transform duration-300">
                    <DebitCardVisual mode="compare" card={card} />
                  </div>
                  <div className="font-extrabold text-slate-800 dark:text-slate-100 text-center">{card.cardName || "Debit Card"}</div>
                  
                  {/* Dynamic Winner Medals */}
                  <div className="flex flex-wrap gap-1 mt-2.5 justify-center">
                    {isWinner && (
                      <span className="bg-yellow-500/15 border border-yellow-500/35 text-yellow-600 dark:text-yellow-400 text-[8px] font-black px-2.5 py-0.5 rounded-lg select-none whitespace-nowrap tracking-wide uppercase">
                        👑 Matrix Winner
                      </span>
                    )}
                    {feeNum === lowestFee && (
                      <span className="bg-green-500/15 border border-green-500/35 text-green-600 dark:text-green-400 text-[8px] font-black px-2.5 py-0.5 rounded-lg select-none whitespace-nowrap tracking-wide uppercase">
                        🏆 Lowest Fee
                      </span>
                    )}
                    {(card.cashbackPct || 0) === highestCashback && (card.cashbackPct || 0) > 0 && (
                      <span className="bg-pink-500/15 border border-pink-500/35 text-pink-600 dark:text-pink-400 text-[8px] font-black px-2.5 py-0.5 rounded-lg select-none whitespace-nowrap tracking-wide uppercase">
                        🏆 Best Cashback
                      </span>
                    )}
                    {(card.maxLimit || 0) === highestLimit && (card.maxLimit || 0) > 0 && (
                      <span className="bg-violet-500/15 border border-violet-500/35 text-violet-600 dark:text-violet-400 text-[8px] font-black px-2.5 py-0.5 rounded-lg select-none whitespace-nowrap tracking-wide uppercase">
                        🏆 Highest Limit
                      </span>
                    )}
                    {card.travelZeroForex && (
                      <span className="bg-sky-500/15 border border-sky-500/35 text-sky-600 dark:text-sky-400 text-[8px] font-black px-2.5 py-0.5 rounded-lg select-none whitespace-nowrap tracking-wide uppercase">
                        ✈️ Best Travel
                      </span>
                    )}
                    {card.studentFriendly && (
                      <span className="bg-cyan-500/15 border border-cyan-500/35 text-cyan-600 dark:text-cyan-400 text-[8px] font-black px-2.5 py-0.5 rounded-lg select-none whitespace-nowrap tracking-wide uppercase">
                        🎓 Best Student
                      </span>
                    )}
                    {card.healthcareFriendly && (
                      <span className="bg-emerald-500/15 border border-emerald-500/35 text-emerald-600 dark:text-emerald-400 text-[8px] font-black px-2.5 py-0.5 rounded-lg select-none whitespace-nowrap tracking-wide uppercase">
                        🏥 Wellness Perks
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-5 font-black text-slate-800 dark:text-slate-100 whitespace-nowrap text-sm">
                  {feeNum === 0 ? "Lifetime Free" : (card.annualFee ? (typeof card.annualFee === 'number' ? `₹${card.annualFee.toLocaleString('en-IN')}` : String(card.annualFee)) : "N/A")}
                </td>
                <td className="px-5 py-5 font-bold text-secondary dark:text-roseGold whitespace-nowrap text-sm">
                  {card.interestRate != null ? `${card.interestRate}% p.a.` : "N/A"}
                </td>
                <td className="px-5 py-5 font-semibold text-slate-600 dark:text-slate-300 max-w-[150px]">
                  {card.cashback || "N/A"}
                </td>
                <td className="px-5 py-5 font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap text-sm">
                  {minBalNum === 0 ? "Zero Balance" : (minBalNum != null && !isNaN(minBalNum) ? `₹${minBalNum.toLocaleString('en-IN')}` : "N/A")}
                </td>
                <td className="px-5 py-5 text-textSoft dark:text-slate-400 text-[11px] leading-relaxed max-w-[200px] font-sans">
                  {card.benefits || "N/A"}
                </td>
                <td className="px-5 py-5 font-black text-secondary dark:text-roseGold whitespace-nowrap text-sm">
                  ★ {card.rating ?? "N/A"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default memo(ComparisonTable);
