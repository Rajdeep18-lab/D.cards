/**
 * ==============================================================================
 * D.CARD - BRANCH FINDER UTILITIES & DISTANCE CALCULATION
 * ==============================================================================
 * Comprehensive geographic distance calculations (Haversine formula),
 * bank filtering, proximity sorting, search filtering, and direction routing.
 * ==============================================================================
 */

import { BRANCHES, getBranchByIFSC as lookupByIFSC } from '../data/branches.js';
import { getBankById, normalizeBankId } from '../data/banks.js';
import { getLocationBySlug } from '../data/locations.js';

const EARTH_RADIUS_KM = 6371;

/**
 * Calculate great-circle distance between two geographic coordinates using the Haversine formula
 * @param {number} lat1 Latitude of point 1 (in degrees)
 * @param {number} lon1 Longitude of point 1 (in degrees)
 * @param {number} lat2 Latitude of point 2 (in degrees)
 * @param {number} lon2 Longitude of point 2 (in degrees)
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (
    typeof lat1 !== 'number' ||
    typeof lon1 !== 'number' ||
    typeof lat2 !== 'number' ||
    typeof lon2 !== 'number' ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return Infinity;
  }

  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  // Round to 2 decimal places for precision stability
  return Math.round(distance * 100) / 100;
}

/**
 * Format distance in kilometers for display
 * e.g., 0.8 km, 2.1 km, 15.0 km
 * @param {number} distanceKm 
 * @returns {string}
 */
