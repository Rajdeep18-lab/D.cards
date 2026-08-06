import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { debitCards } from '../data/mockData';

function SavingsCalculator({ onViewDetails }) {
  const [shopping, setShopping] = useState(15000);
  const [travel, setTravel] = useState(10000);
  const [fuel, setFuel] = useState(5000);
  const [food, setFood] = useState(8000);
  const [online, setOnline] = useState(12000);

  const totalMonthlySpend = shopping + travel + fuel + food + online;

  const cardSavings = useMemo(() => {
    return debitCards.map(card => {
      // 1. Cashback calculations
      const rate = card.cashbackPct / 100;
      let cashback = (shopping + food + online) * rate;
      
      // Travel specific cashback
      if (card.category === "Travel") {
        cashback += travel * (rate * 1.5); // extra travel booster
      } else {
        cashback += travel * rate;
      }

      // 2. Fuel waiver calculations
      let fuelSavings = 0;
      const fuelStr = String(card?.fuelWaiver || "");
      const hasFuelWaiver = fuelStr && fuelStr !== "No" && !fuelStr.toLowerCase().includes("verify");
      if (hasFuelWaiver) {
        fuelSavings = Math.min(250, fuel * 0.01); // 1% surcharge waiver capped at ₹250
      }

      // 3. Lounge access rewards
      let loungeValue = 0;
      const loungeStr = String(card?.loungeAccess || "");
      const hasLounge = loungeStr && loungeStr !== "No" && !loungeStr.toLowerCase().startsWith("no");
      if (hasLounge) {
        loungeValue = 350; // estimated lifestyle value per month
      }

      // 4. Zero Forex savings
      let forexSavings = 0;
      const hasZeroForex = (card.features && Array.isArray(card.features) && card.features.some(f => String(f || '').toLowerCase().includes("zero forex"))) || 
                           (card.bestFor && String(card.bestFor).toLowerCase().includes("forex")) || 
                           (card.cardName && String(card.cardName).toLowerCase().includes("global"));
      if (hasZeroForex && travel > 0) {
        forexSavings = travel * 0.025; // 2.5% markup saved on travel spends
      }

      const grossMonthlyBenefit = cashback + fuelSavings + loungeValue + forexSavings;
      const annualFeeNum = typeof card.numAnnualFee === 'number' ? card.numAnnualFee : (typeof card.annualFee === 'number' ? card.annualFee : parseFloat(String(card.annualFee || '').replace(/[^0-9.]/g, '')) || 0);
      const monthlyFee = annualFeeNum / 12;
      const netMonthlyBenefit = Math.round(grossMonthlyBenefit - monthlyFee);
      const netYearlyBenefit = netMonthlyBenefit * 12;

      return {
        ...card,
        cashbackEarned: Math.round(cashback),
        fuelEarned: Math.round(fuelSavings),
        loungeEarned: Math.round(loungeValue),
        forexEarned: Math.round(forexSavings),
        netMonthlyBenefit,
        netYearlyBenefit
      };
    }).sort((a, b) => b.netMonthlyBenefit - a.netMonthlyBenefit);
  }, [shopping, travel, fuel, food, online]);

  const topRecommendations = useMemo(() => {
    return cardSavings.slice(0, 3);
  }, [cardSavings]);

  return (
    <section id="calculator" className="my-14 scroll-mt-20 font-sans">
      
      {/* ── HEADER ── */}
      <div className="mb-6 border-b border-highlight dark:border-darkHighlight pb-4 select-none">
        <h2 className="text-2xl font-bold font-serif text-primary dark:text-accent flex items-center gap-2">
          <span>📊</span> Savings Calculator 2.0
        </h2>
        <p className="text-sm text-textSoft dark:text-gray-400 mt-1 leading-relaxed">
          Input your monthly banking budgets and let our AI engine instantly calculate the absolute highest yearly benefit yield.
        </p>
      </div>

      {/* ── STRIPE-GRADE DUAL PANEL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 bg-cardBg dark:bg-[#0c0612]/45 backdrop-blur-xl rounded-[32px] p-6 md:p-8 shadow-soft border border-slate-200 dark:border-secondary/15 transition-colors duration-300">
        
        {/* Sliders Input Area */}
        <div className="space-y-4">
          <h3 className="text-sm font-black font-serif text-[#1E0B16] dark:text-[#F5D9E8] flex items-center gap-2 mb-2 select-none uppercase tracking-wider">
            <span>💳</span> Your Monthly Spends
          </h3>

          {[
            { label: "Shopping Spends", val: shopping, setVal: setShopping, max: 50000, icon: "🛍️", color: "from-[#A30D62] to-[#C21875]" },
            { label: "Travel Spends (International / Domestic)", val: travel, setVal: setTravel, max: 50000, icon: "✈️", color: "from-pink-500 to-rose-600" },
            { label: "Fuel Purchases", val: fuel, setVal: setFuel, max: 20000, icon: "⛽", color: "from-amber-500 to-orange-600" },
            { label: "Food & Dining", val: food, setVal: setFood, max: 30000, icon: "🍔", color: "from-emerald-500 to-green-600" },
            { label: "Online Spends / General Bills", val: online, setVal: setOnline, max: 50000, icon: "💻", color: "from-purple-500 to-pink-600" },
          ].map(({ label, val, setVal, max, icon, color }) => {
            const pct = (val / max) * 100;
            return (
              <div key={label} className="bg-slate-100/50 dark:bg-[#100619]/40 p-4 rounded-2xl border border-slate-200 dark:border-secondary/10 transition-colors">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-black text-slate-700 dark:text-[#D89AB6] flex items-center gap-2">
                    <span className="text-base select-none">{icon}</span>{label}
                  </span>
                  <span className="text-xs font-black text-secondary dark:text-roseGold bg-secondary/10 dark:bg-secondary/20 px-2.5 py-0.5 rounded-full select-none border border-secondary/10">
                    ₹{(val ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="relative h-6 flex items-center">
                  <div className="absolute w-full h-[5px] rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div 
                    className={`absolute h-[5px] rounded-full bg-gradient-to-r ${color} transition-all duration-100`} 
                    style={{ width: `${pct}%` }} 
                  />
                  <input
                    type="range" 
                    min={0} 
                    max={max} 
                    step={max <= 20000 ? 500 : 1000}
                    value={val} 
                    onChange={e => setVal(Number(e.target.value))}
                    className="absolute w-full appearance-none bg-transparent cursor-pointer z-10"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Recommendation Panel */}
        <div className="flex flex-col bg-white/40 dark:bg-[#060309]/30 p-6 rounded-[24px] border border-slate-200 dark:border-secondary/15 justify-between select-none">
          <div className="text-center pb-6 border-b border-slate-200 dark:border-secondary/15 flex-shrink-0">
            <p className="text-[10px] sm:text-[11px] font-black text-textSoft dark:text-roseGold uppercase tracking-widest font-serif">Estimated Annual Benefit</p>
            <h4 className="text-3xl font-black text-gradient mt-1 tracking-tight">₹{(topRecommendations[0]?.netYearlyBenefit ?? 0).toLocaleString('en-IN')}</h4>
            <p className="text-xs text-textMuted dark:text-slate-400 font-semibold mt-1">Net yearly savings linked to top recommendation</p>
            <div className="mt-4 py-2 px-3 bg-secondary/5 dark:bg-secondary/15 rounded-xl inline-flex items-center gap-1.5 border border-secondary/15 text-xs text-secondary dark:text-roseGold font-black uppercase tracking-wider">
              <span>💳</span> Monthly Spend Pool: ₹{(totalMonthlySpend ?? 0).toLocaleString('en-IN')}
            </div>
          </div>

          <div className="flex-1 py-5 space-y-4">
            <h5 className="text-xs font-black text-[#1E0B16] dark:text-[#F5D9E8] uppercase tracking-widest font-serif">Top Optimized Matches</h5>
            
            <div className="space-y-3">
              {topRecommendations.map((rec, index) => (
                <div 
                  key={rec.id}
                  onClick={() => onViewDetails && onViewDetails(rec)}
                  className={`group p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between hover:translate-x-1 ${
                    index === 0 
                      ? "bg-gradient-to-r from-secondary/10 to-primary/5 border-secondary/40 shadow-sm" 
                      : "bg-slate-100/50 dark:bg-[#100619]/40 border-slate-200 dark:border-secondary/10 hover:border-secondary/35 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full select-none ${
                        index === 0 ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" : "bg-gray-250 dark:bg-gray-800 text-textSoft dark:text-[#D89AB6]"
                      }`}>
                        #{index + 1}
                      </span>
                      <p className="text-xs font-black text-slate-800 dark:text-slate-100 group-hover:text-secondary transition-colors truncate">{rec.cardName}</p>
                    </div>
                    <p className="text-[10.5px] text-textSoft dark:text-slate-400 font-extrabold mt-1 pl-5 uppercase tracking-wider">{rec.bank}</p>
                  </div>
                  
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-xs font-black text-secondary dark:text-roseGold">
                      +₹{rec.netMonthlyBenefit}/mo
                    </p>
                    <p className="text-[10px] text-textMuted dark:text-slate-500 font-bold mt-0.5 uppercase tracking-wider">Net Savings</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-xs text-textMuted dark:text-[#B07A95]/80 text-center leading-relaxed mt-2 border-t border-slate-200 dark:border-secondary/15 pt-4 font-semibold font-sans">
            Estimated returns factor in cashback, standard fuel waivers, domestic lounge utility values and absolute card fees.
          </div>
        </div>

      </div>
    </section>
  );
}

export default SavingsCalculator;
