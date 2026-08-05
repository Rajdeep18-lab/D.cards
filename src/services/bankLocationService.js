/**
 * Real-time Bank Location Service using Geolocation API, Overpass API, and OpenStreetMap Nominatim
 * STRICTLY 100% LIVE REAL DATA - NO MOCK / FALLBACK DATA GENERATED.
 */

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
];

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache
const memoryCache = new Map();
const nominatimCache = new Map();

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) return 0;
  const R = 6371; // Earth's radius in km
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
export function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

/**
 * Get current coordinates from Browser Geolocation API
 */
export function getUserPosition(timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    let isSettled = false;
    const timer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        const err = new Error('Location request timed out. Please search for your city manually.');
        err.code = 3;
        reject(err);
      }
    }, timeoutMs);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        }
      },
      (error) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          let msg = 'Unable to retrieve your location.';
          if (error.code === error.PERMISSION_DENIED) {
            msg = 'Location permission denied. Please allow location access or search for a city.';
          } else if (error.code === error.TIMEOUT) {
            msg = 'Location request timed out. Please search for your city manually.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = 'Location information is unavailable. Please search for a city manually.';
          }
          const err = new Error(msg);
          err.code = error.code;
          reject(err);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge: 180000 // 3 minutes cache
      }
    );
  });
}

/**
 * Reverse Geocode coordinates via Nominatim to obtain full real address if OSM tags lack full street details
 */
export async function reverseGeocodeNominatim(lat, lng) {
  const cacheKey = `${lat.toFixed(5)}_${lng.toFixed(5)}`;
  if (nominatimCache.has(cacheKey)) {
    return nominatimCache.get(cacheKey);
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en',
        'User-Agent': 'CardsApp/1.0 (BankBranchFinder)'
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.display_name) {
        nominatimCache.set(cacheKey, data.display_name);
        return data.display_name;
      }
    }
  } catch (e) {
    console.warn('Nominatim reverse geocode error:', e);
  }
  return null;
}

/**
 * Search city coordinates using Nominatim API
 */
