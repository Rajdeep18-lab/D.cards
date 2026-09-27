/**
 * D.CARD Server-side Bank & Branch Data Service
 * 
 * Provides server-side data querying, validation, filtering, distance calculation,
 * pagination, rate limiting, and caching for /api/banks and /api/banks/nearby.
 * 
 * Database: Firebase Firestore (collection: "bank_branches")
 * Fallback: Verified local dataset during migration phase
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { BANK_BRANCHES } from '../src/data/bankBranchesData.js';

// Firebase Client initialization for serverless execution
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDkj6E9tWCOdzwTXffN1jo13G75liEHt-c",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "d-card-71933.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "d-card-71933",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "d-card-71933.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "672659614467",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:672659614467:web:1cf5f786d03118a27bd736"
};

let db = null;
try {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
} catch (err) {
  console.warn('[BankService] Firestore initialization warning:', err.message);
}

// -------------------------------------------------------------
// Rate Limiting (Lightweight in-memory IP tracker)
// -------------------------------------------------------------
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests/min per IP

export function checkRateLimit(clientIp) {
  if (!clientIp) return { limited: false };
  const now = Date.now();
  const timestamps = (rateLimitMap.get(clientIp) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return { limited: true, retryAfterSec: Math.ceil((timestamps[0] + RATE_LIMIT_WINDOW_MS - now) / 1000) };
  }
  
  timestamps.push(now);
  rateLimitMap.set(clientIp, timestamps);
  return { limited: false };
}

// -------------------------------------------------------------
// Lightweight In-Memory Response Caching
// -------------------------------------------------------------
const cacheStore = new Map();
const DEFAULT_CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

function getCached(key) {
  const item = cacheStore.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    cacheStore.delete(key);
    return null;
  }
  return item.data;
}

function setCached(key, data, ttlMs = DEFAULT_CACHE_TTL_MS) {
  cacheStore.set(key, {
    data,
    expiresAt: Date.now() + ttlMs
  });
}

// -------------------------------------------------------------
// Haversine Distance Calculation (Server-side)
// -------------------------------------------------------------
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return 0;
  const R = 6371; // Earth's mean radius in km
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

// -------------------------------------------------------------
// Database Loader with Migration Fallback
// -------------------------------------------------------------
let cachedAllRecords = null;
let lastAllFetch = 0;
const DB_RECORDS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchAllVerifiedRecords() {
  const now = Date.now();
  if (cachedAllRecords && (now - lastAllFetch < DB_RECORDS_CACHE_TTL)) {
    return cachedAllRecords;
  }

  // Attempt to load from Firestore collection "bank_branches"
  if (db) {
    try {
      const snap = await getDocs(collection(db, 'bank_branches'));
      if (!snap.empty) {
        const firestoreList = snap.docs.map(docSnap => ({
          ...docSnap.data(),
          id: docSnap.id
        }));

        if (firestoreList.length > 0) {
          cachedAllRecords = firestoreList;
          lastAllFetch = now;
          return firestoreList;
        }
      }
    } catch (err) {
      // Graceful fallback during migration or if Firestore permissions are admin-only
      console.warn('[BankService] Firestore read notice, using verified local dataset:', err.message);
    }
  }

  // MIGRATION FALLBACK — REMOVE AFTER API STABILITY VERIFICATION
  cachedAllRecords = BANK_BRANCHES;
  lastAllFetch = now;
  return BANK_BRANCHES;
}

// -------------------------------------------------------------
// Parameter Validation & Normalization
// -------------------------------------------------------------
export function normalizeBankName(name) {
  const s = String(name || '').toLowerCase().trim();
  if (s.includes('state bank') || s === 'sbi') return 'State Bank of India';
  if (s.includes('hdfc')) return 'HDFC Bank';
  if (s.includes('icici')) return 'ICICI Bank';
  if (s.includes('axis')) return 'Axis Bank';
  if (s.includes('kotak')) return 'Kotak Mahindra Bank';
  if (s.includes('indusind')) return 'IndusInd Bank';
  if (s.includes('federal')) return 'Federal Bank';
  if (s.includes('idfc')) return 'IDFC FIRST Bank';
  if (s.includes('punjab national') || s.includes('pnb')) return 'Punjab National Bank';
  if (s.includes('baroda') || s === 'bob') return 'Bank of Baroda';
  if (s.includes('canara')) return 'Canara Bank';
  if (s.includes('union bank')) return 'Union Bank of India';
  if (s.includes('central bank')) return 'Central Bank of India';
  if (s === 'boi' || (s.includes('bank of india') && !s.includes('central') && !s.includes('state') && !s.includes('union'))) return 'Bank of India';
  if (s.includes('indian bank') && !s.includes('overseas')) return 'Indian Bank';
  if (s.includes('uco')) return 'UCO Bank';
  if (s.includes('punjab & sind') || s.includes('punjab and sind') || s === 'psb') return 'Punjab & Sind Bank';
  if (s.includes('yes bank')) return 'Yes Bank';
  if (s.includes('au small') || s.includes('au bank')) return 'AU Small Finance Bank';
  if (s.includes('rbl')) return 'RBL Bank';
  if (s.includes('idbi')) return 'IDBI Bank';
  return name;
}

/**
 * Checks if two bank names refer to the same bank without false-positive substring merges
 */
