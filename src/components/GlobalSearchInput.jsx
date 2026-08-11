import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Building2, 
  CreditCard, 
  Percent, 
  Clock, 
  Trash2, 
  ChevronRight, 
  Landmark, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { debitCards } from '../data/mockData';
import { savingsAccounts, getAssociatedDebitCards } from '../data/mockSavingsAccounts';
import { getCoveredBanksDirectory, canonicalBankName } from '../utils/bankDirectoryUtils';

const RECENT_SEARCHES_KEY = 'dcard_recent_searches_v1';
const MAX_RECENT_SEARCHES = 6;

const DEFAULT_SUGGESTIONS = [
  "SBI",
  "Student Account",
  "Zero Balance",
  "RuPay",
  "Lounge Access"
];

function GlobalSearchInput({ query = '', setQuery = () => {}, onViewDetails = null }) {
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState(query);
  const [debouncedTerm, setDebouncedTerm] = useState(query);
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load recent searches", e);
    }
  }, []);

  // Save term to recent searches
  const saveRecentSearch = (term) => {
    const clean = String(term || '').trim();
    if (!clean || clean.length < 2) return;

    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const removeRecentSearch = (termToRemove, e) => {
    if (e) e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(s => s !== termToRemove);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
  };

  const clearAllRecentSearches = (e) => {
    if (e) e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (err) {}
  };

  // Debounce search input (200ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setQuery(searchTerm);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, setQuery]);

  // Sync external query prop
  useEffect(() => {
    if (query !== searchTerm) {
      setSearchTerm(query);
    }
  }, [query]);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Covered Banks dataset
  const coveredBanks = useMemo(() => getCoveredBanksDirectory(), []);

  // Relevance Scoring & Categorized Filtering Algorithm
  const searchResults = useMemo(() => {
    const q = debouncedTerm.trim().toLowerCase();
    if (!q) return { banks: [], cards: [], accounts: [] };

    // 1. Filter Banks
    const matchedBanks = coveredBanks.map(b => {
      const bName = b.name.toLowerCase();
      let score = 0;
      if (bName === q) score += 100;
      else if (bName.startsWith(q)) score += 80;
      else if (bName.includes(q)) score += 60;
      return { item: b, score };
    }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).map(x => x.item).slice(0, 4);

    // 2. Filter Debit Cards
    const matchedCards = debitCards.map(c => {
      const name = String(c.cardName || '').toLowerCase();
      const bank = String(c.bank || '').toLowerCase();
      const network = String(c.network || '').toLowerCase();
      const cat = String(c.category || '').toLowerCase();
      const lounge = String(c.loungeAccess || '').toLowerCase();
      const benefits = String(c.benefits || '').toLowerCase();

      let score = 0;
      if (name === q) score += 100;
      else if (name.startsWith(q)) score += 80;
      else if (name.includes(q) || bank.includes(q)) score += 60;

      if (q.includes("rupay") && (network.includes("rupay") || name.includes("rupay"))) score += 50;
      if (q.includes("visa") && (network.includes("visa") || name.includes("visa"))) score += 50;
      if (q.includes("lounge") && (lounge.includes("lounge") || lounge.includes("yes"))) score += 50;
      if (q.includes("international") && c.international) score += 50;
      if (q.includes("zero fee") && (c.annualFee === 0 || String(c.annualFee).toLowerCase().includes("free"))) score += 50;
      if (benefits.includes(q) || cat.includes(q)) score += 30;

      return { item: c, score };
    }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).map(x => x.item).slice(0, 5);

    // 3. Filter Savings Accounts
    const matchedAccounts = savingsAccounts.map(s => {
      const name = String(s.accountName || '').toLowerCase();
      const bank = String(s.bank || '').toLowerCase();
      const type = String(s.accountType || '').toLowerCase();
      const cardName = String(s.associatedDebitCardName || '').toLowerCase();
      const benefits = Array.isArray(s.keyBenefits) ? s.keyBenefits.join(' ').toLowerCase() : '';

      let score = 0;
      if (name === q) score += 100;
      else if (name.startsWith(q)) score += 80;
      else if (name.includes(q) || bank.includes(q)) score += 60;

      if ((q.includes("zero balance") || q.includes("zero min")) && (s.isZeroBalance || s.minimumBalanceValue === 0)) score += 50;
      if (q.includes("student") && (s.isStudent || type.includes("student"))) score += 50;
      if (q.includes("salary") && (s.isSalary || type.includes("salary"))) score += 50;
      if (q.includes("senior") && (s.isSeniorCitizen || type.includes("senior"))) score += 50;
      if ((q.includes("online") || q.includes("video kyc") || q.includes("digital")) && (s.isOnlineOpening || s.isDigital)) score += 50;
      if (type.includes(q) || cardName.includes(q) || benefits.includes(q)) score += 30;

      return { item: s, score };
    }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).map(x => x.item).slice(0, 5);

    return {
      banks: matchedBanks,
      cards: matchedCards,
      accounts: matchedAccounts
    };
  }, [debouncedTerm, coveredBanks]);

  const totalResultsCount = searchResults.banks.length + searchResults.cards.length + searchResults.accounts.length;
  const isQueryActive = debouncedTerm.trim().length > 0;

  const handleItemSelect = (action) => {
    saveRecentSearch(debouncedTerm);
    setIsFocused(false);
    action();
  };

  const handleSuggestionClick = (sug) => {
    setSearchTerm(sug);
    setDebouncedTerm(sug);
    saveRecentSearch(sug);
  };

  return (
    <div ref={searchContainerRef} className="w-full relative z-40 select-none">
      {/* ── Search Input Box ── */}
      <div className="flex items-center gap-2 bg-white dark:bg-[#1E293B] p-2 rounded-2xl border border-[#E5E7EB] dark:border-slate-700 shadow-lg hover:border-[#2563EB]/50 transition-all">
        <div className="relative flex-1 flex items-center pl-3">
          <Search className="w-4 h-4 text-[#6B7280] dark:text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                saveRecentSearch(searchTerm);
                setIsFocused(false);
                navigate('/cards');
              }
            }}
            placeholder="Search banks, debit cards, savings accounts or features..."
            className="w-full bg-transparent border-none text-xs font-normal pl-2.5 py-3 outline-none text-[#1F2937] dark:text-white placeholder-[#9CA3AF]"
          />

          {/* Clear X Button */}
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setDebouncedTerm('');
                setQuery('');
              }}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors mr-2 cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => {
            saveRecentSearch(searchTerm);
            setIsFocused(false);
            navigate('/cards');
          }}
          className="px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold tracking-wide uppercase shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <span>Search</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Categorized Search Panel Dropdown ── */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.99 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-[0_20px_60px_rgba(15,23,42,0.25)] z-50 overflow-hidden backdrop-blur-2xl text-left"
          >
            {/* Case 1: Empty Search Input -> Show Recent Searches & Popular Suggestions */}
            {!isQueryActive && (
              <div className="p-5 space-y-4 text-xs">
                {recentSearches.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#2563EB]" /> Recent Searches
                      </span>
                      <button
                        onClick={clearAllRecentSearches}
                        className="text-[10.5px] font-bold text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Clear All
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSuggestionClick(item)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-[#EFF6FF] dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-2 group"
                        >
                          <span>{item}</span>
                          <button
                            onClick={(e) => removeRecentSearch(item, e)}
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Suggested Features
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_SUGGESTIONS.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(sug)}
                        className="px-3 py-1.5 rounded-xl bg-[#EFF6FF] dark:bg-slate-800 text-[#2563EB] dark:text-[#60A5FA] font-bold border border-[#2563EB]/20 hover:bg-[#2563EB] hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        💡 {sug}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Case 2: Active Query with Results -> Show Grouped Categorized Cards */}
            {isQueryActive && totalResultsCount > 0 && (
              <div className="p-4 space-y-4 text-xs max-h-[480px] overflow-y-auto custom-scrollbar">
                
                {/* 🏦 BANKS CATEGORY */}
                {searchResults.banks.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-[10.5px] font-black uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-[#2563EB]" /> Banks ({searchResults.banks.length})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {searchResults.banks.map(b => (
                        <div
                          key={b.id}
                          onClick={() => handleItemSelect(() => navigate(`/banks/${b.id}`))}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#2563EB] transition-all cursor-pointer flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-black text-xs shrink-0">
                              {b.logoText}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-800 dark:text-white group-hover:text-[#2563EB] transition-colors leading-tight">
                                {b.name}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-bold block">
                                {b.cardCount} Debit Cards • {b.accountCount || 0} Savings
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 💳 DEBIT CARDS CATEGORY */}
                {searchResults.cards.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-[10.5px] font-black uppercase tracking-wider text-[#2563EB] dark:text-[#60A5FA] flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-[#2563EB]" /> Debit Cards ({searchResults.cards.length})
                      </span>
                    </div>

                    <div className="space-y-2">
                      {searchResults.cards.map(c => (
                        <div
                          key={c.id}
                          onClick={() => handleItemSelect(() => {
                            if (onViewDetails) onViewDetails(c);
                            else navigate('/cards');
                          })}
                          className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#2563EB] transition-all cursor-pointer flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B3D91] to-[#2563EB] text-white flex items-center justify-center font-bold text-xs shrink-0">
                              <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-slate-800 dark:text-white group-hover:text-[#2563EB] transition-colors leading-tight">
                                  {c.cardName}
                                </h4>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#2563EB]/10 text-[#2563EB]">
                                  {c.network || 'Visa'}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                                {c.bank} • Fee: {c.annualFee === 0 ? 'Free' : `₹${c.annualFee}`} • Lounge: {c.loungeAccess || 'No'}
                              </span>
                            </div>
                          </div>

                          <span className="text-[11px] font-extrabold text-[#2563EB] dark:text-[#60A5FA] group-hover:underline flex items-center gap-0.5 shrink-0">
                            Specs <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 🏦 SAVINGS ACCOUNTS CATEGORY */}
                {searchResults.accounts.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-[10.5px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <Landmark className="w-4 h-4 text-emerald-500" /> Savings Accounts ({searchResults.accounts.length})
                      </span>
                    </div>

                    <div className="space-y-2">
                      {searchResults.accounts.map(s => {
                        const associatedCards = getAssociatedDebitCards(s);
                        const cardName = associatedCards.length > 0 ? associatedCards[0].cardName : (s.associatedDebitCardName || 'Standard Card');

                        return (
                          <div
                            key={s.id}
                            onClick={() => handleItemSelect(() => navigate(`/savings-accounts/${s.id}`))}
                            className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                <Percent className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-extrabold text-slate-800 dark:text-white group-hover:text-emerald-600 transition-colors leading-tight">
                                    {s.accountName}
                                  </h4>
                                  {s.isZeroBalance && (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                      Zero Bal
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                                  {s.bank} • Rate: {s.interestRate} • Min: {s.minimumBalance} • Linked: {cardName}
                                </span>
                              </div>
                            </div>

                            <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 group-hover:underline flex items-center gap-0.5 shrink-0">
                              View <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Case 3: Active Query with NO Results -> Show Friendly Empty State + Suggestions */}
            {isQueryActive && totalResultsCount === 0 && (
              <div className="p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-800 dark:text-white text-sm">
                    No results found for "{debouncedTerm}"
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Try searching for a bank, account type, card feature or benefit.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-2">
                  {DEFAULT_SUGGESTIONS.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(sug)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#EFF6FF] dark:bg-slate-800 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 hover:bg-[#2563EB] hover:text-white transition-all cursor-pointer active:scale-95"
                    >
                      💡 {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GlobalSearchInput;
