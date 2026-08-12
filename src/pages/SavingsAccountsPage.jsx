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
  ChevronDown,
  SlidersHorizontal,
  CreditCard,
  ArrowUpDown,
  Tag,
  Wallet,
  Zap,
  Smartphone,
  CheckCircle2,
  Gift,
  Award,
  Globe,
  Sliders
} from 'lucide-react';
import SavingsAccountCard from '../components/SavingsAccountCard';
import SavingsAccountDetailsModal from '../components/SavingsAccountDetailsModal';
import SavingsAccountComparisonDock from '../components/SavingsAccountComparisonDock';
import SavingsAccountComparisonModal from '../components/SavingsAccountComparisonModal';
import { savingsAccountService } from '../services/savingsAccountService';
import { getAssociatedDebitCard } from '../data/mockSavingsAccounts';

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
  "Minor",
  "Premium Savings",
  "Basic Savings",
  "NRI",
  "Other"
];

const BALANCE_RANGE_OPTIONS = [
  { id: 'zero', label: '₹0 (Zero Balance)' },
  { id: 'below-1k', label: 'Below ₹1,000' },
  { id: '1k-5k', label: '₹1,000–₹5,000' },
  { id: '5k-10k', label: '₹5,000–₹10,000' },
  { id: 'above-10k', label: 'Above ₹10,000' }
];

const OPENING_METHOD_OPTIONS = [
  "Online",
  "Video KYC",
  "Mobile App",
  "Branch"
];

const BANKING_FEATURE_OPTIONS = [
  "UPI",
  "Mobile Banking",
  "Internet Banking",
  "NEFT",
  "RTGS",
  "IMPS",
  "Cheque Book",
  "Passbook",
  "Auto Sweep",
  "Nominee Facility"
];

const DEBIT_CARD_FILTER_OPTIONS = [
  "Debit Card Available",
  "Visa",
  "Mastercard",
  "RuPay",
  "Contactless",
  "International Usage",
  "Lounge Access",
  "Insurance",
  "Rewards",
  "Cashback"
];

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'rate-desc', label: 'Interest Rate: High → Low' },
  { id: 'rate-asc', label: 'Interest Rate: Low → High' },
  { id: 'balance-asc', label: 'Minimum Balance: Low → High' },
  { id: 'balance-desc', label: 'Minimum Balance: High → Low' },
  { id: 'bank-asc', label: 'Bank Name: A → Z' }
];

function SavingsAccountSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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

function matchesAccountType(acc, type) {
  const typeStr = (acc.accountType || '').toLowerCase();
  const badgesStr = (acc.accountTypeBadges || []).map(b => b.toLowerCase()).join(' ');
  const t = type.toLowerCase();

  if (typeStr.includes(t) || badgesStr.includes(t)) return true;
  if (t.includes('zero') && acc.isZeroBalance) return true;
  if (t.includes('student') && acc.isStudent) return true;
  if (t.includes('salary') && acc.isSalary) return true;
  if (t.includes('senior') && acc.isSeniorCitizen) return true;
  if (t.includes('women') && acc.isWomenSpecial) return true;
  if (t.includes('digital') && acc.isDigital) return true;
  if (t.includes('premium') && acc.isPremium) return true;
  if (t.includes('nri') && acc.isNRI) return true;
  if (t.includes('minor') && (acc.accountType?.toLowerCase().includes('minor') || acc.accountName?.toLowerCase().includes('minor') || acc.accountName?.toLowerCase().includes('kids') || acc.accountName?.toLowerCase().includes('pehla kadam'))) return true;
  if (t.includes('basic') && (acc.accountType?.toLowerCase().includes('basic') || acc.accountTypeBadges?.some(b => b.toLowerCase().includes('basic')) || acc.accountName?.toLowerCase().includes('bsbd'))) return true;
  if (t === 'other') return true;
  return false;
}

function matchesBalanceRange(acc, rangeId) {
  const val = acc.minimumBalanceValue ?? 0;
  const isZero = acc.isZeroBalance === true || val === 0;

  switch (rangeId) {
    case 'zero':
      return isZero;
    case 'below-1k':
      return !isZero && val > 0 && val < 1000;
    case '1k-5k':
      return val >= 1000 && val <= 5000;
    case '5k-10k':
      return val >= 5000 && val <= 10000;
    case 'above-10k':
      return val > 10000;
    default:
      return true;
  }
}