export function isSameBank(bankA, bankB) {
  if (!bankA || !bankB) return false;
  const normA = normalizeBankName(bankA).toLowerCase().trim();
  const normB = normalizeBankName(bankB).toLowerCase().trim();
  if (normA === normB) return true;
  
  const indiaBanks = ['state bank of india', 'bank of india', 'central bank of india', 'union bank of india', 'indian bank'];
  if (indiaBanks.includes(normA) || indiaBanks.includes(normB)) {
    return normA === normB;
  }
  
  return normA.includes(normB) || normB.includes(normA);
}

export function sanitizePagination(queryPage, queryLimit) {
  let page = parseInt(queryPage, 10);
  if (isNaN(page) || page < 1) page = 1;

  let limit = parseInt(queryLimit, 10);
  if (isNaN(limit) || limit < 1) limit = 20;
  if (limit > 50) limit = 50; // Strict upper bound: never allow client limit > 50

  return { page, limit };
}

// -------------------------------------------------------------
// 1. GET /api/banks — Filtered & Paginated Branch Directory
// -------------------------------------------------------------
export async function getBranches({
  bank,
  city,
  state,
  pincode,
  type = 'All',
  page = 1,
  limit = 20
} = {}) {
  const { page: safePage, limit: safeLimit } = sanitizePagination(page, limit);
  const cacheKey = `branches_${bank || ''}_${city || ''}_${state || ''}_${pincode || ''}_${type}_${safePage}_${safeLimit}`;
  
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const allRecords = await fetchAllVerifiedRecords();
  let filtered = allRecords;

  // Filter: Bank (Resilient matching with normalization)
  if (bank && bank !== 'All Banks') {
    filtered = filtered.filter(b => b.bank_name && isSameBank(bank, b.bank_name));
  }

  // Filter: City
  if (city) {
    const qCity = String(city).toLowerCase().trim();
    filtered = filtered.filter(b => 
      b.city && b.city.toLowerCase().includes(qCity)
    );
  }

  // Filter: State
  if (state) {
    const qState = String(state).toLowerCase().trim();
    filtered = filtered.filter(b => 
      b.state && b.state.toLowerCase().includes(qState)
    );
  }

  // Filter: PIN Code
  if (pincode) {
    const qPin = String(pincode).trim();
    filtered = filtered.filter(b => b.pincode === qPin);
  }

  // Filter: Type ('Branch' | 'ATM')
  if (type && type !== 'All') {
    const qType = String(type).toLowerCase().trim();
    if (qType === 'atm') {
      filtered = filtered.filter(b => 
        (b.branch_type && b.branch_type.toLowerCase() === 'atm') ||
        (Array.isArray(b.services) && b.services.some(s => s.toLowerCase().includes('atm')))
      );
    } else {
      filtered = filtered.filter(b => 
        b.branch_type && b.branch_type.toLowerCase() === qType
      );
    }
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / safeLimit) || 1;
  const offset = (safePage - 1) * safeLimit;
  const paginatedData = filtered.slice(offset, offset + safeLimit);

  const response = {
    success: true,
    data: paginatedData,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
      hasNext: safePage < totalPages,
      hasPrev: safePage > 1
    },
    meta: {
      dataSource: db ? 'firebase_firestore_or_verified_baseline' : 'verified_baseline',
      timestamp: new Date().toISOString()
    }
  };

  setCached(cacheKey, response);
  return response;
}

