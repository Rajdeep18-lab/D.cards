import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  Scale, 
  ChevronDown,
  Briefcase,
  ArrowUpDown,
  Tag,
  Wallet,
  CheckCircle2,
  Gift,
  ArrowRight
} from 'lucide-react';
import CurrentAccountCard from '../components/CurrentAccountCard';
import CurrentAccountDetailsModal from '../components/CurrentAccountDetailsModal';
import { currentAccountService } from '../services/currentAccountService';
import { safeString, safeLower, safeArray, parseNumericValue } from '../utils/safeUtils';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

const BANK_OPTIONS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "IDFC FIRST Bank",
  "Bank of Baroda",
  "IndusInd Bank"
];

const ACCOUNT_TYPE_OPTIONS = [
  "Regular Current",
  "Premium Tier Current",
  "Digital Startup & Modern Current",
  "Zero / Transparent Fee Current",
  "Flexible Balance Current",
  "Fee Collection & Institution Current"
];

const BUSINESS_TYPE_OPTIONS = [
  "Sole Proprietorship",
  "Partnership Firm",
  "Private Limited Company",
  "Limited Liability Partnership (LLP)",
  "Public Limited Company",
  "Trust / Society / Club"
];

const BALANCE_RANGE_OPTIONS = [
  { id: 'all', label: 'All Balance Tiers' },
  { id: 'up-to-5k', label: 'Up to ₹5,000' },
  { id: 'up-to-10k', label: 'Up to ₹10,000' },
  { id: 'up-to-25k', label: 'Up to ₹25,000' },
  { id: 'above-25k', label: '₹25,000+' }
];

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'balance-asc', label: 'Lowest Minimum Balance' },
  { id: 'balance-desc', label: 'Highest Tier Balance' },
  { id: 'name-asc', label: 'Account Name (A–Z)' }
];