function matchesOpeningMethod(acc, method) {
  const m = method.toLowerCase();
  const accText = [
    acc.isOnlineOpening ? 'online video kyc' : '',
    ...(acc.accountOpeningFeatures || []),
    ...(acc.keyBenefits || []),
    acc.description || ''
  ].join(' ').toLowerCase();

  if (m === 'online') {
    return acc.isOnlineOpening === true || accText.includes('online') || accText.includes('digital');
  }
  if (m === 'video kyc') {
    return accText.includes('video kyc') || accText.includes('vkyc');
  }
  if (m === 'mobile app') {
    return accText.includes('app') || accText.includes('mobile') || accText.includes('yono') || accText.includes('imobile') || accText.includes('bob world') || accText.includes('0101');
  }
  if (m === 'branch') {
    return accText.includes('branch') || accText.includes('doorstep');
  }
  return false;
}

function matchesBankingFeature(acc, feature) {
  const f = feature.toLowerCase();
  const accText = [
    ...(acc.bankingFeatures || []),
    ...(acc.keyBenefits || []),
    ...(acc.accountOpeningFeatures || []),
    acc.description || ''
  ].join(' ').toLowerCase();

  if (f === 'upi') return accText.includes('upi') || accText.includes('scan & pay');
  if (f === 'mobile banking') return accText.includes('mobile') || accText.includes('app');
  if (f === 'internet banking') return accText.includes('internet banking') || accText.includes('netbanking') || accText.includes('online');
  if (f === 'neft') return accText.includes('neft');
  if (f === 'rtgs') return accText.includes('rtgs');
  if (f === 'imps') return accText.includes('imps');
  if (f === 'cheque book') return accText.includes('cheque') || accText.includes('chequebook');
  if (f === 'passbook') return accText.includes('passbook');
  if (f === 'auto sweep') return accText.includes('auto-sweep') || accText.includes('auto sweep') || accText.includes('mod') || accText.includes('smart jar');
  if (f === 'nominee facility') return accText.includes('nominee') || accText.includes('joint') || true;
  return accText.includes(f);
}

function matchesDebitCardFilter(acc, cardFilter) {
  const cf = cardFilter.toLowerCase();
  const card = getAssociatedDebitCard(acc.associatedDebitCardId);
  const cardName = (acc.associatedDebitCardName || card?.cardName || '').toLowerCase();
  const cardNetwork = (card?.network || '').toLowerCase();

  const combinedText = [
    cardName,
    cardNetwork,
    card?.bestFor || '',
    card?.cashback || '',
    card?.loungeAccess || '',
    card?.annualFee || '',
    ...(card?.features || []),
    ...(card?.perks || []),
    ...(acc.keyBenefits || []),
    acc.description || ''
  ].join(' ').toLowerCase();

  if (cf === 'debit card available') {
    return Boolean(acc.associatedDebitCardId || acc.associatedDebitCardName || card);
  }
  if (cf === 'visa') {
    return cardNetwork.includes('visa') || combinedText.includes('visa');
  }
  if (cf === 'mastercard') {
    return cardNetwork.includes('mastercard') || combinedText.includes('mastercard');
  }
  if (cf === 'rupay') {
    return cardNetwork.includes('rupay') || combinedText.includes('rupay');
  }
  if (cf === 'contactless') {
    return card?.contactless === true || combinedText.includes('contactless') || combinedText.includes('paywave') || combinedText.includes('scan');
  }
  if (cf === 'international usage') {
    return card?.international === true || combinedText.includes('international') || combinedText.includes('global') || combinedText.includes('forex');
  }
  if (cf === 'lounge access') {
    const l = (card?.loungeAccess || '').toLowerCase();
    return (Boolean(l) && !l.startsWith('no') && !l.includes('not available')) || combinedText.includes('lounge');
  }
  if (cf === 'insurance') {
    return combinedText.includes('insurance') || combinedText.includes('cover') || combinedText.includes('accidental');
  }
  if (cf === 'rewards') {
    return combinedText.includes('reward') || combinedText.includes('points') || combinedText.includes('discount') || combinedText.includes('privilege');
  }
  if (cf === 'cashback') {
    const cb = (card?.cashback || '').toLowerCase();
    return (Boolean(cb) && !cb.startsWith('no') && !cb.includes('not available')) || combinedText.includes('cashback');
  }

  return false;
}