// -------------------------------------------------------------
// 2. GET /api/banks/nearby — Radius & Nearest-First Geo Query
// -------------------------------------------------------------
export async function getNearbyBranches({
  lat,
  lng,
  radiusKm = 10,
  bank = 'All Banks',
  type = 'All',
  page = 1,
  limit = 50
} = {}) {
  // Validate coordinates
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new Error('Invalid coordinates: "lat" must be between -90 and 90, "lng" between -180 and 180.');
  }

  // Validate radius
  let radius = parseFloat(radiusKm);
  if (isNaN(radius) || radius <= 0) {
    radius = 10;
  }
  if (radius > 50) {
    radius = 50; // Cap to maximum 50 km
  }

  const { page: safePage, limit: safeLimit } = sanitizePagination(page, limit);
  const cacheKey = `nearby_${latitude.toFixed(3)}_${longitude.toFixed(3)}_${radius}_${bank}_${type}_${safePage}_${safeLimit}`;

  const cached = getCached(cacheKey);
  if (cached) return cached;

  const allRecords = await fetchAllVerifiedRecords();
  const matched = [];
  const qBank = bank && bank !== 'All Banks' ? String(bank).toLowerCase().trim() : null;
  const qType = type && type !== 'All' ? String(type).toLowerCase().trim() : null;

  for (const branch of allRecords) {
    // Bank check
    if (qBank && !isSameBank(qBank, branch.bank_name)) {
      continue;
    }

    // Type check
    if (qType) {
      const isAtm = qType === 'atm';
      const matchesType = (branch.branch_type && branch.branch_type.toLowerCase() === qType) ||
        (isAtm && Array.isArray(branch.services) && branch.services.some(s => String(s).toLowerCase().includes('atm')));
      if (!matchesType) {
        continue;
      }
    }

    // Distance calculation
    const distanceKm = calculateDistanceKm(latitude, longitude, branch.latitude, branch.longitude);

    if (distanceKm <= radius) {
      matched.push({
        ...branch,
        distanceKm: parseFloat(distanceKm.toFixed(2)),
        distanceFormatted: distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m away` : `${distanceKm.toFixed(1)} km away`,
        googleMapsUrl: `https://www.google.com/maps?q=${branch.latitude},${branch.longitude}`,
        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`
      });
    }
  }

  // Strict Nearest-First Sorting
  matched.sort((a, b) => a.distanceKm - b.distanceKm);

  const total = matched.length;
  const totalPages = Math.ceil(total / safeLimit) || 1;
  const offset = (safePage - 1) * safeLimit;
  const paginatedData = matched.slice(offset, offset + safeLimit);

  const response = {
    success: true,
    data: paginatedData,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
      hasNext: safePage < totalPages,
      hasPrev: safePage > 1
    },
    query: {
      latitude,
      longitude,
      radiusKm: radius,
      bank: bank || 'All Banks',
      type: type || 'All'
    },
    meta: {
      dataSource: 'verified_dataset_api',
      timestamp: new Date().toISOString()
    }
  };

  setCached(cacheKey, response);
  return response;
}

// -------------------------------------------------------------
// 3. GET /api/banks/:id — Branch Details by ID
// -------------------------------------------------------------
export async function getBranchById(id) {
  if (!id || typeof id !== 'string') {
    throw new Error('Branch ID is required.');
  }

  const cleanId = String(id).trim().toLowerCase();
  const cacheKey = `branch_id_${cleanId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const allRecords = await fetchAllVerifiedRecords();
  const found = allRecords.find(b => String(b.id).trim().toLowerCase() === cleanId);

  if (!found) {
    return null;
  }

  const result = {
    success: true,
    data: found
  };

  setCached(cacheKey, result);
  return result;
}

// -------------------------------------------------------------
// 4. GET /api/banks/meta — Metadata (Banks list, Cities, Counts)
// -------------------------------------------------------------
export async function getBankMetadata() {
  const cacheKey = 'banks_metadata';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const allRecords = await fetchAllVerifiedRecords();
  const bankSet = new Set();
  const citySet = new Set();
  const stateSet = new Set();
  let branchCount = 0;
  let atmCount = 0;

  for (const b of allRecords) {
    if (b.bank_name) bankSet.add(b.bank_name.trim());
    if (b.city) citySet.add(b.city.trim());
    if (b.state) stateSet.add(b.state.trim());
    if (b.branch_type === 'ATM') {
      atmCount++;
    } else {
      branchCount++;
    }
  }

  const meta = {
    success: true,
    totalRecords: allRecords.length,
    branchCount,
    atmCount,
    uniqueBanks: Array.from(bankSet).sort(),
    uniqueCities: Array.from(citySet).sort(),
    uniqueStates: Array.from(stateSet).sort()
  };

  setCached(cacheKey, meta, 10 * 60 * 1000); // 10 minutes cache
  return meta;
}