export async function searchCityCoordinates(query, signal = null) {
  if (!query || !query.trim()) {
    throw new Error('Please enter a city or location name.');
  }

  const cleanQuery = query.trim();
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery)}&limit=1`;

  let response;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);
    const combinedSignal = signal ? AbortSignal.any([signal, controller.signal]) : controller.signal;

    response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en',
        'User-Agent': 'CardsApp/1.0 (BankBranchFinder)'
      },
      signal: combinedSignal
    });
    clearTimeout(timeoutId);
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Location search timed out. Please try again.');
    }
    throw new Error('Network error searching location. Please check your connection.');
  }

  if (!response.ok) {
    throw new Error('Geocoding service temporarily unavailable.');
  }

  let results;
  try {
    results = await response.json();
  } catch (e) {
    throw new Error('Invalid response from geocoding service.');
  }

  if (!results || results.length === 0) {
    throw new Error(`Location "${cleanQuery}" not found. Try searching with city name or postal code.`);
  }

  const item = results[0];
  return {
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    displayName: item.display_name
  };
}

/**
 * Generates spatial cache key
 */
function getCacheKey(lat, lng, radius) {
  const gridLat = lat.toFixed(3);
  const gridLng = lng.toFixed(3);
  return `real_bank_cache_${gridLat}_${gridLng}_r${radius}`;
}

/**
 * Fetches REAL nearby bank branches from Overpass API
 * NEVER GENERATES MOCK OR FALLBACK DATA.
 */
export async function fetchNearbyBankBranches(lat, lng, radius = 5000, externalSignal = null) {
  const cacheKey = getCacheKey(lat, lng, radius);
  const now = Date.now();

  // 1. Check Memory Cache
  if (memoryCache.has(cacheKey)) {
    const cached = memoryCache.get(cacheKey);
    if (now - cached.timestamp < CACHE_TTL_MS) {
      return sortAndEnrichBranches(cached.data, lat, lng).slice(0, 10);
    }
  }

  // 2. Check SessionStorage Cache
  try {
    const item = sessionStorage.getItem(cacheKey);
    if (item) {
      const parsed = JSON.parse(item);
      if (now - parsed.timestamp < CACHE_TTL_MS) {
        memoryCache.set(cacheKey, parsed);
        return sortAndEnrichBranches(parsed.data, lat, lng).slice(0, 10);
      }
    }
  } catch (e) {
    // Ignore storage errors
  }

  // 3. Overpass QL Query for real bank nodes & ways
  const query = `
    [out:json][timeout:20];
    (
      node["amenity"="bank"](around:${radius},${lat},${lng});
      way["amenity"="bank"](around:${radius},${lat},${lng});
      node["building"="bank"](around:${radius},${lat},${lng});
      way["building"="bank"](around:${radius},${lat},${lng});
    );
    out body center;
  `;

  let rawData = null;

  // Try endpoints in sequence
  for (const endpoint of OVERPASS_ENDPOINTS) {
    if (externalSignal?.aborted) {
      const abortErr = new Error('Request aborted');
      abortErr.name = 'AbortError';
      throw abortErr;
    }

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutMs = 5000;
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        const combinedSignal = externalSignal
          ? AbortSignal.any([externalSignal, controller.signal])
          : controller.signal;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          body: `data=${encodeURIComponent(query)}`,
          signal: combinedSignal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          rawData = await response.json();
          if (rawData && Array.isArray(rawData.elements) && rawData.elements.length > 0) {
            break;
          }
        } else if (response.status === 429 || response.status === 504 || response.status === 503) {
          await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
        }
      } catch (err) {
        if (err.name === 'AbortError' && externalSignal?.aborted) {
          throw err;
        }
      }
    }

    if (rawData && Array.isArray(rawData.elements) && rawData.elements.length > 0) {
      break;
    }
  }

  // If initial 5km radius returned 0 elements, expand search once to 10km
  if ((!rawData || !rawData.elements || rawData.elements.length === 0) && radius < 10000) {
    return await fetchNearbyBankBranches(lat, lng, 10000, externalSignal);
  }

  // If still no raw elements, return empty array (STRICTLY NO MOCK DATA)
  if (!rawData || !rawData.elements || rawData.elements.length === 0) {
    return [];
  }

  // 4. Process real OSM elements
  let branches = normalizeOverpassElements(rawData.elements, lat, lng);

  // Sort by distance and select top 10
  branches = sortAndEnrichBranches(branches, lat, lng).slice(0, 10);

  // 5. Enrich addresses with Nominatim Reverse Geocoding where OSM tags lack street details
  const enrichedBranches = await Promise.all(
    branches.map(async (b) => {
      if (b.isAddressIncomplete) {
        const fullAddress = await reverseGeocodeNominatim(b.lat, b.lng);
        if (fullAddress) {
          return {
            ...b,
            address: fullAddress,
            isAddressIncomplete: false
          };
        }
      }
      return b;
    })
  );

  // Cache final real results
  const cacheObj = { timestamp: now, data: enrichedBranches };
  memoryCache.set(cacheKey, cacheObj);
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(cacheObj));
  } catch (e) {
    // Ignore storage quota error
  }

  return enrichedBranches;
}

/**
 * Normalizes raw Overpass elements into clean real bank branch objects
 */
function normalizeOverpassElements(elements, userLat, userLng) {
  const branches = [];
  const seenKeys = new Set();

  for (const el of elements) {
    const tags = el.tags || {};

    let bLat = el.lat;
    let bLng = el.lon;

    if (bLat === undefined || bLng === undefined) {
      if (el.center) {
        bLat = el.center.lat;
        bLng = el.center.lon;
      }
    }

    if (bLat === undefined || bLng === undefined) continue;

    // Deduplicate by coordinates (4 decimal places ~ 11 meters precision)
    const uniqueKey = `${bLat.toFixed(4)}_${bLng.toFixed(4)}`;
    if (seenKeys.has(uniqueKey)) continue;
    seenKeys.add(uniqueKey);

    // Extract real bank name
    const rawName = tags.name || tags['name:en'] || tags.operator || tags.brand || tags.official_name;
    const bankName = rawName ? rawName.trim() : 'Bank Branch';
    const branchName = tags.branch || tags['branch:en'] || tags.ref || null;

    // Construct address from available tags
    const addressParts = [];
    if (tags['addr:housenumber']) addressParts.push(tags['addr:housenumber']);
    if (tags['addr:street']) addressParts.push(tags['addr:street']);
    if (tags['addr:suburb'] || tags['addr:neighbourhood']) addressParts.push(tags['addr:suburb'] || tags['addr:neighbourhood']);
    if (tags['addr:city'] || tags['addr:district']) addressParts.push(tags['addr:city'] || tags['addr:district']);
    if (tags['addr:postcode']) addressParts.push(tags['addr:postcode']);

    let address = addressParts.join(', ');
    let isAddressIncomplete = false;

    if (!address) {
      if (tags['addr:full']) {
        address = tags['addr:full'];
      } else {
        // Mark for reverse geocoding via Nominatim
        address = `${bLat.toFixed(5)}, ${bLng.toFixed(5)}`;
        isAddressIncomplete = true;
      }
    }

    const distanceKm = calculateDistance(userLat, userLng, bLat, bLng);

    branches.push({
      id: `osm_${el.type}_${el.id}`,
      name: bankName,
      branchName: branchName,
      address: address,
      isAddressIncomplete: isAddressIncomplete,
      lat: bLat,
      lng: bLng,
      distanceKm: distanceKm,
      distanceFormatted: formatDistance(distanceKm),
      brand: tags.brand || tags.operator || bankName,
      openingHours: tags.opening_hours || null,
      phone: tags.phone || tags['contact:phone'] || null,
      website: tags.website || tags['contact:website'] || null,
      googleMapsUrl: `https://www.google.com/maps?q=${bLat},${bLng}`,
      directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${bLat},${bLng}`
    });
  }

  return branches;
}

/**
 * Re-sorts branches and updates distance formatted & URLs
 */
function sortAndEnrichBranches(branches, userLat, userLng) {
  return branches
    .map((branch) => {
      const distanceKm = calculateDistance(userLat, userLng, branch.lat, branch.lng);
      return {
        ...branch,
        distanceKm: distanceKm,
        distanceFormatted: formatDistance(distanceKm),
        googleMapsUrl: `https://www.google.com/maps?q=${branch.lat},${branch.lng}`,
        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
