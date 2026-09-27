/**
 * D.CARD Branch Data Provider Abstraction Layer
 * 
 * Scalable data provider interfacing between FindBanksPage / bankBranchService
 * and the server-side API endpoints (/api/banks, /api/banks/nearby).
 * 
 * Architecture:
 *   FindBanksPage -> bankBranchService -> branchDataProvider -> API -> Database
 * 
 * Fallback Strategy:
 *   Tries API endpoint first; if API is unreachable (offline, network error, or static deploy),
 *   gracefully switches to the verified local fallback dataset.
 * 
 * MIGRATION FALLBACK — REMOVE AFTER API STABILITY VERIFICATION
 */

import { BANK_BRANCHES, RADIUS_OPTIONS } from '../data/bankBranchesData.js';
import { validateBranchRecord } from '../utils/branchDataValidator.js';

// Internal memory cache for API responses to avoid repeated network overhead
const clientCache = new Map();
const CLIENT_CACHE_TTL_MS = 60 * 1000; // 1 minute

function getFromClientCache(key) {
  const item = clientCache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    clientCache.delete(key);
    return null;
  }
  return item.data;
}

function setToClientCache(key, data, ttlMs = CLIENT_CACHE_TTL_MS) {
  clientCache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula (Client fallback)
 */
function localHaversine(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return 0;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Formats distance in km or meters
 */
function localFormatDistance(distanceKm) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

/**
 * Asynchronously queries /api/banks with filtering and pagination.
 * Falls back to local verified dataset if API is unavailable.
 * 
 * @param {Object} options Filter and pagination options
 * @returns {Promise<{ success: boolean, data: Array, pagination: Object, source: string }>}
 */
export async function getBranches({
  bank,
  city,
  state,
  pincode,
  type = 'All',
  page = 1,
  limit = 20,
  signal
} = {}) {
  const cacheKey = `client_branches_${bank || ''}_${city || ''}_${state || ''}_${pincode || ''}_${type}_${page}_${limit}`;
  const cached = getFromClientCache(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams();
  if (bank && bank !== 'All Banks') params.set('bank', bank);
  if (city) params.set('city', city);
  if (state) params.set('state', state);
  if (pincode) params.set('pincode', pincode);
  if (type && type !== 'All') params.set('type', type);
  params.set('page', String(page));
  params.set('limit', String(limit));

  try {
    const res = await fetch(`/api/banks?${params.toString()}`, {
      headers: { 'Accept': 'application/json' },
      signal
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data)) {
        const payload = { ...json, source: 'api' };
        setToClientCache(cacheKey, payload);
        return payload;
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    console.info('[branchDataProvider] API unavailable, using local verified fallback:', err.message);
  }

  // MIGRATION FALLBACK — REMOVE AFTER API STABILITY VERIFICATION
  let localFiltered = getAllBranches();

  if (bank && bank !== 'All Banks') {
    const qBank = String(bank).toLowerCase().trim();
    localFiltered = localFiltered.filter(b => 
      b.bank_name && (b.bank_name.toLowerCase().includes(qBank) || qBank.includes(b.bank_name.toLowerCase()))
    );
  }

  if (city) {
    const qCity = String(city).toLowerCase().trim();
    localFiltered = localFiltered.filter(b => b.city && b.city.toLowerCase().includes(qCity));
  }

  if (state) {
    const qState = String(state).toLowerCase().trim();
    localFiltered = localFiltered.filter(b => b.state && b.state.toLowerCase().includes(qState));
  }

  if (pincode) {
    localFiltered = localFiltered.filter(b => b.pincode === String(pincode).trim());
  }

  if (type && type !== 'All') {
    const qType = String(type).toLowerCase().trim();
    localFiltered = localFiltered.filter(b => b.branch_type && b.branch_type.toLowerCase() === qType);
  }

  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
  const total = localFiltered.length;
  const totalPages = Math.ceil(total / safeLimit) || 1;
  const offset = (safePage - 1) * safeLimit;
  const paginated = localFiltered.slice(offset, offset + safeLimit);

  const fallbackPayload = {
    success: true,
    data: paginated,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
      hasNext: safePage < totalPages,
      hasPrev: safePage > 1
    },
    source: 'fallback'
  };

  setToClientCache(cacheKey, fallbackPayload);
  return fallbackPayload;
}

/**
 * Asynchronously queries /api/banks/nearby with radius, coordinates, and filters.
 * Falls back to local Haversine computation if API is unreachable.
 * 
 * @param {Object} options Coordinates, radius, and filters
 * @returns {Promise<{ success: boolean, data: Array, pagination: Object, source: string }>}
 */
export async function getNearbyBranches({
  lat,
  lng,
  radiusKm = 10,
  bank = 'All Banks',
  type = 'All',
  page = 1,
  limit = 50,
  signal
} = {}) {
  if (lat === undefined || lng === undefined || lat === null || lng === null) {
    return { success: true, data: [], pagination: { total: 0, page: 1, limit, totalPages: 1 }, source: 'empty' };
  }

  const cacheKey = `client_nearby_${Number(lat).toFixed(3)}_${Number(lng).toFixed(3)}_${radiusKm}_${bank}_${type}_${page}_${limit}`;
  const cached = getFromClientCache(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radiusKm: String(radiusKm),
    bank: bank || 'All Banks',
    type: type || 'All',
    page: String(page),
    limit: String(limit)
  });

  try {
    const res = await fetch(`/api/banks/nearby?${params.toString()}`, {
      headers: { 'Accept': 'application/json' },
      signal
    });

    if (res.ok) {
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data)) {
        const payload = { ...json, source: 'api' };
        setToClientCache(cacheKey, payload);
        return payload;
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    console.info('[branchDataProvider] Nearby API unavailable, using local Haversine fallback:', err.message);
  }

  // MIGRATION FALLBACK — REMOVE AFTER API STABILITY VERIFICATION
  const allBranches = getAllBranches();
  const qBank = bank && bank !== 'All Banks' ? String(bank).toLowerCase().trim() : null;
  const qType = type && type !== 'All' ? String(type).toLowerCase().trim() : null;
  const matched = [];

  for (const branch of allBranches) {
    if (qBank && (!branch.bank_name || (!branch.bank_name.toLowerCase().includes(qBank) && !qBank.includes(branch.bank_name.toLowerCase())))) {
      continue;
    }
    if (qType && (!branch.branch_type || branch.branch_type.toLowerCase() !== qType)) {
      continue;
    }

    const distanceKm = localHaversine(lat, lng, branch.latitude, branch.longitude);
    if (distanceKm <= radiusKm) {
      matched.push({
        ...branch,
        distanceKm: parseFloat(distanceKm.toFixed(2)),
        distanceFormatted: localFormatDistance(distanceKm),
        googleMapsUrl: `https://www.google.com/maps?q=${branch.latitude},${branch.longitude}`,
        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`
      });
    }
  }

  matched.sort((a, b) => a.distanceKm - b.distanceKm);

  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 50));
  const total = matched.length;
  const totalPages = Math.ceil(total / safeLimit) || 1;
  const offset = (safePage - 1) * safeLimit;
  const paginated = matched.slice(offset, offset + safeLimit);

  const fallbackPayload = {
    success: true,
    data: paginated,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
      hasNext: safePage < totalPages,
      hasPrev: safePage > 1
    },
    source: 'fallback'
  };

  setToClientCache(cacheKey, fallbackPayload);
  return fallbackPayload;
}

/**
 * Fetches single branch details by ID from API or local fallback
 */
export async function getBranchById(id, { signal } = {}) {
  if (!id) return null;
  const cacheKey = `client_branch_id_${String(id).trim().toLowerCase()}`;
  const cached = getFromClientCache(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(`/api/banks/${encodeURIComponent(id)}`, {
      headers: { 'Accept': 'application/json' },
      signal
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        const payload = { success: true, data: json.data, source: 'api' };
        setToClientCache(cacheKey, payload);
        return payload;
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') throw err;
  }

  // MIGRATION FALLBACK — REMOVE AFTER API STABILITY VERIFICATION
  const all = getAllBranches();
  const found = all.find(b => String(b.id).trim().toLowerCase() === String(id).trim().toLowerCase());
  if (found) {
    const payload = { success: true, data: found, source: 'fallback' };
    setToClientCache(cacheKey, payload);
    return payload;
  }

  return null;
}

/**
 * Returns all verified branch and ATM records from the data store.
 * Applies internal validation to guarantee data integrity.
 * @returns {Array<Object>} List of valid branch records
 */
export function getAllBranches() {
  return BANK_BRANCHES.filter((branch) => {
    const validation = validateBranchRecord(branch);
    return validation.isValid;
  });
}

/**
 * Returns supported search radius options in kilometers.
 * @returns {Array<number>}
 */
export function getSupportedRadiusOptions() {
  return [...RADIUS_OPTIONS];
}

/**
 * Returns an array of verified unique bank names present in the dataset.
 * @returns {Array<string>} Sorted canonical bank names
 */
export function getUniqueBankNames() {
  const bankSet = new Set();
  for (const b of BANK_BRANCHES) {
    if (b.bank_name && typeof b.bank_name === 'string') {
      bankSet.add(b.bank_name.trim());
    }
  }
  return Array.from(bankSet).sort();
}

/**
 * Returns an index of verified known locations (cities, postal codes, and regions)
 * present in the data store for fast deterministic autocompletion.
 * @returns {Array<{ type: string, name: string, state: string, pincode?: string, lat: number, lng: number }>}
 */
export function getKnownLocationsIndex() {
  const cityMap = new Map();
  const pincodeMap = new Map();

  for (const b of BANK_BRANCHES) {
    if (b.city && b.state && typeof b.latitude === 'number' && typeof b.longitude === 'number') {
      const cityKey = `${b.city.toLowerCase()}_${b.state.toLowerCase()}`;
      if (!cityMap.has(cityKey)) {
        cityMap.set(cityKey, {
          type: 'city',
          name: b.city,
          state: b.state,
          lat: b.latitude,
          lng: b.longitude,
          samplePincode: b.pincode
        });
      }
    }

    if (b.pincode && typeof b.latitude === 'number' && typeof b.longitude === 'number') {
      if (!pincodeMap.has(b.pincode)) {
        pincodeMap.set(b.pincode, {
          type: 'pincode',
          name: b.pincode,
          city: b.city,
          state: b.state,
          lat: b.latitude,
          lng: b.longitude
        });
      }
    }
  }

  // Common regional banking hubs in India
  const standardHubs = [
    { type: 'city', name: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794, samplePincode: '160017' },
    { type: 'city', name: 'New Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, samplePincode: '110001' },
    { type: 'city', name: 'Mumbai', state: 'Maharashtra', lat: 18.9322, lng: 72.8335, samplePincode: '400001' },
    { type: 'city', name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, samplePincode: '560001' },
    { type: 'city', name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, samplePincode: '500001' },
    { type: 'city', name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, samplePincode: '600002' },
    { type: 'city', name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, samplePincode: '700001' },
    { type: 'city', name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, samplePincode: '411001' },
    { type: 'city', name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, samplePincode: '380009' },
    { type: 'city', name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, samplePincode: '302001' },
    { type: 'city', name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, samplePincode: '226001' }
  ];

  const merged = Array.from(cityMap.values());
  for (const hub of standardHubs) {
    const key = `${hub.name.toLowerCase()}_${hub.state.toLowerCase()}`;
    if (!cityMap.has(key)) {
      merged.push(hub);
    }
  }

  return {
    cities: merged,
    pincodes: Array.from(pincodeMap.values())
  };
}
