import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function FilterSummaryBar({
  activeFilters,
  toggleFilter,
  selectedBanks,
  toggleBank,
  selectedNetworks,
  toggleNetwork,
  selectedCategories,
  toggleCategory,
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
  clearAllFilters,
  resultCount,
  totalCount,
  onLoadPreset
}) {
  const [presetNameInput, setPresetNameInput] = useState("");
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [savedPresets, setSavedPresets] = useState({});

  // Load presets from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dcard_filter_presets");
      if (stored) {
        setSavedPresets(JSON.parse(stored));
      } else {
        // Seed default presets
        const defaultPresets = {
          "My Student Setup": {
            activeFilters: ["Student Friendly", "Zero Balance", "Zero Fee"],
            selectedBanks: [],
            selectedNetworks: [],
            selectedCategories: [],
            feeRange: 250,
            balanceRange: 0,
            atmRange: [0, 1000000],
            posRange: [0, 1500000],
            minRating: 0,
            minCashback: 0
          },
          "Travel Setup": {
            activeFilters: ["Lounge Access", "International Usage", "Zero Forex"],
            selectedBanks: [],
            selectedNetworks: [],
            selectedCategories: [],
            feeRange: 2000,
            balanceRange: 500000,
            atmRange: [0, 1000000],
            posRange: [0, 1500000],
            minRating: 4.2,
            minCashback: 1.0
          },
          "Premium Setup": {
            activeFilters: ["Premium Banking", "Lounge Access"],
            selectedBanks: [],
            selectedNetworks: [],
            selectedCategories: ["Premium"],
            feeRange: 2000,
            balanceRange: 500000,
            atmRange: [100000, 1000000],
            posRange: [300000, 1500000],
            minRating: 4.5,
            minCashback: 1.5
          },
          "Women Banking Setup": {
            activeFilters: ["Women Special"],
            selectedBanks: [],
            selectedNetworks: [],
            selectedCategories: [],
            feeRange: 2000,
            balanceRange: 500000,
            atmRange: [0, 1000000],
            posRange: [0, 1500000],
            minRating: 4.0,
            minCashback: 0.5
          }
        };
        localStorage.setItem("dcard_filter_presets", JSON.stringify(defaultPresets));
        setSavedPresets(defaultPresets);
      }
    } catch (e) {
      console.error("Failed to parse presets", e);
    }
  }, []);

  const handleSavePreset = (e) => {
    e.preventDefault();
    if (!presetNameInput.trim()) return;

    const newPreset = {
      activeFilters,
      selectedBanks,
      selectedNetworks,
      selectedCategories,
      feeRange,
      balanceRange,
      atmRange,
      posRange,
      minRating,
      minCashback
    };

    const updated = {
      ...savedPresets,
      [presetNameInput.trim()]: newPreset
    };

    setSavedPresets(updated);
    localStorage.setItem("dcard_filter_presets", JSON.stringify(updated));
    setPresetNameInput("");
    setIsSaveModalOpen(false);
  };

  const handleDeletePreset = (name, e) => {
    e.stopPropagation();
    const updated = { ...savedPresets };
    delete updated[name];
    setSavedPresets(updated);
    localStorage.setItem("dcard_filter_presets", JSON.stringify(updated));
  };

  // Calculate active filter count
  const activeChips = [];

  selectedBanks.forEach(bank => {
    activeChips.push({ type: "bank", label: bank, remove: () => toggleBank(bank), icon: "🏦" });
  });

  selectedNetworks.forEach(net => {
    activeChips.push({ type: "network", label: net, remove: () => toggleNetwork(net), icon: "💳" });
  });

  selectedCategories.forEach(cat => {
    activeChips.push({ type: "category", label: cat, remove: () => toggleCategory(cat), icon: "🏷️" });
  });

  activeFilters.forEach(filter => {
    let icon = "⚡";
    if (filter === "Lounge Access") icon = "✈️";
    if (filter === "International Usage") icon = "🌎";
    if (filter === "Contactless") icon = "📶";
    if (filter === "Fuel Waiver") icon = "⛽";
    if (filter === "Zero Balance") icon = "💵";
    if (filter === "Zero Forex") icon = "💱";
    if (filter === "Healthcare Benefits") icon = "🏥";
    if (filter === "Insurance Cover") icon = "🛡️";
    if (filter === "Rewards Program") icon = "🎁";
    if (filter === "Student Friendly") icon = "🎓";
    if (filter === "Women Special") icon = "👩";
    if (filter === "Senior Citizen") icon = "👴";
    if (filter === "Premium Banking") icon = "💎";

    activeChips.push({ type: "advanced", label: filter, remove: () => toggleFilter(filter), icon });
  });

  if (feeRange < 2000) {
    activeChips.push({
      type: "range-fee",
      label: `Fee: ≤ ₹${feeRange}`,
      remove: () => setFeeRange(2000),
      icon: "💰"
    });
  }

  if (balanceRange < 500000) {
    activeChips.push({
      type: "range-bal",
      label: balanceRange === 0 ? "Zero Balance" : `Bal: ≤ ₹${(balanceRange / 1000).toFixed(0)}K`,
      remove: () => setBalanceRange(500000),
      icon: "🏦"
    });
  }

  if (minRating > 0) {
    activeChips.push({
      type: "range-rating",
      label: `Rating: ≥ ★${minRating}`,
      remove: () => setMinRating(0),
      icon: "⭐"
    });
  }

  if (minCashback > 0) {
    activeChips.push({
      type: "range-cashback",
      label: `Cashback: ≥ ${minCashback}%`,
      remove: () => setMinCashback(0),
      icon: "🎁"
    });
  }

  if (atmRange && (atmRange[0] > 0 || atmRange[1] < 1000000)) {
    activeChips.push({
      type: "range-atm",
      label: `ATM: ₹${(atmRange[0] / 1000).toFixed(0)}K - ₹${(atmRange[1] / 1000).toFixed(0)}K`,
      remove: () => setAtmRange([0, 1000000]),
      icon: "🏧"
    });
  }

  if (posRange && (posRange[0] > 0 || posRange[1] < 1500000)) {
    activeChips.push({
      type: "range-pos",
      label: `POS: ₹${(posRange[0] / 1000).toFixed(0)}K - ₹${(posRange[1] / 1000).toFixed(0)}K`,
      remove: () => setPosRange([0, 1500000]),
      icon: "🛍️"
    });
  }

  return (
    <div className="w-full flex flex-col gap-4 select-none mb-6">
      {/* Top row: Analytics & Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/45 dark:bg-[#09050a]/45 backdrop-blur-xl border border-slate-200 dark:border-secondary/15 rounded-3xl p-4 shadow-soft">
        
        {/* Analytics count */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white font-black shadow-indigo">
            <span className="text-base select-none">📊</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                Filtered Search
              </span>
              <span className="bg-secondary/10 dark:bg-secondary/25 border border-secondary/20 text-secondary dark:text-roseGold text-xs font-black px-2 py-0.5 rounded-full animate-pulse">
                Showing {resultCount} of {totalCount}
              </span>
            </div>
            <p className="text-[10px] text-textSoft dark:text-slate-400 font-bold uppercase mt-0.5 tracking-wider">
              Real-time banking analytics updated instantly
            </p>
          </div>
        </div>

        {/* Presets List */}
        <div className="flex items-center flex-wrap gap-2 md:justify-end">
          <span className="text-[10px] font-black text-slate-400 dark:text-[#B07A95] uppercase tracking-wider mr-1">
            Presets:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(savedPresets).map(name => (
              <div 
                key={name}
                onClick={() => onLoadPreset(savedPresets[name])}
                className="group flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-all duration-300 border border-slate-200 dark:border-secondary/15 bg-slate-100/60 dark:bg-secondary/5 hover:border-secondary hover:bg-secondary/5 text-slate-700 dark:text-slate-200"
              >
                <span>⚙️</span>
                <span>{name}</span>
                <button
                  onClick={(e) => handleDeletePreset(name, e)}
                  className="ml-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-sm font-bold transition-opacity"
                  title="Delete preset"
                >
                  ×
                </button>
              </div>
            ))}

            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-primary to-secondary text-white hover:shadow-indigo transition-all duration-300 shadow-sm"
            >
              <span>💾</span> Save Preset
            </button>
          </div>
        </div>
      </div>

      {/* Preset Saving Modal */}
      <AnimatePresence>
        {isSaveModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSaveModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white dark:bg-[#0c0612] backdrop-blur-2xl rounded-3xl p-6 border border-slate-200 dark:border-secondary/20 shadow-[0_20px_50px_rgba(0,0,0,0.4)] z-[2001]"
            >
              <h3 className="font-black text-xl text-slate-800 dark:text-slate-100 mb-2">
                Save Current Filter Preset
              </h3>
              <p className="text-xs text-textSoft dark:text-slate-400 mb-4 leading-relaxed font-medium">
                Store your currently applied filters, ranges, and preferences to load them in a single click next time.
              </p>

              <form onSubmit={handleSavePreset} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">
                    Preset Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My Travel Setup"
                    value={presetNameInput}
                    onChange={(e) => setPresetNameInput(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-secondary/5 border border-slate-200 dark:border-secondary/15 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all font-bold"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSaveModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-black text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-secondary/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-primary to-secondary text-white shadow-indigo hover:shadow-glow transition-all"
                  >
                    Save Setup
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Applied Filters Summary Bar */}
      <AnimatePresence>
        {activeChips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full flex flex-col gap-2.5 bg-secondary/[0.03] border border-dashed border-secondary/20 rounded-3xl p-4 backdrop-blur-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                <span className="text-[10px] font-black text-secondary dark:text-roseGold uppercase tracking-widest">
                  {activeChips.length} Filters Currently Applied
                </span>
              </div>
              <button
                onClick={clearAllFilters}
                className="text-[10px] font-black text-slate-500 hover:text-secondary dark:text-[#B07A95] dark:hover:text-roseGold transition-colors uppercase tracking-wider"
              >
                Clear All ✕
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {activeChips.map((chip, idx) => (
                  <motion.button
                    key={chip.type + "-" + chip.label + "-" + idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={chip.remove}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold bg-white dark:bg-[#0c0612] border border-slate-200/80 dark:border-secondary/20 shadow-sm hover:border-secondary/40 text-slate-700 dark:text-slate-200 transition-all select-none"
                  >
                    <span>{chip.icon}</span>
                    <span className="font-extrabold">{chip.label}</span>
                    <span className="text-secondary dark:text-roseGold font-black ml-0.5 hover:scale-110">
                      ×
                    </span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FilterSummaryBar;
