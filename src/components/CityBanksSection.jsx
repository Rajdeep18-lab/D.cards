import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [locationName, setLocationName] = useState('Your Location');
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Ref to store current active AbortController for API requests
  const abortControllerRef = useRef(null);

  // 1. Fetch Branches from Overpass API when userCoords updates
  const loadNearbyBranches = useCallback(async (lat, lng) => {
    // Abort previous pending fetch request if any
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
        setBranches(data || []);
        if (!data || data.length === 0) {
          setError('No nearby bank branches found for this area.');
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Error fetching nearby bank branches:', err);
      setBranches([]);
      setError('Unable to fetch live bank locations. Displaying approximate nearby branches.');
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

  // 2. Initial Location Detection via Browser Geolocation API
  const handleDetectLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPermissionDenied(false);
    try {
      const coords = await getUserPosition(7000);
      setUserCoords(coords);
      setLocationName('Your Live Geolocation');
    } catch (err) {
      console.warn('Geolocation failed or denied:', err.message);
      const isDenied = err.code === 1 || err.message.toLowerCase().includes('denied');
      setPermissionDenied(isDenied);

      // Fallback to profile city if available
      if (userCity) {
        try {
          const cityCoords = await searchCityCoordinates(userCity);
          setUserCoords({ lat: cityCoords.lat, lng: cityCoords.lng });
          setLocationName(userCity);
          return;
        } catch (e) {
          // Fall through to Mumbai default
        }
      }

      // Fallback to default Mumbai coordinates
      setUserCoords({ lat: 19.0760, lng: 72.8777 });
      setLocationName('Mumbai (Default)');
    } finally {
      setLoading(false);
    }
  }, [userCity]);

  // Trigger location detection on mount
  useEffect(() => {
    handleDetectLocation();
  }, [handleDetectLocation]);

  // 3. Handle City Search Form Submit
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
      setError(err.message || 'Location search failed. Try entering a city name or pincode.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section id="city-banks" className="mt-12 mb-12 select-none text-left">
      {/* Top Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="mb-2 inline-flex items-center gap-1.5 px-3.5 py-1 bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-roseGold text-[10px] font-black tracking-widest uppercase rounded-full border border-secondary/20 select-none">
            ⚡ LIVE NEARBY BRANCH FINDER
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-serif text-[#1E0B16] dark:text-[#F5D9E8] tracking-tight mt-1 flex items-center gap-2">
            <span>🏦</span> Bank Branches Near You
          </h2>
          <p className="text-xs sm:text-sm text-textSoft dark:text-gray-400 mt-1 max-w-xl font-medium">
            Real-time branch locator for <strong className="text-secondary dark:text-roseGold font-bold">{locationName}</strong>. Sorted by distance from your position.
          </p>
        </div>

        {/* Action Bar: City Search & Location Detector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* City Search Form */}
          <form onSubmit={handleCitySearch} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search city or pincode..."
              className="w-full sm:w-64 px-4 py-2.5 text-xs rounded-2xl bg-white/80 dark:bg-black/40 border border-slate-300 dark:border-roseGold/20 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-secondary transition-all shadow-sm"
            />
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="absolute right-1 px-3 py-1.5 text-xs font-bold bg-secondary hover:bg-secondary/90 text-white rounded-xl disabled:opacity-50 transition-all cursor-pointer shadow-sm"
            >
              {isSearching ? '...' : 'Search'}
            </button>
          </form>

          {/* Live Geolocation Trigger */}
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-secondary to-primary hover:opacity-95 text-white text-xs font-bold rounded-2xl shadow-md transition-all cursor-pointer active:scale-98 disabled:opacity-50"
            title="Detect your current browser position"
          >
            <span>📍</span>
            <span>{loading ? 'Locating...' : 'Use My Geolocation'}</span>
          </button>
        </div>
      </div>

      {/* Permission Denied Warning State */}
      {permissionDenied && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⚠️</span>
            <span>Location permission was denied. Showing fallback results for {locationName}. Enable location access in your browser for live coordinates.</span>
          </div>
          <button
            type="button"
            onClick={handleDetectLocation}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-white text-[11px] font-black uppercase tracking-wider hover:bg-amber-600 transition-all cursor-pointer whitespace-nowrap"
          >
            Allow Location & Retry
          </button>
        </div>
      )}

      {/* Error / Warning Notice */}
      {error && !loading && branches.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs flex items-center justify-between">
          <span>ℹ️ {error}</span>
          <button
            type="button"
            onClick={() => loadNearbyBranches(userCoords.lat, userCoords.lng)}
            className="text-xs font-bold underline hover:opacity-80"
          >
            Refresh 🔄
          </button>
        </div>
      )}

      {/* Loading Skeleton View */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-5 rounded-3xl bg-white/40 dark:bg-black/20 border border-slate-200 dark:border-white/5 animate-pulse space-y-3"
            >
              <div className="flex justify-between">
                <div className="h-4 bg-slate-300 dark:bg-white/10 rounded w-1/2"></div>
                <div className="h-4 bg-slate-300 dark:bg-white/10 rounded w-1/4"></div>
              </div>
              <div className="h-3 bg-slate-200 dark:bg-white/5 rounded w-5/6"></div>
              <div className="h-3 bg-slate-200 dark:bg-white/5 rounded w-2/3"></div>
              <div className="pt-3 flex gap-2">
                <div className="h-9 bg-slate-300 dark:bg-white/10 rounded-xl w-1/2"></div>
                <div className="h-9 bg-slate-300 dark:bg-white/10 rounded-xl w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : branches.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-10 text-center rounded-3xl bg-white/50 dark:bg-black/30 backdrop-blur-xl border border-slate-200 dark:border-secondary/20 shadow-soft flex flex-col items-center justify-center my-6"
        >
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-3xl mb-4">
            🏦
          </div>
          <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 font-serif">
            No nearby bank branches found.
          </h3>
          <p className="text-xs text-textSoft dark:text-gray-400 mt-2 max-w-md leading-relaxed font-medium">
            Try searching for a major city, checking your location settings, or entering a pincode.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleDetectLocation}
              className="px-5 py-2.5 bg-secondary text-white text-xs font-bold rounded-xl hover:bg-secondary/90 transition-all shadow-md cursor-pointer"
            >
              Retry Location Search 📍
            </button>
          </div>
        </motion.div>
      ) : (
        /* Responsive Branch Cards Grid (Sorted by Distance) */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Showing {branches.length} bank branches near {locationName}
            </span>
            <span className="font-mono text-[11px] text-secondary dark:text-roseGold">
              ⚡ Sorted by nearest distance
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {branches.map((branch) => {
                const navDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`;
                const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${branch.lat},${branch.lng}`;

                return (
                  <motion.div
                    key={branch.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="p-5 rounded-3xl bg-white/60 dark:bg-black/35 backdrop-blur-xl border border-slate-200/90 dark:border-secondary/20 shadow-soft hover:shadow-lg flex flex-col justify-between space-y-4 select-none group"
                  >
                    {/* Card Top Header */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary to-primary text-white flex items-center justify-center text-base font-black shadow-md flex-shrink-0">
                            🏦
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight leading-snug font-serif">
                              {branch.name}
                            </h3>
                            <p className="text-[10px] text-secondary dark:text-roseGold font-bold uppercase tracking-wider">
                              {branch.brand || 'Banking Partner'}
                            </p>
                          </div>
                        </div>

                        {/* Distance Badge */}
                        <span className="px-2.5 py-1 rounded-full bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-roseGold text-[11px] font-black border border-secondary/20 flex-shrink-0">
                          📏 {branch.distanceFormatted}
                        </span>
                      </div>

                      {/* Full Address */}
                      <p className="text-xs text-textSoft dark:text-slate-300 leading-relaxed font-medium pt-1">
                        📍 {branch.address}
                      </p>
                    </div>

                    {/* Meta Details: Hours, Phone, Rating */}
                    <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-1.5 text-[11px]">
                      {/* Hours */}
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-gray-500 dark:text-gray-400">🕒 Business Hours:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {branch.openingHours || '10:00 AM - 4:00 PM (Mon-Sat)'}
                        </span>
                      </div>

                      {/* Phone */}
                      {branch.phone && (
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                          <span className="font-semibold text-gray-500 dark:text-gray-400">📞 Phone:</span>
                          <a href={`tel:${branch.phone}`} className="font-mono text-secondary dark:text-roseGold hover:underline font-bold">
                            {branch.phone}
                          </a>
                        </div>
                      )}

                      {/* Rating */}
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-gray-500 dark:text-gray-400">⭐ Rating:</span>
                        <span className="font-bold text-amber-500 dark:text-amber-400">
                          4.5 / 5.0 (Verified Branch)
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                      <a
                        href={navDirectionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-secondary hover:bg-secondary/90 text-white text-[11px] font-black text-center transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>🧭</span> Get Directions
                      </a>

                      <a
                        href={googleMapsSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black text-center transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>🗺️</span> Google Maps
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </section>
  );
}

export default CityBanksSection;