function SavingsAccountsPage({ onSelectDebitCard }) {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedAccountTypes, setSelectedAccountTypes] = useState([]);
  const [minInterestRate, setMinInterestRate] = useState(0);
  const [selectedBalanceRanges, setSelectedBalanceRanges] = useState([]);
  const [zeroBalanceFilter, setZeroBalanceFilter] = useState('all'); // 'all' | 'yes' | 'no'
  const [selectedOpeningMethods, setSelectedOpeningMethods] = useState([]);
  const [selectedBankingFeatures, setSelectedBankingFeatures] = useState([]);
  const [selectedDebitCardFilters, setSelectedDebitCardFilters] = useState([]);
  const [sortBy, setSortBy] = useState('recommended');

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

  // Multi-select toggle helpers
  const toggleBank = useCallback((b) => {
    setSelectedBanks(prev => prev.includes(b) ? prev.filter(item => item !== b) : [...prev, b]);
  }, []);

  const toggleAccountType = useCallback((t) => {
    setSelectedAccountTypes(prev => prev.includes(t) ? prev.filter(item => item !== t) : [...prev, t]);
  }, []);

  const toggleBalanceRange = useCallback((rId) => {
    setSelectedBalanceRanges(prev => prev.includes(rId) ? prev.filter(item => item !== rId) : [...prev, rId]);
  }, []);

  const toggleOpeningMethod = useCallback((m) => {
    setSelectedOpeningMethods(prev => prev.includes(m) ? prev.filter(item => item !== m) : [...prev, m]);
  }, []);

  const toggleBankingFeature = useCallback((f) => {
    setSelectedBankingFeatures(prev => prev.includes(f) ? prev.filter(item => item !== f) : [...prev, f]);
  }, []);

  const toggleDebitCardFilter = useCallback((cf) => {
    setSelectedDebitCardFilters(prev => prev.includes(cf) ? prev.filter(item => item !== cf) : [...prev, cf]);
  }, []);

  const resetAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedBanks([]);
    setSelectedAccountTypes([]);
    setMinInterestRate(0);
    setSelectedBalanceRanges([]);
    setZeroBalanceFilter('all');
    setSelectedOpeningMethods([]);
    setSelectedBankingFeatures([]);
    setSelectedDebitCardFilters([]);
    setSortBy('recommended');
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

  // Filter & Sort Pipeline
  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    // 1. Search Query Filter
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(acc => {
        const card = getAssociatedDebitCard(acc.associatedDebitCardId);
        const searchableText = [
          acc.accountName,
          acc.bank,
          acc.accountType,
          ...(acc.accountTypeBadges || []),
          acc.description,
          ...(acc.keyBenefits || []),
          ...(acc.bankingFeatures || []),
          ...(acc.accountOpeningFeatures || []),
          acc.associatedDebitCardName,
          card?.cardName,
          card?.network,
          card?.bestFor,
          card?.cashback,
          card?.loungeAccess,
          ...(card?.features || [])
        ].filter(Boolean).join(' ').toLowerCase();

        return searchableText.includes(q);
      });
    }

    // 2. Bank Filter (OR within category)
    if (selectedBanks.length > 0) {
      result = result.filter(acc => selectedBanks.some(b => acc.bank.toLowerCase().includes(b.toLowerCase())));
    }

    // 3. Account Type Filter (OR within category)
    if (selectedAccountTypes.length > 0) {
      result = result.filter(acc => selectedAccountTypes.some(t => matchesAccountType(acc, t)));
    }

    // 4. Minimum Interest Rate Filter
    if (minInterestRate > 0) {
      result = result.filter(acc => (acc.interestRateValue || 0) >= minInterestRate);
    }

    // 5. Minimum Balance Range Filter (OR within category)
    if (selectedBalanceRanges.length > 0) {
      result = result.filter(acc => selectedBalanceRanges.some(rId => matchesBalanceRange(acc, rId)));
    }

    // 6. Zero Balance Filter
    if (zeroBalanceFilter === 'yes') {
      result = result.filter(acc => acc.isZeroBalance === true || acc.minimumBalanceValue === 0);
    } else if (zeroBalanceFilter === 'no') {
      result = result.filter(acc => acc.isZeroBalance === false && (acc.minimumBalanceValue || 0) > 0);
    }

    // 7. Account Opening Method Filter (AND logic across selected methods)
    if (selectedOpeningMethods.length > 0) {
      result = result.filter(acc => selectedOpeningMethods.every(m => matchesOpeningMethod(acc, m)));
    }

    // 8. Banking Features Filter (AND logic across selected features)
    if (selectedBankingFeatures.length > 0) {
      result = result.filter(acc => selectedBankingFeatures.every(f => matchesBankingFeature(acc, f)));
    }

    // 9. Debit Card Feature Filter (AND logic across selected debit card filters)
    if (selectedDebitCardFilters.length > 0) {
      result = result.filter(acc => selectedDebitCardFilters.every(cf => matchesDebitCardFilter(acc, cf)));
    }

    // 10. Sorting
    switch (sortBy) {
      case 'rate-desc':
        result.sort((a, b) => (b.interestRateValue || 0) - (a.interestRateValue || 0));
        break;
      case 'rate-asc':
        result.sort((a, b) => (a.interestRateValue || 0) - (b.interestRateValue || 0));
        break;
      case 'balance-asc':
        result.sort((a, b) => (a.minimumBalanceValue || 0) - (b.minimumBalanceValue || 0));
        break;
      case 'balance-desc':
        result.sort((a, b) => (b.minimumBalanceValue || 0) - (a.minimumBalanceValue || 0));
        break;
      case 'bank-asc':
        result.sort((a, b) => (a.bank || '').localeCompare(b.bank || ''));
        break;
      case 'recommended':
      default:
        // Keep initial dataset order
        break;
    }

    return result;
  }, [
    accounts,
    searchQuery,
    selectedBanks,
    selectedAccountTypes,
    minInterestRate,
    selectedBalanceRanges,
    zeroBalanceFilter,
    selectedOpeningMethods,
    selectedBankingFeatures,
    selectedDebitCardFilters,
    sortBy
  ]);

  const activeFiltersCount = useMemo(() => {
    return (searchQuery ? 1 : 0) +
      selectedBanks.length +
      selectedAccountTypes.length +
      (minInterestRate > 0 ? 1 : 0) +
      selectedBalanceRanges.length +
      (zeroBalanceFilter !== 'all' ? 1 : 0) +
      selectedOpeningMethods.length +
      selectedBankingFeatures.length +
      selectedDebitCardFilters.length;
  }, [
    searchQuery,
    selectedBanks,
    selectedAccountTypes,
    minInterestRate,
    selectedBalanceRanges,
    zeroBalanceFilter,
    selectedOpeningMethods,
    selectedBankingFeatures,
    selectedDebitCardFilters
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
            Savings Accounts
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1 font-normal max-w-3xl">
            Explore savings accounts based on interest rates, balance requirements, features, charges and eligibility.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-extrabold text-xs flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
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

      {/* Prominent Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search savings accounts, banks or features..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all font-medium text-slate-800 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full cursor-pointer"
              aria-label="Clear Search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {activeFiltersCount > 0 && (
        <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-slate-800/60 border border-blue-100 dark:border-slate-700 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-extrabold text-slate-500 uppercase tracking-wider text-[11px] mr-1">
            Active Filters ({activeFiltersCount}):
          </span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200 shadow-2xs">
              Search: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-rose-500 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {selectedBanks.map(b => (
            <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 font-bold text-[#2563EB] dark:text-[#60A5FA] shadow-2xs">
              {b}
              <button onClick={() => toggleBank(b)} className="hover:text-rose-500 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          {selectedAccountTypes.map(t => (
            <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 font-bold text-indigo-600 dark:text-indigo-400 shadow-2xs">
              {t}
              <button onClick={() => toggleAccountType(t)} className="hover:text-rose-500 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          {minInterestRate > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-700 font-bold text-emerald-600 dark:text-emerald-400 shadow-2xs">
              Min Interest: {minInterestRate}%+
              <button onClick={() => setMinInterestRate(0)} className="hover:text-rose-500 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {selectedBalanceRanges.map(rId => {
            const opt = BALANCE_RANGE_OPTIONS.find(o => o.id === rId);
            return (
              <span key={rId} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 shadow-2xs">
                {opt?.label || rId}
                <button onClick={() => toggleBalanceRange(rId)} className="hover:text-rose-500 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            );
          })}

          {zeroBalanceFilter !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-700 font-bold text-emerald-600 dark:text-emerald-400 shadow-2xs">
              Zero Balance: {zeroBalanceFilter === 'yes' ? 'Yes' : 'No'}
              <button onClick={() => setZeroBalanceFilter('all')} className="hover:text-rose-500 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {selectedOpeningMethods.map(m => (
            <span key={m} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 shadow-2xs">
              Opening: {m}
              <button onClick={() => toggleOpeningMethod(m)} className="hover:text-rose-500 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          {selectedBankingFeatures.map(f => (
            <span key={f} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 shadow-2xs">
              Feature: {f}
              <button onClick={() => toggleBankingFeature(f)} className="hover:text-rose-500 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          {selectedDebitCardFilters.map(cf => (
            <span key={cf} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 font-bold text-purple-600 dark:text-purple-400 shadow-2xs">
              Card: {cf}
              <button onClick={() => toggleDebitCardFilter(cf)} className="hover:text-rose-500 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          <button
            onClick={resetAllFilters}
            className="ml-auto font-extrabold text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      )}

      {/* Main Layout Container (Desktop Sidebar + Grid) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
        {/* Desktop Left Filter Sidebar */}
        <aside className="hidden lg:block w-[300px] space-y-6 flex-shrink-0 sticky top-24">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-800 shadow-soft space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="font-extrabold text-sm text-[#1F2937] dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#2563EB]" />
                <span>Smart Filters</span>
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {/* 1. BANK */}
            <div className="space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Bank:</span>
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

            {/* 2. ACCOUNT TYPE */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Account Type:</span>
              <div className="space-y-1.5 max-h-44 overflow-y-auto custom-scrollbar text-xs">
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

            {/* 3. INTEREST RATE */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
              <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Interest Rate:</span>
                <span className="font-extrabold text-emerald-600">
                  {minInterestRate > 0 ? `${minInterestRate}%+` : 'Any'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMinInterestRate(0)}
                  className={`flex-1 py-1.5 rounded-xl border text-[11px] font-extrabold cursor-pointer transition-all ${
                    minInterestRate === 0
                      ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-100 dark:text-slate-900'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Lowest
                </button>
                <button
                  type="button"
                  onClick={() => setMinInterestRate(6.0)}
                  className={`flex-1 py-1.5 rounded-xl border text-[11px] font-extrabold cursor-pointer transition-all ${
                    minInterestRate === 6.0
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Highest (6%+)
                </button>
              </div>
              <div>
                <input
                  type="range"
                  min="0"
                  max="7.5"
                  step="0.5"
                  value={minInterestRate}
                  onChange={(e) => setMinInterestRate(parseFloat(e.target.value))}
                  className="w-full accent-[#2563EB] cursor-pointer"
                />
              </div>
            </div>

            {/* 4. MINIMUM BALANCE */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Minimum Balance:</span>
              <div className="space-y-1.5 text-xs">
                {BALANCE_RANGE_OPTIONS.map(opt => (
                  <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium hover:text-[#2563EB]">
                    <input
                      type="checkbox"
                      checked={selectedBalanceRanges.includes(opt.id)}
                      onChange={() => toggleBalanceRange(opt.id)}
                      className="rounded text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 5. ZERO BALANCE */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Zero Balance:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'yes', label: 'Yes' },
                  { id: 'no', label: 'No' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setZeroBalanceFilter(opt.id)}
                    className={`py-1.5 rounded-xl border font-bold cursor-pointer transition-all ${
                      zeroBalanceFilter === opt.id
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. ACCOUNT OPENING */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Account Opening:</span>
              <div className="space-y-1.5 text-xs">
                {OPENING_METHOD_OPTIONS.map(m => (
                  <label key={m} className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium hover:text-[#2563EB]">
                    <input
                      type="checkbox"
                      checked={selectedOpeningMethods.includes(m)}
                      onChange={() => toggleOpeningMethod(m)}
                      className="rounded text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span>{m}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 7. BANKING FEATURES */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Banking Features:</span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar text-xs">
                {BANKING_FEATURE_OPTIONS.map(f => (
                  <label key={f} className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium hover:text-[#2563EB]">
                    <input
                      type="checkbox"
                      checked={selectedBankingFeatures.includes(f)}
                      onChange={() => toggleBankingFeature(f)}
                      className="rounded text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span>{f}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 8. DEBIT CARD */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block">Debit Card Features:</span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar text-xs">
                {DEBIT_CARD_FILTER_OPTIONS.map(cf => (
                  <label key={cf} className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium hover:text-[#2563EB]">
                    <input
                      type="checkbox"
                      checked={selectedDebitCardFilters.includes(cf)}
                      onChange={() => toggleDebitCardFilter(cf)}
                      className="rounded text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span>{cf}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right Accounts Cards Grid */}
        <div className="flex-1 w-full space-y-6">
          {/* Summary Bar & Sorting Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#1E293B] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 tracking-tight">
              {filteredAccounts.length} Savings Accounts Found
            </span>

            <div className="flex items-center gap-2 text-xs font-bold w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-slate-400 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort By:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200 text-xs outline-none focus:border-[#2563EB] cursor-pointer"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <SavingsAccountSkeleton />
          ) : filteredAccounts.length === 0 ? (
            /* Empty State */
            <div className="p-12 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 text-center space-y-4 my-8 shadow-soft">
              <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                No savings accounts found.
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try changing your filters or search criteria.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-6 py-2.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
              >
                Clear Filters
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
              className="relative z-10 w-full max-w-sm bg-white dark:bg-[#0F172A] h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[#2563EB]" />
                    <span>Account Filters</span>
                  </h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
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

                {/* Mobile Interest Rate */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                    <span>Min Interest Rate:</span>
                    <span className="text-emerald-600">{minInterestRate > 0 ? `${minInterestRate}%+` : 'Any'}</span>
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

                {/* Mobile Minimum Balance */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase">Minimum Balance:</span>
                  <div className="space-y-2 text-xs">
                    {BALANCE_RANGE_OPTIONS.map(opt => (
                      <label key={opt.id} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={selectedBalanceRanges.includes(opt.id)}
                          onChange={() => toggleBalanceRange(opt.id)}
                          className="rounded text-[#2563EB]"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mobile Account Opening */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase">Account Opening:</span>
                  <div className="space-y-2 text-xs">
                    {OPENING_METHOD_OPTIONS.map(m => (
                      <label key={m} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={selectedOpeningMethods.includes(m)}
                          onChange={() => toggleOpeningMethod(m)}
                          className="rounded text-[#2563EB]"
                        />
                        <span>{m}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mobile Banking Features */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase">Banking Features:</span>
                  <div className="space-y-2 max-h-36 overflow-y-auto text-xs">
                    {BANKING_FEATURE_OPTIONS.map(f => (
                      <label key={f} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={selectedBankingFeatures.includes(f)}
                          onChange={() => toggleBankingFeature(f)}
                          className="rounded text-[#2563EB]"
                        />
                        <span>{f}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mobile Debit Card Features */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase">Debit Card Features:</span>
                  <div className="space-y-2 max-h-36 overflow-y-auto text-xs">
                    {DEBIT_CARD_FILTER_OPTIONS.map(cf => (
                      <label key={cf} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={selectedDebitCardFilters.includes(cf)}
                          onChange={() => toggleDebitCardFilter(cf)}
                          className="rounded text-[#2563EB]"
                        />
                        <span>{cf}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions inside Mobile Drawer */}
              <div className="pt-6 space-y-2 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-[#0F172A]">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#2563EB] text-white text-xs font-bold shadow cursor-pointer active:scale-98 transition-transform"
                >
                  Apply Filters ({activeFiltersCount})
                </button>
                <button
                  onClick={() => { resetAllFilters(); setIsMobileFilterOpen(false); }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer hover:bg-slate-200"
                >
                  Clear All
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
