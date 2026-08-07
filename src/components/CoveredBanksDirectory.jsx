import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowUpDown, Building2, Sparkles, X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import BankCard from './BankCard';
import { getCoveredBanksDirectory } from '../utils/bankDirectoryUtils';

function CoveredBanksDirectory({ onSelectBank, customCardsList = null }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('most-cards'); // 'most-cards' | 'trust-high' | 'alphabetical' | 'savings-high'

  // Dynamically load covered banks from JSON database
  const allBanks = useMemo(() => {
    return getCoveredBanksDirectory(customCardsList);
  }, [customCardsList]);

  // Filter & Sort bank directory
  const filteredAndSortedBanks = useMemo(() => {
    let result = [...allBanks];

    // Search filter
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(bank => {
        const nameMatch = bank.name.toLowerCase().includes(query);
        const featureMatch = bank.features.some(f => f.toLowerCase().includes(query));
        const badgeMatch = bank.badges.some(b => b.text.toLowerCase().includes(query));
        return nameMatch || featureMatch || badgeMatch;
      });
    }

    // Sort options
    result.sort((a, b) => {
      if (sortBy === 'most-cards') {
        return b.cardCount - a.cardCount || b.trustScore - a.trustScore;
      }
      if (sortBy === 'trust-high') {
        return b.trustScore - a.trustScore || b.cardCount - a.cardCount;
      }
      if (sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'savings-high') {
        return b.interest - a.interest || b.trustScore - a.trustScore;
      }
      return 0;
    });

    return result;
  }, [allBanks, searchQuery, sortBy]);

  return (
    <section className="space-y-6 select-none text-left" id="covered-banks-directory">
      {/* Directory Section Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5E7EB] dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] text-xs font-semibold tracking-widest uppercase rounded-full">
              <Building2 className="w-3.5 h-3.5" />
              DYNAMIC BANK DIRECTORY
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[#6B7280] dark:text-slate-300 border border-[#E5E7EB] dark:border-slate-700">
              {allBanks.length} Banks Indexed
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] dark:text-white tracking-tight">
            Covered Banks Directory
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-slate-400 mt-1 font-normal">
            Real-time debit card coverage, trust ratings, interest rates, and perks derived directly from official database rules.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Bank Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#6B7280] dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Bank..."
              className="w-full bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 rounded-xl pl-9 pr-8 py-2.5 text-xs text-[#1F2937] dark:text-white placeholder-[#9CA3AF] dark:placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F2937] dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative sm:w-52">
            <div className="flex items-center bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs shadow-xs focus-within:border-[#2563EB]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#6B7280] dark:text-slate-400 mr-2 flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-transparent text-[#1F2937] dark:text-white focus:outline-none cursor-pointer text-xs font-medium"
              >
                <option value="most-cards" className="bg-white dark:bg-[#1E293B] text-[#1F2937] dark:text-white">Most Debit Cards</option>
                <option value="trust-high" className="bg-white dark:bg-[#1E293B] text-[#1F2937] dark:text-white">Highest Trust</option>
                <option value="alphabetical" className="bg-white dark:bg-[#1E293B] text-[#1F2937] dark:text-white">Alphabetical</option>
                <option value="savings-high" className="bg-white dark:bg-[#1E293B] text-[#1F2937] dark:text-white">Highest Savings Rate</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count & Search Active Bar */}
      {searchQuery && (
        <div className="flex items-center justify-between bg-[#EFF6FF] dark:bg-slate-800/60 border border-[#2563EB]/20 px-4 py-2 rounded-xl text-xs text-[#2563EB] dark:text-[#60A5FA]">
          <span>Found <strong>{filteredAndSortedBanks.length}</strong> matching banks for "{searchQuery}"</span>
          <button 
            onClick={() => setSearchQuery('')}
            className="underline font-semibold hover:opacity-80 cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Grid Layout: 3 Per Row on Desktop, 2 Per Row on Tablet, 1 Per Row on Mobile */}
      {filteredAndSortedBanks.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedBanks.map((bank) => (
              <BankCard
                key={bank.name}
                bank={bank}
                onSelect={(bankName) => {
                  if (onSelectBank) {
                    onSelectBank(bankName);
                  }
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-[#1E293B] rounded-3xl border border-[#E5E7EB] dark:border-slate-800 space-y-3">
          <Building2 className="w-10 h-10 text-[#6B7280] dark:text-slate-400 mx-auto opacity-50" />
          <h3 className="text-base font-bold text-[#1F2937] dark:text-white">No banks match your search</h3>
          <p className="text-xs text-[#6B7280] dark:text-slate-400 max-w-sm mx-auto">
            Try typing another bank name like "SBI", "HDFC", "ICICI", or "Axis"
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:opacity-90 transition-all cursor-pointer inline-block mt-2"
          >
            Reset Search
          </button>
        </div>
      )}
    </section>
  );
}

export default CoveredBanksDirectory;
