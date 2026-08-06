import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, User, DollarSign, Building2, CreditCard, Plane, Globe, Shield, TrendingUp, Star, Clock, Zap, X } from 'lucide-react';

const CHIPS = [
  { id: 'student', label: 'Student', icon: GraduationCap, filterType: 'userType', value: 'Student' },
  { id: 'women', label: 'Women', icon: User, filterType: 'userType', value: 'Women' },
  { id: 'zero-fee', label: 'Zero Fee', icon: DollarSign, filterType: 'feeTier', value: 'free' },
  { id: 'govt', label: 'Government', icon: Building2, filterType: 'bankType', value: 'Government Banks' },
  { id: 'rupay', label: 'RuPay', icon: CreditCard, filterType: 'network', value: 'RuPay' },
  { id: 'lounge', label: 'Lounge Access', icon: Plane, filterType: 'feature', value: 'Lounge Access' },
  { id: 'intl', label: 'International', icon: Globe, filterType: 'feature', value: 'International Usage' },
  { id: 'premium', label: 'Premium', icon: Shield, filterType: 'category', value: 'Premium' },
  { id: 'trending', label: 'Trending', icon: TrendingUp, filterType: 'sortBy', value: 'most-popular' },
  { id: 'popular', label: 'Most Popular', icon: Star, filterType: 'sortBy', value: 'highest-rated' },
  { id: 'recent', label: 'Recently Added', icon: Clock, filterType: 'sortBy', value: 'newest-cards' }
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
    <div className="w-full mb-6 select-none">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F2937] dark:text-white flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#2563EB]" /> Quick Discovery Filters
          </span>
          {activeChipsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-[10px] font-bold border border-[#2563EB]/20">
              {activeChipsCount} Active
            </span>
          )}
        </div>

        {activeChipsCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Clear Quick Filters</span>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar scroll-smooth">
        {CHIPS.map((chip) => {
          const active = isChipActive(chip);
          const IconComp = chip.icon;
          return (
            <motion.button
              key={chip.id}
              type="button"
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleChipClick(chip)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border flex items-center gap-1.5 shadow-sm ${
                active
                  ? 'bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white border-[#2563EB] shadow-[0_4px_15px_rgba(37,99,235,0.35)]'
                  : 'bg-white dark:bg-[#1E293B] border-[#E5E7EB] dark:border-slate-700 text-[#1F2937] dark:text-slate-200 hover:border-[#2563EB]'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
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
