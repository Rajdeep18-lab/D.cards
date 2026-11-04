import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  ExternalLink, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Search, 
  Percent, 
  Sliders, 
  Heart, 
  Scale, 
  Globe, 
  ChevronRight, 
  Info, 
  Award, 
  MapPin, 
  Calendar, 
  Shield, 
  Smartphone,
  Star,
  DollarSign,
  Gift,
  Zap,
  ArrowRight,
  Filter,
  Check,
  Briefcase
} from 'lucide-react';
import { debitCards as defaultDebitCards } from '../data/mockData';
import { savingsAccounts as defaultSavingsAccounts, getAssociatedDebitCards, getAssociatedDebitCard } from '../data/mockSavingsAccounts';
import { savingsAccountService } from '../services/savingsAccountService';
import { currentAccounts as defaultCurrentAccounts } from '../data/currentAccounts/index.js';
import { currentAccountService } from '../services/currentAccountService';
import { getCoveredBanksDirectory, getInstitutionalProfileForBank, canonicalBankName, getBankBrandTheme } from '../utils/bankDirectoryUtils';
import { useWishlist } from '../context/WishlistContext';
import DebitCardCard from '../components/DebitCardCard';
import SavingsAccountCard from '../components/SavingsAccountCard';
import CurrentAccountCard from '../components/CurrentAccountCard';
import BankBrandLogo from '../components/BankBrandLogo';
import BankLogo from '../components/BankLogo';
import IDFCTierEligibilityCalculator from '../components/IDFCTierEligibilityCalculator';
import IDFCTierBenefitsComparison from '../components/IDFCTierBenefitsComparison';
import ICICIBSavingsDetailView from '../components/ICICIBSavingsDetailView';
import { useSEO } from '../hooks/useSEO';
import { useLanguage } from '../context/LanguageContext';

