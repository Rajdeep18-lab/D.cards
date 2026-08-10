import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Percent, 
  Building2, 
  ShieldCheck, 
  Scale, 
  HelpCircle,
  ChevronDown,
  SlidersHorizontal,
  CreditCard
} from 'lucide-react';
import SavingsAccountCard from '../components/SavingsAccountCard';
import SavingsAccountDetailsModal from '../components/SavingsAccountDetailsModal';
import SavingsAccountComparisonDock from '../components/SavingsAccountComparisonDock';
import SavingsAccountComparisonModal from '../components/SavingsAccountComparisonModal';
import { savingsAccountService } from '../services/savingsAccountService';

const BANK_OPTIONS = [
  "HDFC Bank",
  "ICICI Bank",
  "State Bank of India",
  "Kotak Mahindra Bank",
  "Axis Bank",
  "IDFC FIRST Bank",
  "AU Small Finance Bank",
  "Bank of Baroda",
  "IndusInd Bank",
  "Fi Money (Federal Bank)"
];

const ACCOUNT_TYPE_OPTIONS = [
  "Regular Savings",
  "Zero Balance",
  "Digital Savings",
  "Student",
  "Salary",
  "Senior Citizen",
  "Women's",
  "Premium Savings"
];

function SavingsAccountSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div key={n} className="rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 p-6 space-y-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700" />
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          </div>
          <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
      ))}
    </div>
  );
}

