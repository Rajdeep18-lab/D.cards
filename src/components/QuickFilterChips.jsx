import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, User, DollarSign, Building2, CreditCard, Plane, Globe, Shield, TrendingUp, Star, Clock, Zap, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CHIPS_EN = [
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

const CHIPS_HI = [
  { id: 'student', label: 'विद्यार्थी', icon: GraduationCap, filterType: 'userType', value: 'Student' },
  { id: 'women', label: 'महिलाएं', icon: User, filterType: 'userType', value: 'Women' },
  { id: 'zero-fee', label: 'जीरो शुल्क', icon: DollarSign, filterType: 'feeTier', value: 'free' },
  { id: 'govt', label: 'सरकारी बैंक', icon: Building2, filterType: 'bankType', value: 'Government Banks' },
  { id: 'rupay', label: 'RuPay', icon: CreditCard, filterType: 'network', value: 'RuPay' },
  { id: 'lounge', label: 'लाउंज एक्सेस', icon: Plane, filterType: 'feature', value: 'Lounge Access' },
  { id: 'intl', label: 'अंतरराष्ट्रीय', icon: Globe, filterType: 'feature', value: 'International Usage' },
  { id: 'premium', label: 'प्रीमियम', icon: Shield, filterType: 'category', value: 'Premium' },
  { id: 'trending', label: 'ट्रेंडिंग', icon: TrendingUp, filterType: 'sortBy', value: 'most-popular' },
  { id: 'popular', label: 'सर्वाधिक लोकप्रिय', icon: Star, filterType: 'sortBy', value: 'highest-rated' },
  { id: 'recent', label: 'हाल ही में जोड़े गए', icon: Clock, filterType: 'sortBy', value: 'newest-cards' }
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

  const { isHindi } = useLanguage();
  const chips = isHindi ? CHIPS_HI : CHIPS_EN;
  const activeChipsCount = chips.filter(isChipActive).length;

  return (
    <div className="w-full mb-6 select-none">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-white flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> {isHindi ? 'त्वरित खोज फ़िल्टर' : 'Quick Discovery Filters'}
          </span>
          {activeChipsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-[#B8860B] dark:text-[#F5DFA8] text-[10px] font-bold border border-[#E8D6B3]">
              {activeChipsCount} {isHindi ? 'सक्रिय' : 'Active'}
            </span>
          )}
        </div>

        {activeChipsCount > 0 && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] font-semibold text-[#B8860B] dark:text-[#F5DFA8] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>{isHindi ? 'त्वरित फ़िल्टर हटाएं' : 'Clear Quick Filters'}</span>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar scroll-smooth touch-scroll">
        {chips.map((chip) => {
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
                  ? 'bg-gradient-to-r from-[#D6A64B] via-[#E5C158] to-[#C59B27] text-[#2A1800] border-amber-300 font-bold shadow-[0_4px_15px_rgba(214,166,75,0.4)]'
                  : 'bg-white dark:bg-[#1E293B] border-[#E8D6B3] dark:border-slate-700 text-[#111827] dark:text-slate-200 hover:border-[#D6A64B]'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{chip.label}</span>
              {active && <span className="w-1.5 h-1.5 rounded-full bg-[#2A1800] animate-pulse" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default memo(QuickFilterChips);