function BanksPage({ 
  activeCardsList = null, 
  toggleCompareQueue, 
  compareQueue = [], 
  onSelectDebitCard, 
  savingsCompareQueue = [], 
  setSavingsCompareQueue,
  currentCompareQueue = [],
  setCurrentCompareQueue
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { t, isHindi } = useLanguage();

  // Load all covered banks dynamically from JSON & dataset
  const coveredBanks = useMemo(() => {
    return getCoveredBanksDirectory(activeCardsList);
  }, [activeCardsList]);

  // Determine active bank based on URL param :id or default to first bank (SBI)
  const activeBankObj = useMemo(() => {
    if (!coveredBanks || coveredBanks.length === 0) return null;
    if (id) {
      const q = String(id).toLowerCase().trim();
      const match = coveredBanks.find(b => 
        String(b.id) === q || 
        b.name.toLowerCase() === q || 
        canonicalBankName(b.name).toLowerCase() === q ||
        b.logoText.toLowerCase() === q
      );
      if (match) return match;
    }
    return coveredBanks[0];
  }, [coveredBanks, id]);

  const seoTitle = id && activeBankObj
    ? `${activeBankObj.name} – Bank Profile, Debit Cards & Savings Accounts | D.Card`
    : "Top Banks in India – Directory, Ratings & Products | D.Card";

  const seoDescription = id && activeBankObj
    ? `Explore ${activeBankObj.name} banking products. Discover ${activeBankObj.cardCount || ''} debit cards, ${activeBankObj.accountCount || ''} savings accounts, interest rates, and key benefits on D.Card.`
    : "Explore profiles of leading public, private, and small finance banks in India. Compare savings accounts and debit card offerings on D.Card.";

  const seoCanonical = id && activeBankObj
    ? `https://www.dcard.website/banks/${id}`
    : "https://www.dcard.website/banks";

  const breadcrumbElements = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.dcard.website/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Banks Directory",
      "item": "https://www.dcard.website/banks"
    }
  ];
  if (id && activeBankObj) {
    breadcrumbElements.push({
      "@type": "ListItem",
      "position": 3,
      "name": activeBankObj.name,
      "item": seoCanonical
    });
  }

  const seoSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbElements
      },
      ...(id && activeBankObj ? [{
        "@type": "BankOrCreditUnion",
        "name": activeBankObj.name,
        "url": seoCanonical,
        "description": seoDescription
      }] : [])
    ]
  };

  useSEO({
    title: seoTitle,
    description: seoDescription,
    canonicalUrl: seoCanonical,
    schema: seoSchema
  });

  const [selectedBankName, setSelectedBankName] = useState(() => {
    return activeBankObj ? activeBankObj.name : "State Bank of India";
  });

  useEffect(() => {
    if (activeBankObj && activeBankObj.name !== selectedBankName) {
      setSelectedBankName(activeBankObj.name);
    }
  }, [activeBankObj]);

  const handleBankSelect = (bankName) => {
    setSelectedBankName(bankName);
    const bankObj = coveredBanks.find(b => b.name === bankName);
    if (bankObj) {
      navigate(`/banks/${bankObj.id}`, { replace: true });
    }
  };

  // Section smooth scrolling refs
  const overviewRef = useRef(null);
  const debitCardsRef = useRef(null);
  const savingsAccountsRef = useRef(null);
  const currentAccountsRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');

  const scrollToSection = (sectionId, tabName) => {
    setActiveTab(tabName);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // In-Bank Search & Filter State
  const [bankSearchQuery, setBankSearchQuery] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All'); // 'All' | 'Debit Cards' | 'Savings Accounts' | 'Current Accounts'

  const [allSavingsAccounts, setAllSavingsAccounts] = useState(defaultSavingsAccounts);
  const [allCurrentAccounts, setAllCurrentAccounts] = useState(defaultCurrentAccounts);

  useEffect(() => {
    savingsAccountService.getSavingsAccounts()
      .then(res => {
        if (res && res.length > 0) setAllSavingsAccounts(res);
      })
      .catch(err => console.warn('Notice loading savings accounts in BanksPage:', err));

    currentAccountService.getCurrentAccounts()
      .then(res => {
        if (res && res.length > 0) setAllCurrentAccounts(res);
      })
      .catch(err => console.warn('Notice loading current accounts in BanksPage:', err));
  }, []);

  // Get active bank details, debit cards, savings accounts, and current accounts
  const bankProfileData = useMemo(() => {
    const canonicalName = canonicalBankName(selectedBankName);
    const currentBankObj = coveredBanks.find(b => canonicalBankName(b.name) === canonicalName) || coveredBanks[0];

    // Filter Debit Cards for this bank
    const sourceDebitCards = (activeCardsList && activeCardsList.length > 0) ? activeCardsList : defaultDebitCards;
    const bankCards = sourceDebitCards.filter(c => {
      const cBank = canonicalBankName(c.bank || c.bankName || "");
      return cBank.toLowerCase() === canonicalName.toLowerCase();
    });

    // Filter Savings Accounts for this bank
    const bankAccounts = allSavingsAccounts.filter(s => {
      const sBank = canonicalBankName(s.bank || s.bankId || "");
      return sBank.toLowerCase() === canonicalName.toLowerCase() || String(s.bankId || '').toLowerCase() === canonicalName.toLowerCase();
    });

    // Filter Current Accounts for this bank
    const bankCurrentAccounts = allCurrentAccounts.filter(c => {
      const cBank = canonicalBankName(c.bankName || c.bank || c.bank_id || "");
      return (
        cBank.toLowerCase() === canonicalName.toLowerCase() ||
        String(c.bank_id || '').toLowerCase() === canonicalName.toLowerCase() ||
        canonicalBankName(String(c.bank_id || '')).toLowerCase() === canonicalName.toLowerCase()
      );
    });

    const profile = getInstitutionalProfileForBank(canonicalName, bankCards);

    return {
      canonicalName,
      currentBankObj,
      profile,
      bankCards,
      bankAccounts,
      bankCurrentAccounts
    };
  }, [coveredBanks, selectedBankName, activeCardsList, allSavingsAccounts, allCurrentAccounts]);

  const { canonicalName, currentBankObj, profile, bankCards, bankAccounts, bankCurrentAccounts } = bankProfileData;
  const brandTheme = getBankBrandTheme(canonicalName);

  // Apply In-Bank Search & Category Filter
  const filteredDebitCards = useMemo(() => {
    if (productCategoryFilter !== 'All' && productCategoryFilter !== 'Debit Cards') return [];
    const q = bankSearchQuery.trim().toLowerCase();
    if (!q) return bankCards;
    return bankCards.filter(c => {
      const matchName = String(c.cardName || '').toLowerCase().includes(q);
      const matchCategory = String(c.category || '').toLowerCase().includes(q);
      const matchNetwork = String(c.network || '').toLowerCase().includes(q);
      const matchBenefits = String(c.benefits || '').toLowerCase().includes(q);
      const matchBestFor = Array.isArray(c.bestFor) ? c.bestFor.some(b => String(b).toLowerCase().includes(q)) : String(c.bestFor || '').toLowerCase().includes(q);
      return matchName || matchCategory || matchNetwork || matchBenefits || matchBestFor;
    });
  }, [bankCards, bankSearchQuery, productCategoryFilter]);

  const filteredSavingsAccounts = useMemo(() => {
    if (productCategoryFilter !== 'All' && productCategoryFilter !== 'Savings Accounts') return [];
    const q = bankSearchQuery.trim().toLowerCase();
    if (!q) return bankAccounts;
    return bankAccounts.filter(a => {
      const matchName = String(a.accountName || '').toLowerCase().includes(q);
      const matchType = String(a.accountType || '').toLowerCase().includes(q);
      const matchDesc = String(a.description || '').toLowerCase().includes(q);
      const matchBenefits = Array.isArray(a.keyBenefits) ? a.keyBenefits.some(b => String(b).toLowerCase().includes(q)) : false;
      const matchCardName = String(a.associatedDebitCardName || '').toLowerCase().includes(q);
      return matchName || matchType || matchDesc || matchBenefits || matchCardName;
    });
  }, [bankAccounts, bankSearchQuery, productCategoryFilter]);

  const filteredCurrentAccounts = useMemo(() => {
    if (productCategoryFilter !== 'All' && productCategoryFilter !== 'Current Accounts') return [];
    const q = bankSearchQuery.trim().toLowerCase();
    if (!q) return bankCurrentAccounts;
    return bankCurrentAccounts.filter(a => {
      const matchName = String(a.accountName || a.variant_name || '').toLowerCase().includes(q);
      const matchType = String(a.accountType || a.account_type || '').toLowerCase().includes(q);
      const matchSuitable = String(a.suitableFor || '').toLowerCase().includes(q);
      const matchCardName = String(a.debitCardName || '').toLowerCase().includes(q);
      const matchBenefits = Array.isArray(a.keyBenefits) ? a.keyBenefits.some(b => String(b).toLowerCase().includes(q)) : false;
      return matchName || matchType || matchSuitable || matchCardName || matchBenefits;
    });
  }, [bankCurrentAccounts, bankSearchQuery, productCategoryFilter]);

  const handleToggleSavingsCompare = (acc) => {
    if (!setSavingsCompareQueue) return;
    setSavingsCompareQueue(prev => {
      if (prev.some(a => String(a.id) === String(acc.id))) {
        return prev.filter(a => String(a.id) !== String(acc.id));
      }
      if (prev.length >= 3) return prev;
      return [...prev, acc];
    });
  };

  const handleToggleCurrentCompare = (acc) => {
    if (!setCurrentCompareQueue) return;
    setCurrentCompareQueue(prev => {
      if (prev.some(a => String(a.id) === String(acc.id))) {
        return prev.filter(a => String(a.id) !== String(acc.id));
      }
      if (prev.length >= 3) return prev;
      return [...prev, acc];
    });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 relative z-20 space-y-8 text-left select-none">
      
      {/* ── 0. BANK SELECTION BAR (Quick Switching across all covered banks) ── */}
      <div className="p-4 rounded-3xl bg-white/95 dark:bg-[#1E293B]/95 border border-[#E8D6B3] dark:border-amber-900/40 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#B8860B] dark:text-[#F5DFA8] flex items-center gap-1.5">
            <Building2 className="w-4 h-4" /> {t('banks.selectInstitution', 'Select Bank Institution:')}
          </span>
          <span className="text-xs font-bold text-slate-400">
            {t('banks.banksListed', `${coveredBanks.length} Banks Listed`, { count: coveredBanks.length })}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
          {coveredBanks.map(b => (
            <button
              key={b.id}
              onClick={() => handleBankSelect(b.name)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 border ${
                canonicalBankName(selectedBankName) === canonicalBankName(b.name)
                  ? 'bg-gradient-to-r from-[#111827] to-[#1E293B] text-white border-[#D6A64B]/80 shadow-md scale-105'
                  : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BankLogo bankName={b.name} size="xs" />
              <span>{b.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 1. BANK HEADER ── */}
      <div 
        id="bank-overview"
        ref={overviewRef}
        className={`p-6 sm:p-8 rounded-[32px] bg-gradient-to-br ${brandTheme.gradient} text-white shadow-2xl space-y-6 relative overflow-hidden border border-white/20`}
      >
        <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-white/40 flex items-center justify-center shadow-xl shrink-0 p-2">
              <BankLogo bankName={canonicalName} size="lg" className="w-full h-full border-0 shadow-none bg-transparent" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10.5px] font-black uppercase tracking-widest border border-white/30">
                  {profile.ownershipType}
                </span>
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10.5px] font-black uppercase tracking-widest border border-emerald-400/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {isHindi ? 'सत्यापित संस्थान' : 'Verified Institution'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {canonicalName} {isHindi ? 'बैंकिंग उत्पाद' : 'Banking Products'}
              </h1>
              <p className="text-xs sm:text-sm text-white/80 font-medium max-w-2xl leading-relaxed">
                {isHindi 
                  ? `${canonicalName} द्वारा पेश किए गए बचत खाते, चालू खाते और डेबिट कार्ड देखें और उनकी प्रमुख विशेषताओं की तुलना करें।`
                  : `Explore savings accounts, current accounts, and debit cards offered by ${canonicalName} and compare their key features.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              to={`/find-my-bank?bank=${encodeURIComponent(activeBankObj?.id || '')}`}
              className="px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer active:scale-95 border border-white/30"
            >
              <MapPin className="w-4 h-4 text-white" />
              <span>{t('findBanks.nearbyBanksBranches', 'Find Branches Near You')}</span>
            </Link>

            {profile.officialWebsite && (
              <a
                href={profile.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl bg-white text-[#0B3D91] hover:bg-slate-100 font-extrabold text-xs transition-all shadow-lg flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
              >
                <span>{t('common.applyNow', 'Visit Official Website')}</span>
                <ExternalLink className="w-4 h-4 text-[#2563EB]" />
              </a>
            )}
          </div>
        </div>

        {/* ── 6. BANK PRODUCT SUMMARY (Dynamic Numbers) ── */}
        <div className="pt-4 border-t border-white/20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 relative z-10 text-xs">
          <div className="p-3.5 rounded-2xl bg-black/25 backdrop-blur-xl border border-white/15">
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block">{t('banks.debitCardsTab', 'Debit Cards')}</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">{bankCards.length} {isHindi ? 'उपलब्ध' : 'Available'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/25 backdrop-blur-xl border border-white/15">
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block">{t('banks.savingsAccountsTab', 'Savings Accounts')}</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-300 mt-0.5 block">{bankAccounts.length} {isHindi ? 'उपलब्ध' : 'Available'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/25 backdrop-blur-xl border border-white/15">
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block">{t('banks.currentAccountsTab', 'Current Accounts')}</span>
            <span className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5 block">{bankCurrentAccounts.length} {isHindi ? 'उपलब्ध' : 'Available'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/25 backdrop-blur-xl border border-white/15">
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block">{t('banks.trustScore', 'Trust Score')}</span>
            <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">{profile.trustScore}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/25 backdrop-blur-xl border border-white/15 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block">{isHindi ? 'अधिकतम ब्याज दर' : 'Max Savings Yield'}</span>
            <span className="text-xl sm:text-2xl font-black text-cyan-300 mt-0.5 block">{profile.stats.interestRate}</span>
          </div>
        </div>
      </div>

      {/* ── 8. PRODUCT SECTION NAVIGATION TABS ── */}
      <div className="sticky top-20 z-30 p-2.5 rounded-2xl glass-card-premium border border-slate-200 dark:border-slate-800 shadow-soft flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          {[
            { id: 'bank-overview', tab: 'overview', label: t('banks.overview', 'Overview'), icon: Building2 },
            { id: 'debit-cards-section', tab: 'debitCards', label: `${t('banks.debitCardsTab', 'Debit Cards')} (${bankCards.length})`, icon: CreditCard },
            { id: 'savings-accounts-section', tab: 'savingsAccounts', label: `${t('banks.savingsAccountsTab', 'Savings Accounts')} (${bankAccounts.length})`, icon: Percent },
            { id: 'current-accounts-section', tab: 'currentAccounts', label: `${t('banks.currentAccountsTab', 'Current Accounts')} (${bankCurrentAccounts.length})`, icon: Briefcase }
          ].map(tItem => {
            const Icon = tItem.icon;
            return (
              <button
                key={tItem.tab}
                onClick={() => scrollToSection(tItem.id, tItem.tab)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tItem.tab
                    ? 'bg-[#2563EB] text-white shadow-md shadow-[#2563EB]/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tItem.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Link to Official Site */}
        {profile.officialWebsite && (
          <a
            href={profile.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-extrabold text-[#2563EB] dark:text-[#60A5FA] hover:underline flex items-center gap-1 shrink-0 px-3 py-1.5"
          >
            <span>{canonicalName} {isHindi ? 'पोर्टल' : 'Site'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* ── 2. BANK OVERVIEW & METRICS ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft space-y-6">
        <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
          <span>{isHindi ? 'संस्थागत अवलोकन और मुख्य पैरामीटर' : 'Institutional Overview & Key Parameters'}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{isHindi ? 'मुख्यालय' : 'Headquarters'}</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-0.5 block">{profile.headquarters}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{isHindi ? 'स्थापना वर्ष' : 'Founded Year'}</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm mt-0.5 block">{profile.foundedYear}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('banks.segment', 'Banking Category')}</span>
            <span className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] text-sm mt-0.5 block">{profile.ownershipType}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('banks.viewOfficialPortal', 'Official Portal')}</span>
            <a href={profile.officialWebsite} target="_blank" rel="noopener noreferrer" className="font-extrabold text-[#2563EB] dark:text-[#60A5FA] text-xs mt-0.5 block truncate hover:underline">
              {profile.officialWebsite.replace("https://", "")}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-900/60 border border-blue-100 dark:border-slate-800 space-y-1">
            <span className="text-[10.5px] font-bold text-[#2563EB] dark:text-[#60A5FA] uppercase tracking-wider block">{isHindi ? 'ग्राहक आधार और नेटवर्क' : 'Customer Base & Network'}</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{profile.overviewCustomerBase}</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-slate-900/60 border border-emerald-100 dark:border-slate-800 space-y-1">
            <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">{isHindi ? 'डिजिटल बैंकिंग बुनियादी ढांचा' : 'Digital Banking Infrastructure'}</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{profile.overviewDigital}</p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-900/60 border border-purple-100 dark:border-slate-800 space-y-1">
            <span className="text-[10.5px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">{isHindi ? 'सुरक्षा और वित्तीय विश्वसनीयता' : 'Security & Financial Reputation'}</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{profile.overviewReputation}</p>
          </div>
        </div>
      </div>

      {/* ── 7. SEARCH & FILTER WITHIN BANK PRODUCTS ── */}
      <div className="p-5 rounded-3xl glass-card-premium border border-slate-200 dark:border-slate-800 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          {[
            { key: 'All', label: t('common.all', 'All') },
            { key: 'Debit Cards', label: t('banks.debitCardsTab', 'Debit Cards') },
            { key: 'Savings Accounts', label: t('banks.savingsAccountsTab', 'Savings Accounts') },
            { key: 'Current Accounts', label: t('banks.currentAccountsTab', 'Current Accounts') }
          ].map(catItem => (
            <button
              key={catItem.key}
              onClick={() => setProductCategoryFilter(catItem.key)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                productCategoryFilter === catItem.key
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-[#2563EB]'
              }`}
            >
              {catItem.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={bankSearchQuery}
            onChange={(e) => setBankSearchQuery(e.target.value)}
            placeholder={isHindi ? `${canonicalName} के कार्ड और खाते खोजें...` : t('banks.searchPlaceholder', `Search within this bank's cards & accounts...`)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
          />
        </div>
      </div>

      {/* ── 3. DEBIT CARDS SECTION ── */}
      {(productCategoryFilter === 'All' || productCategoryFilter === 'Debit Cards') && (
        <div id="debit-cards-section" ref={debitCardsRef} className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#2563EB] dark:text-[#60A5FA]">
                {isHindi ? 'सत्यापित लाइनअप' : 'VERIFIED LINEUP'}
              </span>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-[#2563EB]" />
                <span>{t('banks.debitCardsTab', 'Debit Cards')} ({filteredDebitCards.length})</span>
              </h2>
            </div>

            <p className="text-xs text-slate-400 font-bold">
              {isHindi ? `${canonicalName} द्वारा जारी आधिकारिक डेबिट कार्ड वेरिएंट` : `Official debit card variants issued by ${canonicalName}`}
            </p>
          </div>

          {filteredDebitCards.length === 0 ? (
            <div className="py-12 text-center rounded-3xl glass-card-premium border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-2">
              <CreditCard className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="font-bold">{t('banks.noProductsFound', `No debit cards match your search criteria for ${canonicalName}.`, { bank: canonicalName })}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDebitCards.map(card => (
                <DebitCardCard
                  key={card.id}
                  card={card}
                  onViewDetails={() => onSelectDebitCard && onSelectDebitCard(card)}
                  onCompare={() => toggleCompareQueue && toggleCompareQueue(card)}
                  isCompared={compareQueue.some(c => String(c.id) === String(card.id))}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 4 & 5. SAVINGS ACCOUNTS & ASSOCIATED DEBIT CARDS SECTION ── */}
      {(productCategoryFilter === 'All' || productCategoryFilter === 'Savings Accounts') && (
        <div id="savings-accounts-section" ref={savingsAccountsRef} className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                {isHindi ? 'उच्च-ब्याज बचत' : 'HIGH-YIELD SAVINGS'}
              </span>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Percent className="w-6 h-6 text-emerald-500" />
                <span>{t('banks.savingsAccountsTab', 'Savings Accounts')} ({filteredSavingsAccounts.length})</span>
              </h2>
            </div>

            <p className="text-xs text-slate-400 font-bold">
              {isHindi ? `${canonicalName} के लिए सत्यापित बचत योजनाएं और खाता स्तर` : `Verified savings schemes & account tiers for ${canonicalName}`}
            </p>
          </div>

          {filteredSavingsAccounts.length === 0 ? (
            <div className="py-12 text-center rounded-3xl glass-card-premium border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-2">
              <Percent className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="font-bold">{t('banks.noProductsFound', `No savings accounts match your search criteria for ${canonicalName}.`, { bank: canonicalName })}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSavingsAccounts.map(account => {
                const associatedCards = getAssociatedDebitCards(account);
                const linkedCard = associatedCards.length > 0 ? associatedCards[0] : null;

                return (
                  <div 
                    key={account.id}
                    className="p-6 rounded-3xl bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 shadow-soft hover:shadow-xl hover:border-[#2563EB]/40 transition-all duration-300 flex flex-col justify-between space-y-5"
                  >
                    {/* Header: Logo, Bank, Name, Heart Toggle */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <BankLogo bankName={account.bank} size="md" />
                          <div>
                            <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] block">
                              {account.bank}
                            </span>
                            <Link 
                              to={`/savings-accounts/${account.id}`}
                              className="text-lg font-extrabold text-slate-800 dark:text-white hover:text-[#2563EB] hover:underline leading-snug block"
                            >
                              {account.accountName}
                            </Link>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleWishlist(account)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border shrink-0 ${
                            isWishlisted(account.id)
                              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-500'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 text-slate-400 hover:text-rose-500'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isWishlisted(account.id) ? 'fill-rose-500' : ''}`} />
                        </button>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5 text-[10.5px]">
                        <span className="px-2.5 py-0.5 rounded-full font-extrabold bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20">
                          {account.accountType}
                        </span>
                        {account.isZeroBalance && (
                          <span className="px-2.5 py-0.5 rounded-full font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {t('accountDetail.zeroBalance', 'Zero Balance')}
                          </span>
                        )}
                        {account.isOnlineOpening && (
                          <span className="px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            ⚡ {t('accountDetail.digitalKyc', 'Instant Video KYC')}
                          </span>
                        )}
                      </div>

                      {/* Key Account Stats */}
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase block">{t('accountDetail.interestRate', 'Max Interest Rate')}</span>
                          <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{account.interestRate}</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase block">{t('accountDetail.minimumBalance', 'Min. Balance')}</span>
                          <span className="text-lg font-black text-slate-800 dark:text-white">{account.minimumBalance}</span>
                        </div>
                      </div>

                      {/* Account Key Benefits */}
                      {account.keyBenefits && (
                        <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                          <span className="text-[10.5px] font-extrabold text-slate-400 uppercase block">{isHindi ? 'मुख्य खाता विशेषताएं:' : 'Key Account Highlights:'}</span>
                          {account.keyBenefits.slice(0, 2).map((b, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                              <span>{b}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* ── 5. SAVINGS ACCOUNT → ASSOCIATED DEBIT CARD BOX ── */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]/40 dark:from-slate-900 dark:to-slate-900/90 border border-[#2563EB]/25 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10.5px] font-black uppercase tracking-wider text-[#0B3D91] dark:text-[#60A5FA] flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>{t('accountDetail.linkedCards', 'Debit Card with this Account')}</span>
                        </span>
                        {linkedCard && (
                          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-extrabold bg-[#2563EB] text-white">
                            {t('accountDetail.linkedCardTitle', 'Linked Debit Card')}
                          </span>
                        )}
                      </div>

                      {linkedCard ? (
                        <div className="space-y-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold text-[#2563EB] uppercase block">
                                {linkedCard.bank} • {linkedCard.network || 'Visa'}
                              </span>
                              <h4 className="font-extrabold text-sm text-slate-800 dark:text-white leading-tight">
                                {linkedCard.cardName}
                              </h4>
                            </div>

                            {onSelectDebitCard && (
                              <button
                                onClick={() => onSelectDebitCard(linkedCard)}
                                className="px-3 py-1 rounded-lg bg-[#2563EB] text-white font-bold text-[11px] hover:bg-blue-700 transition-colors shrink-0 cursor-pointer"
                              >
                                {isHindi ? 'विवरण देखें →' : 'View Specs →'}
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1.5 border-t border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                            <div><strong className="block text-[9.5px] text-slate-400 uppercase">{t('debitCards.dailyAtmLimit', 'ATM Limit')}</strong> ₹{(linkedCard.atmLimit || 50000).toLocaleString('en-IN')}/day</div>
                            <div><strong className="block text-[9.5px] text-slate-400 uppercase">{t('debitCards.dailyPosLimit', 'POS Limit')}</strong> ₹{(linkedCard.posLimit || 100000).toLocaleString('en-IN')}/day</div>
                            <div><strong className="block text-[9.5px] text-slate-400 uppercase">{t('debitCards.annualFee', 'Annual Fee')}</strong> {linkedCard.annualFee || (isHindi ? 'निःशुल्क' : 'Free')}</div>
                            <div><strong className="block text-[9.5px] text-slate-400 uppercase">{t('debitCards.loungeAccess', 'Lounge')}</strong> {linkedCard.loungeAccess || (isHindi ? 'नहीं' : 'No')}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-xl text-xs font-semibold text-slate-500">
                          {isHindi ? 'इस खाते के लिए डेबिट कार्ड की जानकारी उपलब्ध नहीं है।' : 'Debit card information not available for this account.'}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <Link
                        to={`/savings-accounts/${account.id}`}
                        className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-xs flex items-center gap-1"
                      >
                        <span>{t('common.viewDetails', 'View Details')}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleToggleSavingsCompare(account)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 ${
                          savingsCompareQueue.some(a => String(a.id) === String(account.id))
                            ? 'bg-[#2563EB] text-white border-[#2563EB]'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <Scale className="w-3.5 h-3.5" />
                        <span>{savingsCompareQueue.some(a => String(a.id) === String(account.id)) ? t('debitCards.inCompare', 'Queued') : t('debitCards.addToCompare', 'Compare')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── ICICI BANK SAVINGS ACCOUNT & PRIVILEGE BANKING SECTION ── */}
          {canonicalName.toLowerCase().includes('icici') && (
            <div className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <ICICIBSavingsDetailView onSelectDebitCard={onSelectDebitCard} />
            </div>
          )}

          {/* ── IDFC FIRST BANK SPECIAL CALCULATOR & MATRIX ── */}
          {canonicalName.toLowerCase().includes('idfc') && (
            <div className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              {/* Eligibility Calculator */}
              <IDFCTierEligibilityCalculator />

              {/* Privilege Tier Benefits Comparison Matrix */}
              <IDFCTierBenefitsComparison />
            </div>
          )}
        </div>
      )}

      {/* ── 6. CURRENT ACCOUNTS SECTION ── */}
      {(productCategoryFilter === 'All' || productCategoryFilter === 'Current Accounts') && (
        <div id="current-accounts-section" ref={currentAccountsRef} className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                {isHindi ? 'वाणिज्यिक एवं व्यावसायिक बैंकिंग' : 'COMMERCIAL & BUSINESS BANKING'}
              </span>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-amber-500" />
                <span>{t('banks.currentAccountsTab', 'Current Accounts')} ({filteredCurrentAccounts.length})</span>
              </h2>
            </div>

            <p className="text-xs text-slate-400 font-bold">
              {isHindi ? `${canonicalName} के लिए चालू खाते, एमएबी स्तर और नकद जमा सीमाएं` : `Commercial accounts, MAB tiers & cash deposit limits for ${canonicalName}`}
            </p>
          </div>

          {filteredCurrentAccounts.length === 0 ? (
            <div className="py-12 text-center rounded-3xl glass-card-premium border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-2">
              <Briefcase className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="font-bold">{t('banks.noProductsFound', `No current accounts match your search criteria for ${canonicalName}.`, { bank: canonicalName })}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCurrentAccounts.map(account => (
                <CurrentAccountCard
                  key={account.id || account.product_id}
                  account={account}
                  onViewDetails={() => navigate(`/current-accounts/${account.id || account.product_id}`)}
                  onToggleCompare={handleToggleCurrentCompare}
                  isCompared={currentCompareQueue.some(item => String(item.id) === String(account.id))}
                  onSelectDebitCard={onSelectDebitCard}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── 13 & 15. STATUTORY DISCLAIMER & INFORMATION NOTICE ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
        <div className="flex items-center gap-2 font-black uppercase tracking-wider text-amber-800 dark:text-amber-300">
          <Info className="w-4 h-4 shrink-0" />
          <span>{isHindi ? 'वैधानिक बैंक जानकारी और सत्यापन अस्वीकरण' : 'Statutory Bank Information & Verification Disclaimer'}</span>
        </div>
        <p className="leading-relaxed font-normal">
          {isHindi 
            ? `दिखाई गई जानकारी केवल तुलना और सूचनात्मक उद्देश्यों के लिए है। बचत खाता, चालू खाता और डेबिट कार्ड की विशेषताएं, ब्याज दरें, शुल्क, पात्रता आवश्यकताएं, सीमाएं और लाभ समय के साथ बदल सकते हैं। निर्णय लेने से पहले कृपया सीधे ${canonicalName} की आधिकारिक वेबसाइट पर नवीनतम विवरण सत्यापित करें।`
            : `Information shown is for comparison and informational purposes only. Savings Account, Current Account, and Debit Card features, interest rates, fees, charges, eligibility requirements, limits, and benefits may change over time. Please verify the latest details directly on ${canonicalName}'s official website before making a decision.`}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-200/60 dark:border-amber-900/40 text-xs font-semibold">
          <span>{isHindi ? `स्रोत: आधिकारिक ${canonicalName} पोर्टल` : `Source: Official ${canonicalName} Portal`}</span>
          <span>{isHindi ? 'अंतिम सत्यापन: अगस्त 2026' : 'Last Verified: August 2026'}</span>
        </div>
      </div>
    </main>
  );
}

export default BanksPage;
