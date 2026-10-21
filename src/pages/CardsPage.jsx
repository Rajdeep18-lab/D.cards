import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, Sparkles, ShieldCheck, CreditCard, X, RotateCcw } from 'lucide-react';
import FilterSidebar from '../components/FilterSidebar';
import QuickFilterChips from '../components/QuickFilterChips';
import VirtualizedCardGrid from '../components/VirtualizedCardGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useSEO } from '../hooks/useSEO';
import { useAppLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';

function CardsPage({
  filteredCards,
  activeFilters,
  toggleFilter,
  clearFilters,
  handleResetFilters,
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
  selectedBanks,
  toggleBank,
  selectedNetworks,
  toggleNetwork,
  selectedCategories,
  toggleCategory,
  selectedUserTypes,
  toggleUserType,
  selectedBankTypes,
  toggleBankType,
  selectedFeeTier,
  setSelectedFeeTier,
  selectedAtmLimitTier,
  setSelectedAtmLimitTier,
  selectedPosLimitTier,
  setSelectedPosLimitTier,
  selectedFeatures,
  toggleFeature,
  handleLoadPreset,
  userProfile,
  handleApplyProfilePreset,
  totalActiveFiltersCount,
  isLoading,
  toggleCompareQueue,
  compareQueue,
  setSelectedCard,
  STATIC_RANKINGS,
  TOTAL_CARDS_COUNT,
  VERIFIED_CARDS_COUNT,
  PENDING_VERIFY_COUNT,
  RECENTLY_UPDATED_COUNT,
  query,
  setQuery
}) {
  const { language, isHindi, t } = useLanguage();
  useSEO({
    title: isHindi
      ? "भारत में सर्वश्रेष्ठ डेबिट कार्ड – शुल्क, एटीएम सीमा एवं लाभ की तुलना | D.Card"
      : "Debit Cards in India – Compare Fees, ATM Limits & Benefits | D.Card",
    description: isHindi
      ? "शीर्ष भारतीय बैंकों के डेबिट कार्डों की तुलना करें। वार्षिक शुल्क, दैनिक एटीएम निकासी सीमा, लाउंज एक्सेस और रिवॉर्ड्स के आधार पर फ़िल्टर करें।"
      : "Compare debit cards across top Indian banks. Filter by annual fee, daily ATM withdrawal limits, airport lounge access, and rewards on D.Card.",
    canonicalUrl: "https://www.dcard.website/cards"
  });

  const { selectedLocation, isAllIndia, selectLocation } = useAppLocation();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFilterOpen]);

  // Construct active filter chips array for top bar display
  const activeChipsList = [];
  if (!isAllIndia && selectedLocation?.name) {
    activeChipsList.push({
      label: `📍 ${selectedLocation.name}${selectedLocation.stateCode ? `, ${selectedLocation.stateCode}` : ''}`,
      onRemove: () => selectLocation('all-india')
    });
  }
  if (query) activeChipsList.push({ label: `${isHindi ? 'खोज' : 'Search'}: "${query}"`, onRemove: () => setQuery('') });
  selectedBanks.forEach(b => activeChipsList.push({ label: b, onRemove: () => toggleBank(b) }));
  selectedNetworks.forEach(n => activeChipsList.push({ label: n, onRemove: () => toggleNetwork(n) }));
  selectedCategories.forEach(c => activeChipsList.push({ label: c, onRemove: () => toggleCategory(c) }));
  selectedUserTypes.forEach(u => activeChipsList.push({ label: u, onRemove: () => toggleUserType(u) }));
  selectedBankTypes.forEach(bt => activeChipsList.push({ label: bt, onRemove: () => toggleBankType(bt) }));
  selectedFeatures.forEach(f => activeChipsList.push({ label: f, onRemove: () => toggleFeature(f) }));
  activeFilters.forEach(af => activeChipsList.push({ label: af, onRemove: () => toggleFilter(af) }));
  if (selectedFeeTier) activeChipsList.push({ label: `${isHindi ? 'शुल्क' : 'Fee'}: ${selectedFeeTier}`, onRemove: () => setSelectedFeeTier(null) });
  if (selectedAtmLimitTier) activeChipsList.push({ label: `ATM: ${selectedAtmLimitTier}`, onRemove: () => setSelectedAtmLimitTier(null) });
  if (selectedPosLimitTier) activeChipsList.push({ label: `POS: ${selectedPosLimitTier}`, onRemove: () => setSelectedPosLimitTier(null) });
  if (feeRange < 2000) activeChipsList.push({ label: `${isHindi ? 'शुल्क' : 'Fee'} ≤ ₹${feeRange}`, onRemove: () => setFeeRange(2000) });
  if (balanceRange < 500000) activeChipsList.push({ label: `${isHindi ? 'बैलेंस' : 'Bal'} ≤ ₹${balanceRange}`, onRemove: () => setBalanceRange(500000) });
  if (minRating > 0) activeChipsList.push({ label: `${isHindi ? 'रेटिंग' : 'Rating'} ≥ ${minRating}★`, onRemove: () => setMinRating(0) });
  if (minCashback > 0) activeChipsList.push({ label: `${isHindi ? 'कैशबैक' : 'Cashback'} ≥ ${minCashback}%`, onRemove: () => setMinCashback(0) });

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 select-none">
      {/* Header Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E7EB] dark:border-slate-800 pb-6 text-left">
        <div>
          <span className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
            {isHindi ? "वित्तीय सूचना डेटाबेस" : "FINANCIAL INFORMATION DATABASE"}
          </span>
          <h1 className="text-3xl font-extrabold text-[#1F2937] dark:text-white">
            {t('debitCards.title', 'Debit Cards')}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1 font-normal">
            {t('debitCards.subtitle', 'Compare debit cards based on fees, limits, network, benefits and features.')}
          </p>
        </div>

        {/* Global Search inside Cards Page */}
        <div className="w-full md:w-80">
          <div className="relative flex items-center bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 rounded-xl px-3.5 py-2.5 shadow-sm focus-within:border-[#2563EB] transition-colors">
            <Search className="w-4 h-4 text-[#6B7280] dark:text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isHindi ? "बैंक, कार्ड या लाभ खोजें..." : "Search bank, card or perk..."}
              className="w-full bg-transparent border-none text-xs font-semibold text-[#1F2937] dark:text-white outline-none placeholder-[#9CA3AF]"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs text-[#6B7280] hover:text-[#1F2937] dark:hover:text-white px-1 font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Discovery Filter Chips */}
      <div className="mb-6">
        <QuickFilterChips
          selectedUserTypes={selectedUserTypes}
          toggleUserType={toggleUserType}
          selectedFeeTier={selectedFeeTier}
          setFeeTier={setSelectedFeeTier}
          selectedBankTypes={selectedBankTypes}
          toggleBankType={toggleBankType}
          selectedNetworks={selectedNetworks}
          toggleNetwork={toggleNetwork}
          selectedFeatures={selectedFeatures}
          toggleFeature={toggleFeature}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onResetFilters={handleResetFilters}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-3 sticky top-20">
          <FilterSidebar
            activeFilters={activeFilters}
            toggleFilter={toggleFilter}
            clearFilters={clearFilters}
            handleResetFilters={handleResetFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            feeRange={feeRange}
            setFeeRange={setFeeRange}
            balanceRange={balanceRange}
            setBalanceRange={setBalanceRange}
            atmRange={atmRange}
            setAtmRange={setAtmRange}
            posRange={posRange}
            setPosRange={setPosRange}
            minRating={minRating}
            setMinRating={setMinRating}
            minCashback={minCashback}
            setMinCashback={setMinCashback}
            selectedBanks={selectedBanks}
            toggleBank={toggleBank}
            selectedNetworks={selectedNetworks}
            toggleNetwork={toggleNetwork}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            selectedUserTypes={selectedUserTypes}
            toggleUserType={toggleUserType}
            selectedBankTypes={selectedBankTypes}
            toggleBankType={toggleBankType}
            selectedFeeTier={selectedFeeTier}
            setSelectedFeeTier={setSelectedFeeTier}
            selectedAtmLimitTier={selectedAtmLimitTier}
            setSelectedAtmLimitTier={setSelectedAtmLimitTier}
            selectedPosLimitTier={selectedPosLimitTier}
            setSelectedPosLimitTier={setSelectedPosLimitTier}
            selectedFeatures={selectedFeatures}
            toggleFeature={toggleFeature}
            totalActiveFiltersCount={totalActiveFiltersCount}
          />
        </div>

        {/* Mobile Filter Toggle Trigger Button */}
        <div className="lg:hidden col-span-1 mb-4">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 shadow-sm text-xs font-semibold text-[#1F2937] dark:text-white"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
              <span>{isHindi ? 'फ़िल्टर एवं क्रमबद्ध विकल्प' : 'Filter & Sort Options'}</span>
            </span>
            {totalActiveFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center">
                {totalActiveFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Main Cards Content Area */}
        <div className="col-span-1 lg:col-span-9">
          {/* Top Toolbar */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E5E7EB] dark:border-slate-800 pb-4 text-left">
            <div>
              <h2 className="text-lg font-extrabold text-[#1F2937] dark:text-white">
                {isHindi ? 'सक्रिय कार्ड चयन' : 'Active Card Selection'}
              </h2>
              <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-0.5 font-normal">
                {isHindi
                  ? `आपके मानदंडों से मेल खाते ${filteredCards.length} कार्ड प्रदर्शित`
                  : `Showing ${filteredCards.length} cards matching your filter criteria`}
              </p>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 select-none">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#6B7280]" />
              <span className="text-xs font-semibold text-[#6B7280] dark:text-slate-400">
                {isHindi ? 'क्रमबद्ध करें:' : 'Sort By:'}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-extrabold text-[#1F2937] dark:text-white outline-none cursor-pointer"
              >
                <option value="most-popular">{isHindi ? 'लोकप्रियता (डिफ़ॉल्ट)' : 'Popularity (Default)'}</option>
                <option value="highest-rated">{isHindi ? 'रेटिंग: उच्च से निम्न' : 'Rating: High to Low'}</option>
                <option value="fee-low">{isHindi ? 'वार्षिक शुल्क: कम से अधिक' : 'Annual Fee: Low to High'}</option>
                <option value="fee-high">{isHindi ? 'वार्षिक शुल्क: अधिक से कम' : 'Annual Fee: High to Low'}</option>
                <option value="cashback_high">{isHindi ? 'रिवॉर्ड दर: उच्च से निम्न' : 'Reward Rate: High to Low'}</option>
                <option value="atm_high">{isHindi ? 'एटीएम सीमा: उच्च से निम्न' : 'ATM Limit: High to Low'}</option>
              </select>
            </div>
          </div>

          {/* ── Active Filter Chips Bar (Requirement #8) ── */}
          {activeChipsList.length > 0 && (
            <div className="mb-6 p-4 rounded-2xl glass-card-premium border border-[#E5E7EB] dark:border-slate-800 shadow-soft text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[#1F2937] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#2563EB]" />
                  {isHindi ? `सक्रिय फ़िल्टर मानदंड (${activeChipsList.length})` : `Active Filter Criteria (${activeChipsList.length})`}
                </span>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{isHindi ? 'सभी फ़िल्टर साफ़ करें' : 'Clear All Filters'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {activeChipsList.map((chip, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/25 text-xs font-extrabold"
                  >
                    <span>{chip.label}</span>
                    <button
                      type="button"
                      onClick={chip.onRemove}
                      className="w-4 h-4 rounded-full bg-[#2563EB]/20 hover:bg-[#2563EB] hover:text-white flex items-center justify-center transition-colors cursor-pointer text-[10px]"
                      title={`Remove ${chip.label}`}
                    >
                      ✕
                    </button>
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Cards Grid */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredCards.length > 0 ? (
            <VirtualizedCardGrid
              cards={filteredCards}
              compareQueue={compareQueue}
              toggleCompareQueue={toggleCompareQueue}
              setSelectedCard={setSelectedCard}
            />
          ) : (
            <div className="py-16 text-center bg-white dark:bg-[#1E293B] rounded-3xl border border-[#E5E7EB] dark:border-slate-800 p-8 space-y-4 shadow-soft">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center text-2xl mx-auto shadow-xs border border-rose-500/20">
                🔍
              </div>
              <h3 className="text-xl font-extrabold text-[#1F2937] dark:text-white">
                {isHindi ? 'कोई डेबिट कार्ड नहीं मिला।' : 'No debit cards found.'}
              </h3>
              <p className="text-xs text-[#6B7280] dark:text-slate-400 max-w-sm mx-auto font-normal">
                {isHindi ? 'कृपया अपने फ़िल्टर या खोज मानदंड बदलकर पुनः प्रयास करें।' : 'Try changing your filters or search criteria.'}
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white text-xs font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isHindi ? 'सभी फ़िल्टर साफ़ करें' : 'Clear All Filters'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-white dark:bg-[#0F172A] p-4 overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] dark:border-slate-800 mb-4">
            <h3 className="text-lg font-extrabold text-[#1F2937] dark:text-white">
              {isHindi ? 'फ़िल्टर एवं क्रमबद्ध विकल्प' : 'Filter & Sort Options'}
            </h3>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="text-lg font-bold text-[#6B7280] cursor-pointer"
            >
              ✕
            </button>
          </div>
          <FilterSidebar
            activeFilters={activeFilters}
            toggleFilter={toggleFilter}
            clearFilters={clearFilters}
            handleResetFilters={handleResetFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            feeRange={feeRange}
            setFeeRange={setFeeRange}
            balanceRange={balanceRange}
            setBalanceRange={setBalanceRange}
            atmRange={atmRange}
            setAtmRange={setAtmRange}
            posRange={posRange}
            setPosRange={setPosRange}
            minRating={minRating}
            setMinRating={setMinRating}
            minCashback={minCashback}
            setMinCashback={setMinCashback}
            selectedBanks={selectedBanks}
            toggleBank={toggleBank}
            selectedNetworks={selectedNetworks}
            toggleNetwork={toggleNetwork}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            selectedUserTypes={selectedUserTypes}
            toggleUserType={toggleUserType}
            selectedBankTypes={selectedBankTypes}
            toggleBankType={toggleBankType}
            selectedFeeTier={selectedFeeTier}
            setSelectedFeeTier={setSelectedFeeTier}
            selectedAtmLimitTier={selectedAtmLimitTier}
            setSelectedAtmLimitTier={setSelectedAtmLimitTier}
            selectedPosLimitTier={selectedPosLimitTier}
            setSelectedPosLimitTier={setSelectedPosLimitTier}
            selectedFeatures={selectedFeatures}
            toggleFeature={toggleFeature}
            totalActiveFiltersCount={totalActiveFiltersCount}
          />
        </div>
      )}
    </main>
  );
}

export default CardsPage;
