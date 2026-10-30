import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { debitCards } from '../data/mockData';
import { savingsAccounts } from '../data/savingsAccounts/index.js';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShoppingBag, 
  Plane, 
  Fuel, 
  Utensils, 
  Laptop, 
  CreditCard, 
  Calculator, 
  TrendingUp, 
  Target, 
  Sparkles, 
  HelpCircle, 
  Download, 
  Printer, 
  RotateCcw, 
  Bookmark, 
  Trash2, 
  CheckCircle2, 
  Info, 
  ShieldCheck, 
  ExternalLink, 
  Building2, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Percent, 
  Calendar, 
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { 
  calculateSavingsProjection, 
  formatINR, 
  sanitizeNumber, 
  FREQUENCIES, 
  COMPOUNDING_FREQUENCIES, 
  QUICK_PRESETS 
} from '../utils/savingsCalculations';

/**
 * Safely converts any input into a valid number (used by debit card calculator).
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

const STORAGE_KEY = 'dcard_saved_savings_plans';

function SavingsCalculator({ onViewDetails, cards }) {
  const { isHindi, t } = useLanguage();

  // Top-level Navigation Mode: 'savings' (Savings & Wealth Growth) vs 'debitCards' (Spend & Reward Yield)
  const [calculatorMode, setCalculatorMode] = useState('savings');

  // Savings Calculator Experience Mode: 'beginner' vs 'advanced'
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  // Core Inputs
  const [initialDeposit, setInitialDeposit] = useState(0);
  const [contribution, setContribution] = useState(1000);
  const [frequency, setFrequency] = useState('monthly');
  const [durationValue, setDurationValue] = useState(3);
  const [durationUnit, setDurationUnit] = useState('years'); // 'years' | 'months'
  const [annualRate, setAnnualRate] = useState(3.5);
  const [targetAmount, setTargetAmount] = useState(50000);

  // Advanced Inputs
  const [compoundingFrequency, setCompoundingFrequency] = useState('quarterly');
  const [timing, setTiming] = useState('end'); // 'beginning' | 'end'
  const [inflationRate, setInflationRate] = useState(5.5);
  const [enableInflation, setEnableInflation] = useState(false);
  const [stepUpRate, setStepUpRate] = useState(0); // Annual % increase

  // Multi-scenario comparison in Advanced Mode
  const [compareScenarios, setCompareScenarios] = useState(false);
  const [scenarioRates, setScenarioRates] = useState({
    conservative: 2.7,
    base: 3.5,
    high: 6.5
  });

  // UI state
  const [activePreset, setActivePreset] = useState('custom');
  const [showMilestones, setShowMilestones] = useState(true);
  const [showBankRates, setShowBankRates] = useState(false);
  const [selectedBankNote, setSelectedBankNote] = useState(null);
  const [chartHoverIndex, setChartHoverIndex] = useState(null);
  const [savedPlans, setSavedPlans] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // --- PRESERVED DEBIT CARD SPEND STATE ---
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

  // Handle Preset Selection
  const applyPreset = (preset) => {
    setActivePreset(preset.id);
    setInitialDeposit(preset.initialDeposit);
    setContribution(preset.contribution);
    setFrequency(preset.frequency);
    setDurationValue(preset.durationValue);
    setDurationUnit(preset.durationUnit);
    setAnnualRate(preset.annualRate);
    if (preset.targetAmount) {
      setTargetAmount(preset.targetAmount);
    }
    setSelectedBankNote(null);
  };

  // Reset Calculator to clean defaults
  const handleReset = () => {
    setActivePreset('custom');
    setInitialDeposit(0);
    setContribution(1000);
    setFrequency('monthly');
    setDurationValue(2);
    setDurationUnit('years');
    setAnnualRate(3.5);
    setTargetAmount(50000);
    setCompoundingFrequency('quarterly');
    setTiming('end');
    setInflationRate(5.5);
    setEnableInflation(false);
    setStepUpRate(0);
    setCompareScenarios(false);
    setSelectedBankNote(null);
  };

  // Primary Savings Calculation Result
  const projectionResult = useMemo(() => {
    return calculateSavingsProjection({
      initialDeposit,
      contribution,
      frequency,
      durationValue,
      durationUnit,
      annualRate,
      compoundingFrequency,
      timing,
      inflationRate: enableInflation ? inflationRate : 0,
      stepUpRate,
      targetAmount
    });
  }, [
    initialDeposit,
    contribution,
    frequency,
    durationValue,
    durationUnit,
    annualRate,
    compoundingFrequency,
    timing,
    enableInflation,
    inflationRate,
    stepUpRate,
    targetAmount
  ]);

  // Comparison Scenarios (Advanced Mode)
  const comparisonResults = useMemo(() => {
    if (!compareScenarios) return null;
    const conservative = calculateSavingsProjection({
      initialDeposit,
      contribution,
      frequency,
      durationValue,
      durationUnit,
      annualRate: scenarioRates.conservative,
      compoundingFrequency,
      timing,
      inflationRate: enableInflation ? inflationRate : 0,
      stepUpRate,
      targetAmount
    });
    const base = calculateSavingsProjection({
      initialDeposit,
      contribution,
      frequency,
      durationValue,
      durationUnit,
      annualRate: scenarioRates.base,
      compoundingFrequency,
      timing,
      inflationRate: enableInflation ? inflationRate : 0,
      stepUpRate,
      targetAmount
    });
    const high = calculateSavingsProjection({
      initialDeposit,
      contribution,
      frequency,
      durationValue,
      durationUnit,
      annualRate: scenarioRates.high,
      compoundingFrequency,
      timing,
      inflationRate: enableInflation ? inflationRate : 0,
      stepUpRate,
      targetAmount
    });
    return { conservative, base, high };
  }, [
    compareScenarios,
    scenarioRates,
    initialDeposit,
    contribution,
    frequency,
    durationValue,
    durationUnit,
    compoundingFrequency,
    timing,
    enableInflation,
    inflationRate,
    stepUpRate,
    targetAmount
  ]);

  // Verified Banks from D.CARD database
  const verifiedBanksList = useMemo(() => {
    if (!Array.isArray(savingsAccounts)) return [];
    const seen = new Set();
    const list = [];
    savingsAccounts.forEach(acc => {
      const bank = acc.bank_name || acc.bank;
      const rateVal = sanitizeNumber(acc.interestRateValue || acc.interest_rate);
      if (bank && rateVal > 0 && !seen.has(bank)) {
        seen.add(bank);
        list.push({
          id: acc.id || acc.product_id,
          bank: bank,
          accountName: acc.variant_name || acc.accountName || `${bank} Savings Account`,
          rate: rateVal,
          rateString: acc.interest_rate || `${rateVal}% p.a.`,
          frequency: acc.interest_credit_frequency || 'Quarterly',
          sourceUrl: acc.officialSourceUrl || acc.source,
          lastVerified: acc.lastVerified || acc.as_of_date || 'August 2026',
        });
      }
    });
    return list.slice(0, 8);
  }, []);

  // Handle Save Plan
  const handleSavePlan = () => {
    const newPlan = {
      id: Date.now(),
      title: `${FREQUENCIES[frequency]?.label || 'Regular'} Plan (₹${formatINR(contribution, { showSymbol: false })}/${FREQUENCIES[frequency]?.shortLabel || 'mo'})`,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      initialDeposit,
      contribution,
      frequency,
      durationValue,
      durationUnit,
      annualRate,
      targetAmount,
      finalBalance: projectionResult.nominalFinalBalance,
      interestEarned: projectionResult.nominalInterestEarned,
      totalContributed: projectionResult.totalContributions
    };
    const updated = [newPlan, ...savedPlans.slice(0, 4)];
    setSavedPlans(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleRemoveSavedPlan = (id) => {
    const updated = savedPlans.filter(p => p.id !== id);
    setSavedPlans(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
  };

  const handleLoadSavedPlan = (plan) => {
    setInitialDeposit(plan.initialDeposit);
    setContribution(plan.contribution);
    setFrequency(plan.frequency);
    setDurationValue(plan.durationValue);
    setDurationUnit(plan.durationUnit);
    setAnnualRate(plan.annualRate);
    if (plan.targetAmount) setTargetAmount(plan.targetAmount);
    setActivePreset('custom');
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      "Milestone",
      "Year",
      "Month",
      "Total Contributed (INR)",
      "Estimated Interest (INR)",
      "Nominal Balance (INR)",
      "Inflation Adjusted Real Value (INR)"
    ];
    const rows = projectionResult.chartData.map(d => [
      `"${d.label}"`,
      d.year,
      d.month,
      d.contributed,
      d.interest,
      d.balance,
      d.realBalance
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dcard_savings_growth_projection_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Summary
  const handlePrint = () => {
    window.print();
  };

  // Preserved Debit Card Cashback Calculation
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

      const rate = cashbackPct > 1 ? cashbackPct / 100 : (cashbackPct > 0 ? cashbackPct : 0.01);

      let cashback = (sShopping + sFood + sOnline) * rate;
      const categoryStr = String(card.category || '').toLowerCase();
      if (categoryStr.includes("travel")) {
        cashback += sTravel * (rate * 1.5);
      } else {
        cashback += sTravel * rate;
      }
      if (isNaN(cashback)) cashback = 0;

      let fuelSavings = safeNumber(card.fuelBenefit);
      if (fuelSavings === 0) {
        const fuelStr = String(card.fuelWaiver || "");
        const hasFuelWaiver = fuelStr && fuelStr !== "No" && !fuelStr.toLowerCase().startsWith("no") && !fuelStr.toLowerCase().includes("verify");
        if (hasFuelWaiver) {
          fuelSavings = Math.min(250, sFuel * 0.01);
        }
      }
      if (isNaN(fuelSavings)) fuelSavings = 0;

      let loungeValue = 0;
      const loungeStr = String(card.loungeAccess || "");
      const hasLounge = loungeStr && loungeStr !== "No" && !loungeStr.toLowerCase().startsWith("no");
      if (hasLounge) {
        loungeValue = 350;
      }
      if (isNaN(loungeValue)) loungeValue = 0;

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

  // SVG Chart Dimensions & Path Generation
  const chartWidth = 600;
  const chartHeight = 220;
  const padding = { top: 20, right: 25, bottom: 35, left: 20 };

  const { balancePath, contributedPath, realPath, points, maxVal } = useMemo(() => {
    const data = projectionResult.chartData;
    if (!data || data.length === 0) {
      return { balancePath: '', contributedPath: '', realPath: '', points: [], maxVal: 1 };
    }
    const maxBalance = Math.max(...data.map(d => d.balance), projectionResult.goalProgress.target || 0, 100);
    const usableW = chartWidth - padding.left - padding.right;
    const usableH = chartHeight - padding.top - padding.bottom;

    const mappedPoints = data.map((d, i) => {
      const x = padding.left + (i / (data.length - 1 || 1)) * usableW;
      const yBal = chartHeight - padding.bottom - (d.balance / maxBalance) * usableH;
      const yCont = chartHeight - padding.bottom - (d.contributed / maxBalance) * usableH;
      const yReal = chartHeight - padding.bottom - (d.realBalance / maxBalance) * usableH;
      return { ...d, x, yBal, yCont, yReal };
    });

    const bPath = mappedPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.yBal.toFixed(1)}`, '');
    const cPath = mappedPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.yCont.toFixed(1)}`, '');
    const rPath = mappedPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.yReal.toFixed(1)}`, '');

    return {
      balancePath: bPath,
      contributedPath: cPath,
      realPath: rPath,
      points: mappedPoints,
      maxVal: maxBalance
    };
  }, [projectionResult.chartData, projectionResult.goalProgress.target]);

  const activeHoverPoint = chartHoverIndex !== null && points[chartHoverIndex] 
    ? points[chartHoverIndex] 
    : points[points.length - 1] || null;

  return (
    <section id="calculator" className="my-14 scroll-mt-20 font-sans text-left transition-colors">
      
      {/* ── TOP NAV / DUAL CALCULATOR MODE SWITCHER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-[#E5E7EB] dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-bold uppercase tracking-wider mb-2 border border-[#2563EB]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isHindi ? 'वित्तीय नियोजन एवं विश्लेषण टूल' : 'FINANCIAL PLANNING & WEALTH ENGINE'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-white tracking-tight flex items-center gap-2.5">
            <span>{calculatorMode === 'savings' ? '📊' : '💳'}</span>
            <span>{t('savingsAccounts.calculatorTitle', 'Savings & Wealth Growth Calculator')}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {calculatorMode === 'savings'
              ? (isHindi 
                  ? 'अपनी बचत योजना बनाएं, चक्रवृद्धि ब्याज वृद्धि का सटीक अनुकरण करें, महंगाई के वास्तविक प्रभाव को समझें और वित्तीय लक्ष्यों को प्राप्त करें।'
                  : 'Calculate wealth growth on small or large deposits, simulate compound interest, account for inflation, and track personal savings milestones.')
              : (isHindi
                  ? 'अपने मासिक खर्च दर्ज करें और देखें कि कौन सा डेबिट कार्ड आपको अधिकतम कैशबैक व वार्षिक रिवॉर्ड्स देता है।'
                  : 'Input your monthly banking spends and calculate the highest annual net benefit yield across debit cards.')}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setCalculatorMode('savings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              calculatorMode === 'savings'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t('savingsAccounts.modeSavings', 'Savings Growth')}</span>
          </button>
          <button
            onClick={() => setCalculatorMode('debitCards')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              calculatorMode === 'debitCards'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{t('savingsAccounts.modeDebitCards', 'Card Rewards')}</span>
          </button>
        </div>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* ── MODE 1: SAVINGS & WEALTH GROWTH PLANNER (NEW ADVANCED & ACCESSIBLE) ── */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {calculatorMode === 'savings' && (
        <div className="space-y-8">
          
          {/* Quick-Start Presets Bar */}
          <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-5 border border-[#E5E7EB] dark:border-slate-700/80 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                {t('savingsAccounts.quickPresets', 'Quick Start Presets')}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 italic">
                {t('savingsAccounts.presetDisclaimer', 'Presets are illustrative examples, not financial advice.')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {QUICK_PRESETS.map((preset) => {
                const isSelected = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#2563EB]/10 dark:bg-[#2563EB]/20 border-[#2563EB] shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <p className={`text-xs font-extrabold ${isSelected ? 'text-[#2563EB] dark:text-[#60A5FA]' : 'text-slate-800 dark:text-white'}`}>
                        {isHindi ? preset.titleHi : preset.title}
                      </p>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {isHindi ? preset.descriptionHi : preset.description}
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold mt-2 uppercase tracking-wider ${isSelected ? 'text-[#2563EB] dark:text-[#60A5FA]' : 'text-slate-400'}`}>
                      {isSelected ? '✓ Active' : 'Select →'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Toolbar: Beginner vs Advanced Toggle + Save / Export */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isHindi ? 'मोड:' : 'Mode:'}
              </span>
              <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setIsAdvancedMode(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    !isAdvancedMode 
                      ? 'bg-white dark:bg-slate-800 text-[#2563EB] dark:text-[#60A5FA] shadow-xs' 
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {t('savingsAccounts.beginnerMode', 'Beginner Mode')}
                </button>
                <button
                  onClick={() => setIsAdvancedMode(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    isAdvancedMode 
                      ? 'bg-white dark:bg-slate-800 text-[#2563EB] dark:text-[#60A5FA] shadow-xs' 
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  {t('savingsAccounts.advancedMode', 'Advanced / Research')}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleReset}
                title="Reset all inputs"
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('savingsAccounts.reset', 'Reset')}</span>
              </button>

              <button
                onClick={handleSavePlan}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] hover:bg-[#2563EB]/20 border border-[#2563EB]/20 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{saveSuccessNotice ? (isHindi ? '✓ सहेजा गया!' : '✓ Saved!') : t('savingsAccounts.savePlan', 'Save Plan')}</span>
              </button>

              <button
                onClick={handleExportCsv}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('savingsAccounts.exportCsv', 'Export CSV')}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t('savingsAccounts.printReport', 'Print')}</span>
              </button>
            </div>
          </div>

          {/* ── MAIN TWO-PANEL INTERACTION WORKSPACE ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── LEFT COLUMN: INPUT CONTROLS (5 COLS) ── */}
            <div className="lg:col-span-6 space-y-5 bg-white dark:bg-[#1E293B] rounded-[32px] p-6 sm:p-7 border border-[#E5E7EB] dark:border-slate-700 shadow-soft">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Calculator className="w-4 h-4 text-[#2563EB]" />
                <span>{isHindi ? 'बचत योजना पैरामीटर्स' : 'YOUR SAVINGS PARAMETERS'}</span>
              </h3>

              {/* 1. Initial Deposit */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    {t('savingsAccounts.initialDeposit', 'Initial Deposit')}
                    {!isAdvancedMode && (
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({isHindi ? 'शुरुआती एकमुश्त राशि' : 'starting lump sum'})
                      </span>
                    )}
                  </label>
                  <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] bg-[#2563EB]/10 px-2.5 py-0.5 rounded-full border border-[#2563EB]/20">
                    ₹{initialDeposit.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={initialDeposit === 0 ? '' : initialDeposit}
                    onChange={(e) => {
                      setInitialDeposit(sanitizeNumber(e.target.value, 0));
                      setActivePreset('custom');
                    }}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[0, 1000, 5000, 25000, 100000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setInitialDeposit(amt);
                        setActivePreset('custom');
                      }}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl border transition-colors cursor-pointer ${
                        initialDeposit === amt 
                          ? 'bg-[#2563EB] text-white border-[#2563EB]' 
                          : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {amt === 0 ? '₹0' : `₹${amt.toLocaleString('en-IN')}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Regular Contribution Amount */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    {t('savingsAccounts.regularContribution', 'Regular Contribution')}
                    {!isAdvancedMode && (
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({isHindi ? 'नियमित बचत' : 'habitual saving'})
                      </span>
                    )}
                  </label>
                  <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] bg-[#2563EB]/10 px-2.5 py-0.5 rounded-full border border-[#2563EB]/20">
                    ₹{contribution.toLocaleString('en-IN')} {FREQUENCIES[frequency]?.shortLabel}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={contribution === 0 ? '' : contribution}
                    onChange={(e) => {
                      setContribution(sanitizeNumber(e.target.value, 0));
                      setActivePreset('custom');
                    }}
                    placeholder="1000"
                    className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                {/* Inclusive Micro-saving & quick amounts (₹10 to ₹5000) */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[10, 50, 100, 500, 1000, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setContribution(amt);
                        setActivePreset('custom');
                      }}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl border transition-colors cursor-pointer ${
                        contribution === amt 
                          ? 'bg-[#2563EB] text-white border-[#2563EB]' 
                          : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                {/* Encouraging micro-saving message for modest amounts */}
                {contribution > 0 && contribution <= 100 && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {isHindi 
                        ? '🌱 हर छोटी राशि मायने रखती है! नियमित ₹' + contribution + ' की बचत भी समय के साथ बड़ा धन संचय बनाती है।' 
                        : '🌱 Every rupee counts! Daily or weekly micro-savings of ₹' + contribution + ' compound into meaningful financial security over time.'}
                    </span>
                  </div>
                )}
              </div>

              {/* 3. Saving Frequency */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {t('savingsAccounts.frequency', 'Saving Frequency')}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {Object.values(FREQUENCIES).map((f) => {
                    const isSelected = frequency === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          setFrequency(f.id);
                          setActivePreset('custom');
                        }}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Duration (Months vs Years) */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t('savingsAccounts.duration', 'Savings Duration')}
                  </label>
                  <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setDurationUnit('months')}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                        durationUnit === 'months' 
                          ? 'bg-white dark:bg-slate-700 text-[#2563EB] dark:text-[#60A5FA] shadow-xs' 
                          : 'text-slate-500'
                      }`}
                    >
                      {isHindi ? 'महीने' : 'Months'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDurationUnit('years')}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                        durationUnit === 'years' 
                          ? 'bg-white dark:bg-slate-700 text-[#2563EB] dark:text-[#60A5FA] shadow-xs' 
                          : 'text-slate-500'
                      }`}
                    >
                      {isHindi ? 'वर्ष' : 'Years'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={durationUnit === 'months' ? 1 : 0.5}
                    max={durationUnit === 'months' ? 120 : 30}
                    step={durationUnit === 'months' ? 1 : 0.5}
                    value={durationValue}
                    onChange={(e) => {
                      setDurationValue(Number(e.target.value));
                      setActivePreset('custom');
                    }}
                    className="flex-1 accent-[#2563EB] cursor-pointer"
                  />
                  <div className="w-24 text-right">
                    <span className="text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] bg-[#2563EB]/10 px-2.5 py-1 rounded-xl border border-[#2563EB]/20">
                      {durationValue} {durationUnit === 'months' ? (durationValue === 1 ? 'Month' : 'Months') : (durationValue === 1 ? 'Year' : 'Years')}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Annual Nominal Interest Rate */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t('savingsAccounts.interestRate', 'Annual Interest Rate (% p.a.)')}
                  </label>
                  <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] bg-[#2563EB]/10 px-2.5 py-0.5 rounded-full border border-[#2563EB]/20">
                    {annualRate}% p.a.
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={12}
                    step={0.1}
                    value={annualRate}
                    onChange={(e) => {
                      setAnnualRate(Number(e.target.value));
                      setSelectedBankNote(null);
                      setActivePreset('custom');
                    }}
                    className="flex-1 accent-[#2563EB] cursor-pointer"
                  />
                  <div className="w-20">
                    <input
                      type="number"
                      min={0}
                      max={20}
                      step={0.1}
                      value={annualRate}
                      onChange={(e) => {
                        setAnnualRate(sanitizeNumber(e.target.value, 0, { min: 0, max: 50 }));
                        setSelectedBankNote(null);
                        setActivePreset('custom');
                      }}
                      className="w-full text-center py-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Quick Bank Interest Benchmarks */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {[
                    { label: 'SBI (2.7%)', rate: 2.7 },
                    { label: 'HDFC (3.0%)', rate: 3.0 },
                    { label: 'Kotak (3.5%)', rate: 3.5 },
                    { label: 'High Yield (6.5%)', rate: 6.5 }
                  ].map((b) => (
                    <button
                      key={b.label}
                      type="button"
                      onClick={() => {
                        setAnnualRate(b.rate);
                        setSelectedBankNote(`Applied illustrative rate benchmark: ${b.label}`);
                        setActivePreset('custom');
                      }}
                      className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                        annualRate === b.rate 
                          ? 'bg-[#2563EB] text-white border-[#2563EB]' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowBankRates(!showBankRates)}
                    className="text-[10.5px] font-bold text-[#2563EB] dark:text-[#60A5FA] underline ml-1 cursor-pointer"
                  >
                    {showBankRates ? 'Hide Verified Rates' : 'View Verified Bank Rates →'}
                  </button>
                </div>
              </div>

              {/* 6. Optional Target Savings Goal */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t('savingsAccounts.targetGoal', 'Target Savings Goal (Optional)')}</span>
                  </label>
                  {targetAmount > 0 && (
                    <button
                      type="button"
                      onClick={() => setTargetAmount(0)}
                      className="text-[10.5px] text-slate-400 hover:text-rose-500 font-semibold"
                    >
                      Clear Target
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={targetAmount === 0 ? '' : targetAmount}
                    onChange={(e) => setTargetAmount(sanitizeNumber(e.target.value, 0))}
                    placeholder="e.g. 50000"
                    className="w-full pl-8 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[1000, 10000, 50000, 100000, 500000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTargetAmount(amt)}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                        targetAmount === amt 
                          ? 'bg-amber-500 text-white border-amber-500' 
                          : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── ADVANCED SETTINGS PANEL ── */}
              {isAdvancedMode && (
                <div className="pt-4 border-t-2 border-slate-200 dark:border-slate-700 space-y-4 bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-2xl">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Advanced Assumptions & Research Parameters</span>
                  </h4>

                  {/* Compounding Frequency */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                      {t('savingsAccounts.compounding', 'Compounding Frequency')}
                    </label>
                    <select
                      value={compoundingFrequency}
                      onChange={(e) => setCompoundingFrequency(e.target.value)}
                      className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white"
                    >
                      {Object.values(COMPOUNDING_FREQUENCIES).map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Contribution Timing */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                      {t('savingsAccounts.timing', 'Contribution Timing')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTiming('end')}
                        className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          timing === 'end' 
                            ? 'bg-[#2563EB] text-white border-[#2563EB]' 
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        End of period (Ordinary Annuity)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTiming('beginning')}
                        className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          timing === 'beginning' 
                            ? 'bg-[#2563EB] text-white border-[#2563EB]' 
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        Beginning (Annuity Due / RD)
                      </button>
                    </div>
                  </div>

                  {/* Annual Contribution Step-Up */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {t('savingsAccounts.stepUpRate', 'Annual Contribution Step-Up')}
                      </label>
                      <span className="text-[11px] font-bold text-[#2563EB]">+{stepUpRate}% / yr</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={25}
                      step={1}
                      value={stepUpRate}
                      onChange={(e) => setStepUpRate(Number(e.target.value))}
                      className="w-full accent-[#2563EB] cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-400">
                      Simulates increasing your recurring savings each year in tandem with salary hikes.
                    </p>
                  </div>

                  {/* Inflation Calculator Toggle & Rate */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enableInflation}
                          onChange={(e) => setEnableInflation(e.target.checked)}
                          className="w-4 h-4 rounded text-[#2563EB] accent-[#2563EB] cursor-pointer"
                        />
                        <span>Adjust for Inflation (Real Purchasing Power)</span>
                      </label>
                      {enableInflation && (
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                          {inflationRate}% p.a.
                        </span>
                      )}
                    </div>
                    {enableInflation && (
                      <div className="space-y-1 pl-6">
                        <input
                          type="range"
                          min={2}
                          max={12}
                          step={0.5}
                          value={inflationRate}
                          onChange={(e) => setInflationRate(Number(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                        <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          Illustrates what your final nominal balance would buy in today’s rupees: <code>Value = Future / (1 + inflation)^years</code>.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Multi-Scenario Rate Comparison */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={compareScenarios}
                          onChange={(e) => setCompareScenarios(e.target.checked)}
                          className="w-4 h-4 rounded text-[#2563EB] accent-[#2563EB] cursor-pointer"
                        />
                        <span>Compare Interest Rate Scenarios (A, B, C)</span>
                      </label>
                    </div>
                    {compareScenarios && (
                      <div className="grid grid-cols-3 gap-2 pl-6 pt-1">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block">Conservative</span>
                          <input
                            type="number"
                            step={0.1}
                            value={scenarioRates.conservative}
                            onChange={(e) => setScenarioRates({ ...scenarioRates, conservative: sanitizeNumber(e.target.value, 0) })}
                            className="w-full p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#2563EB] block">Base Case</span>
                          <input
                            type="number"
                            step={0.1}
                            value={scenarioRates.base}
                            onChange={(e) => setScenarioRates({ ...scenarioRates, base: sanitizeNumber(e.target.value, 0) })}
                            className="w-full p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-emerald-600 block">Higher Yield</span>
                          <input
                            type="number"
                            step={0.1}
                            value={scenarioRates.high}
                            onChange={(e) => setScenarioRates({ ...scenarioRates, high: sanitizeNumber(e.target.value, 0) })}
                            className="w-full p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>

            {/* ── RIGHT COLUMN: RESULTS, TARGET PLANNER & VISUALIZATION (7 COLS) ── */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Hero Results Summary Card */}
              <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white rounded-[32px] p-6 sm:p-7 shadow-lg border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {t('savingsAccounts.projectedBalance', 'Projected Final Balance')}
                    </span>
                    <span className="text-[10.5px] font-semibold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10 text-slate-300">
                      {durationValue} {durationUnit} @ {annualRate}%
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {formatINR(projectionResult.nominalFinalBalance)}
                  </h3>

                  {/* Inflation Adjusted Callout */}
                  {enableInflation && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-amber-300 font-medium">
                      <span>Purchasing power in today's money:</span>
                      <strong className="text-sm font-extrabold text-amber-200">
                        {formatINR(projectionResult.inflationAdjustedBalance)}
                      </strong>
                    </div>
                  )}

                  {/* Dual Stat Metrics */}
                  <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-white/10">
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                      <span className="text-[10.5px] font-medium text-slate-400 uppercase block tracking-wider">
                        {t('savingsAccounts.totalContributed', 'Total Contributed')}
                      </span>
                      <span className="text-lg font-bold text-white mt-0.5 block">
                        {formatINR(projectionResult.totalContributions)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {initialDeposit > 0 ? `(₹${initialDeposit.toLocaleString('en-IN')} init + ₹${projectionResult.recurringContributionsTotal.toLocaleString('en-IN')})` : 'All from recurring'}
                      </span>
                    </div>

                    <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
                      <span className="text-[10.5px] font-medium text-emerald-300 uppercase block tracking-wider">
                        {t('savingsAccounts.estimatedInterest', 'Estimated Interest')}
                      </span>
                      <span className="text-lg font-bold text-emerald-400 mt-0.5 block">
                        +{formatINR(projectionResult.nominalInterestEarned)}
                      </span>
                      <span className="text-[10px] text-emerald-300/80">
                        Compounded {COMPOUNDING_FREQUENCIES[compoundingFrequency]?.label.split(' ')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Effective Annual Rate & Timing Note */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-medium">
                    <span>Effective Annual Yield (EAR): <strong className="text-white font-bold">{projectionResult.effectiveAnnualRate}%</strong></span>
                    <span>Timing: <strong className="text-white font-bold">{timing === 'beginning' ? 'Beginning (Annuity Due)' : 'End (Ordinary Annuity)'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Savings Goal Planner Card */}
              {targetAmount > 0 && (
                <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-5 border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-amber-500" />
                      <span>Savings Goal Progress</span>
                    </span>
                    <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                      {projectionResult.goalProgress.percentageAchieved}% Reached
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        projectionResult.goalProgress.isAchieved 
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
                          : 'bg-gradient-to-r from-amber-500 to-orange-500'
                      }`}
                      style={{ width: `${Math.min(100, projectionResult.goalProgress.percentageAchieved)}%` }}
                    />
                  </div>

                  {/* Goal Status Message */}
                  {projectionResult.goalProgress.isAchieved ? (
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p>{t('savingsAccounts.targetAchieved', 'Target Achieved! 🎉')}</p>
                        <p className="text-[11px] font-normal text-emerald-700 dark:text-emerald-400 mt-0.5">
                          {t('savingsAccounts.targetAchievedDesc', 'Your projected balance meets or exceeds your goal under these assumptions.')}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10.5px] text-slate-400 uppercase font-bold block">Amount Remaining</span>
                        <span className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5 block">
                          {formatINR(projectionResult.goalProgress.amountRemaining)}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          to reach target of {formatINR(targetAmount)}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10.5px] text-slate-400 uppercase font-bold block">Required Monthly Contribution</span>
                        <span className="text-sm font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-0.5 block">
                          {projectionResult.goalProgress.requiredContribution !== null 
                            ? `${formatINR(projectionResult.goalProgress.requiredContribution)} / period`
                            : 'Adjust timeframe'}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {projectionResult.goalProgress.timeToReachYears !== null 
                            ? `Estimated time: ~${projectionResult.goalProgress.timeToReachYears} years` 
                            : 'Unachievable with 0 contributions'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── INTERACTIVE GROWTH CHART (RESPONSIVE SVG) ── */}
              <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-5 border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Savings Growth Trajectory</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">Contributions vs Compounded Final Balance over time</p>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center gap-3 text-[11px] font-bold">
                    <span className="flex items-center gap-1 text-[#2563EB]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" /> Balance
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Contributed
                    </span>
                    {enableInflation && (
                      <span className="flex items-center gap-1 text-amber-500">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Real Value
                      </span>
                    )}
                  </div>
                </div>

                {/* SVG Visualizer */}
                <div className="w-full relative touch-none select-none">
                  <svg 
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                    className="w-full h-auto overflow-visible"
                    aria-label="Savings growth chart showing total balance, contributed principal, and inflation-adjusted purchasing power over time"
                  >
                    <defs>
                      <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                      const y = chartHeight - padding.bottom - pct * (chartHeight - padding.top - padding.bottom);
                      const val = Math.round(pct * maxVal);
                      return (
                        <g key={pct}>
                          <line 
                            x1={padding.left} 
                            y1={y} 
                            x2={chartWidth - padding.right} 
                            y2={y} 
                            stroke="#E2E8F0" 
                            strokeDasharray="3 3"
                            className="stroke-slate-200 dark:stroke-slate-700/60"
                          />
                          <text 
                            x={chartWidth - padding.right + 4} 
                            y={y + 3} 
                            fontSize="9" 
                            fill="#94A3B8" 
                            textAnchor="start"
                          >
                            ₹{val >= 100000 ? `${(val / 100000).toFixed(1)}L` : val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                          </text>
                        </g>
                      );
                    })}

                    {/* Area under curves */}
                    {points.length > 1 && (
                      <>
                        <path 
                          d={`${balancePath} L ${points[points.length - 1].x.toFixed(1)} ${(chartHeight - padding.bottom).toFixed(1)} L ${points[0].x.toFixed(1)} ${(chartHeight - padding.bottom).toFixed(1)} Z`}
                          fill="url(#balanceGrad)"
                        />
                        <path 
                          d={`${contributedPath} L ${points[points.length - 1].x.toFixed(1)} ${(chartHeight - padding.bottom).toFixed(1)} L ${points[0].x.toFixed(1)} ${(chartHeight - padding.bottom).toFixed(1)} Z`}
                          fill="url(#contribGrad)"
                        />
                      </>
                    )}

                    {/* Lines */}
                    <path d={contributedPath} fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" />
                    <path d={balancePath} fill="none" stroke="#2563EB" strokeWidth="3" />
                    {enableInflation && (
                      <path d={realPath} fill="none" stroke="#F59E0B" strokeWidth="2" />
                    )}

                    {/* Target line if within range */}
                    {targetAmount > 0 && targetAmount <= maxVal && (
                      <g>
                        <line
                          x1={padding.left}
                          y1={chartHeight - padding.bottom - (targetAmount / maxVal) * (chartHeight - padding.top - padding.bottom)}
                          x2={chartWidth - padding.right}
                          y2={chartHeight - padding.bottom - (targetAmount / maxVal) * (chartHeight - padding.top - padding.bottom)}
                          stroke="#EF4444"
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                        />
                        <text
                          x={padding.left + 5}
                          y={chartHeight - padding.bottom - (targetAmount / maxVal) * (chartHeight - padding.top - padding.bottom) - 4}
                          fontSize="9"
                          fill="#EF4444"
                          fontWeight="bold"
                        >
                          Target: ₹{targetAmount.toLocaleString('en-IN')}
                        </text>
                      </g>
                    )}

                    {/* Interactive points */}
                    {points.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.yBal}
                        r={chartHoverIndex === i ? 6 : 3}
                        fill={chartHoverIndex === i ? '#1D4ED8' : '#2563EB'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setChartHoverIndex(i)}
                        onMouseLeave={() => setChartHoverIndex(null)}
                      />
                    ))}
                  </svg>
                </div>

                {/* Active Hover / Scrub readout */}
                {activeHoverPoint && (
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Period: <strong className="text-[#2563EB]">{activeHoverPoint.label}</strong>
                    </span>
                    <span className="font-semibold text-slate-500">
                      Contributed: <strong className="text-slate-800 dark:text-white">₹{activeHoverPoint.contributed.toLocaleString('en-IN')}</strong>
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Interest: <strong>+₹{activeHoverPoint.interest.toLocaleString('en-IN')}</strong>
                    </span>
                    <span className="font-extrabold text-[#2563EB]">
                      Balance: <strong>₹{activeHoverPoint.balance.toLocaleString('en-IN')}</strong>
                    </span>
                    {enableInflation && (
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        Real: <strong>₹{activeHoverPoint.realBalance.toLocaleString('en-IN')}</strong>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* ── MILESTONES TABLE ── */}
              <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-5 border border-[#E5E7EB] dark:border-slate-700 shadow-soft space-y-3">
                <div 
                  onClick={() => setShowMilestones(!showMilestones)}
                  className="flex items-center justify-between cursor-pointer select-none"
                >
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{t('savingsAccounts.milestones', 'Growth Milestones Breakdown')}</span>
                  </h4>
                  <button className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <span>{showMilestones ? 'Collapse' : 'Expand'}</span>
                    {showMilestones ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {showMilestones && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 uppercase text-[10px] font-extrabold">
                          <th className="py-2.5 px-3">Timeline</th>
                          <th className="py-2.5 px-3">Contributed</th>
                          <th className="py-2.5 px-3">Interest</th>
                          <th className="py-2.5 px-3">Nominal Balance</th>
                          {enableInflation && <th className="py-2.5 px-3">Real Value (Inflation)</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                        {projectionResult.milestones.map((m, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-200">
                              {m.label}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                              ₹{m.contributed.toLocaleString('en-IN')}
                            </td>
                            <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-bold">
                              +₹{m.interest.toLocaleString('en-IN')}
                            </td>
                            <td className="py-2.5 px-3 font-extrabold text-[#2563EB] dark:text-[#60A5FA]">
                              ₹{m.balance.toLocaleString('en-IN')}
                            </td>
                            {enableInflation && (
                              <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400 font-semibold">
                                ₹{m.realBalance.toLocaleString('en-IN')}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* ── VERIFIED BANK SAVINGS RATES COMPARISON SECTION ── */}
          {showBankRates && (
            <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 border border-[#2563EB]/30 shadow-soft space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2563EB] block">
                    VERIFIED D.CARD DATA
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-5 h-5 text-[#2563EB]" />
                    <span>Compare Verified Savings Account Rates</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Select a bank below to instantly load its prevailing interest rate into your calculator.
                  </p>
                </div>
                <button
                  onClick={() => setShowBankRates(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer self-start sm:self-auto"
                >
                  Close ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {verifiedBanksList.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-2 hover:border-[#2563EB] transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-white truncate">{b.bank}</span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full shrink-0">
                          {b.rateString}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{b.accountName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Credit: {b.frequency} • Verified: {b.lastVerified}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setAnnualRate(b.rate);
                          setSelectedBankNote(`Loaded verified rate from ${b.bank} (${b.rateString}). Verified as of ${b.lastVerified}.`);
                          setShowBankRates(false);
                        }}
                        className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline cursor-pointer"
                      >
                        Use This Rate →
                      </button>

                      {b.sourceUrl && (
                        <a
                          href={b.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          title="Official Bank Source"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-slate-400 italic">
                Note: Bank savings interest rates vary by tier and account balance slabs. Projections are illustrative. Consult bank schedules for official terms.
              </p>
            </div>
          )}

          {/* Active Bank Benchmark Notice Banner */}
          {selectedBankNote && (
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 text-xs text-blue-800 dark:text-blue-300 font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>{selectedBankNote}</span>
              </div>
              <button 
                onClick={() => setSelectedBankNote(null)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer ml-3"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* ── SAVED CALCULATIONS LIST ── */}
          {savedPlans.length > 0 && (
            <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-soft space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Locally Saved Calculations ({savedPlans.length})</span>
                </h4>
                <button
                  onClick={() => {
                    setSavedPlans([]);
                    localStorage.removeItem(STORAGE_KEY);
                  }}
                  className="text-[11px] text-rose-500 hover:underline font-semibold"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {savedPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-white truncate">{plan.title}</span>
                        <span className="text-[10px] text-slate-400">{plan.date}</span>
                      </div>
                      <p className="text-sm font-extrabold text-[#2563EB] dark:text-[#60A5FA] mt-1">
                        Final: {formatINR(plan.finalBalance)}
                      </p>
                      <p className="text-[10.5px] text-slate-500 mt-0.5">
                        Contributed: {formatINR(plan.totalContributed)} • Interest: +{formatINR(plan.interestEarned)}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <button
                        onClick={() => handleLoadSavedPlan(plan)}
                        className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
                      >
                        Load Plan →
                      </button>
                      <button
                        onClick={() => handleRemoveSavedPlan(plan.id)}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MANDATORY TRANSPARENCY & DISCLAIMER ── */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs leading-relaxed space-y-2">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  {t('savingsAccounts.disclaimerText', "This calculator provides illustrative estimates based on your inputs and the assumptions shown. Actual savings account interest and balances may differ according to the bank's terms, applicable rates, balance calculations, taxes, and interest-crediting rules. This tool does not guarantee returns or provide personalised financial advice.")}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  <strong>Calculation Conventions:</strong> In standard Indian commercial banking, savings account interest is calculated on daily closing balances and credited on a quarterly calendar schedule. Projections here assume compounding at the selected interval with period-consistent compounding and no mid-tenure withdrawals. Inflation adjustments represent today's real purchasing power using standard exponential discounting and are illustrative estimates, not forecasts of future inflation rates.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {/* ── MODE 2: DEBIT CARD SPEND & REWARDS YIELD (PRESERVED FUNCTIONALITY) ── */}
      {/* ═════════════════════════════════════════════════════════════════════════ */}
      {calculatorMode === 'debitCards' && (
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
      )}

    </section>
  );
}

export default SavingsCalculator;
