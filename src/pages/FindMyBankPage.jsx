import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Navigation, 
  Building2, 
  Search, 
  SlidersHorizontal, 
  ExternalLink, 
  Phone, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  Star, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight,
  Info,
  X,
  Compass,
  CreditCard,
  Percent,
  Check
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { useAppLocation } from '../context/LocationContext';
import { BANKS, getBankById, normalizeBankId } from '../data/banks';
import { BRANCHES } from '../data/branches';
import { 
  getNearbyBranches, 
  getBranchesByCity, 
  searchBranches, 
  getDirectionsUrl, 
  formatDistance 
} from '../utils/branchUtils';
import BranchDetailsModal from '../components/BranchDetailsModal';

const RADIUS_OPTIONS = [
  { value: 2, label: '2 km' },
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 25, label: '25 km' },
  { value: 50, label: '50 km' }
];

export default function FindMyBankPage() {
  useSEO({
    title: 'Find My Bank — Nearby Bank Branch Finder | D.CARD',
    description: 'Find verified nearby bank branches of SBI, HDFC, ICICI, Axis and other Indian banks. GPS proximity search, nearest branch first, working hours and directions.'
  });

  const [searchParams] = useSearchParams();
  const { selectedLocation, openLocationSelector, isAllIndia } = useAppLocation();

  // Search Configuration State
  const initialBankParam = searchParams.get('bank');
  const [selectedBankId, setSelectedBankId] = useState(() => {
    if (initialBankParam) {
      const normalized = normalizeBankId(initialBankParam);
      if (normalized) return normalized;
    }
    return 'sbi';
  });

  const [searchRadius, setSearchRadius] = useState(5);
  const [locationMode, setLocationMode] = useState(null); // 'gps' | 'manual' | null
  const [userCoords, setUserCoords] = useState(null); // { latitude, longitude }
  const [geoStatus, setGeoStatus] = useState({ state: 'idle', message: '' }); // 'idle' | 'detecting' | 'granted' | 'denied' | 'error'

  // Bank Search Input Filter inside bank selector
  const [bankSearchTerm, setBankSearchTerm] = useState('');
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const bankDropdownRef = useRef(null);

  // Results & In-results query state
  const [hasSearched, setHasSearched] = useState(false);
  const [inResultsQuery, setInResultsQuery] = useState('');
  const [selectedBranchForModal, setSelectedBranchForModal] = useState(null);

  const resultsRef = useRef(null);
  const searchInputRef = useRef(null);

  // Dynamic Coverage Statistics (Section 11) - NEVER hardcoded!
  const coverageStats = useMemo(() => {
    const totalBranchesCount = BRANCHES.length;
    const uniqueCitiesCount = new Set(BRANCHES.map(b => b.city)).size;
    const uniqueBanksCount = new Set(BRANCHES.map(b => b.bankId)).size;
    return {
      totalBranches: totalBranchesCount,
      totalCities: uniqueCitiesCount,
      totalBanks: uniqueBanksCount
    };
  }, []);

  // Sync LocationContext changes with manual mode
  useEffect(() => {
    if (selectedLocation && !isAllIndia && !userCoords) {
      setLocationMode('manual');
    }
  }, [selectedLocation, isAllIndia, userCoords]);

  // Click outside to close bank dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bankDropdownRef.current && !bankDropdownRef.current.contains(e.target)) {
        setIsBankDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Selected Bank Object
  const currentBank = useMemo(() => {
    return getBankById(selectedBankId) || BANKS[0];
  }, [selectedBankId]);

  // Filtered Banks based on search term
  const filteredBanksList = useMemo(() => {
    const q = bankSearchTerm.trim().toLowerCase();
    if (!q) return BANKS;
    return BANKS.filter(b => 
      b.bankName.toLowerCase().includes(q) ||
      b.shortName.toLowerCase().includes(q) ||
      (b.aliases && b.aliases.some(a => a.toLowerCase().includes(q)))
    );
  }, [bankSearchTerm]);

  // Request GPS Location when user explicitly clicks "Use My Location" (Section 2)
  const handleUseMyLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGeoStatus({
        state: 'error',
        message: 'Geolocation is not supported by your browser.'
      });
      return;
    }

    setGeoStatus({
      state: 'detecting',
      message: 'Finding branches near you...'
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ latitude, longitude });
        setLocationMode('gps');
        setGeoStatus({
          state: 'granted',
          message: 'Location access active.'
        });
        // Auto trigger search on GPS acquisition
        setHasSearched(true);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      },
      (error) => {
        let msg = 'Unable to detect your location. Please select your city manually.';
        if (error.code === 1) { // PERMISSION_DENIED
          msg = 'Location access is turned off.';
        } else if (error.code === 2) {
          msg = 'Unable to detect your location. Please select your city manually.';
        } else if (error.code === 3) {
          msg = 'Location request timed out. Please select your city manually.';
        }
        setGeoStatus({
          state: 'denied',
          message: msg
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, []);

  // Switch to Manual City
  const handleChooseLocationManually = () => {
    setUserCoords(null);
    setLocationMode('manual');
    openLocationSelector();
  };

  // Perform Branch Search
  const handleFindBranches = () => {
    setHasSearched(true);
    setInResultsQuery('');
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Compute Raw Search Results
  const rawBranches = useMemo(() => {
    if (!hasSearched) return [];

    if (locationMode === 'gps' && userCoords) {
      // GPS Mode: Filter bank -> Calculate Haversine distance -> Filter radius -> Sort nearest first
      return getNearbyBranches(
        userCoords.latitude,
        userCoords.longitude,
        selectedBankId,
        searchRadius
      );
    }

    if (locationMode === 'manual' && selectedLocation && !isAllIndia) {
      // Manual City Mode: City + Bank Branch View (Section 8)
      return getBranchesByCity(
        selectedLocation.slug || selectedLocation.name,
        selectedBankId
      );
    }

    // Default Fallback if no specific city or GPS coordinates yet
    return getBranchesByCity('new-delhi', selectedBankId);
  }, [hasSearched, locationMode, userCoords, selectedBankId, searchRadius, selectedLocation, isAllIndia]);

  // Filter within results via query input (Section 12)
  const filteredBranches = useMemo(() => {
    if (!inResultsQuery.trim()) return rawBranches;
    return searchBranches(rawBranches, inResultsQuery);
  }, [rawBranches, inResultsQuery]);

  // Nearest branch in GPS mode (Section 5)
  const nearestBranch = useMemo(() => {
    if (locationMode === 'gps' && filteredBranches.length > 0) {
      return filteredBranches[0];
    }
    return null;
  }, [locationMode, filteredBranches]);

  // Remaining branches list
  const otherBranches = useMemo(() => {
    if (locationMode === 'gps' && filteredBranches.length > 0) {
      return filteredBranches.slice(1);
    }
    return filteredBranches;
  }, [locationMode, filteredBranches]);

  // Action for empty state expansion (Section 6)
  const handleExpandRadius = () => {
    const nextRadius = searchRadius <= 2 ? 5 : searchRadius <= 5 ? 10 : searchRadius <= 10 ? 25 : 50;
    setSearchRadius(nextRadius);
    setInResultsQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* ==================================================
          1. HERO HEADER SECTION (Section 1)
         ================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-indigo-950/60">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30 backdrop-blur-xs mb-4">
            <Compass className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
            Official D.CARD Verified Branch Directory
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
            Find My Bank
          </h1>
          <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl mx-auto font-normal">
            Find verified bank branches near you.
          </p>

          {/* D.CARD Dynamic Branch Coverage Section (Section 11) */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-blue-100">
            <span className="font-semibold text-white">D.CARD Branch Coverage:</span>
            <span><strong className="text-white">{coverageStats.totalBranches}+</strong> verified branch records</span>
            <span className="hidden sm:inline">•</span>
            <span><strong className="text-white">{coverageStats.totalCities}</strong> cities</span>
            <span className="hidden sm:inline">•</span>
            <span><strong className="text-white">{coverageStats.totalBanks}</strong> banks</span>
          </div>
        </div>
      </section>

      {/* ==================================================
          2. FINDER SEARCH CARD (PRIMARY FLOW)
         ================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-12">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 backdrop-blur-md">
          <div className="space-y-6">
            
            {/* Step 1: Location Selection (Section 1 & 2) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Your Location
                </label>
                {userCoords && (
                  <button
                    type="button"
                    onClick={() => {
                      setUserCoords(null);
                      setLocationMode(selectedLocation && !isAllIndia ? 'manual' : null);
                      setGeoStatus({ state: 'idle', message: '' });
                    }}
                    className="text-xs text-rose-500 hover:text-rose-600 font-medium inline-flex items-center gap-1 focus:outline-hidden"
                  >
                    <X className="w-3 h-3" /> Reset Location
                  </button>
                )}
              </div>

              {/* Location Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Primary Action: Use My Location */}
                <button
                  type="button"
                  id="btn-use-my-location"
                  onClick={handleUseMyLocation}
                  disabled={geoStatus.state === 'detecting'}
                  className={`w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl border text-sm font-bold transition-all shadow-xs focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
                    locationMode === 'gps'
                      ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-500/30'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
                  }`}
                  aria-label="Use My Location to detect nearby branches"
                >
                  <Navigation className={`w-4 h-4 ${geoStatus.state === 'detecting' ? 'animate-spin' : ''}`} />
                  {geoStatus.state === 'detecting' ? 'Finding branches near you...' : 'Use My Location'}
                </button>

                {/* Secondary Option: Choose Location Manually */}
                <button
                  type="button"
                  id="btn-choose-location-manually"
                  onClick={handleChooseLocationManually}
                  className={`w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl border text-sm font-bold transition-all shadow-xs focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer ${
                    locationMode === 'manual' && !userCoords
                      ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-500/30'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
                  }`}
                  aria-label="Choose Location Manually from city selector"
                >
                  <Building2 className="w-4 h-4" />
                  {selectedLocation && !isAllIndia 
                    ? selectedLocation.displayName || selectedLocation.name 
                    : 'Choose Location Manually'}
                </button>
              </div>

              {/* Status Feedback Message (Section 2) */}
              {geoStatus.message && (
                <div className={`mt-2.5 p-3 rounded-xl text-xs flex items-start gap-2 ${
                  geoStatus.state === 'granted'
                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : geoStatus.state === 'denied' || geoStatus.state === 'error'
                    ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                }`}>
                  {geoStatus.state === 'granted' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  )}
                  <div className="flex-1 flex flex-wrap items-center justify-between gap-1">
                    <span>{geoStatus.message}</span>
                    {geoStatus.state === 'denied' && (
                      <button
                        type="button"
                        onClick={handleChooseLocationManually}
                        className="font-bold underline hover:text-amber-950 dark:hover:text-amber-100 cursor-pointer"
                      >
                        Choose Location Manually
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Active Context Banner */}
              <div className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                {locationMode === 'gps' && userCoords ? (
                  <span>
                    Location detected near your current area. Distance is calculated securely from your position.
                  </span>
                ) : selectedLocation && !isAllIndia ? (
                  <span>
                    Manual city mode: Searching branches available around <strong>{selectedLocation.displayName || selectedLocation.name}</strong>.
                  </span>
                ) : (
                  <span>
                    Select "Use My Location" or choose a city to search nearby branches.
                  </span>
                )}
              </div>
            </div>

            {/* Step 2: Search Bank Filter (Section 3) */}
            <div ref={bankDropdownRef} className="relative">
              <label htmlFor="search-bank-input" className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Search Bank
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  {BANKS.length} verified banks available
                </span>
              </label>

              {/* Bank Search Input & Trigger */}
              <div 
                onClick={() => setIsBankDropdownOpen(prev => !prev)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-sm cursor-pointer shadow-xs focus-within:ring-2 focus-within:ring-blue-500"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-white p-0.5 flex items-center justify-center border border-slate-100 dark:border-slate-700 shrink-0">
                    {currentBank.logo ? (
                      <img
                        src={currentBank.logo}
                        alt=""
                        className="w-5 h-5 object-contain"
                      />
                    ) : (
                      <Building2 className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {currentBank.bankName} ({currentBank.shortName})
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isBankDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* Searchable Bank Dropdown Panel */}
              <AnimatePresence>
                {isBankDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute left-0 right-0 top-full mt-2 z-40 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                  >
                    {/* Search inside Bank Dropdown */}
                    <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-850">
                      <div className="relative">
                        <input
                          id="search-bank-input"
                          type="text"
                          value={bankSearchTerm}
                          onChange={(e) => setBankSearchTerm(e.target.value)}
                          placeholder="Type to filter banks (e.g. SBI, HDFC, Kotak)..."
                          className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Bank List */}
                    <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
                      {filteredBanksList.map(bank => {
                        const isSelected = bank.bankId === selectedBankId;
                        return (
                          <button
                            key={bank.bankId}
                            type="button"
                            onClick={() => {
                              setSelectedBankId(bank.bankId);
                              setIsBankDropdownOpen(false);
                              setBankSearchTerm('');
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-6 h-6 rounded-md bg-white p-0.5 flex items-center justify-center border border-slate-100 dark:border-slate-700 shrink-0">
                                {bank.logo ? (
                                  <img src={bank.logo} alt="" className="w-4 h-4 object-contain" />
                                ) : (
                                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                )}
                              </div>
                              <span>{bank.bankName} ({bank.shortName})</span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                          </button>
                        );
                      })}
                      {filteredBanksList.length === 0 && (
                        <div className="p-4 text-center text-xs text-slate-400">
                          No banks found matching "{bankSearchTerm}"
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Step 3: Radius Filter (Section 4) */}
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Search Radius
              </label>
              
              {/* Segmented Visually Obvious Buttons */}
              <div className="grid grid-cols-5 gap-2" role="radiogroup" aria-label="Search Radius Options">
                {RADIUS_OPTIONS.map((opt) => {
                  const isSelected = searchRadius === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSearchRadius(opt.value)}
                      className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-center border focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-500/20'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Primary Find Action Button */}
            <div className="pt-2">
              <button
                type="button"
                id="btn-find-nearby-branches"
                onClick={handleFindBranches}
                className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white text-base font-bold shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.99] cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Search className="w-5 h-5" />
                Find Nearby Branches
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          3. RESULTS DISPLAY SECTION
         ================================================== */}
      {hasSearched && (
        <section ref={resultsRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Results Summary Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                {locationMode === 'gps'
                  ? `Within ${searchRadius} km from your location`
                  : `Around ${selectedLocation?.displayName || selectedLocation?.name || 'Selected City'}`}
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {currentBank.shortName} Branches Near You
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {locationMode === 'gps' ? (
                  <>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      {filteredBranches.length} verified {currentBank.shortName}
                    </span>{' '}
                    {filteredBranches.length === 1 ? 'branch record' : 'branch records'} found within {searchRadius} km.
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                      {filteredBranches.length} verified {currentBank.shortName}
                    </span>{' '}
                    {filteredBranches.length === 1 ? 'branch record' : 'branch records'} available around {selectedLocation?.displayName || selectedLocation?.name}.
                  </>
                )}
              </p>
            </div>

            {/* In-Results Instant Search Input (Section 12) */}
            <div className="w-full md:w-72 relative">
              <input
                ref={searchInputRef}
                type="text"
                value={inResultsQuery}
                onChange={(e) => setInResultsQuery(e.target.value)}
                placeholder="Search branch, locality, PIN or IFSC..."
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
                aria-label="Search within branch results"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {inResultsQuery && (
                <button
                  type="button"
                  onClick={() => setInResultsQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Clear branch search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* ==================================================
              3A. EMPTY STATE (Section 6)
             ================================================== */}
          {filteredBranches.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {inResultsQuery
                  ? `No branch records matched "${inResultsQuery}"`
                  : 'No verified branch record is currently available within the selected search area.'}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                {inResultsQuery
                  ? 'Try clearing the search query to view all branch records found within this search area.'
                  : 'Try increasing the search radius.'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {inResultsQuery ? (
                  <button
                    type="button"
                    onClick={() => setInResultsQuery('')}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    Clear Filter
                  </button>
                ) : (
                  <>
                    {searchRadius < 50 && (
                      <button
                        type="button"
                        onClick={handleExpandRadius}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors shadow-xs"
                      >
                        Increase Radius
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setIsBankDropdownOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                    >
                      Choose Another Bank
                    </button>

                    <button
                      type="button"
                      onClick={handleChooseLocationManually}
                      className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
                    >
                      Choose Location Manually
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* ==================================================
                  3B. NEAREST BRANCH HIGHLIGHT (Section 5)
                 ================================================== */}
              {nearestBranch && (
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-blue-500/5 to-transparent dark:from-amber-400/10 dark:via-blue-900/10 dark:to-transparent border-2 border-amber-400/60 dark:border-amber-400/40 p-6 sm:p-7 shadow-lg shadow-amber-500/5 transition-all">
                  {/* Nearest Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-amber-950 uppercase tracking-wider mb-4 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-950 text-amber-950" />
                    Nearest
                  </div>

                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                    <div className="flex items-start gap-4">
                      {currentBank.logo ? (
                        <div className="w-14 h-14 rounded-2xl bg-white p-2 flex items-center justify-center shadow-md border border-slate-100 dark:border-slate-800 shrink-0">
                          <img
                            src={currentBank.logo}
                            alt=""
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                          <Building2 className="w-7 h-7" />
                        </div>
                      )}

                      <div>
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {currentBank.bankName}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
                          {nearestBranch.branchName}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {nearestBranch.address}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                          <span>{nearestBranch.city}, {nearestBranch.state}</span>
                          <span>•</span>
                          <span>PIN: <strong className="text-slate-700 dark:text-slate-200">{nearestBranch.pincode}</strong></span>
                          <span>•</span>
                          <span>IFSC: <strong className="text-blue-700 dark:text-blue-300 font-bold">{nearestBranch.ifsc}</strong></span>
                        </div>

                        {nearestBranch.openingHours && (
                          <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-sans">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{nearestBranch.openingHours}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Distance & Actions */}
                    <div className="flex flex-col sm:items-end justify-between gap-4 shrink-0">
                      {nearestBranch.distanceText && (
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 text-sm font-extrabold border border-blue-200 dark:border-blue-900">
                          <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          {nearestBranch.distanceText} away
                        </div>
                      )}

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => setSelectedBranchForModal(nearestBranch)}
                          className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                          View Details
                        </button>

                        <a
                          href={getDirectionsUrl(nearestBranch)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                          <Navigation className="w-4 h-4" />
                          Get Directions
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================================================
                  3C. OTHER BRANCHES LIST (Section 5)
                 ================================================== */}
              {otherBranches.length > 0 && (
                <div className="space-y-4 pt-2">
                  {nearestBranch && (
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
                      Other Nearby Branches (Sorted by Distance)
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    {otherBranches.map((branch) => (
                      <div
                        key={branch.branchId || branch.ifsc}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-3.5">
                          {currentBank.logo ? (
                            <div className="w-11 h-11 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-xs border border-slate-100 dark:border-slate-800 shrink-0 mt-0.5">
                              <img
                                src={currentBank.logo}
                                alt=""
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                              <Building2 className="w-5 h-5" />
                            </div>
                          )}

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                {branch.branchName}
                              </h4>
                              {branch.distanceText && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
                                  <MapPin className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                  {branch.distanceText} away
                                </span>
                              )}
                            </div>

                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                              {branch.address}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                              <span>{branch.city}, {branch.state}</span>
                              <span>•</span>
                              <span>PIN: <strong className="text-slate-700 dark:text-slate-200">{branch.pincode}</strong></span>
                              <span>•</span>
                              <span>IFSC: <strong className="text-blue-700 dark:text-blue-300 font-bold">{branch.ifsc}</strong></span>
                              {branch.openingHours && (
                                <>
                                  <span>•</span>
                                  <span className="font-sans inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    {branch.openingHours.split(',')[0]}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center gap-2 pt-2 md:pt-0 shrink-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => setSelectedBranchForModal(branch)}
                            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
                          >
                            View Details
                          </button>

                          <a
                            href={getDirectionsUrl(branch)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            Get Directions
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Data Transparency & Trust Disclaimers (Section 10 & 17) */}
              <div className="mt-8 space-y-3">
                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Data Transparency:</span>{' '}
                    Showing verified branch records currently available in the D.CARD directory. Branch coverage is continuously expanded using official bank sources.
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Disclaimer:</span>{' '}
                    Branch information is provided for informational purposes. Branch details, hours and services may change. Please verify important details with the bank before visiting.
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ==================================================
          4. BRANCH DETAILS MODAL
         ================================================== */}
      <BranchDetailsModal
        branch={selectedBranchForModal}
        isOpen={Boolean(selectedBranchForModal)}
        onClose={() => setSelectedBranchForModal(null)}
      />
    </div>
  );
}
