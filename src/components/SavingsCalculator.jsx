import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { debitCards } from '../data/mockData';
import { ShoppingBag, Plane, Fuel, Utensils, Laptop, CreditCard, Calculator } from 'lucide-react';

/**
 * Safely converts any input (string with ₹, %, commas, null, undefined, NaN) into a valid number.
 * Defaults to 0 if parsing fails.
 */
function safeNumber(value) {
  if (value === null || value === undefined) return 0;
  if (typeof value === "string") {
    const cleaned = value.replace(/[₹,%\s]/g, "").trim();
    const parsed = Number(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

function SavingsCalculator({ onViewDetails, cards }) {
  const [shopping, setShopping] = useState(15000);
  const [travel, setTravel] = useState(10000);
  const [fuel, setFuel] = useState(5000);
  const [food, setFood] = useState(8000);
  const [online, setOnline] = useState(12000);

  const sShopping = safeNumber(shopping);
  const sTravel = safeNumber(travel);
  const sFuel = safeNumber(fuel);
  const sFood = safeNumber(food);
  const sOnline = safeNumber(online);

  const totalMonthlySpend = sShopping + sTravel + sFuel + sFood + sOnline;

  const cardSavings = useMemo(() => {
    const sourceCards = (Array.isArray(cards) && cards.length > 0) ? cards : debitCards;

    return sourceCards.map(card => {
      if (!card || typeof card !== 'object') {
        return {
          cardName: 'Debit Card',
          bank: 'Bank',
          netMonthlyBenefit: 0,
          netYearlyBenefit: 0
        };
      }

      // 1. Cashback Percentage Calculation
      let cashbackPct = safeNumber(card.cashbackPct);
      if (cashbackPct === 0 && card.cashback) {
        cashbackPct = safeNumber(card.cashback);
      }
      if (cashbackPct === 0 && card.rewardRate) {
        cashbackPct = safeNumber(card.rewardRate);
      }
      if (cashbackPct === 0 && typeof card.cashback === 'string') {
        const match = card.cashback.match(/(\d+(?:\.\d+)?)\s*%/);
        if (match) cashbackPct = safeNumber(match[1]);
      }
      if (cashbackPct === 0 && Array.isArray(card.features)) {
        for (const feat of card.features) {
          const str = String(feat || '');
          const match = str.match(/(\d+(?:\.\d+)?)\s*%/);
          if (match) {
            cashbackPct = safeNumber(match[1]);
            break;
          }
        }
      }
      if (isNaN(cashbackPct) || cashbackPct < 0) cashbackPct = 0;

      // Rate formula (e.g. 5% -> 0.05, 1% -> 0.01)
      const rate = cashbackPct > 1 ? cashbackPct / 100 : (cashbackPct > 0 ? cashbackPct : 0.01);

      // Category / spend cashback
      let cashback = (sShopping + sFood + sOnline) * rate;
      const categoryStr = String(card.category || '').toLowerCase();
      if (categoryStr.includes("travel")) {
        cashback += sTravel * (rate * 1.5);
      } else {
        cashback += sTravel * rate;
      }
      if (isNaN(cashback)) cashback = 0;

      // 2. Fuel Waiver Calculation
      let fuelSavings = safeNumber(card.fuelBenefit);
      if (fuelSavings === 0) {
        const fuelStr = String(card.fuelWaiver || "");
        const hasFuelWaiver = fuelStr && fuelStr !== "No" && !fuelStr.toLowerCase().startsWith("no") && !fuelStr.toLowerCase().includes("verify");
        if (hasFuelWaiver) {
          fuelSavings = Math.min(250, sFuel * 0.01);
        }
      }
      if (isNaN(fuelSavings)) fuelSavings = 0;

      // 3. Lounge Access Value
      let loungeValue = 0;
      const loungeStr = String(card.loungeAccess || "");
      const hasLounge = loungeStr && loungeStr !== "No" && !loungeStr.toLowerCase().startsWith("no");
      if (hasLounge) {
        loungeValue = 350;
      }
      if (isNaN(loungeValue)) loungeValue = 0;

      // 4. Zero Forex Savings
      let forexSavings = safeNumber(card.forexMarkup);
      if (forexSavings === 0) {
        const hasZeroForex = (Array.isArray(card.features) && card.features.some(f => String(f || '').toLowerCase().includes("zero forex"))) || 
                             String(card.bestFor || '').toLowerCase().includes("forex") || 
                             String(card.cardName || '').toLowerCase().includes("global");
        if (hasZeroForex && sTravel > 0) {
          forexSavings = sTravel * 0.025;
        }
      }
      if (isNaN(forexSavings)) forexSavings = 0;

      // Annual & Monthly Fee
      let annualFeeNum = safeNumber(card.numAnnualFee);
      if (annualFeeNum === 0 && card.annualFee !== undefined) {
        annualFeeNum = safeNumber(card.annualFee);
      }
      if (isNaN(annualFeeNum) || annualFeeNum < 0) annualFeeNum = 0;

      const monthlyFee = annualFeeNum / 12;
      const grossMonthlyBenefit = cashback + fuelSavings + loungeValue + forexSavings;

      let netMonthlyBenefit = Math.round(grossMonthlyBenefit - monthlyFee);
      if (isNaN(netMonthlyBenefit)) netMonthlyBenefit = 0;

      let netYearlyBenefit = Math.round(netMonthlyBenefit * 12);
      if (isNaN(netYearlyBenefit)) netYearlyBenefit = 0;

      return {
        ...card,
        cardName: card.cardName || 'Debit Card',
        bank: card.bank || 'Bank',
        cashbackEarned: Math.round(cashback),
        fuelEarned: Math.round(fuelSavings),
        loungeEarned: Math.round(loungeValue),
        forexEarned: Math.round(forexSavings),
        netMonthlyBenefit,
        netYearlyBenefit
      };
    }).sort((a, b) => (b.netMonthlyBenefit || 0) - (a.netMonthlyBenefit || 0));
  }, [cards, sShopping, sTravel, sFuel, sFood, sOnline]);

  const topRecommendations = useMemo(() => {
    return cardSavings.slice(0, 3);
  }, [cardSavings]);

  const topBenefit = safeNumber(topRecommendations[0]?.netYearlyBenefit);

  return (
    <section id="calculator" className="my-14 scroll-mt-20 font-sans text-left">
      
      {/* ── HEADER ── */}
      <div className="mb-6 border-b border-[#E5E7EB] dark:border-slate-800 pb-4 select-none">
        <h2 className="text-2xl font-bold text-[#1F2937] dark:text-white flex items-center gap-2">
          <span>📊</span> Savings Calculator 2.0
        </h2>
        <p className="text-sm text-[#6B7280] dark:text-slate-400 mt-1 leading-relaxed">
          Input your monthly banking budgets and let our AI engine instantly calculate the absolute highest yearly benefit yield.
        </p>
      </div>

      {/* ── DUAL PANEL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 bg-white dark:bg-[#1E293B] rounded-[32px] p-6 md:p-8 shadow-soft border border-[#E5E7EB] dark:border-slate-700 transition-colors duration-300">
        
        {/* Sliders Input Area */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-[#1F2937] dark:text-white flex items-center gap-2 mb-2 select-none uppercase tracking-wider">
            <CreditCard className="w-4 h-4 text-[#2563EB]" /> Your Monthly Spends
          </h3>

          {[
            { label: "Shopping Spends", val: sShopping, setVal: setShopping, max: 50000, icon: ShoppingBag, color: "from-[#2563EB] to-[#3B82F6]" },
            { label: "Travel Spends (International / Domestic)", val: sTravel, setVal: setTravel, max: 50000, icon: Plane, color: "from-[#3B82F6] to-[#60A5FA]" },
            { label: "Fuel Purchases", val: sFuel, setVal: setFuel, max: 20000, icon: Fuel, color: "from-amber-500 to-orange-600" },
            { label: "Food & Dining", val: sFood, setVal: setFood, max: 30000, icon: Utensils, color: "from-emerald-500 to-green-600" },
            { label: "Online Spends / General Bills", val: sOnline, setVal: setOnline, max: 50000, icon: Laptop, color: "from-blue-600 to-indigo-600" },
          ].map(({ label, val, setVal, max, icon: IconComp, color }) => {
            const pct = Math.min(100, Math.max(0, (val / max) * 100));
            return (
              <div key={label} className="bg-[#F8FAFC] dark:bg-slate-800/60 p-4 rounded-2xl border border-[#E5E7EB] dark:border-slate-700 transition-colors">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-semibold text-[#1F2937] dark:text-slate-200 flex items-center gap-2">
                    <IconComp className="w-4 h-4 text-[#2563EB]" />{label}
                  </span>
                  <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] bg-[#2563EB]/10 px-2.5 py-0.5 rounded-full select-none border border-[#2563EB]/20">
                    ₹{val.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="relative h-7 flex items-center touch-action-pan-x">
                  <div className="absolute w-full h-[6px] rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div 
                    className={`absolute h-[6px] rounded-full bg-gradient-to-r ${color} transition-all duration-75`} 
                    style={{ width: `${pct}%` }} 
                  />
                  <input
                    type="range" 
                    min={0} 
                    max={max} 
                    step={max <= 20000 ? 500 : 1000}
                    value={val} 
                    onChange={e => setVal(safeNumber(e.target.value))}
                    className="absolute w-full appearance-none bg-transparent cursor-pointer z-10 touch-none py-1"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Recommendation Panel */}
        <div className="flex flex-col bg-[#F8FAFC] dark:bg-slate-900/80 p-6 rounded-3xl border border-[#E5E7EB] dark:border-slate-700 justify-between select-none shadow-sm">
          <div className="text-center pb-6 border-b border-[#E5E7EB] dark:border-slate-700 flex-shrink-0">
            <p className="text-[10px] sm:text-[11px] font-semibold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-widest">Estimated Annual Benefit</p>
            <h4 className="text-3xl font-bold text-[#1F2937] dark:text-white mt-1 tracking-tight">₹{topBenefit.toLocaleString('en-IN')}</h4>
            <p className="text-xs text-[#6B7280] dark:text-slate-400 font-normal mt-1">Net yearly savings linked to top recommendation</p>
            <div className="mt-4 py-2 px-3 bg-[#2563EB]/10 rounded-xl inline-flex items-center gap-1.5 border border-[#2563EB]/20 text-xs text-[#2563EB] dark:text-[#60A5FA] font-semibold uppercase tracking-wider">
              <Calculator className="w-4 h-4" /> Monthly Spend Pool: ₹{totalMonthlySpend.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="flex-1 py-5 space-y-4">
            <h5 className="text-xs font-bold text-[#1F2937] dark:text-white uppercase tracking-wider">Top Optimized Matches</h5>
            
            <div className="space-y-3">
              {topRecommendations.map((rec, index) => {
                const monthlySavings = safeNumber(rec.netMonthlyBenefit);
                return (
                  <div 
                    key={rec.id || index}
                    onClick={() => onViewDetails && onViewDetails(rec)}
                    className={`group p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between hover:border-[#2563EB] ${
                      index === 0 
                        ? "bg-white dark:bg-slate-800 border-[#2563EB]/40 shadow-sm" 
                        : "bg-white/60 dark:bg-slate-800/40 border-[#E5E7EB] dark:border-slate-700 text-[#1F2937] dark:text-slate-200"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full select-none ${
                          index === 0 ? "bg-[#2563EB] text-white" : "bg-slate-200 dark:bg-slate-700 text-[#6B7280] dark:text-slate-300"
                        }`}>
                          #{index + 1}
                        </span>
                        <p className="text-xs font-bold text-[#1F2937] dark:text-white group-hover:text-[#2563EB] transition-colors truncate">{rec.cardName}</p>
                      </div>
                      <p className="text-[10.5px] text-[#6B7280] dark:text-slate-400 font-semibold mt-1 pl-5 uppercase tracking-wider">{rec.bank}</p>
                    </div>
                    
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA]">
                        +₹{monthlySavings.toLocaleString('en-IN')}/mo
                      </p>
                      <p className="text-[10px] text-[#6B7280] dark:text-slate-500 font-semibold mt-0.5 uppercase tracking-wider">Net Savings</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-[#6B7280] dark:text-slate-400 text-center leading-relaxed mt-2 border-t border-[#E5E7EB] dark:border-slate-700 pt-4 font-medium">
            Estimated returns factor in cashback, standard fuel waivers, domestic lounge utility values and absolute card fees.
          </div>
        </div>

      </div>
    </section>
  );
}

export default SavingsCalculator;
