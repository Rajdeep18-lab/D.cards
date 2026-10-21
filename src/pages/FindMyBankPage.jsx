import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Compass, 
  Navigation, 
  Phone, 
  Clock, 
  Building2, 
  ExternalLink, 
  CheckCircle2, 
  Filter, 
  Layers, 
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  X
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';
import { useAppLocation } from '../context/LocationContext';
import { useLanguage } from '../context/LanguageContext';
import MapTilerMap from '../components/MapTilerMap';
import BranchDetailsModal from '../components/BranchDetailsModal';
import { 
  findNearbyBranches, 
  fetchNearbyBranchesAsync,
  getBranchCountsByBank, 
  getUserPosition, 
  geocodeLocation,
  normalizeBankName,
  getUniqueBankNamesFromDatabase,
  parseSmartSearchQuery,
  getSearchSuggestions,
  RADIUS_OPTIONS
} from '../services/bankBranchService';

const QUICK_TEST_CITIES = [
  { name: 'Kharar (140301)', lat: 30.7463, lng: 76.6469, query: 'Kharar, Punjab' },
  { name: 'Mohali (160062)', lat: 30.7046, lng: 76.7179, query: 'Mohali, Punjab' },
  { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, query: 'Chandigarh' },
  { name: 'New Delhi', lat: 28.6139, lng: 77.2090, query: 'Connaught Place, New Delhi' },
  { name: 'Gurugram', lat: 28.4721, lng: 77.0725, query: 'Gurugram, Haryana' },
  { name: 'Mumbai', lat: 18.9322, lng: 72.8335, query: 'Fort, Mumbai' },
  { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, query: 'MG Road, Bengaluru' },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, query: 'Abids, Hyderabad' },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707, query: 'Anna Salai, Chennai' },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639, query: 'BBD Bagh, Kolkata' },
  { name: 'Pune', lat: 18.5204, lng: 73.8567, query: 'FC Road, Pune' },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, query: 'Ashram Road, Ahmedabad' },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873, query: 'MI Road, Jaipur' },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462, query: 'Hazratganj, Lucknow' },
  { name: 'Medininagar (Daltonganj)', lat: 24.0384, lng: 84.0682, query: 'Medininagar, Jharkhand' },
  { name: 'Haridwar', lat: 29.9457, lng: 78.1642, query: 'Haridwar, Uttarakhand' },
  { name: 'Patiala', lat: 30.3398, lng: 76.3869, query: 'Patiala, Punjab' },
  { name: 'Bhopal', lat: 23.2324, lng: 77.4332, query: 'MP Nagar, Bhopal' }
];

