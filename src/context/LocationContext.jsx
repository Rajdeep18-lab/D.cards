import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation as useRouterLocation, useNavigate } from 'react-router-dom';
import {
  locations,
  ALL_INDIA_LOCATION,
  getLocationBySlug,
  getPopularLocations,
  getAllStates,
  getAllCities,
  getCitiesByState,
  searchLocations,
  getCityDisplayName,
  getFormattedLocation,
  isProductAvailableInLocation
} from '../data/locations';

const LocationContext = createContext(null);

const STORAGE_SELECTED_KEY = 'dcard-selected-location';
const STORAGE_RECENT_KEY = 'dcard-recent-locations';
const MAX_RECENT_LOCATIONS = 5;

/**
 * Safely parse JSON from localStorage with fallback
 */
function safeGetItem(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return fallback;
  }
}

/**
 * Safely save JSON to localStorage
 */
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing localStorage key "${key}":`, err);
  }
}

export function LocationProvider({ children }) {
  const routerLocation = useRouterLocation();
  const navigate = useNavigate();

  // 1. Initialize Selected Location from localStorage or default to All India
  const [selectedLocation, setSelectedLocationState] = useState(() => {
    try {
      const stored = safeGetItem(STORAGE_SELECTED_KEY, null);
      if (!stored) return ALL_INDIA_LOCATION;

      // If stored as slug string
      if (typeof stored === 'string') {
        return getLocationBySlug(stored) || ALL_INDIA_LOCATION;
      }
      // If stored as object with slug
      if (stored.slug) {
        return getLocationBySlug(stored.slug) || ALL_INDIA_LOCATION;
      }
      return ALL_INDIA_LOCATION;
    } catch {
      return ALL_INDIA_LOCATION;
    }
  });

  // 2. Initialize Recent Locations from localStorage
  const [recentLocations, setRecentLocations] = useState(() => {
    try {
      const stored = safeGetItem(STORAGE_RECENT_KEY, []);
      if (!Array.isArray(stored)) return [];
      return stored
        .map(item => (typeof item === 'string' ? getLocationBySlug(item) : getLocationBySlug(item?.slug)))
        .filter(loc => loc && loc.slug !== 'all-india')
        .slice(0, MAX_RECENT_LOCATIONS);
    } catch {
      return [];
    }
  });

  // 3. Modal visibility state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // 4. Check URL Query Parameters (?location=slug or ?city=slug)
  useEffect(() => {
    if (!routerLocation?.search) return;

    try {
      const params = new URLSearchParams(routerLocation.search);
      const locationParam = params.get('location') || params.get('city');

      if (locationParam) {
        const matched = getLocationBySlug(locationParam);
        if (matched && matched.slug !== selectedLocation?.slug) {
          setSelectedLocationState(matched);
          safeSetItem(STORAGE_SELECTED_KEY, matched.slug);
        }
      }
    } catch (e) {
      console.warn('Error reading location query param:', e);
    }
  }, [routerLocation.search, selectedLocation?.slug]);

  // 5. Select Location Handler
  const selectLocation = useCallback((locOrSlug) => {
    const loc = typeof locOrSlug === 'string' ? getLocationBySlug(locOrSlug) : locOrSlug;
    const finalLoc = loc || ALL_INDIA_LOCATION;

    setSelectedLocationState(finalLoc);
    safeSetItem(STORAGE_SELECTED_KEY, finalLoc.slug);

    // Update recent locations (only for real cities, not All India)
    if (finalLoc.slug && finalLoc.slug !== 'all-india') {
      setRecentLocations(prev => {
        const filtered = prev.filter(item => {
          const itemSlug = typeof item === 'string' ? item : item?.slug;
          return itemSlug?.toLowerCase() !== finalLoc.slug.toLowerCase();
        });
        const updated = [finalLoc, ...filtered].slice(0, MAX_RECENT_LOCATIONS);
        safeSetItem(STORAGE_RECENT_KEY, updated.map(u => u.slug));
        return updated;
      });
    }

    setIsLocationModalOpen(false);
  }, []);

  // 6. Clear Recent Locations
  const clearRecentLocations = useCallback(() => {
    setRecentLocations([]);
    safeSetItem(STORAGE_RECENT_KEY, []);
  }, []);

  const openLocationSelector = useCallback(() => {
    setIsLocationModalOpen(true);
  }, []);

  const closeLocationSelector = useCallback(() => {
    setIsLocationModalOpen(false);
  }, []);

  // Check if current location is All India
  const isAllIndia = useMemo(() => {
    return !selectedLocation || selectedLocation.isAllIndia || selectedLocation.slug === 'all-india';
  }, [selectedLocation]);

  // Pre-computed popular locations
  const popularLocations = useMemo(() => getPopularLocations(), []);

  // Pre-computed all states
  const allStates = useMemo(() => getAllStates(), []);

  // Context value
  const value = useMemo(() => ({
    selectedLocation,
    selectLocation,
    setSelectedLocation: selectLocation,
    isAllIndia,
    recentLocations,
    clearRecentLocations,
    isLocationModalOpen,
    setIsLocationModalOpen,
    openLocationSelector,
    closeLocationSelector,
    popularLocations,
    allStates,
    getAllCities,
    getCitiesByState,
    searchLocations,
    getCityDisplayName,
    getFormattedLocation,
    isProductAvailable: (product) => isProductAvailableInLocation(product, selectedLocation)
  }), [
    selectedLocation,
    selectLocation,
    isAllIndia,
    recentLocations,
    clearRecentLocations,
    isLocationModalOpen,
    openLocationSelector,
    closeLocationSelector,
    popularLocations,
    allStates
  ]);

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

/**
 * Custom hook to access LocationContext
 */
export function useAppLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    return {
      selectedLocation: ALL_INDIA_LOCATION,
      selectLocation: () => {},
      setSelectedLocation: () => {},
      isAllIndia: true,
      recentLocations: [],
      clearRecentLocations: () => {},
      isLocationModalOpen: false,
      setIsLocationModalOpen: () => {},
      openLocationSelector: () => {},
      closeLocationSelector: () => {},
      popularLocations: getPopularLocations(),
      allStates: getAllStates(),
      getAllCities,
      getCitiesByState,
      searchLocations,
      getCityDisplayName,
      getFormattedLocation,
      isProductAvailable: () => true
    };
  }
  return context;
}

export const useLocationContext = useAppLocation;
