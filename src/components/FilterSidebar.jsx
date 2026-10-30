import React, { useState, useMemo, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BANKS } from "../data/mockData";
import { useLanguage } from "../context/LanguageContext";

/* Categorized Institutional Bank Mapping */
const BANK_CATEGORIES = {
  "Government Banks": [
    "State Bank of India", "SBI", "Bank of Baroda", "Punjab National Bank", "PNB",
    "Canara Bank", "Union Bank of India", "Indian Bank", "Bank of India", "Central Bank of India"
  ],
  "Private Banks": [
    "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "IDFC FIRST Bank",
    "IndusInd Bank", "Yes Bank", "Federal Bank", "RBL Bank", "Bandhan Bank", "Fi Money"
  ],
  "Small Finance Banks": [
    "AU Small Finance Bank", "Equitas Small Finance Bank", "Ujjivan Small Finance Bank",
    "Suryoday Small Finance Bank", "Jana Small Finance Bank"
  ],
  "Payments Banks": [
    "Paytm Payments Bank", "Airtel Payments Bank", "India Post Payments Bank", "NSDL Payments Bank"
  ],
  "Regional Rural Banks": [
    "Prathama UP Gramin Bank", "Kerala Gramin Bank", "Baroda UP Bank"
  ],
  "Co-operative Banks": [
    "Saraswat Bank", "Cosmos Bank", "SVC Co-operative Bank", "TJSB Sahakari Bank"
  ]
};