function SavingsAccountsPage({ onSelectDebitCard }) {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedAccountTypes, setSelectedAccountTypes] = useState([]);
  const [minInterestRate, setMinInterestRate] = useState(0);
  const [maxMinBalance, setMaxMinBalance] = useState(50000);
  
  const [filterZeroBalance, setFilterZeroBalance] = useState(false);
  const [filterOnlineOpening, setFilterOnlineOpening] = useState(false);
  const [filterStudent, setFilterStudent] = useState(false);
  const [filterSalary, setFilterSalary] = useState(false);
  const [filterSeniorCitizen, setFilterSeniorCitizen] = useState(false);
  const [filterWomen, setFilterWomen] = useState(false);
  const [filterDigital, setFilterDigital] = useState(false);
  const [filterHasDebitCard, setFilterHasDebitCard] = useState(false);
  const [filterLoungeAccess, setFilterLoungeAccess] = useState(false);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Modal & Comparison States
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [compareQueue, setCompareQueue] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    savingsAccountService.getSavingsAccounts()
      .then(data => setAccounts(data || []))
      .catch(err => console.warn('Could not load savings accounts:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const toggleBank = useCallback((b) => {
    setSelectedBanks(prev => prev.includes(b) ? prev.filter(item => item !== b) : [...prev, b]);
  }, []);

  const toggleAccountType = useCallback((t) => {
    setSelectedAccountTypes(prev => prev.includes(t) ? prev.filter(item => item !== t) : [...prev, t]);
  }, []);

  const resetAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedBanks([]);
    setSelectedAccountTypes([]);
    setMinInterestRate(0);
    setMaxMinBalance(50000);
    setFilterZeroBalance(false);
    setFilterOnlineOpening(false);
    setFilterStudent(false);
    setFilterSalary(false);
    setFilterSeniorCitizen(false);
    setFilterWomen(false);
    setFilterDigital(false);
    setFilterHasDebitCard(false);
    setFilterLoungeAccess(false);
  }, []);

  const toggleCompareQueue = useCallback((account) => {
    if (!account) return;
    setCompareQueue(prev => {
      const exists = prev.some(a => String(a.id) === String(account.id));
      if (exists) {
        return prev.filter(a => String(a.id) !== String(account.id));
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 savings accounts at a time");
        return prev;
      }
      return [...prev, account];
    });
  }, []);

  // Filter Pipeline
  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(acc => {
        const name = (acc.accountName || '').toLowerCase();
        const bank = (acc.bank || '').toLowerCase();
        const desc = (acc.description || '').toLowerCase();
        const cardName = (acc.associatedDebitCardName || '').toLowerCase();
        return name.includes(q) || bank.includes(q) || desc.includes(q) || cardName.includes(q);
      });
    }

    if (selectedBanks.length > 0) {
      result = result.filter(acc => selectedBanks.some(b => acc.bank.toLowerCase().includes(b.toLowerCase())));
    }

    if (selectedAccountTypes.length > 0) {
      result = result.filter(acc => {
        return selectedAccountTypes.some(t => {
          const typeStr = (acc.accountType || '').toLowerCase();
          const badgesStr = (acc.accountTypeBadges || []).map(b => b.toLowerCase()).join(' ');
          return typeStr.includes(t.toLowerCase()) || badgesStr.includes(t.toLowerCase());
        });
      });
    }

    if (minInterestRate > 0) {
      result = result.filter(acc => (acc.interestRateValue || 0) >= minInterestRate);
    }

    if (maxMinBalance < 50000) {
      result = result.filter(acc => (acc.minimumBalanceValue || 0) <= maxMinBalance);
    }

    if (filterZeroBalance) result = result.filter(acc => acc.isZeroBalance === true);
    if (filterOnlineOpening) result = result.filter(acc => acc.isOnlineOpening === true);
    if (filterStudent) result = result.filter(acc => acc.isStudent === true || (acc.accountType || '').toLowerCase().includes('student'));
    if (filterSalary) result = result.filter(acc => acc.isSalary === true || (acc.accountType || '').toLowerCase().includes('salary'));
    if (filterSeniorCitizen) result = result.filter(acc => acc.isSeniorCitizen === true || (acc.accountType || '').toLowerCase().includes('senior'));
    if (filterWomen) result = result.filter(acc => acc.isWomenSpecial === true || (acc.accountType || '').toLowerCase().includes('women'));
    if (filterDigital) result = result.filter(acc => acc.isDigital === true || (acc.accountType || '').toLowerCase().includes('digital'));
    if (filterHasDebitCard) result = result.filter(acc => Boolean(acc.associatedDebitCardName) || Boolean(acc.associatedDebitCardId));
    if (filterLoungeAccess) {
      result = result.filter(acc => {
        const card = getAssociatedDebitCard(acc.associatedDebitCardId);
        const l = (card?.loungeAccess || '').toLowerCase();
        return Boolean(l) && !l.startsWith('no') && !l.includes('not available');
      });
    }

    return result;
  }, [
    accounts, searchQuery, selectedBanks, selectedAccountTypes,
    minInterestRate, maxMinBalance, filterZeroBalance, filterOnlineOpening,
    filterStudent, filterSalary, filterSeniorCitizen, filterWomen, filterDigital,
    filterHasDebitCard, filterLoungeAccess
  ]);

  const activeFiltersCount = useMemo(() => {
    return selectedBanks.length +
      selectedAccountTypes.length +
      (minInterestRate > 0 ? 1 : 0) +
      (maxMinBalance < 50000 ? 1 : 0) +
      (filterZeroBalance ? 1 : 0) +
      (filterOnlineOpening ? 1 : 0) +
      (filterStudent ? 1 : 0) +
      (filterSalary ? 1 : 0) +
      (filterSeniorCitizen ? 1 : 0) +
      (filterWomen ? 1 : 0) +
      (filterDigital ? 1 : 0) +
      (filterHasDebitCard ? 1 : 0) +
      (filterLoungeAccess ? 1 : 0);
  }, [
    selectedBanks, selectedAccountTypes, minInterestRate, maxMinBalance,
    filterZeroBalance, filterOnlineOpening, filterStudent, filterSalary,
    filterSeniorCitizen, filterWomen, filterDigital, filterHasDebitCard, filterLoungeAccess
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-8 text-left select-none">
      {/* Page Header */}
      <div className="border-b border-[#E5E7EB] dark:border-slate-800 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-extrabold tracking-widest uppercase rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#2563EB]" />
            SAVINGS DISCOVERY ENGINE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] dark:text-white tracking-tight">
            Find the Right Savings Account
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1 font-normal max-w-3xl">
            Explore and compare savings accounts from different banks.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-extrabold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
            <span>Filters ({activeFiltersCount})</span>
          </button>

          <button
            onClick={() => setIsCompareModalOpen(true)}
            disabled={compareQueue.length === 0}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              compareQueue.length > 0
                ? 'bg-gradient-to-r from-[#0B3D91] to-[#2563EB] text-white hover:shadow-indigo'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Compare Matrix ({compareQueue.length})</span>
          </button>
        </div>
      </div>

      {/* Main Search & Discovery Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search savings accounts by bank name, account type, or debit card..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm outline-none focus:border-[#2563EB] transition-all font-medium text-slate-800 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Chip Preset Toggles */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterZeroBalance(!filterZeroBalance)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
              filterZeroBalance
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            ✓ Zero Balance
          </button>

          <button
            onClick={() => setFilterOnlineOpening(!filterOnlineOpening)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
              filterOnlineOpening
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            ⚡ Video KYC
          </button>

          <button
            onClick={() => setFilterLoungeAccess(!filterLoungeAccess)}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
              filterLoungeAccess
                ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            ✈️ Lounge Access
          </button>
        </div>
      </div>

      {/* Main Layout Container (Desktop Sidebar + Grid) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
        {/* Desktop Left Filter Sidebar */}
        <aside className="hidden lg:block w-[280px] space-y-6 flex-shrink-0 sticky top-24">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="font-extrabold text-sm text-[#1F2937] dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#2563EB]" />
                <span>Account Filters</span>
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-[#2563EB] dark:text-[#60A5FA] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Banks Checklist */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Select Banks:</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar text-xs">
                {BANK_OPTIONS.map(b => (
                  <label key={b} className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium hover:text-[#2563EB]">
                    <input
                      type="checkbox"
                      checked={selectedBanks.includes(b)}
                      onChange={() => toggleBank(b)}
                      className="rounded text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span>{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Account Types Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Account Types:</span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar text-xs">
                {ACCOUNT_TYPE_OPTIONS.map(t => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium hover:text-[#2563EB]">
                    <input
                      type="checkbox"
                      checked={selectedAccountTypes.includes(t)}
                      onChange={() => toggleAccountType(t)}
                      className="rounded text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Range Filters: Min Interest Rate & Max Min Balance */}
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
              <div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                  <span>Min Interest Rate:</span>
                  <span className="font-extrabold text-emerald-600">{minInterestRate > 0 ? `${minInterestRate}%+` : 'Any'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="7.5"
                  step="0.5"
                  value={minInterestRate}
                  onChange={(e) => setMinInterestRate(parseFloat(e.target.value))}
                  className="w-full accent-[#2563EB]"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 mb-1">
                  <span>Max Min Balance:</span>
                  <span className="font-extrabold text-[#2563EB]">₹{maxMinBalance.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="5000"
                  value={maxMinBalance}
                  onChange={(e) => setMaxMinBalance(parseInt(e.target.value, 10))}
                  className="w-full accent-[#2563EB]"
                />
              </div>
            </div>

            {/* Category Special Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Special Filters:</span>
              <div className="space-y-2">
                <label className="flex items-center justify-between cursor-pointer text-slate-700 dark:text-slate-300">
                  <span>Zero Minimum Balance</span>
                  <input type="checkbox" checked={filterZeroBalance} onChange={(e) => setFilterZeroBalance(e.target.checked)} className="rounded text-[#2563EB]" />
                </label>
                <label className="flex items-center justify-between cursor-pointer text-slate-700 dark:text-slate-300">
                  <span>Online Video KYC</span>
                  <input type="checkbox" checked={filterOnlineOpening} onChange={(e) => setFilterOnlineOpening(e.target.checked)} className="rounded text-[#2563EB]" />
                </label>
                <label className="flex items-center justify-between cursor-pointer text-slate-700 dark:text-slate-300">
                  <span>Student Friendly</span>
                  <input type="checkbox" checked={filterStudent} onChange={(e) => setFilterStudent(e.target.checked)} className="rounded text-[#2563EB]" />
                </label>
                <label className="flex items-center justify-between cursor-pointer text-slate-700 dark:text-slate-300">
                  <span>Salary Account</span>
                  <input type="checkbox" checked={filterSalary} onChange={(e) => setFilterSalary(e.target.checked)} className="rounded text-[#2563EB]" />
                </label>
                <label className="flex items-center justify-between cursor-pointer text-slate-700 dark:text-slate-300">
                  <span>Senior Citizen</span>
                  <input type="checkbox" checked={filterSeniorCitizen} onChange={(e) => setFilterSeniorCitizen(e.target.checked)} className="rounded text-[#2563EB]" />
                </label>
                <label className="flex items-center justify-between cursor-pointer text-slate-700 dark:text-slate-300">
                  <span>Women's Account</span>
                  <input type="checkbox" checked={filterWomen} onChange={(e) => setFilterWomen(e.target.checked)} className="rounded text-[#2563EB]" />
                </label>
                <label className="flex items-center justify-between cursor-pointer text-slate-700 dark:text-slate-300">
                  <span>100% Digital Account</span>
                  <input type="checkbox" checked={filterDigital} onChange={(e) => setFilterDigital(e.target.checked)} className="rounded text-[#2563EB]" />
                </label>
                <label className="flex items-center justify-between cursor-pointer text-slate-700 dark:text-slate-300">
                  <span>Debit Card Available</span>
                  <input type="checkbox" checked={filterHasDebitCard} onChange={(e) => setFilterHasDebitCard(e.target.checked)} className="rounded text-[#2563EB]" />
                </label>
                <label className="flex items-center justify-between cursor-pointer text-slate-700 dark:text-slate-300">
                  <span>Lounge Access Card</span>
                  <input type="checkbox" checked={filterLoungeAccess} onChange={(e) => setFilterLoungeAccess(e.target.checked)} className="rounded text-[#2563EB]" />
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Accounts Cards Grid */}
        <div className="flex-1 w-full space-y-6">
          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>Showing {filteredAccounts.length} Verified Savings Accounts</span>
            {activeFiltersCount > 0 && (
              <span className="text-[#2563EB] dark:text-[#60A5FA]">
                {activeFiltersCount} active filter(s) applied
              </span>
            )}
          </div>

          {isLoading ? (
            <SavingsAccountSkeleton />
          ) : filteredAccounts.length === 0 ? (
            /* Empty State */
            <div className="p-12 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 text-center space-y-4 my-8">
              <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                No savings accounts match your current filters.
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try widening your minimum balance range, resetting bank filters, or clearing search keywords.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-6 py-2.5 rounded-full bg-[#2563EB] text-white font-bold text-xs shadow-md cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAccounts.map(account => (
                <SavingsAccountCard
                  key={account.id}
                  account={account}
                  onViewDetails={setSelectedAccount}
                  onToggleCompare={toggleCompareQueue}
                  isCompared={compareQueue.some(a => String(a.id) === String(account.id))}
                  onSelectDebitCard={onSelectDebitCard}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Slide-out Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 w-full max-w-xs bg-white dark:bg-[#0F172A] h-full overflow-y-auto p-6 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#2563EB]" />
                  <span>Account Filters</span>
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Banks Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Select Banks:</span>
                <div className="space-y-2 max-h-40 overflow-y-auto text-xs">
                  {BANK_OPTIONS.map(b => (
                    <label key={b} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={selectedBanks.includes(b)}
                        onChange={() => toggleBank(b)}
                        className="rounded text-[#2563EB]"
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Account Types */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase">Account Types:</span>
                <div className="space-y-2 max-h-40 overflow-y-auto text-xs">
                  {ACCOUNT_TYPE_OPTIONS.map(t => (
                    <label key={t} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={selectedAccountTypes.includes(t)}
                        onChange={() => toggleAccountType(t)}
                        className="rounded text-[#2563EB]"
                      />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Toggles */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
                <label className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>Zero Minimum Balance</span>
                  <input type="checkbox" checked={filterZeroBalance} onChange={(e) => setFilterZeroBalance(e.target.checked)} className="rounded text-[#2563EB]" />
                </label>
                <label className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>Online Video KYC</span>
                  <input type="checkbox" checked={filterOnlineOpening} onChange={(e) => setFilterOnlineOpening(e.target.checked)} className="rounded text-[#2563EB]" />
                </label>
                <label className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>Student Account</span>
                  <input type="checkbox" checked={filterStudent} onChange={(e) => setFilterStudent(e.target.checked)} className="rounded text-[#2563EB]" />
                </label>
                <label className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>Salary Account</span>
                  <input type="checkbox" checked={filterSalary} onChange={(e) => setFilterSalary(e.target.checked)} className="rounded text-[#2563EB]" />
                </label>
                <label className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>Senior Citizen</span>
                  <input type="checkbox" checked={filterSeniorCitizen} onChange={(e) => setFilterSeniorCitizen(e.target.checked)} className="rounded text-[#2563EB]" />
                </label>
                <label className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>Women's Account</span>
                  <input type="checkbox" checked={filterWomen} onChange={(e) => setFilterWomen(e.target.checked)} className="rounded text-[#2563EB]" />
                </label>
                <label className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>Debit Card Available</span>
                  <input type="checkbox" checked={filterHasDebitCard} onChange={(e) => setFilterHasDebitCard(e.target.checked)} className="rounded text-[#2563EB]" />
                </label>
                <label className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>Lounge Access Card</span>
                  <input type="checkbox" checked={filterLoungeAccess} onChange={(e) => setFilterLoungeAccess(e.target.checked)} className="rounded text-[#2563EB]" />
                </label>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#2563EB] text-white text-xs font-bold shadow"
                >
                  Apply Filters ({activeFiltersCount})
                </button>
                <button
                  onClick={() => { resetAllFilters(); setIsMobileFilterOpen(false); }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold"
                >
                  Reset All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Savings Account Comparison Dock */}
      <SavingsAccountComparisonDock
        compareQueue={compareQueue}
        onRemove={(id) => setCompareQueue(prev => prev.filter(a => String(a.id) !== String(id)))}
        onCompareNow={() => setIsCompareModalOpen(true)}
        onClear={() => setCompareQueue([])}
      />

      {/* Savings Account Details Modal */}
      <SavingsAccountDetailsModal
        isOpen={!!selectedAccount}
        onClose={() => setSelectedAccount(null)}
        account={selectedAccount}
        onSelectDebitCard={onSelectDebitCard}
        onToggleCompare={toggleCompareQueue}
        isCompared={selectedAccount && compareQueue.some(a => String(a.id) === String(selectedAccount.id))}
      />

      {/* Side-by-Side Savings Comparison Modal */}
      <SavingsAccountComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        compareQueue={compareQueue}
        onRemove={(id) => setCompareQueue(prev => prev.filter(a => String(a.id) !== String(id)))}
        onSelectDebitCard={onSelectDebitCard}
      />
    </main>
  );
}

export default SavingsAccountsPage;