export function formatDistance(distanceKm) {
  if (typeof distanceKm !== 'number' || !isFinite(distanceKm)) return '';
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Sort branches ascending by their calculated distance
 * @param {Array<Object>} branches 
 * @returns {Array<Object>}
 */
export function sortBranchesByDistance(branches) {
  if (!Array.isArray(branches)) return [];
  return [...branches].sort((a, b) => {
    const distA = typeof a.distance === 'number' ? a.distance : Infinity;
    const distB = typeof b.distance === 'number' ? b.distance : Infinity;
    return distA - distB;
  });
}

/**
 * Find verified branches near a user's GPS coordinates.
 * Performance optimized:
 * 1. Filter bankId first
 * 2. Filter valid coordinates
 * 3. Calculate distance
 * 4. Filter radius
 * 5. Sort nearest first
 *
 * @param {number} userLat Latitude of user
 * @param {number} userLng Longitude of user
 * @param {string} [bankId] Target bank identifier (e.g. 'sbi', 'hdfc')
 * @param {number} [radiusKm=5] Radius limit in kilometers
 * @param {Object} [options] Additional options
 * @returns {Array<Object>}
 */
export function getNearbyBranches(userLat, userLng, bankId, radiusKm = 5, options = {}) {
  const dataset = Array.isArray(options.dataset) ? options.dataset : BRANCHES;

  if (typeof userLat !== 'number' || typeof userLng !== 'number') {
    return [];
  }

  const normalizedBank = bankId ? normalizeBankId(bankId) || String(bankId).toLowerCase() : null;
  const radius = Number(radiusKm) || 5;

  const results = [];

  for (let i = 0; i < dataset.length; i++) {
    const branch = dataset[i];

    // 1. Filter bankId first
    if (normalizedBank && branch.bankId !== normalizedBank) {
      continue;
    }

    // 2. Filter valid coordinates
    if (typeof branch.latitude !== 'number' || typeof branch.longitude !== 'number') {
      continue;
    }

    // 3. Calculate distance
    const dist = calculateDistance(userLat, userLng, branch.latitude, branch.longitude);

    // 4. Filter radius
    if (dist <= radius) {
      results.push({
        ...branch,
        distance: dist,
        distanceText: formatDistance(dist),
        isNearest: false
      });
    }
  }

  // 5. Sort nearest first
  const sorted = sortBranchesByDistance(results);

  // Mark the nearest branch
  if (sorted.length > 0) {
    sorted[0].isNearest = true;
  }

  return sorted;
}

/**
 * Filter branches in manual city context (where exact GPS user distance is not available).
 * Avoids fabricating false exact user distance.
 *
 * @param {string} citySlugOrName City slug or city name
 * @param {string} [bankId] Target bank identifier
 * @param {Object} [options]
 * @returns {Array<Object>}
 */
export function getBranchesByCity(citySlugOrName, bankId, options = {}) {
  const dataset = Array.isArray(options.dataset) ? options.dataset : BRANCHES;
  if (!citySlugOrName) return [];

  const locationObj = getLocationBySlug(citySlugOrName);
  const canonicalCity = locationObj ? locationObj.name.toLowerCase() : String(citySlugOrName).trim().toLowerCase();
  const stateCode = locationObj?.stateCode?.toLowerCase();
  const stateName = locationObj?.state?.toLowerCase();

  const normalizedBank = bankId ? normalizeBankId(bankId) || String(bankId).toLowerCase() : null;

  return dataset.filter(branch => {
    if (normalizedBank && branch.bankId !== normalizedBank) {
      return false;
    }
    const branchCity = String(branch.city || '').toLowerCase();
    const branchState = String(branch.state || '').toLowerCase();

    // Match city name
    if (branchCity === canonicalCity || branchCity.includes(canonicalCity) || canonicalCity.includes(branchCity)) {
      return true;
    }

    // Check alias match if location object exists
    if (locationObj?.aliases?.some(a => a.toLowerCase() === branchCity)) {
      return true;
    }

    // If city is small or a satellite town, also match state context if explicitly requested
    return false;
  });
}

/**
 * Search branches by query across branch name, area/locality, PIN code, and IFSC.
 * Supports both signatures:
 *   searchBranches(query, options)
 *   searchBranches(branchesArray, query)
 *
 * @param {string|Array<Object>} queryOrBranches 
 * @param {string|Object} [optionsOrQuery] 
 * @returns {Array<Object>}
 */
export function searchBranches(queryOrBranches, optionsOrQuery) {
  let branchesToSearch = BRANCHES;
  let queryString = '';

  if (Array.isArray(queryOrBranches)) {
    branchesToSearch = queryOrBranches;
    queryString = typeof optionsOrQuery === 'string' ? optionsOrQuery : '';
  } else if (typeof queryOrBranches === 'string') {
    queryString = queryOrBranches;
    if (optionsOrQuery && Array.isArray(optionsOrQuery.branches)) {
      branchesToSearch = optionsOrQuery.branches;
    }
  }

  const query = String(queryString || '').trim().toLowerCase();
  if (!query) return branchesToSearch;

  return branchesToSearch.filter(branch => {
    const branchName = String(branch.branchName || '').toLowerCase();
    const address = String(branch.address || '').toLowerCase();
    const city = String(branch.city || '').toLowerCase();
    const state = String(branch.state || '').toLowerCase();
    const pincode = String(branch.pincode || '').toLowerCase();
    const ifsc = String(branch.ifsc || '').toLowerCase();
    const bankId = String(branch.bankId || '').toLowerCase();

    return (
      branchName.includes(query) ||
      address.includes(query) ||
      city.includes(query) ||
      state.includes(query) ||
      pincode.includes(query) ||
      ifsc.includes(query) ||
      bankId.includes(query)
    );
  });
}

/**
 * Get branch by official IFSC code
 * @param {string} ifsc 
 * @returns {Object|null}
 */
export function getBranchByIFSC(ifsc) {
  if (!ifsc) return null;
  return lookupByIFSC(ifsc);
}

/**
 * Get count of verified branches for a city and bank
 * @param {string} citySlug City slug
 * @param {string} [bankId] Optional bankId
 * @returns {number}
 */
export function getBranchCount(citySlug, bankId) {
  if (!citySlug) return 0;
  const branches = getBranchesByCity(citySlug, bankId);
  return branches.length;
}

/**
 * Generate Google Maps navigation destination URL for a branch.
 * Uses verified latitude & longitude if present; falls back to verified address.
 * Never invents coordinates.
 *
 * @param {Object} branch 
 * @returns {string}
 */
export function getDirectionsUrl(branch) {
  if (!branch) return 'https://maps.google.com';

  if (
    typeof branch.latitude === 'number' &&
    typeof branch.longitude === 'number' &&
    !isNaN(branch.latitude) &&
    !isNaN(branch.longitude)
  ) {
    return `https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`;
  }

  // Address fallback
  const parts = [branch.branchName, branch.address, branch.city, branch.state, branch.pincode]
    .filter(Boolean)
    .join(', ');

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(parts || 'Bank Branch')}`;
}
