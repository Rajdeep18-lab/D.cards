import React, { memo } from 'react';
import { motion } from 'framer-motion';

const CHIPS = [
  { id: 'student', label: '🎓 Student', filterType: 'userType', value: 'Student' },
  { id: 'women', label: '👩 Women', filterType: 'userType', value: 'Women' },
  { id: 'zero-fee', label: '💰 Zero Fee', filterType: 'feeTier', value: 'free' },
  { id: 'govt', label: '🏦 Government', filterType: 'bankType', value: 'Government Banks' },
  { id: 'rupay', label: '💳 RuPay', filterType: 'network', value: 'RuPay' },
  { id: 'lounge', label: '✈ Lounge Access', filterType: 'feature', value: 'Lounge Access' },
  { id: 'intl', label: '🌍 International', filterType: 'feature', value: 'International Usage' },
  { id: 'premium', label: '💎 Premium', filterType: 'category', value: 'Premium' },
  { id: 'trending', label: '🔥 Trending', filterType: 'sortBy', value: 'most-popular' },
  { id: 'popular', label: '⭐ Most Popular', filterType: 'sortBy', value: 'highest-rated' },
  { id: 'recent', label: '🕒 Recently Added', filterType: 'sortBy', value: 'newest-cards' }
];

function QuickFilterChips({
  selectedUserTypes = [],
  toggleUserType,
  selectedFeeTier = null,
  setFeeTier,
  selectedBankTypes = [],
  toggleBankType,
  selectedNetworks = [],
  toggleNetwork,
  selectedFeatures = [],
  toggleFeature,
  selectedCategories = [],
  toggleCategory,
  sortBy = 'most-popular',
  setSortBy,
  onResetFilters
}) {

  const handleChipClick = (chip) => {
    switch (chip.filterType) {
      case 'userType':
        if (toggleUserType) toggleUserType(chip.value);
        break;
      case 'feeTier':
        if (setFeeTier) setFeeTier(selectedFeeTier === chip.value ? null : chip.value);
        break;
      case 'bankType':
        if (toggleBankType) toggleBankType(chip.value);
        break;
      case 'network':
        if (toggleNetwork) toggleNetwork(chip.value);
        break;
      case 'feature':
        if (toggleFeature) toggleFeature(chip.value);
        break;
      case 'category':
        if (toggleCategory) toggleCategory(chip.value);
        break;
      case 'sortBy':
        if (setSortBy) setSortBy(chip.value);
        break;
      default:
        break;
    }
  };

  const isChipActive = (chip) => {
    switch (chip.filterType) {
      case 'userType':
        return selectedUserTypes.includes(chip.value);
      case 'feeTier':
        return selectedFeeTier === chip.value;
      case 'bankType':
        return selectedBankTypes.includes(chip.value);
      case 'network':
        return selectedNetworks.includes(chip.value);
      case 'feature':
        return selectedFeatures.includes(chip.value);
      case 'category':
        return selectedCategories.includes(chip.value);
      case 'sortBy':
        return sortBy === chip.value;
      default:
        return false;
    }
  };

  const activeChipsCount = CHIPS.filter(isChipActive).length;

  return (
    <div className="w-full mb-6 select-none font-sans">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            ⚡ Quick Discovery Filters
          </span>
          {activeChipsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-roseGold text-[10px] font-black border border-secondary/20">
              {activeChipsCount} Active
            </span>
          )}
        </div>

        {activeChipsCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] font-extrabold text-secondary dark:text-roseGold hover:underline cursor-pointer"
          >
            Clear Quick Filters ✕
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar scroll-smooth">
        {CHIPS.map((chip) => {
          const active = isChipActive(chip);
          return (
            <motion.button
              key={chip.id}
              type="button"
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleChipClick(chip)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-200 cursor-pointer border flex items-center gap-1.5 shadow-sm ${
                active
                  ? 'bg-gradient-to-r from-secondary to-primary text-white border-secondary shadow-[0_4px_15px_rgba(194,24,117,0.35)]'
                  : 'bg-white/70 dark:bg-black/35 backdrop-blur-md border-slate-200/90 dark:border-secondary/20 text-slate-800 dark:text-slate-200 hover:border-secondary/50 dark:hover:border-roseGold/40'
              }`}
            >
              <span>{chip.label}</span>
              {active && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default memo(QuickFilterChips);