function CurrentAccountsPage({ onSelectDebitCard }) {
  useSEO({
    title: "Current Accounts in India – Compare Limits & Charges | D.Card",
    description: "Compare business and commercial current accounts from top banks in India. Check average monthly balance and cash transaction limits on D.Card.",
    canonicalUrl: "https://www.dcard.website/current-accounts"
  });

  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccountForModal, setSelectedAccountForModal] = useState(null);
  const [compareQueue, setCompareQueue] = useState([]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState([]);
  const [selectedBalanceRange, setSelectedBalanceRange] = useState('all');
  const [requireDebitCard, setRequireDebitCard] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    currentAccountService.getCurrentAccounts()
      .then(data => {
        setAccounts(data || []);
      })
      .catch(err => {
        console.error("Failed to load current accounts:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleToggleCompare = useCallback((acc) => {
    setCompareQueue(prev => {
      const exists = prev.some(item => String(item.id) === String(acc.id));
      if (exists) {
        return prev.filter(item => String(item.id) !== String(acc.id));
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, acc];
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedBanks([]);
    setSelectedTypes([]);
    setSelectedBusinessTypes([]);
    setSelectedBalanceRange('all');
    setRequireDebitCard(false);
    setSortBy('recommended');
  }, []);

  // Filter & Search computation
  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    // 1. Text Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(acc => {
        const bank = safeLower(acc.bankName || acc.bank);
        const name = safeLower(acc.accountName);
        const type = safeLower(acc.accountType);
        const suitable = safeLower(acc.suitableFor);
        const benefits = safeArray(acc.keyBenefits).join(' ').toLowerCase();
        const business = safeArray(acc.businessConstitution).join(' ').toLowerCase();

        return bank.includes(q) || 
               name.includes(q) || 
               type.includes(q) || 
               suitable.includes(q) || 
               benefits.includes(q) ||
               business.includes(q);
      });
    }

    // 2. Bank Filter
    if (selectedBanks.length > 0) {
      result = result.filter(acc => {
        const b = acc.bankName || acc.bank;
        return selectedBanks.some(sb => safeLower(b).includes(safeLower(sb)));
      });
    }

    // 3. Account Type Filter
    if (selectedTypes.length > 0) {
      result = result.filter(acc => {
        const t = acc.accountType || '';
        return selectedTypes.some(st => safeLower(t) === safeLower(st));
      });
    }

    // 4. Business Constitution Filter
    if (selectedBusinessTypes.length > 0) {
      result = result.filter(acc => {
        const list = safeArray(acc.businessConstitution);
        return selectedBusinessTypes.some(sbt => 
          list.some(item => safeLower(item).includes(safeLower(sbt)))
        );
      });
    }

    // 5. Balance Range Filter
    if (selectedBalanceRange !== 'all') {
      result = result.filter(acc => {
        const val = parseNumericValue(acc.minimumBalance);
        if (selectedBalanceRange === 'up-to-5k') return val <= 5000;
        if (selectedBalanceRange === 'up-to-10k') return val <= 10000;
        if (selectedBalanceRange === 'up-to-25k') return val <= 25000;
        if (selectedBalanceRange === 'above-25k') return val > 25000;
        return true;
      });
    }

    // 6. Debit Card Availability Filter
    if (requireDebitCard) {
      result = result.filter(acc => {
        const rel = String(acc.debitCardRelationship || '').toLowerCase();
        return rel === 'included' || rel === 'default' || Boolean(acc.debitCardName);
      });
    }

    // 7. Sort
    if (sortBy === 'balance-asc') {
      result.sort((a, b) => parseNumericValue(a.minimumBalance) - parseNumericValue(b.minimumBalance));
    } else if (sortBy === 'balance-desc') {
      result.sort((a, b) => parseNumericValue(b.minimumBalance) - parseNumericValue(a.minimumBalance));
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => String(a.accountName || '').localeCompare(String(b.accountName || '')));
    }

    return result;
  }, [accounts, searchQuery, selectedBanks, selectedTypes, selectedBusinessTypes, selectedBalanceRange, requireDebitCard, sortBy]);

  const activeFilterCount = (selectedBanks.length ? 1 : 0) +
                            (selectedTypes.length ? 1 : 0) +
                            (selectedBusinessTypes.length ? 1 : 0) +
                            (selectedBalanceRange !== 'all' ? 1 : 0) +
                            (requireDebitCard ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none text-left">
      {/* ── 1. HERO BANNER ── */}
      <div className="p-8 sm:p-10 rounded-[32px] bg-gradient-to-br from-[#0B3D91] via-[#1E3A8A] to-[#2563EB] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-extrabold border border-white/20">
            <Briefcase className="w-3.5 h-3.5 text-blue-200" />
            <span>BUSINESS & COMMERCIAL BANKING</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Current Accounts Discovery
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 font-normal leading-relaxed">
            Compare business accounts, Monthly Average Balance (MAB) rules, free cash deposit thresholds, multi-user net banking, and verified business debit cards.
          </p>

          <div className="flex flex-wrap gap-4 pt-4 text-xs font-bold">
            <div className="flex items-center gap-2 bg-black/20 px-3.5 py-2 rounded-xl border border-white/10">
              <Building2 className="w-4 h-4 text-blue-300" />
              <span>{accounts.length} Commercial Accounts Indexed</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. SEARCH & CONTROLS TOOLBAR ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 w-full flex items-center pl-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search current accounts by bank, account name, business type, or features..."
            className="w-full bg-transparent border-none text-xs font-normal pl-2.5 py-2.5 outline-none text-[#1F2937] dark:text-white placeholder-[#9CA3AF]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 mr-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end px-2">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="sm:hidden px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-slate-700 dark:text-slate-200 border-none outline-none cursor-pointer pr-4 py-1"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id} className="bg-white dark:bg-slate-900">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── 3. MAIN CONTENT GRID WITH SIDEBAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <div className="hidden lg:block space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-black uppercase tracking-wider text-[#1F2937] dark:text-white flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#2563EB]" /> Filters
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] font-extrabold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            {/* Bank Filter */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Banks
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {BANK_OPTIONS.map(bank => {
                  const isChecked = selectedBanks.includes(bank);
                  return (
                    <label
                      key={bank}
                      onClick={() => {
                        setSelectedBanks(prev => 
                          prev.includes(bank) ? prev.filter(b => b !== bank) : [...prev, bank]
                        );
                      }}
                      className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-[#2563EB] cursor-pointer py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="rounded text-[#2563EB] focus:ring-0 cursor-pointer"
                      />
                      <span>{bank}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Business Constitution Filter */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Business Constitution
              </label>
              <div className="space-y-1.5">
                {BUSINESS_TYPE_OPTIONS.map(type => {
                  const isChecked = selectedBusinessTypes.includes(type);
                  return (
                    <label
                      key={type}
                      onClick={() => {
                        setSelectedBusinessTypes(prev => 
                          prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                        );
                      }}
                      className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-[#2563EB] cursor-pointer py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="rounded text-[#2563EB] focus:ring-0 cursor-pointer"
                      />
                      <span>{type}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Minimum Balance Tier Filter */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Minimum Balance (MAB)
              </label>
              <div className="space-y-1.5">
                {BALANCE_RANGE_OPTIONS.map(opt => (
                  <label
                    key={opt.id}
                    onClick={() => setSelectedBalanceRange(opt.id)}
                    className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-[#2563EB] cursor-pointer py-0.5"
                  >
                    <input
                      type="radio"
                      name="balanceRangeDesktop"
                      checked={selectedBalanceRange === opt.id}
                      readOnly
                      className="text-[#2563EB] focus:ring-0 cursor-pointer"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Debit Card Availability */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label
                onClick={() => setRequireDebitCard(prev => !prev)}
                className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={requireDebitCard}
                  readOnly
                  className="rounded text-[#2563EB] focus:ring-0 cursor-pointer"
                />
                <span>Includes Debit Card Linkage</span>
              </label>
            </div>
          </div>
        </div>

        {/* PRODUCTS CARDS GRID */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-1">
            <span>Showing {filteredAccounts.length} of {accounts.length} Current Accounts</span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading current accounts catalogue...</div>
          ) : filteredAccounts.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 text-center space-y-4">
              <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">No Matching Current Accounts Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Try adjusting or clearing your search filters to view available commercial banking options.</p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {filteredAccounts.map(account => (
                <CurrentAccountCard
                  key={account.id}
                  account={account}
                  onViewDetails={() => setSelectedAccountForModal(account)}
                  onToggleCompare={handleToggleCompare}
                  isCompared={compareQueue.some(item => String(item.id) === String(account.id))}
                  onSelectDebitCard={onSelectDebitCard}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── 4. QUICK DETAILS MODAL ── */}
      <CurrentAccountDetailsModal
        isOpen={!!selectedAccountForModal}
        onClose={() => setSelectedAccountForModal(null)}
        account={selectedAccountForModal}
        onSelectDebitCard={onSelectDebitCard}
        onToggleCompare={handleToggleCompare}
        isCompared={selectedAccountForModal ? compareQueue.some(i => String(i.id) === String(selectedAccountForModal.id)) : false}
      />

      {/* ── 5. FLOATING COMPARE DOCK ── */}
      <AnimatePresence>
        {compareQueue.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-50 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl flex items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#2563EB]" />
              <span className="text-xs font-black text-slate-800 dark:text-white">
                Comparing ({compareQueue.length}/3)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {compareQueue.map(acc => (
                <div key={acc.id} className="text-[11px] font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <span>{acc.bankName || acc.bank}</span>
                  <button onClick={() => handleToggleCompare(acc)} className="text-slate-400 hover:text-rose-500">×</button>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/compare-current', { state: { queue: compareQueue } })}
              className="px-4 py-2 rounded-xl bg-[#2563EB] text-white font-extrabold text-xs shadow-md hover:bg-blue-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>Compare Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CurrentAccountsPage;
