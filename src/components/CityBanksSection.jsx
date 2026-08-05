import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import {
  getUserPosition,
  fetchNearbyBankBranches,
  searchCityCoordinates
} from '../services/bankLocationService';

function CityBanksSection() {
  const { profile } = useAuth();
  const userCity = profile?.city || '';

  // Core State
  const [userCoords, setUserCoords] = useState(null); // { lat, lng }
  const [locationName, setLocationName] = useState('Your Current Location');
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Grouping State: 'nearest' | 'grouped'
  const [viewMode, setViewMode] = useState('nearest');

  // Manual City Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Active AbortController reference
  const abortControllerRef = useRef(null);

  // 1. Fetch Branches from Overpass API when userCoords updates
  const loadNearbyBranches = useCallback(async (lat, lng) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchNearbyBankBranches(lat, lng, 5000, controller.signal);
      if (!controller.signal.aborted) {
        // Enforce maximum 10 nearest branches
        const top10 = (data || []).slice(0, 10);
        setBranches(top10);
        if (top10.length === 0) {
          setError('No nearby banks found');
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Error fetching nearby bank branches:', err);
      setBranches([]);
      setError('Unable to fetch live bank locations. Please check your network or try again.');
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (userCoords) {
      loadNearbyBranches(userCoords.lat, userCoords.lng);
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [userCoords, loadNearbyBranches]);

  // 2. Detect Current Location via Browser Geolocation API
  const handleDetectLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPermissionDenied(false);
    try {
      const coords = await getUserPosition(8000);
      setUserCoords(coords);
      setLocationName('Your Current Location');
    } catch (err) {
      console.warn('Geolocation failed or denied:', err.message);
      const isDenied = err.code === 1 || (err.message && err.message.toLowerCase().includes('denied'));
      setPermissionDenied(isDenied);

      // Automatic fallback to profile city if available
      if (userCity) {
        try {
          const cityCoords = await searchCityCoordinates(userCity);
          setUserCoords({ lat: cityCoords.lat, lng: cityCoords.lng });
          setLocationName(userCity);
          return;
        } catch (e) {
          // Fall through to default
        }
      }

      // Default fallback (Mumbai)
      setUserCoords({ lat: 19.0760, lng: 72.8777 });
      setLocationName('Mumbai Central Area');
    } finally {
      setLoading(false);
    }
  }, [userCity]);

  // Trigger location detection on initial component mount
  useEffect(() => {
    handleDetectLocation();
  }, [handleDetectLocation]);

  // Manual Retry Handler
  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    if (userCoords) {
      loadNearbyBranches(userCoords.lat, userCoords.lng);
    } else {
      handleDetectLocation();
    }
  };

  // 3. Handle Manual City Search
  const handleCitySearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);
    try {
      const results = await searchCityCoordinates(searchQuery);
      setUserCoords({ lat: results.lat, lng: results.lng });
      setLocationName(results.displayName.split(',')[0] || searchQuery);
      setSearchQuery('');
    } catch (err) {
      setError(err.message || 'Location search failed. Try entering a city name or postal code.');
    } finally {
      setIsSearching(false);
    }
  };

  // 4. Group Branches by Bank Name if multiple branches exist
  const groupedBranches = useMemo(() => {
    const map = new Map();
    branches.forEach((b) => {
      // Normalize brand/bank name for grouping
      const bankGroup = b.brand || b.name.replace(/(Branch|ATM|Main Branch|IFSC).*/i, '').trim() || 'Other Banks';
      if (!map.has(bankGroup)) {
        map.set(bankGroup, []);
      }
      map.get(bankGroup).push(b);
    });
    return Array.from(map.entries()).map(([bankName, branchList]) => ({
      bankName,
      branchList: branchList.sort((a, b) => a.distanceKm - b.distanceKm)
    }));
  }, [branches]);

  return (
    <section id="city-banks" className="mt-12 mb-14 select-none text-left font-sans">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
        <div>
          <span className="mb-2.5 inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-widest uppercase rounded-full border border-emerald-500/20 select-none">
            ⚡ FREE OVERPASS API LOCATOR • NO GOOGLE MAPS API
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-serif text-slate-900 dark:text-roseGold tracking-tight mt-1 flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">🏦</span> Nearby Banks
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl font-medium leading-relaxed">
            Real-time bank branches near <strong className="text-secondary dark:text-roseGold font-bold">{locationName}</strong>. Completely free, fast, and sorted by nearest distance.
          </p>
        </div>

        {/* Action Controls: Location Detector & Manual Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* City Search Input */}
          <form onSubmit={handleCitySearch} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city or pincode..."
              className="w-full sm:w-60 px-4 py-2.5 text-xs rounded-2xl bg-white/90 dark:bg-black/50 border border-slate-200 dark:border-roseGold/20 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-secondary transition-all shadow-sm"
            />
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="absolute right-1 px-3 py-1.5 text-xs font-bold bg-secondary hover:bg-secondary/90 text-white rounded-xl disabled:opacity-50 transition-all cursor-pointer shadow-sm"
            >
              {isSearching ? '...' : 'Search'}
            </button>
          </form>

          {/* Live Geolocation Request Button */}
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-secondary to-primary hover:opacity-95 text-white text-xs font-bold rounded-2xl shadow-md transition-all cursor-pointer active:scale-98 disabled:opacity-50"
            title="Detect current location using Geolocation API"
          >
            <span>📍</span>
            <span>{loading ? 'Locating...' : 'Use My Location'}</span>
          </button>
        </div>
      </div>

      {/* Permission Denied Notice */}
      {permissionDenied && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold">Location Permission Needed</p>
              <p className="text-[11px] font-normal text-amber-800 dark:text-amber-400">
                Please allow location permission in your browser to discover live nearby bank branches, or search for your city above.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDetectLocation}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shadow-sm"
          >
            📍 Allow & Detect
          </button>
        </motion.div>
      )}

      {/* Network / Retrying Notice */}
      {error && !loading && branches.length > 0 && (
        <div className="mb-5 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-2 font-medium">
            <span>ℹ️</span> {error}
          </span>
          <button
            type="button"
            onClick={handleRetry}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[11px] font-bold hover:bg-blue-700 transition-all cursor-pointer"
          >
            Retry 🔄
          </button>
        </div>
      )}

      {/* Filter / View Mode Bar */}
      {!loading && branches.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Showing top {branches.length} nearest bank branches
            </span>
            <span className="px-2 py-0.5 rounded-md bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-roseGold text-[10px] font-black uppercase tracking-wide">
              Max 10
            </span>
          </div>

          {/* Grouping Toggle Buttons */}
          <div className="flex items-center bg-slate-200/80 dark:bg-black/40 p-1 rounded-xl border border-slate-300/50 dark:border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('nearest')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'nearest'
                  ? 'bg-white dark:bg-secondary text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              📏 Sorted by Distance
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grouped')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'grouped'
                  ? 'bg-white dark:bg-secondary text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🏦 Group by Bank
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton View */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-5 rounded-3xl bg-white/40 dark:bg-black/20 border border-slate-200 dark:border-white/5 animate-pulse space-y-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2 w-2/3">
                  <div className="h-5 bg-slate-300 dark:bg-white/10 rounded-lg w-full"></div>
                  <div className="h-3 bg-slate-200 dark:bg-white/5 rounded-md w-1/2"></div>
                </div>
                <div className="h-6 bg-slate-300 dark:bg-white/10 rounded-full w-16"></div>
              </div>
              <div className="space-y-2 pt-1">
                <div className="h-3.5 bg-slate-200 dark:bg-white/5 rounded-md w-full"></div>
                <div className="h-3.5 bg-slate-200 dark:bg-white/5 rounded-md w-4/5"></div>
              </div>
              <div className="pt-3 grid grid-cols-2 gap-2 border-t border-slate-200/50 dark:border-white/5">
                <div className="h-9 bg-slate-300 dark:bg-white/10 rounded-xl w-full"></div>
                <div className="h-9 bg-slate-300 dark:bg-white/10 rounded-xl w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : branches.length === 0 ? (
        /* Empty State: No Nearby Banks Found */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-10 text-center rounded-3xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-slate-200/90 dark:border-secondary/20 shadow-soft flex flex-col items-center justify-center my-6"
        >
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-3xl mb-4 text-secondary">
            🏦
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 font-serif">
            No nearby banks found
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mt-2 max-w-md leading-relaxed font-medium">
            We couldn't detect any bank branches in your immediate vicinity. Try searching for a nearby city or enabling location access.
          </p>
          <div className="pt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleDetectLocation}
              className="px-5 py-2.5 bg-secondary text-white text-xs font-bold rounded-xl hover:bg-secondary/90 transition-all shadow-md cursor-pointer"
            >
              📍 Retry Location Detection
            </button>
          </div>
        </motion.div>
      ) : viewMode === 'grouped' ? (
        /* Grouped View: Accordion / Sectioned by Bank Name */
        <div className="space-y-6">
          {groupedBranches.map((group) => (
            <div key={group.bankName} className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2">
                <span className="text-lg">🏛️</span>
                <h3 className="text-base font-black text-slate-900 dark:text-roseGold font-serif">
                  {group.bankName}
                </h3>
                <span className="ml-auto text-xs font-bold text-slate-500 dark:text-slate-400">
                  {group.branchList.length} {group.branchList.length === 1 ? 'branch' : 'branches'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.branchList.map((branch) => (
                  <BankCardItem key={branch.id} branch={branch} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Standard View: Clean Grid Sorted Strictly by Nearest Distance */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {branches.map((branch) => (
              <BankCardItem key={branch.id} branch={branch} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}

/**
 * Individual Bank Card Component
 * Strictly presenting:
 * 🏦 Bank Name
 * 📍 Branch Address
 * 📏 Distance from user (meters/km)
 * 🧭 Get Directions button (https://www.google.com/maps/dir/?api=1&destination=LAT,LNG)
 * 📍 Open in Google Maps button (https://www.google.com/maps?q=LAT,LNG)
 */
function BankCardItem({ branch }) {
  // Direct Google Maps Directions URL as specified
  const directionsUrl = branch.directionsUrl || `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`;
  // Direct Google Maps View URL
  const googleMapsUrl = branch.googleMapsUrl || `https://www.google.com/maps?q=${branch.lat},${branch.lng}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="p-5 rounded-3xl bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-slate-200/90 dark:border-roseGold/20 shadow-soft hover:shadow-lg flex flex-col justify-between space-y-4 select-none group transition-all"
    >
      {/* Top Header & Bank Name */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-secondary to-primary text-white flex items-center justify-center text-lg font-black shadow-md flex-shrink-0">
              🏦
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight leading-snug font-serif">
                {branch.name}
              </h3>
              <p className="text-[10px] text-secondary dark:text-roseGold font-bold uppercase tracking-wider">
                {branch.brand || 'Bank Branch'}
              </p>
            </div>
          </div>

          {/* Distance Badge (meters / km) */}
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px] font-black border border-emerald-500/20 flex-shrink-0 whitespace-nowrap">
            📏 {branch.distanceFormatted}
          </span>
        </div>

        {/* Branch Address */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium pt-1 flex items-start gap-1.5">
          <span className="flex-shrink-0 text-secondary">📍</span>
          <span>{branch.address}</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-white/5">
        {/* Get Directions Button */}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-3 rounded-xl bg-secondary hover:bg-secondary/90 text-white text-[11px] font-black text-center transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <span>🧭</span> Get Directions
        </a>

        {/* Open in Google Maps Button */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-[11px] font-black text-center transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <span>📍</span> Google Maps
        </a>
      </div>
    </motion.div>
  );
}

export default CityBanksSection;