/* Collapsible Filter Section Component */
function FilterSection({ title, icon, children, activeCount = 0, defaultOpen = true, isHindi = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-3.5 w-full font-sans select-none border border-slate-200/80 dark:border-secondary/20 rounded-2xl bg-white/60 dark:bg-black/30 backdrop-blur-md overflow-hidden transition-all shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors text-left focus:outline-none cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider font-sans">
            {title}
          </span>
          {activeCount > 0 && (
            <span className="text-[10px] font-black text-secondary dark:text-roseGold bg-secondary/10 dark:bg-secondary/20 px-2 py-0.5 rounded-full border border-secondary/20">
              {activeCount} {isHindi ? 'सक्रिय' : 'active'}
            </span>
          )}
        </div>
        <span
          className="text-slate-400 text-xs font-bold transition-transform duration-300 transform"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ▼
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="px-4 pb-4 pt-1 border-t border-slate-200/50 dark:border-white/5"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Dual Range Slider Component */
function MinimalSlider({ label, min, max, value, onChange, format, step }) {
  const minVal = value[0];
  const maxVal = value[1];

  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), maxVal - (step || 1));
    onChange([val, maxVal]);
  };

  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), minVal + (step || 1));
    onChange([minVal, val]);
  };

  const minPct = ((minVal - min) / (max - min)) * 100;
  const maxPct = ((maxVal - min) / (max - min)) * 100;

  return (
    <div className="mb-3 select-none relative w-full font-sans">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-[10px] font-black text-secondary dark:text-roseGold bg-secondary/10 dark:bg-secondary/20 px-2 py-0.5 rounded-full border border-secondary/20">
          {format(minVal)} - {format(maxVal)}
        </span>
      </div>
      <div className="relative h-6 flex items-center w-full">
        <div className="absolute w-full h-[5px] rounded-full bg-slate-200 dark:bg-slate-800" />
        <div
          className="absolute h-[5px] rounded-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_8px_rgba(194,24,117,0.35)]"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          className="absolute w-full h-full appearance-none bg-transparent cursor-pointer z-20"
          style={{ pointerEvents: "none", WebkitAppearance: "none" }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
          className="absolute w-full h-full appearance-none bg-transparent cursor-pointer z-20"
          style={{ pointerEvents: "none", WebkitAppearance: "none" }}
        />
      </div>

      <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-500 font-extrabold mt-1">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

/* SMART ENHANCED FILTER SIDEBAR */
function FilterSidebar({
  activeFilters = [],
  toggleFilter,
  clearFilters,
  onResetFilters,
  sortBy,
  setSortBy,
  feeRange,
  setFeeRange,
  balanceRange,
  setBalanceRange,
  atmRange,
  setAtmRange,
  posRange,
  setPosRange,
  minRating,
  setMinRating,
  minCashback,
  setMinCashback,
  selectedBanks = [],
  toggleBank,
  selectedNetworks = [],
  toggleNetwork,
  resultCount = 0,
  isMobile = false,
  onCloseMobile,
  selectedCategories = [],
  toggleCategory,
  selectedUserTypes = [],
  toggleUserType,
  selectedBankTypes = [],
  toggleBankType,
  selectedFeeTier = null,
  setFeeTier,
  selectedAtmLimitTier = null,
  setAtmLimitTier,
  selectedPosLimitTier = null,
  setPosLimitTier,
  selectedFeatures = [],
  toggleFeature
}) {
  const [bankSearch, setBankSearch] = useState("");
  const [showAllBanks, setShowAllBanks] = useState(false);
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile]);

  const filteredBanks = useMemo(() => {
    const search = String(bankSearch || '').toLowerCase().trim();
    const bankList = Array.isArray(BANKS) ? BANKS : [];
    return bankList.filter(b => String(b || '').toLowerCase().includes(search));
  }, [bankSearch]);

  // Aggregate active filter count
  const totalActiveCount = useMemo(() => {
    return (Array.isArray(selectedUserTypes) ? selectedUserTypes.length : 0) +
      (Array.isArray(selectedNetworks) ? selectedNetworks.length : 0) +
      (Array.isArray(selectedCategories) ? selectedCategories.length : 0) +
      (Array.isArray(selectedFeatures) ? selectedFeatures.length : 0) +
      (Array.isArray(selectedBankTypes) ? selectedBankTypes.length : 0) +
      (Array.isArray(selectedBanks) ? selectedBanks.length : 0) +
      (selectedFeeTier ? 1 : 0) +
      (selectedAtmLimitTier ? 1 : 0) +
      (selectedPosLimitTier ? 1 : 0) +
      ((feeRange ?? 2000) < 2000 ? 1 : 0) +
      ((balanceRange ?? 500000) < 500000 ? 1 : 0) +
      ((minRating ?? 0) > 0 ? 1 : 0) +
      ((minCashback ?? 0) > 0 ? 1 : 0) +
      (Array.isArray(atmRange) && (atmRange[0] > 0 || atmRange[1] < 1000000) ? 1 : 0) +
      (Array.isArray(posRange) && (posRange[0] > 0 || posRange[1] < 1500000) ? 1 : 0);
  }, [
    selectedUserTypes, selectedNetworks, selectedCategories, selectedFeatures,
    selectedBankTypes, selectedBanks, selectedFeeTier, selectedAtmLimitTier,
    selectedPosLimitTier, feeRange, balanceRange, minRating, minCashback, atmRange, posRange
  ]);

  const handleClearAll = () => {
    if (onResetFilters) {
      onResetFilters();
    } else if (clearFilters) {
      clearFilters();
    }
  };

  const filterContent = (
    <div className="space-y-4 w-full">

      {/* ── 1. USER CATEGORY FILTERS (Expanded) ── */}
      <FilterSection title={isHindi ? "उपयोगकर्ता श्रेणी" : "User Category"} icon="🎓" activeCount={selectedUserTypes.length} defaultOpen={true} isHindi={isHindi}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {[
            { label: "Student", display: isHindi ? "विद्यार्थी" : "Student", icon: "🎓", sub: isHindi ? "कॉलेज और स्कूल" : "College & School" },
            { label: "Women", display: isHindi ? "महिलाएं" : "Women", icon: "👩", sub: isHindi ? "बचत और पुरस्कार" : "Savings & Rewards" },
            { label: "Salaried", display: isHindi ? "वेतनभोगी" : "Salaried", icon: "👨‍💼", sub: isHindi ? "पेशेवर लाभ" : "Professional perks" },
            { label: "Business Owner", display: isHindi ? "व्यापारी" : "Business Owner", icon: "💼", sub: isHindi ? "उच्च सीमा खाते" : "High limit accounts" },
            { label: "Freelancer", display: isHindi ? "फ्रीलांसर" : "Freelancer", icon: "🧑‍💻", sub: isHindi ? "डिजिटल एवं जीरो फॉरेक्स" : "Digital & zero forex" },
            { label: "Senior Citizen", display: isHindi ? "वरिष्ठ नागरिक" : "Senior Citizen", icon: "👴", sub: isHindi ? "उच्च ब्याज बचत" : "High yield savings" },
            { label: "NRI Customer", display: isHindi ? "एनआरआई ग्राहक" : "NRI Customer", icon: "🌍", sub: isHindi ? "प्रवासी खाते" : "Overseas accounts" },
            { label: "Joint Account", display: isHindi ? "संयुक्त खाता" : "Joint Account", icon: "👨‍👩‍👧", sub: isHindi ? "पारिवारिक बैंकिंग" : "Family banking" },
            { label: "Minor Account", display: isHindi ? "नाबालिग खाता" : "Minor Account", icon: "👶", sub: isHindi ? "जूनियर एवं युवा" : "Junior & youth" },
            { label: "Premium Banking", display: isHindi ? "प्रीमियम बैंकिंग" : "Premium Banking", icon: "💎", sub: isHindi ? "एलीट एवं वेल्थ" : "Elite & Wealth" }
          ].map(ut => {
            const active = Array.isArray(selectedUserTypes) && selectedUserTypes.includes(ut.label);
            return (
              <motion.button
                key={ut.label}
                type="button"
                onClick={() => toggleUserType && toggleUserType(ut.label)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-2.5 rounded-2xl border text-left cursor-pointer transition-all duration-200 focus:outline-none flex items-center justify-between min-h-[44px] ${
                  active
                    ? "bg-gradient-to-r from-secondary/15 to-primary/10 border-secondary text-secondary dark:text-roseGold shadow-sm font-black"
                    : "bg-white/50 dark:bg-black/20 border-slate-200 dark:border-secondary/15 text-slate-800 dark:text-slate-200 hover:border-secondary/40"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-base">{ut.icon}</span>
                  <div className="truncate">
                    <p className="text-xs font-black leading-tight truncate">{ut.display}</p>
                    <p className="text-[9px] text-gray-400 font-semibold truncate">{ut.sub}</p>
                  </div>
                </div>
                {active && <span className="text-xs font-black text-secondary dark:text-roseGold">✓</span>}
              </motion.button>
            );
          })}
        </div>
      </FilterSection>

      {/* ── 2. SMART FEATURE FILTERS (18 Features) ── */}
      <FilterSection title={isHindi ? "विशेषताएं एवं लाभ" : "Features & Perks"} icon="✨" activeCount={selectedFeatures?.length || 0} defaultOpen={true} isHindi={isHindi}>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {[
            { label: "Zero Annual Fee", display: isHindi ? "शून्य वार्षिक शुल्क" : "Zero Annual Fee", icon: "💰" },
            { label: "Low Annual Fee", display: isHindi ? "कम वार्षिक शुल्क" : "Low Annual Fee", icon: "🏷️" },
            { label: "High ATM Limit", display: isHindi ? "उच्च एटीएम सीमा" : "High ATM Limit", icon: "🏧" },
            { label: "High POS Limit", display: isHindi ? "उच्च खरीदारी सीमा" : "High POS Limit", icon: "🛍️" },
            { label: "Contactless", display: isHindi ? "कॉन्टैक्टलेस" : "Contactless", icon: "📶" },
            { label: "NFC", display: isHindi ? "एनएफसी (NFC)" : "NFC", icon: "📲" },
            { label: "Virtual Card", display: isHindi ? "वर्चुअल कार्ड" : "Virtual Card", icon: "💳" },
            { label: "Lounge Access", display: isHindi ? "लाउंज एक्सेस" : "Lounge Access", icon: "✈️" },
            { label: "Cashback", display: isHindi ? "कैशबैक" : "Cashback", icon: "💵" },
            { label: "Reward Points", display: isHindi ? "रिवॉर्ड पॉइंट्स" : "Reward Points", icon: "🎁" },
            { label: "Insurance Coverage", display: isHindi ? "बीमा कवरेज" : "Insurance Coverage", icon: "🛡️" },
            { label: "Fuel Benefits", display: isHindi ? "ईंधन लाभ" : "Fuel Benefits", icon: "⛽" },
            { label: "Dining Benefits", display: isHindi ? "डाइनिंग लाभ" : "Dining Benefits", icon: "🍽️" },
            { label: "Shopping Benefits", display: isHindi ? "शॉपिंग लाभ" : "Shopping Benefits", icon: "🛒" },
            { label: "Entertainment Benefits", display: isHindi ? "मनोरंजन लाभ" : "Entertainment Benefits", icon: "🎬" },
            { label: "EMI Support", display: isHindi ? "ईएमआई सुविधा" : "EMI Support", icon: "🏦" },
            { label: "International Usage", display: isHindi ? "अंतरराष्ट्रीय उपयोग" : "International Usage", icon: "🌍" },
            { label: "Domestic Only", display: isHindi ? "केवल घरेलू" : "Domestic Only", icon: "🇮🇳" }
          ].map(feat => {
            const active = Array.isArray(selectedFeatures) && selectedFeatures.includes(feat.label);
            return (
              <motion.button
                key={feat.label}
                type="button"
                onClick={() => toggleFeature && toggleFeature(feat.label)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`py-2 px-2.5 rounded-xl border text-[11px] font-black flex items-center justify-between cursor-pointer transition-all duration-200 focus:outline-none min-h-[40px] ${
                  active
                    ? "bg-gradient-to-r from-secondary/15 to-primary/10 border-secondary text-secondary dark:text-roseGold shadow-sm"
                    : "bg-white/50 dark:bg-black/20 border-slate-200 dark:border-secondary/15 text-slate-800 dark:text-slate-200 hover:border-secondary/40"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span>{feat.icon}</span>
                  <span className="truncate">{feat.display}</span>
                </div>
                {active && <span className="text-[10px] font-black text-secondary dark:text-roseGold">✓</span>}
              </motion.button>
            );
          })}
        </div>
      </FilterSection>

      {/* ── 3. CATEGORIZED BANK FILTERS ── */}
      <FilterSection title={isHindi ? "बैंक श्रेणियां" : "Bank Categories"} icon="🏦" activeCount={selectedBankTypes?.length || 0} defaultOpen={true} isHindi={isHindi}>
        <div className="grid grid-cols-2 gap-2 pt-1">
          {[
            { label: "Government Banks", display: isHindi ? "सरकारी बैंक" : "Government Banks", icon: "🏛️" },
            { label: "Private Banks", display: isHindi ? "निजी बैंक" : "Private Banks", icon: "🏢" },
            { label: "Small Finance Banks", display: isHindi ? "स्मॉल फाइनेंस बैंक" : "Small Finance Banks", icon: "🚀" },
            { label: "Payments Banks", display: isHindi ? "पेमेंट्स बैंक" : "Payments Banks", icon: "⚡" },
            { label: "Regional Rural Banks", display: isHindi ? "क्षेत्रीय ग्रामीण बैंक" : "Regional Rural Banks", icon: "🌾" },
            { label: "Co-operative Banks", display: isHindi ? "सहकारी बैंक" : "Co-operative Banks", icon: "🤝" }
          ].map(bt => {
            const active = Array.isArray(selectedBankTypes) && selectedBankTypes.includes(bt.label);
            return (
              <motion.button
                key={bt.label}
                type="button"
                onClick={() => toggleBankType && toggleBankType(bt.label)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`py-2 px-2.5 rounded-xl border text-[11px] font-black flex items-center justify-between cursor-pointer transition-all duration-200 focus:outline-none min-h-[40px] ${
                  active
                    ? "bg-gradient-to-r from-secondary/15 to-primary/10 border-secondary text-secondary dark:text-roseGold shadow-sm"
                    : "bg-white/50 dark:bg-black/20 border-slate-200 dark:border-secondary/15 text-slate-800 dark:text-slate-200 hover:border-secondary/40"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span>{bt.icon}</span>
                  <span className="truncate">{bt.display}</span>
                </div>
                {active && <span className="text-[10px] font-black text-secondary dark:text-roseGold">✓</span>}
              </motion.button>
            );
          })}
        </div>

        {/* Specific Bank Multi-Select Search */}
        <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-white/5">
          <input
            type="text"
            value={bankSearch}
            onChange={(e) => setBankSearch(e.target.value)}
            placeholder={isHindi ? "विशिष्ट बैंक खोजें..." : "Search specific bank name..."}
            className="w-full px-3 py-2 text-xs rounded-xl bg-white/70 dark:bg-black/40 border border-slate-200 dark:border-secondary/20 text-slate-900 dark:text-white outline-none focus:border-secondary"
          />

          <div className="mt-2.5 flex flex-wrap gap-1.5 max-h-36 overflow-y-auto custom-scrollbar">
            {(showAllBanks ? filteredBanks : filteredBanks.slice(0, 8)).map(b => {
              const active = Array.isArray(selectedBanks) && selectedBanks.includes(b);
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBank && toggleBank(b)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold border transition-all cursor-pointer ${
                    active
                      ? "bg-secondary text-white border-secondary shadow-sm"
                      : "bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-secondary/30"
                  }`}
                >
                  {b} {active && '✓'}
                </button>
              );
            })}
          </div>
          {filteredBanks.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAllBanks(!showAllBanks)}
              className="mt-2 text-[10px] font-black text-secondary dark:text-roseGold hover:underline cursor-pointer"
            >
              {showAllBanks ? (isHindi ? "कम बैंक दिखाएं ▲" : "Show Less Banks ▲") : (isHindi ? `+ सभी ${filteredBanks.length} बैंक देखें ▼` : `+ Show All ${filteredBanks.length} Banks ▼`)}
            </button>
          )}
        </div>
      </FilterSection>

      {/* ── 4. CARD NETWORK ── */}
      <FilterSection title={isHindi ? "कार्ड नेटवर्क" : "Card Network"} icon="💳" activeCount={selectedNetworks?.length || 0} defaultOpen={true} isHindi={isHindi}>
        <div className="flex gap-2 w-full pt-1">
          {[
            { label: "RuPay", icon: "🇮🇳", color: "border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" },
            { label: "Visa", icon: "🌐", color: "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-500/10" },
            { label: "Mastercard", icon: "🔴", color: "border-secondary text-secondary dark:text-roseGold bg-secondary/10" }
          ].map(net => {
            const active = Array.isArray(selectedNetworks) && selectedNetworks.includes(net.label);
            return (
              <motion.button
                key={net.label}
                type="button"
                onClick={() => toggleNetwork && toggleNetwork(net.label)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all border flex items-center justify-center gap-1 cursor-pointer focus:outline-none min-h-[44px] ${
                  active
                    ? `${net.color} shadow-sm font-extrabold`
                    : "bg-white/50 dark:bg-black/20 border-slate-200 dark:border-secondary/15 text-slate-800 dark:text-slate-200 hover:border-secondary/40"
                }`}
              >
                <span>{net.icon}</span>
                <span>{net.label}</span>
                {active && <span className="text-[10px]">✓</span>}
              </motion.button>
            );
          })}
        </div>
      </FilterSection>

      {/* ── 5. CARD CATEGORY & TIER ── */}
      <FilterSection title={isHindi ? "कार्ड श्रेणी एवं प्रकार" : "Card Category"} icon="🏷️" activeCount={selectedCategories?.length || 0} defaultOpen={true} isHindi={isHindi}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
          {[
            { label: "Classic", icon: "⭐" },
            { label: "Silver", icon: "🥈" },
            { label: "Gold", icon: "🥇" },
            { label: "Platinum", icon: "💎" },
            { label: "Signature", icon: "🖊️" },
            { label: "Infinite", icon: "♾️" },
            { label: "Business", icon: "💼" },
            { label: "Premium", icon: "👑" }
          ].map(cat => {
            const active = Array.isArray(selectedCategories) && selectedCategories.includes(cat.label);
            return (
              <motion.button
                key={cat.label}
                type="button"
                onClick={() => toggleCategory && toggleCategory(cat.label)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`py-2 px-2.5 rounded-xl text-[11px] font-black border flex items-center justify-center gap-1 cursor-pointer transition-all focus:outline-none min-h-[40px] ${
                  active
                    ? "bg-gradient-to-r from-secondary/15 to-primary/10 border-secondary text-secondary dark:text-roseGold shadow-sm"
                    : "bg-white/50 dark:bg-black/20 border-slate-200 dark:border-secondary/15 text-slate-800 dark:text-slate-200 hover:border-secondary/40"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </motion.button>
            );
          })}
        </div>
      </FilterSection>

      {/* ── 6. DUAL RANGE SLIDERS ── */}
      <FilterSection title={isHindi ? "सीमाएं एवं शेष राशि" : "Limits & Balances"} icon="📊" defaultOpen={false} isHindi={isHindi}>
        <MinimalSlider
          label={isHindi ? "अधिकतम वार्षिक शुल्क" : "Max Annual Fee"}
          min={0}
          max={2000}
          step={50}
          value={[0, feeRange]}
          onChange={([, max]) => setFeeRange(max)}
          format={(v) => v === 0 ? (isHindi ? "निःशुल्क" : "Free") : `₹${v}`}
        />

        <MinimalSlider
          label={isHindi ? "न्यूनतम शेष आवश्यकता" : "Min Balance Requirement"}
          min={0}
          max={500000}
          step={5000}
          value={[0, balanceRange]}
          onChange={([, max]) => setBalanceRange(max)}
          format={(v) => v === 0 ? (isHindi ? "शून्य" : "Zero") : `₹${(v / 1000).toFixed(0)}k`}
        />

        <MinimalSlider
          label={isHindi ? "एटीएम निकासी सीमा" : "ATM Withdrawal Limit"}
          min={0}
          max={1000000}
          step={10000}
          value={atmRange}
          onChange={setAtmRange}
          format={(v) => `₹${(v / 1000).toFixed(0)}k`}
        />

        <MinimalSlider
          label={isHindi ? "दैनिक खरीदारी (POS) सीमा" : "Daily Purchase (POS) Limit"}
          min={0}
          max={1500000}
          step={25000}
          value={posRange}
          onChange={setPosRange}
          format={(v) => `₹${(v / 1000).toFixed(0)}k`}
        />
      </FilterSection>
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[2000] flex flex-col justify-end">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Slide-Up Bottom Drawer Sheet */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="relative z-[2001] w-full max-h-[85vh] bg-white dark:bg-[#0c050c] border-t border-slate-200 dark:border-secondary/20 rounded-t-[32px] p-6 shadow-2xl flex flex-col justify-between overflow-hidden"
        >
          {/* Top Drag Indicator & Header */}
          <div className="flex-shrink-0 pb-3 mb-2 border-b border-slate-200/50 dark:border-secondary/15">
            <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-white/20 mx-auto mb-3" />
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>🎯</span> {isHindi ? 'स्मार्ट कार्ड फिल्टर' : 'Smart Card Filters'}
                </h3>
                <p className="text-xs text-textSoft dark:text-gray-400 font-medium">
                  {isHindi ? `${resultCount} डेबिट कार्ड उपलब्ध` : `Showing ${resultCount} matching debit cards`}
                </p>
              </div>

              <button
                type="button"
                onClick={onCloseMobile}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm focus:outline-none"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Scrollable Filter Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 py-2">
            {filterContent}
          </div>

          {/* Sticky Bottom Actions Bar */}
          <div className="flex-shrink-0 pt-4 mt-2 border-t border-slate-200/50 dark:border-secondary/15 flex items-center gap-3">
            <button
              type="button"
              onClick={handleClearAll}
              className="py-3 px-4 rounded-2xl border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer"
            >
              {isHindi ? 'फ़िल्टर रीसेट करें' : 'Reset Filters'}
            </button>
            <button
              type="button"
              onClick={onCloseMobile}
              className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-secondary to-primary text-white font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all cursor-pointer text-center"
            >
              {isHindi ? `लागू करें (${resultCount} कार्ड)` : `Apply (${resultCount} Cards)`}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* Desktop Sticky Sidebar View */
  return (
    <aside className="sticky top-20 w-full select-none text-left space-y-4 font-sans">
      {/* Top Header Card */}
      <div className="p-4 rounded-3xl bg-white/60 dark:bg-black/35 backdrop-blur-xl border border-slate-200/90 dark:border-secondary/20 shadow-soft flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
            <span>🎯</span> {isHindi ? 'स्मार्ट फ़िल्टर' : 'Smart Filters'}
          </h3>
          <p className="text-[11px] text-textSoft dark:text-gray-400 font-semibold mt-0.5">
            {isHindi ? `${resultCount} कार्ड मेल खाते हैं` : `${resultCount} Cards Match`}
          </p>
        </div>

        {totalActiveCount > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-[10px] font-black text-secondary dark:text-roseGold hover:underline cursor-pointer"
          >
            {isHindi ? `सभी रीसेट करें (${totalActiveCount})` : `Reset All (${totalActiveCount})`}
          </button>
        )}
      </div>

      {/* Main Filter Accordions */}
      <div className="max-h-[calc(100vh-160px)] overflow-y-auto custom-scrollbar pr-1">
        {filterContent}
      </div>
    </aside>
  );
}

export default memo(FilterSidebar);