export default function FindMyBankPage() {
  const { language, isHindi, t } = useLanguage();
  useSEO({
    title: isHindi
      ? 'मेरा बैंक खोजें — निकटतम बैंक शाखा एवं एटीएम | D.CARD'
      : 'Find My Bank — Nearby Bank Branch Finder | D.CARD',
    description: isHindi
      ? 'एसबीआई, एचडीएफसी, आईसीआईसीआई, एक्सिस और अन्य भारतीय बैंकों की निकटतम सत्यापित शाखाएं खोजें। जीपीएस निकटता खोज एवं दिशा-निर्देश।'
      : 'Find verified nearby bank branches of SBI, HDFC, ICICI, Axis and other Indian banks. GPS proximity search, nearest branch first, working hours and directions.',
    canonical: 'https://www.dcard.website/find-my-bank',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'D.CARD Find My Bank Locator',
      'applicationCategory': 'FinanceApplication',
      'operatingSystem': 'All'
    }
  });

  const [searchParams] = useSearchParams();
  const { selectedLocation, isAllIndia } = useAppLocation();

  const initialBankParam = searchParams.get('bank');

  // State: Coordinates & Location Info (Default: Kharar for immediate live verification)
  const [userCoords, setUserCoords] = useState({ lat: 30.7463, lng: 76.6469 });
  const [locationTitle, setLocationTitle] = useState('Kharar, SAS Nagar, Punjab');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [locationSuccessMessage, setLocationSuccessMessage] = useState(null);

  // Dynamic Bank List extracted directly from actual branch database (all 21 banks)
  const bankList = useMemo(() => {
    return getUniqueBankNamesFromDatabase();
  }, []);

  // Filters State
  const [radiusKm, setRadiusKm] = useState(10); // default: 10 km
  const [selectedBank, setSelectedBank] = useState(() => {
    if (initialBankParam) {
      const norm = normalizeBankName(initialBankParam);
      if (norm) return norm;
    }
    return 'All Banks';
  });
  const [typeFilter, setTypeFilter] = useState('All'); // 'All' | 'Branch' | 'ATM'
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Sync bank URL param when arriving from BanksPage
  useEffect(() => {
    if (initialBankParam) {
      const norm = normalizeBankName(initialBankParam);
      if (norm) setSelectedBank(norm);
    }
  }, [initialBankParam]);

  // Smart Search & Autocomplete Typeahead States
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [activeSearchContext, setActiveSearchContext] = useState(null);
  const [hasLiveGps, setHasLiveGps] = useState(false);

  // Map & Card Focus Interaction
  const [focusedBranch, setFocusedBranch] = useState(null);
  const [selectedBranchForModal, setSelectedBranchForModal] = useState(null);
  const [mobileTab, setMobileTab] = useState('both'); // 'map' | 'list' | 'both'

  const searchInputRef = useRef(null);
  const mapSectionRef = useRef(null);
  const dropdownRef = useRef(null);

  const apiKey = import.meta.env.VITE_MAPTILER_API_KEY || import.meta.env.MAPTILER_API_KEY || '';

  // Debounced Autocomplete Suggestion Generator
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed || trimmed.length < 2) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    const timer = setTimeout(() => {
      const results = getSearchSuggestions(trimmed, 6);
      setSuggestions(results);
      setIsDropdownOpen(results.length > 0);
      setHighlightedIndex(-1);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click Outside Listener to Dismiss Dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Async API state & cache
  const [apiData, setApiData] = useState({ key: '', branches: null, source: 'sync' });
  const [isApiLoading, setIsApiLoading] = useState(false);

  const currentFilterKey = `${userCoords?.lat?.toFixed(3)}_${userCoords?.lng?.toFixed(3)}_${radiusKm}_${selectedBank}_${typeFilter}`;

  // Asynchronously query /api/banks/nearby via branchDataProvider
  useEffect(() => {
    if (!userCoords?.lat || !userCoords?.lng) return;

    const controller = new AbortController();
    setIsApiLoading(true);

    fetchNearbyBranchesAsync({
      userLat: userCoords.lat,
      userLng: userCoords.lng,
      radiusKm,
      bankFilter: selectedBank,
      typeFilter,
      page: 1,
      limit: 50,
      signal: controller.signal
    })
      .then(res => {
        if (res && Array.isArray(res.data)) {
          setApiData({
            key: currentFilterKey,
            branches: res.data,
            source: res.source || 'api'
          });
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.info('[FindMyBankPage] Using local verified fallback:', err.message);
        }
      })
      .finally(() => {
        setIsApiLoading(false);
      });

    return () => controller.abort();
  }, [userCoords?.lat, userCoords?.lng, radiusKm, selectedBank, typeFilter, currentFilterKey]);

  // 1. Calculate matching branches: use API payload when available for current filters, else fallback
  const nearbyBranches = useMemo(() => {
    if (apiData.key === currentFilterKey && Array.isArray(apiData.branches)) {
      return apiData.branches;
    }
    return findNearbyBranches({
      userLat: userCoords?.lat,
      userLng: userCoords?.lng,
      radiusKm,
      bankFilter: selectedBank,
      typeFilter
    });
  }, [apiData, currentFilterKey, userCoords, radiusKm, selectedBank, typeFilter]);

  // 2. Calculate branch counts for every bank within the current radius
  const branchCountsByBank = useMemo(() => {
    return getBranchCountsByBank({
      userLat: userCoords?.lat,
      userLng: userCoords?.lng,
      radiusKm,
      typeFilter
    });
  }, [userCoords, radiusKm, typeFilter]);

  // 3. Browser Device Geolocation Flow (Only on user click)
  const handleUseMyLocation = async () => {
    setIsDetectingLocation(true);
    setLocationError(null);
    setLocationSuccessMessage(null);
    setSearchError(null);

    try {
      const position = await getUserPosition(10000);
      const coords = { lat: position.coords?.latitude || position.lat, lng: position.coords?.longitude || position.lng };
      setUserCoords(coords);
      setLocationTitle('Your Live Detected Location');
      setHasLiveGps(true);
      setLocationSuccessMessage('Location detected');
      setTimeout(() => setLocationSuccessMessage(null), 4000);

      // Update active search context location if active
      if (activeSearchContext) {
        setActiveSearchContext(prev => prev ? { ...prev, location: 'Your Live Detected Location', isNearMe: true } : null);
      }
    } catch (err) {
      console.warn('Geolocation detection error:', err);
      setLocationError(err.message || "Allow location access or search by city/PIN.");
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // 4. Smart Bank + Location Execution Flow
  const executeSmartSearch = async (queryText, suggestionObj = null) => {
    const raw = queryText || searchQuery;
    if (!raw || !raw.trim()) {
      setSearchError('Please enter a bank, city, PIN code, or landmark.');
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setLocationError(null);
    setIsDropdownOpen(false);

    const parsed = suggestionObj?.parsed || parseSmartSearchQuery(raw);

    // Apply Bank Filter if parsed
    if (parsed.matchedBank) {
      setSelectedBank(parsed.matchedBank);
    } else if (parsed.matchedType === 'All') {
      setSelectedBank('All Banks');
    }

    // Apply Type Filter if parsed
    if (parsed.matchedType) {
      setTypeFilter(parsed.matchedType);
    }

    // Apply Radius if parsed (e.g. "within 5 km")
    if (parsed.matchedRadius) {
      setRadiusKm(parsed.matchedRadius);
    }

    // Handle "Near Me" Intent
    if (parsed.isNearMe) {
      setActiveSearchContext({
        query: raw,
        bank: parsed.matchedBank || (selectedBank !== 'All Banks' ? selectedBank : 'All Banks'),
        location: 'Your Live Location',
        type: parsed.matchedType || typeFilter,
        radius: parsed.matchedRadius || radiusKm,
        isNearMe: true
      });

      if (hasLiveGps) {
        setLocationTitle('Your Live Detected Location');
        setIsSearching(false);
        setSearchQuery('');
        return;
      } else {
        setIsSearching(false);
        setSearchQuery('');
        handleUseMyLocation();
        return;
      }
    }

    // Handle Location Intent (City, PIN, Landmark)
    const targetLocation = parsed.matchedLocation || parsed.matchedPincode;
    if (targetLocation) {
      try {
        const result = await geocodeLocation(targetLocation, apiKey);
        setUserCoords({ lat: result.lat, lng: result.lng });
        setLocationTitle(result.displayName);
        setActiveSearchContext({
          query: raw,
          bank: parsed.matchedBank || selectedBank,
          location: result.displayName,
          type: parsed.matchedType || typeFilter,
          radius: parsed.matchedRadius || radiusKm,
          isNearMe: false
        });
        setSearchQuery('');
      } catch (err) {
        console.warn('Geocoding search failed:', err);
        setSearchError(err.message || `Location "${targetLocation}" not found. Try searching with city name or 6-digit PIN code.`);
      } finally {
        setIsSearching(false);
      }
    } else if (parsed.matchedBank || parsed.matchedType || parsed.matchedRadius) {
      // Filter intent specified (bank, type, or radius) - retain current location origin
      setActiveSearchContext({
        query: raw,
        bank: parsed.matchedBank || selectedBank,
        location: locationTitle,
        type: parsed.matchedType || typeFilter,
        radius: parsed.matchedRadius || radiusKm,
        isNearMe: false
      });
      setIsSearching(false);
      setSearchQuery('');
    } else {
      // Freeform geocoding fallback
      try {
        const result = await geocodeLocation(raw, apiKey);
        setUserCoords({ lat: result.lat, lng: result.lng });
        setLocationTitle(result.displayName);
        setActiveSearchContext({
          query: raw,
          bank: selectedBank,
          location: result.displayName,
          type: typeFilter,
          isNearMe: false
        });
        setSearchQuery('');
      } catch (err) {
        setSearchError(err.message || 'Location not found. Try searching with city name or 6-digit PIN code.');
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleManualSearch = (e) => {
    if (e) e.preventDefault();
    executeSmartSearch(searchQuery);
  };

  // Keyboard navigation inside search dropdown
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isDropdownOpen && suggestions.length > 0) {
        setIsDropdownOpen(true);
      }
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (isDropdownOpen && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        e.preventDefault();
        const item = suggestions[highlightedIndex];
        executeSmartSearch(item.query, item);
      }
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  };

  // 5. Quick City Preset Selection
  const handleSelectPresetCity = (city) => {
    setUserCoords({ lat: city.lat, lng: city.lng });
    setLocationTitle(city.name);
    setLocationError(null);
    setSearchError(null);
  };

  // 6. Marker Click: select branch, pan to it, and open details modal
  const handleMarkerClick = (branch) => {
    setFocusedBranch(branch);
    setSelectedBranchForModal(branch);
  };

  // 7. View Branch on Map Action (from card button or modal button)
  const handleViewOnMap = (branch) => {
    setFocusedBranch(branch);
    setSelectedBranchForModal(null); // Close modal so user views the map directly
    if (window.innerWidth < 1024) {
      setMobileTab('map');
    }
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 7. Increase Radius Action for Empty State
  const handleIncreaseRadius = () => {
    if (radiusKm < 25) {
      setRadiusKm(25);
    } else if (radiusKm < 50) {
      setRadiusKm(50);
    } else {
      setRadiusKm(50);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Banner / Hero Section */}
      <section className="relative pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-white via-blue-50/20 to-slate-50 dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950">
        <div className="max-w-7xl mx-auto text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t('findBanks.badge', 'Interactive MapTiler Branch Locator')}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white">
                {isHindi ? 'बैंक ' : 'Find My '}<span className="text-blue-600 dark:text-blue-400">{isHindi ? 'खोजें' : 'Bank'}</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl font-medium">
                {t('findBanks.subtitle', 'Locate verified bank branches and ATMs within your preferred radius. Compare real physical branch services, working hours, and get instant turn-by-turn directions.')}
              </p>
            </div>

            {/* Current Active Location Pill */}
            <div className="flex items-center gap-3 p-3 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                📍
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t('findBanks.activeOrigin', 'Active Search Origin')}
                </p>
                <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100 max-w-[220px] truncate" title={locationTitle}>
                  {locationTitle}
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar & Geolocation Trigger */}
          <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center gap-3 max-w-4xl">
            {/* Search Input Form with Autocomplete */}
            <form onSubmit={handleManualSearch} className="relative flex-1">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  role="combobox"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="listbox"
                  aria-controls="search-suggestions-list"
                  aria-activedescendant={highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (searchError) setSearchError(null);
                  }}
                  onFocus={() => {
                    if (suggestions.length > 0) setIsDropdownOpen(true);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={t('findBanks.searchPlaceholder', 'Search bank, city, PIN code (e.g. SBI Chandigarh, HDFC Kharar, ATM near Mohali)')}
                  className="w-full pl-11 pr-28 py-3.5 text-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm transition-all"
                />
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="absolute right-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  {isSearching ? (isHindi ? 'खोज रहे हैं...' : 'Searching...') : (isHindi ? 'खोजें' : 'Search')}
                </button>
              </div>

              {/* Autocomplete Typeahead Dropdown */}
              {isDropdownOpen && suggestions.length > 0 && (
                <div
                  ref={dropdownRef}
                  id="search-suggestions-list"
                  role="listbox"
                  className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50 divide-y divide-slate-100 dark:divide-slate-800/80 max-h-72 overflow-y-auto text-left"
                >
                  {suggestions.map((item, idx) => (
                    <button
                      key={item.id}
                      id={`suggestion-${idx}`}
                      type="button"
                      role="option"
                      aria-selected={highlightedIndex === idx}
                      onClick={() => executeSmartSearch(item.query, item)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors cursor-pointer ${
                        highlightedIndex === idx
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-sm">
                        {item.icon === 'bank' && '🏦'}
                        {item.icon === 'atm' && '🏧'}
                        {item.icon === 'pin' && '📍'}
                        {item.icon === 'gps' && '🎯'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-extrabold truncate text-slate-900 dark:text-white">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                          {item.subtitle}
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                        {item.category === 'combination' ? (isHindi ? 'स्मार्ट मिलान' : 'Smart Match') : item.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* Geolocation Button */}
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={isDetectingLocation}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 disabled:opacity-60 text-white text-sm font-black shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
            >
              <Compass className={`w-4 h-4 ${isDetectingLocation ? 'animate-spin' : ''}`} />
              <span>
                {isDetectingLocation 
                  ? (isHindi ? 'आपका स्थान खोज रहे हैं...' : 'Detecting your location...') 
                  : (isHindi ? '📍 मेरा स्थान उपयोग करें' : '📍 Use My Location')}
              </span>
            </button>
          </div>

          {/* Compact Smart Search Result Context */}
          {activeSearchContext && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center flex-wrap gap-2 text-xs font-bold text-slate-600 dark:text-slate-300"
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t('findBanks.activeSearchContext', 'Active Search Context:')}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1.5 shadow-xs">
                <span>🏦 {activeSearchContext.bank || (selectedBank === 'All Banks' && isHindi ? 'सभी बैंक' : selectedBank)}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 shadow-xs">
                <span>📍 {activeSearchContext.location}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-xs">
                {isHindi ? `${radiusKm} किमी के दायरे में` : `Within ${radiusKm} km`}
              </span>
              {typeFilter !== 'All' && (
                <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-xs">
                  {typeFilter === 'ATM' 
                    ? (isHindi ? '🏧 केवल एटीएम' : '🏧 ATMs Only') 
                    : (isHindi ? '🏢 केवल शाखाएं' : '🏢 Branches Only')}
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setActiveSearchContext(null);
                  setSelectedBank('All Banks');
                  setTypeFilter('All');
                }}
                className="ml-1 inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 underline cursor-pointer"
                title="Reset search context"
              >
                <X className="w-3 h-3" />
                <span>{t('findBanks.resetFilters', 'Reset Filters')}</span>
              </button>
            </motion.div>
          )}

          {/* Quick Preset Cities for 1-Click Verification */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
              {t('findBanks.popularHubs', 'Popular Hubs:')}
            </span>
            {QUICK_TEST_CITIES.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => handleSelectPresetCity(c)}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  locationTitle.toLowerCase().includes(c.name.toLowerCase().split(' ')[0])
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-500'
                }`}
              >
                📍 {c.name}
              </button>
            ))}
          </div>

          {/* Geolocation Success Notice */}
          {locationSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Location detected</span>
            </motion.div>
          )}

          {/* Geolocation Error / Permission Denied Notice */}
          {locationError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="font-extrabold">{locationError}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setLocationError(null);
                    if (searchInputRef.current) searchInputRef.current.focus();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Search Location Manually
                </button>
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 hover:bg-amber-200 text-amber-900 dark:text-amber-200 font-bold text-xs border border-amber-300 dark:border-amber-700 transition-colors cursor-pointer"
                >
                  Try Again 🔄
                </button>
              </div>
            </motion.div>
          )}

          {/* Manual Search Error */}
          {searchError && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-medium flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{searchError}</span>
            </motion.div>
          )}
        </div>
      </section>

      {/* Main Content Area: Filters + Map + Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile View Toggle Bar (Only visible < 1024px) */}
        <div className="lg:hidden flex items-center justify-between mb-4 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setMobileTab('both')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mobileTab === 'both' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t('findBanks.mapAndList', 'Map & List')}
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('map')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mobileTab === 'map' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t('findBanks.mapView', '🗺️ Map View')}
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('list')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mobileTab === 'list' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            📋 {t('findBanks.branchesList', 'Branches')} ({nearbyBranches.length})
          </button>
        </div>

        {/* 2-Column Grid: Filters Sidebar (Left) + Interactive Map (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          {/* Left Column: Filter Controls (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-6 text-left">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {t('findBanks.filtersAndControls', 'Filters & Controls')}
                  </h2>
                </div>
                {(selectedBank !== 'All Banks' || radiusKm !== 10 || typeFilter !== 'All') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBank('All Banks');
                      setRadiusKm(10);
                      setTypeFilter('All');
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    {isHindi ? 'रीसेट' : 'Reset'}
                  </button>
                )}
              </div>

              {/* 1. Distance Radius Control */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  {t('findBanks.searchRadius', 'Search Radius:')}{' '}
                  <span className="text-blue-600 dark:text-blue-400 font-extrabold">
                    {radiusKm} {isHindi ? 'किमी' : 'km'}
                  </span>
                </label>
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {RADIUS_OPTIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRadiusKm(r)}
                      className={`py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                        radiusKm === r
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-500'
                      }`}
                    >
                      {r} {isHindi ? 'किमी' : 'km'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Branch vs ATM Filter */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  {t('findBanks.branchType', 'Type')}:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'All', label: isHindi ? 'सभी' : 'All' },
                    { id: 'Branch', label: isHindi ? 'शाखाएं' : 'Branches' },
                    { id: 'ATM', label: isHindi ? 'एटीएम' : 'ATMs' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTypeFilter(item.id)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        typeFilter === item.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-500'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Bank Selection Filter with Live Branch Counts */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  {t('findBanks.filterByBank', 'Filter By Bank:')}
                </label>
                <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
                  {bankList.map((b) => {
                    const norm = normalizeBankName(b);
                    const count = b === 'All Banks' 
                      ? Object.values(branchCountsByBank).reduce((acc, c) => acc + c, 0)
                      : (branchCountsByBank[norm] || 0);

                    const isSelected = selectedBank === b;

                    return (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBank(b)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 shadow-xs'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate">{b === 'All Banks' && isHindi ? 'सभी बैंक' : b}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          count > 0 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Verified Source Statement */}
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[11px] leading-relaxed font-medium">
                <span className="font-bold flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {isHindi ? 'सत्यापित D.CARD डेटाबेस' : 'Authoritative D.CARD Database'}
                </span>
                {isHindi
                  ? 'सभी 297 शाखा निर्देशांक, IFSC कोड और पते आधिकारिक बैंक सूचियों और RBI रजिस्ट्रियों से सत्यापित हैं।'
                  : 'All 297 branch coordinates, IFSC codes, and addresses are verified against official bank directories and RBI registries.'}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Map (8 cols on desktop) */}
          <div 
            ref={mapSectionRef}
            className={`lg:col-span-8 ${mobileTab === 'list' ? 'hidden lg:block' : 'block'}`}
          >
            <MapTilerMap
              userCoords={userCoords}
              branches={nearbyBranches}
              focusedBranch={focusedBranch}
              onSelectBranch={handleMarkerClick}
              radiusKm={radiusKm}
              className="h-[460px] sm:h-[520px] w-full"
            />
          </div>
        </div>

        {/* ==================================================
            NEARBY BRANCHES RESULTS SECTION
           ================================================== */}
        <section className={`space-y-6 ${mobileTab === 'map' ? 'hidden lg:block' : 'block'}`}>
          {/* Header & Match Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 text-left">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>{t('findBanks.nearbyBanksBranches', 'Nearby Banks & Branches')}</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-extrabold">
                  {isHindi 
                    ? `${nearbyBranches.length} शाखाएं मिलीं` 
                    : `${nearbyBranches.length} ${nearbyBranches.length === 1 ? 'branch found' : 'branches found'}`}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {selectedBank === 'All Banks' 
                  ? (isHindi 
                      ? `${locationTitle} के ${radiusKm} किमी के दायरे में सभी सत्यापित शाखाएं प्रदर्शित` 
                      : `Showing all verified branches within ${radiusKm} km of ${locationTitle}`)
                  : (isHindi 
                      ? `${locationTitle} के ${radiusKm} किमी के दायरे में ${selectedBank} शाखाएं प्रदर्शित` 
                      : `Showing ${selectedBank} branches within ${radiusKm} km of ${locationTitle}`)}
              </p>
            </div>

            {/* Quick Bank Summary Badge */}
            {selectedBank !== 'All Banks' && (
              <div className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-black shadow-xs shrink-0 self-start sm:self-auto">
                {selectedBank}: {nearbyBranches.length} {isHindi ? 'शाखाएं उपलब्ध' : (nearbyBranches.length === 1 ? 'branch found near you' : 'branches found near you')}
              </div>
            )}
          </div>

          {/* Empty State when no branches found within radius */}
          {nearbyBranches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm space-y-4 max-w-xl mx-auto my-12"
            >
              <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-3xl font-black">
                🏦
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {isHindi 
                  ? `${radiusKm} किमी के दायरे में कोई शाखा नहीं मिली।` 
                  : `No branches found within ${radiusKm} km.`}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                {isHindi
                  ? `इस स्थान के ${radiusKm} किमी के भीतर कोई सत्यापित ${selectedBank !== 'All Banks' ? selectedBank : ''} बैंक शाखा या एटीएम दर्ज नहीं है।`
                  : `There are no verified ${selectedBank !== 'All Banks' ? selectedBank : ''} bank branches or ATMs recorded within ${radiusKm} km of this location.`}
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleIncreaseRadius}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  {t('findBanks.increaseRadius', 'Increase Radius')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (searchInputRef.current) searchInputRef.current.focus();
                  }}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-extrabold rounded-xl border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                >
                  {t('findBanks.searchAnotherLocation', 'Search Another Location')}
                </button>
              </div>
            </motion.div>
          ) : (
            /* Branch Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              <AnimatePresence>
                {nearbyBranches.map((branch) => (
                  <BranchCard
                    key={branch.id}
                    branch={branch}
                    onViewOnMap={() => handleViewOnMap(branch)}
                    onOpenDetails={() => setSelectedBranchForModal(branch)}
                    isFocused={focusedBranch?.id === branch.id}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      {/* ==================================================
          BRANCH DETAILS MODAL
         ================================================== */}
      <BranchDetailsModal
        branch={selectedBranchForModal}
        isOpen={Boolean(selectedBranchForModal)}
        onClose={() => setSelectedBranchForModal(null)}
        onViewOnMap={handleViewOnMap}
      />
    </div>
  );
}

/**
 * Individual Bank Branch Card Component
 */
function BranchCard({ branch, onViewOnMap, onOpenDetails, isFocused }) {
  const { isHindi, t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={onOpenDetails}
      className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between space-y-5 shadow-sm hover:shadow-md cursor-pointer ${
        isFocused
          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-lg'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="space-y-4">
        {/* Top Header: Bank Name & Distance */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl font-bold shrink-0 shadow-xs">
              {branch.branch_type === 'ATM' ? '🏧' : '🏦'}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                {branch.branch_type === 'ATM' ? (isHindi ? 'एटीएम' : 'ATM') : (isHindi ? 'शाखा' : 'Branch')} • IFSC: {branch.ifsc || (isHindi ? 'उपलब्ध नहीं' : 'Not available')}
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                {branch.bank_name}
              </h3>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                {branch.branch_name}
              </p>
            </div>
          </div>

          {/* Distance Badge */}
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-black shrink-0 whitespace-nowrap">
            {branch.distanceFormatted}
          </span>
        </div>

        {/* Address */}
        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed flex items-start gap-2 pt-1">
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
          <span>
            {branch.address}, {branch.city}, {branch.state} - {branch.pincode}
          </span>
        </div>

        {/* Meta Details: Phone & Opening Hours */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {t('findBanks.phone', 'Phone')}: <strong className="text-slate-800 dark:text-slate-200">{branch.phone || (isHindi ? 'उपलब्ध नहीं' : 'Not available')}</strong>
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="text-[11px] leading-snug">
              {t('findBanks.hours', 'Hours:')} <strong className="text-slate-800 dark:text-slate-200">{branch.opening_hours || (isHindi ? 'उपलब्ध नहीं' : 'Not available')}</strong>
            </span>
          </div>
        </div>

        {/* Available Services */}
        {branch.services && branch.services.length > 0 && (
          <div className="pt-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              {t('findBanks.availableServices', 'Available Services:')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {branch.services.map((svc) => (
                <span
                  key={svc}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold"
                >
                  {svc}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons: View on Map & Get Directions */}
      <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewOnMap();
          }}
          className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>{t('findBanks.viewOnMap', 'View on Map')}</span>
        </button>

        <a
          href={branch.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
        >
          <span>{t('findBanks.getDirections', 'Get Directions')}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  );
}
