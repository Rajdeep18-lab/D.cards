import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, Sparkles, ShieldCheck, CreditCard } from 'lucide-react';
import FilterSidebar from '../components/FilterSidebar';
import QuickFilterChips from '../components/QuickFilterChips';
import VirtualizedCardGrid from '../components/VirtualizedCardGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';

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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20">
      {/* Header Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E7EB] dark:border-slate-800 pb-6 text-left">
        <div>
          <span className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] tracking-widest uppercase block mb-1">
            FINANCIAL INFORMATION DATABASE
          </span>
          <h1 className="text-3xl font-bold text-[#1F2937] dark:text-white">
            Debit Cards & Account Limits
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1 font-normal">
            Compare annual fees, ATM limits, POS spend caps, cashback, and lounge access across {filteredCards.length} matching cards
          </p>
        </div>

        {/* Global Search inside Cards Page */}
        <div className="w-full md:w-80">
          <div className="relative flex items-center bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 rounded-xl px-3 py-2 shadow-sm focus-within:border-[#2563EB] transition-colors">
            <Search className="w-4 h-4 text-[#6B7280] dark:text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bank, card or perk..."
              className="w-full bg-transparent border-none text-xs font-normal text-[#1F2937] dark:text-white outline-none placeholder-[#9CA3AF]"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs text-[#6B7280] hover:text-[#1F2937] dark:hover:text-white px-1 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="mb-6">
        <QuickFilterChips
          activeFilters={activeFilters}
          toggleFilter={toggleFilter}
          clearFilters={clearFilters}
          STATIC_RANKINGS={STATIC_RANKINGS}
          TOTAL_CARDS_COUNT={TOTAL_CARDS_COUNT}
          VERIFIED_CARDS_COUNT={VERIFIED_CARDS_COUNT}
          PENDING_VERIFY_COUNT={PENDING_VERIFY_COUNT}
          RECENTLY_UPDATED_COUNT={RECENTLY_UPDATED_COUNT}
          handleLoadPreset={handleLoadPreset}
          userProfile={userProfile}
          handleApplyProfilePreset={handleApplyProfilePreset}
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
              <span>Filter & Sort Options</span>
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
              <h2 className="text-lg font-bold text-[#1F2937] dark:text-white">Active Card Selection</h2>
              <p className="text-xs text-[#6B7280] dark:text-slate-400 mt-0.5 font-normal">Showing {filteredCards.length} cards matching your filter criteria</p>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 select-none">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#6B7280]" />
              <span className="text-xs font-normal text-[#6B7280] dark:text-slate-400">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold text-[#1F2937] dark:text-white outline-none cursor-pointer"
              >
                <option value="popularity">Popularity (Default)</option>
                <option value="rating_high">Rating: High to Low</option>
                <option value="fee_low">Annual Fee: Low to High</option>
                <option value="fee_high">Annual Fee: High to Low</option>
                <option value="cashback_high">Reward Rate: High to Low</option>
                <option value="atm_high">ATM Limit: High to Low</option>
              </select>
            </div>
          </div>

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
            <div className="py-16 text-center bg-white dark:bg-[#1E293B] rounded-3xl border border-[#E5E7EB] dark:border-slate-800 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-2xl mx-auto shadow-sm">
                🔍
              </div>
              <h3 className="text-xl font-bold text-[#1F2937] dark:text-white">No debit cards match your selected filters.</h3>
              <p className="text-xs text-[#6B7280] dark:text-slate-400 max-w-sm mx-auto font-normal">
                Try widening your fee ranges or resetting bank filters to explore more cards.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white text-xs font-semibold shadow-sm hover:opacity-95 transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-white dark:bg-[#0F172A] p-4 overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] dark:border-slate-800 mb-4">
            <h3 className="text-lg font-bold text-[#1F2937] dark:text-white">Filter & Sort Options</h3>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="text-lg font-bold text-[#6B7280]"
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
          <button
            onClick={() => setIsMobileFilterOpen(false)}
            className="mt-6 w-full py-3 rounded-xl bg-[#2563EB] text-white font-semibold text-xs shadow-md"
          >
            Apply Filters
          </button>
        </div>
      )}
    </main>
  );
}

export default CardsPage;
