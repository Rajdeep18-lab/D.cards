import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Search,
  X,
  Check,
  Clock,
  ChevronDown,
  Building2,
  Globe,
  Sparkles,
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { useAppLocation } from '../context/LocationContext';
import { ALL_INDIA_LOCATION } from '../data/locations';

export default function LocationSelectorModal({ isOpen, onClose }) {
  const {
    selectedLocation,
    selectLocation,
    recentLocations,
    clearRecentLocations,
    popularLocations,
    allStates,
    getCitiesByState,
    searchLocations,
    getCityDisplayName,
    getFormattedLocation
  } = useAppLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const resultItemRefs = useRef([]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedStateFilter('');
      setHighlightedIndex(-1);
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchLocations(searchQuery.trim(), 20);
  }, [searchQuery, searchLocations]);

  // State-filtered cities
  const stateCities = useMemo(() => {
    if (!selectedStateFilter) return [];
    return getCitiesByState(selectedStateFilter);
  }, [selectedStateFilter, getCitiesByState]);

  // Reset highlightedIndex when search results change
  useEffect(() => {
    if (searchResults.length > 0) {
      setHighlightedIndex(0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [searchResults]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && resultItemRefs.current[highlightedIndex]) {
      resultItemRefs.current[highlightedIndex].scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  const handleSearchKeyDown = (e) => {
    if (searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1 < searchResults.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = (highlightedIndex >= 0 && searchResults[highlightedIndex])
        ? searchResults[highlightedIndex]
        : searchResults[0];
      if (target) {
        handleSelect(target);
      }
    }
  };

  const handleSelect = (loc) => {
    selectLocation(loc);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 select-none">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="location-modal-title"
          className="relative w-full max-w-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
        >
          {/* ── HEADER ── */}
          <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100 dark:border-slate-800/80 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#2563EB]/10 dark:bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center shadow-xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2
                    id="location-modal-title"
                    className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white tracking-tight"
                  >
                    Select Location
                  </h2>
                  <p className="text-[11px] sm:text-xs text-gray-500 dark:text-slate-400 font-medium">
                    Discover banking products & branch availability in your city
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                aria-label="Close location selector"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── SEARCH INPUT ── */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onKeyDown={handleSearchKeyDown}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={searchResults.length > 0}
                aria-controls="location-results-grid"
                aria-activedescendant={highlightedIndex >= 0 ? `location-item-${highlightedIndex}` : undefined}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (selectedStateFilter) setSelectedStateFilter('');
                }}
                placeholder="Search by city, alias, or state (e.g. Haridwar, Daltonganj, MP)..."
                className="w-full pl-10 pr-9 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-slate-700/80 rounded-2xl text-xs sm:text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB] transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* ── BODY (Scrollable) ── */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-5">
            {/* SCENARIO A: LIVE SEARCH RESULTS */}
            {searchQuery.trim() ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 font-semibold px-1">
                  <span>Matching Locations ({searchResults.length})</span>
                  <span>Press item to select</span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <p className="text-sm font-bold text-gray-800 dark:text-slate-200">
                      No locations found
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Try searching by city, state, or alternate name.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSelect(ALL_INDIA_LOCATION)}
                      className="mt-3 px-4 py-2 rounded-xl bg-[#2563EB]/10 text-[#2563EB] dark:text-[#60A5FA] font-bold text-xs hover:bg-[#2563EB]/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Browse All India Instead</span>
                    </button>
                  </div>
                ) : (
                  <div id="location-results-grid" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {searchResults.map((loc, index) => {
                      const isSelected = selectedLocation?.slug === loc.slug;
                      const isHighlighted = highlightedIndex === index;
                      return (
                        <button
                          key={loc.slug}
                          ref={el => (resultItemRefs.current[index] = el)}
                          id={`location-item-${index}`}
                          type="button"
                          onMouseEnter={() => setHighlightedIndex(index)}
                          onClick={() => handleSelect(loc)}
                          className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                            isSelected
                              ? 'bg-[#EFF6FF] dark:bg-[#2563EB]/15 border-[#2563EB] text-[#2563EB] dark:text-[#60A5FA] shadow-xs ring-1 ring-[#2563EB]/40'
                              : isHighlighted
                                ? 'bg-blue-50/80 dark:bg-slate-800 border-[#2563EB]/70 ring-2 ring-[#2563EB]/30'
                                : 'bg-white dark:bg-[#1E293B]/70 border-gray-200 dark:border-slate-800 hover:border-[#2563EB]/50 hover:bg-gray-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-[#2563EB] text-white'
                                : isHighlighted
                                  ? 'bg-[#2563EB]/20 text-[#2563EB] dark:text-[#60A5FA]'
                                  : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400'
                            }`}>
                              {loc.isAllIndia ? <Globe className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                                {getCityDisplayName(loc)}
                              </p>
                              {loc.state && (
                                <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">
                                  {loc.state} {loc.stateCode ? `(${loc.stateCode})` : ''}
                                </p>
                              )}
                              {loc.matchedAlias && (
                                <span className="inline-block mt-0.5 text-[9.5px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded-md">
                                  Matched alias: {loc.matchedAlias}
                                </span>
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* SCENARIO B: DEFAULT EXPLORATION VIEW */
              <div className="space-y-6">
                {/* 1. ALL INDIA OPTION (Default / Global) */}
                <div>
                  <button
                    type="button"
                    onClick={() => handleSelect(ALL_INDIA_LOCATION)}
                    className={`w-full p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      selectedLocation?.slug === 'all-india' || !selectedLocation
                        ? 'bg-gradient-to-r from-[#EFF6FF] to-blue-50 dark:from-[#2563EB]/20 dark:to-slate-800/80 border-[#2563EB] shadow-xs'
                        : 'bg-gray-50/80 dark:bg-[#1E293B]/70 border-gray-200 dark:border-slate-800 hover:border-[#2563EB]/40 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shadow-sm shrink-0">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                            All India
                          </span>
                          <span className="text-[10px] font-bold text-[#2563EB] dark:text-[#60A5FA] bg-[#2563EB]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Global
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                          Show all nationwide financial products, accounts & cards
                        </p>
                      </div>
                    </div>

                    {(selectedLocation?.slug === 'all-india' || !selectedLocation) && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2563EB] text-white text-[11px] font-bold shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    )}
                  </button>
                </div>

                {/* 2. RECENT LOCATIONS (if any stored) */}
                {recentLocations && recentLocations.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                        Recent Locations
                      </span>
                      <button
                        type="button"
                        onClick={clearRecentLocations}
                        className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 cursor-pointer font-medium"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {recentLocations.map((loc) => {
                        const isSelected = selectedLocation?.slug === loc.slug;
                        return (
                          <button
                            key={loc.slug}
                            type="button"
                            onClick={() => handleSelect(loc)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-xs'
                                : 'bg-gray-100/80 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-[#2563EB]/50 hover:bg-gray-100'
                            }`}
                          >
                            <MapPin className="w-3 h-3 text-[#2563EB] dark:text-[#60A5FA]" />
                            <span>{getCityDisplayName(loc)}</span>
                            {loc.stateCode && (
                              <span className="text-[10px] opacity-75">({loc.stateCode})</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. POPULAR CITIES */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Popular Cities
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {popularLocations
                      .filter(loc => loc.slug !== 'all-india')
                      .map((city) => {
                        const isSelected = selectedLocation?.slug === city.slug;
                        return (
                          <button
                            key={city.slug}
                            type="button"
                            onClick={() => handleSelect(city)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-[#EFF6FF] dark:bg-[#2563EB]/20 border-[#2563EB] text-[#2563EB] dark:text-[#60A5FA] shadow-xs'
                                : 'bg-white dark:bg-[#1E293B]/70 border-gray-200 dark:border-slate-800 hover:border-[#2563EB]/40 hover:bg-gray-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                              {city.name}
                            </span>
                            <span className="text-[10.5px] text-gray-500 dark:text-slate-400 truncate">
                              {city.state}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* 4. BROWSE BY STATE -> CITY FILTERING */}
                <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#2563EB]" />
                      Browse by State & Union Territory
                    </span>
                    {selectedStateFilter && (
                      <button
                        type="button"
                        onClick={() => setSelectedStateFilter('')}
                        className="text-[11px] text-[#2563EB] dark:text-[#60A5FA] hover:underline font-bold cursor-pointer"
                      >
                        Reset State
                      </button>
                    )}
                  </div>

                  {/* State Select Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedStateFilter}
                      onChange={(e) => setSelectedStateFilter(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 bg-gray-50 dark:bg-[#1E293B] border border-gray-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 cursor-pointer pr-10"
                    >
                      <option value="">Select a State or Union Territory ({allStates.length} available)...</option>
                      {allStates.map((s) => (
                        <option key={s.state} value={s.state}>
                          {s.state} ({s.cityCount} cities)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Cities for selected state */}
                  {selectedStateFilter && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-900/60 border border-gray-200/80 dark:border-slate-800 space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-slate-300">
                        <span>Cities in {selectedStateFilter} ({stateCities.length})</span>
                        <span className="text-[10px] text-gray-400">Click to select</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                        {stateCities.map((c) => {
                          const isSelected = selectedLocation?.slug === c.slug;
                          return (
                            <button
                              key={c.slug}
                              type="button"
                              onClick={() => handleSelect(c)}
                              className={`p-2 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                                isSelected
                                  ? 'bg-[#2563EB] text-white border-[#2563EB] font-bold shadow-xs'
                                  : 'bg-white dark:bg-[#1E293B] border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-200 hover:border-[#2563EB]/50'
                              }`}
                            >
                              <p className="font-bold truncate">{getCityDisplayName(c)}</p>
                              {c.aliases && c.aliases.length > 0 && !c.displayName && (
                                <p className="text-[10px] opacity-75 truncate">{c.aliases[0]}</p>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── FOOTER ── */}
          <div className="px-5 sm:px-6 py-3 bg-gray-50 dark:bg-[#1E293B]/90 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 shrink-0">
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-semibold text-gray-700 dark:text-slate-300">Active:</span>
              <span className="font-bold text-[#2563EB] dark:text-[#60A5FA] truncate">
                {getFormattedLocation(selectedLocation)}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white font-bold text-xs transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
