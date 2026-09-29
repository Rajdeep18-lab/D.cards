import { 
  getAllBranches, 
  getUniqueBankNames, 
  getNearbyBranches as getNearbyBranchesFromProvider,
  getBranches as getBranchesFromProvider,
  getBranchById as getBranchByIdFromProvider,
  getSupportedRadiusOptions
} from './branchDataProvider.js';
import { validateBranchRecord } from '../utils/branchDataValidator.js';
import { BRANCHES } from '../data/branches.js';
export { parseSmartSearchQuery } from '../utils/smartSearchParser.js';
export { getSearchSuggestions } from '../utils/searchAutocompleteService.js';
export { getSupportedRadiusOptions };

export const RADIUS_OPTIONS = getSupportedRadiusOptions();

/**
 * Scalable asynchronous nearby search calling backend API via branchDataProvider
 */
export async function fetchNearbyBranchesAsync({
  userLat,
  userLng,
  radiusKm = 10,
  bankFilter = 'All Banks',
  typeFilter = 'All',
  page = 1,
  limit = 50,
  signal
} = {}) {
  return getNearbyBranchesFromProvider({
    lat: userLat,
    lng: userLng,
    radiusKm,
    bank: bankFilter,
    type: typeFilter,
    page,
    limit,
    signal
  });
}

/**
 * Scalable asynchronous branch directory search calling backend API via branchDataProvider
 */
export async function fetchBranchesAsync(options = {}) {
  return getBranchesFromProvider(options);
}

/**
 * Scalable asynchronous branch lookup by ID
 */
export async function fetchBranchByIdAsync(id, options = {}) {
  return getBranchByIdFromProvider(id, options);
}

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
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

/**
 * Formats distance in km or meters
 */
export function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

/**
 * Normalizes bank names for resilient matching across full names and short codes
 */
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
  if (s.includes('bank of india') && !s.includes('central') && !s.includes('state') && !s.includes('union')) return 'Bank of India';
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
 * Obtains current coordinates from browser Geolocation API
 */
export function getUserPosition(timeoutMs = 10000) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      const err = new Error('Geolocation is not supported by your browser.');
      err.code = -1;
      reject(err);
      return;
    }

    let isSettled = false;
    const timer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        const err = new Error('Location detection timed out. Please search your location manually.');
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
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        }
      },
      (error) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          let message = 'Unable to detect your location.';
          if (error.code === error.PERMISSION_DENIED) {
            message = "We couldn't access your location.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            message = 'Unable to determine your location.';
          } else if (error.code === error.TIMEOUT) {
            message = 'Location request timed out.';
          }
          const err = new Error(message);
          err.code = error.code;
          reject(err);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge: 60000 // 1 minute cache
      }
    );
  });
}

/**
 * Geocodes location query using MapTiler Geocoding API with India preference
 */
export async function geocodeLocation(query, apiKey, signal = null) {
  if (!query || !query.trim()) {
    throw new Error('Please enter a city, PIN code, area, or landmark.');
  }

  const cleanQuery = query.trim();

  // If MapTiler API Key is available, use MapTiler Geocoding API
  if (apiKey && apiKey !== 'your-maptiler-api-key') {
    try {
      const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(cleanQuery)}.json?key=${apiKey}&country=IN&language=en&limit=1`;
      const response = await fetch(url, { signal });
      if (response.ok) {
        const data = await response.json();
        if (data && data.features && data.features.length > 0) {
          const feature = data.features[0];
          return {
            lat: feature.center[1],
            lng: feature.center[0],
            displayName: feature.place_name || feature.text || cleanQuery
          };
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      console.warn('MapTiler geocoding network error, falling back:', err);
    }
  }

  // Fallback: Local known coordinates index for common search terms
  const lower = cleanQuery.toLowerCase();
  if (lower.includes('kharar') || lower.includes('140301') || lower.includes('sunny enclave')) {
    return { lat: 30.7463, lng: 76.6469, displayName: 'Kharar, SAS Nagar, Punjab, India' };
  }
  if (lower.includes('mohali') || lower.includes('sas nagar') || lower.includes('160062')) {
    return { lat: 30.7046, lng: 76.7179, displayName: 'Mohali, SAS Nagar, Punjab, India' };
  }
  if (lower.includes('chandigarh') || lower.includes('160017')) {
    return { lat: 30.7333, lng: 76.7794, displayName: 'Chandigarh, India' };
  }
  if (lower.includes('delhi') || lower.includes('connaught') || lower.includes('110001')) {
    return { lat: 28.6139, lng: 77.2090, displayName: 'New Delhi, Delhi, India' };
  }
  if (lower.includes('mumbai') || lower.includes('400001') || lower.includes('bkc') || lower.includes('nariman')) {
    return { lat: 18.9322, lng: 72.8335, displayName: 'Mumbai, Maharashtra, India' };
  }
  if (lower.includes('bengaluru') || lower.includes('bangalore') || lower.includes('560001') || lower.includes('koramangala')) {
    return { lat: 12.9716, lng: 77.5946, displayName: 'Bengaluru, Karnataka, India' };
  }
  if (lower.includes('hyderabad') || lower.includes('500001')) {
    return { lat: 17.3850, lng: 78.4867, displayName: 'Hyderabad, Telangana, India' };
  }
  if (lower.includes('chennai') || lower.includes('madras') || lower.includes('600001')) {
    return { lat: 13.0827, lng: 80.2707, displayName: 'Chennai, Tamil Nadu, India' };
  }
  if (lower.includes('kolkata') || lower.includes('calcutta') || lower.includes('700001')) {
    return { lat: 22.5726, lng: 88.3639, displayName: 'Kolkata, West Bengal, India' };
  }
  if (lower.includes('pune') || lower.includes('411001')) {
    return { lat: 18.5204, lng: 73.8567, displayName: 'Pune, Maharashtra, India' };
  }
  if (lower.includes('ahmedabad') || lower.includes('380001')) {
    return { lat: 23.0225, lng: 72.5714, displayName: 'Ahmedabad, Gujarat, India' };
  }
  if (lower.includes('jaipur') || lower.includes('302001')) {
    return { lat: 26.9124, lng: 75.7873, displayName: 'Jaipur, Rajasthan, India' };
  }
  if (lower.includes('lucknow') || lower.includes('226001')) {
    return { lat: 26.8467, lng: 80.9462, displayName: 'Lucknow, Uttar Pradesh, India' };
  }
  if (lower.includes('kochi') || lower.includes('cochin') || lower.includes('ernakulam') || lower.includes('682031')) {
    return { lat: 9.9796, lng: 76.2755, displayName: 'Kochi, Kerala, India' };
  }
  if (lower.includes('thiruvananthapuram') || lower.includes('trivandrum') || lower.includes('695014')) {
    return { lat: 8.4984, lng: 76.9558, displayName: 'Thiruvananthapuram, Kerala, India' };
  }
  if (lower.includes('bhubaneswar') || lower.includes('751009')) {
    return { lat: 20.2662, lng: 85.8398, displayName: 'Bhubaneswar, Odisha, India' };
  }
  if (lower.includes('guwahati') || lower.includes('781001') || lower.includes('dispur')) {
    return { lat: 26.1425, lng: 91.7905, displayName: 'Guwahati, Assam, India' };
  }
  if (lower.includes('bhopal') || lower.includes('462011')) {
    return { lat: 23.2324, lng: 77.4332, displayName: 'Bhopal, Madhya Pradesh, India' };
  }
  if (lower.includes('indore') || lower.includes('452010')) {
    return { lat: 22.7533, lng: 75.8937, displayName: 'Indore, Madhya Pradesh, India' };
  }
  if (lower.includes('patna') || lower.includes('800001')) {
    return { lat: 25.6178, lng: 85.1415, displayName: 'Patna, Bihar, India' };
  }
  if (lower.includes('ranchi') || lower.includes('834001')) {
    return { lat: 23.3705, lng: 85.3256, displayName: 'Ranchi, Jharkhand, India' };
  }
  if (lower.includes('dehradun') || lower.includes('248001')) {
    return { lat: 30.3244, lng: 78.0418, displayName: 'Dehradun, Uttarakhand, India' };
  }
  if (lower.includes('raipur') || lower.includes('492001')) {
    return { lat: 21.2405, lng: 81.6337, displayName: 'Raipur, Chhattisgarh, India' };
  }
  if (lower.includes('shimla') || lower.includes('171001')) {
    return { lat: 31.1048, lng: 77.1734, displayName: 'Shimla, Himachal Pradesh, India' };
  }
  if (lower.includes('jammu') || lower.includes('180012')) {
    return { lat: 32.7061, lng: 74.8785, displayName: 'Jammu, Jammu and Kashmir, India' };
  }
  if (lower.includes('srinagar') || lower.includes('190001')) {
    return { lat: 34.0722, lng: 74.8145, displayName: 'Srinagar, Jammu and Kashmir, India' };
  }
  if (lower.includes('visakhapatnam') || lower.includes('vizag') || lower.includes('530003')) {
    return { lat: 17.7231, lng: 83.3159, displayName: 'Visakhapatnam, Andhra Pradesh, India' };
  }
  if (lower.includes('vijayawada') || lower.includes('520010')) {
    return { lat: 16.5033, lng: 80.6465, displayName: 'Vijayawada, Andhra Pradesh, India' };
  }
  if (lower.includes('panaji') || lower.includes('goa') || lower.includes('403001')) {
    return { lat: 15.4989, lng: 73.8278, displayName: 'Panaji, Goa, India' };
  }
  if (lower.includes('gurugram') || lower.includes('gurgaon') || lower.includes('122002') || lower.includes('cyber city')) {
    return { lat: 28.4721, lng: 77.0725, displayName: 'Gurugram, Haryana, India' };
  }
  if (lower.includes('faridabad') || lower.includes('121002')) {
    return { lat: 28.4112, lng: 77.3184, displayName: 'Faridabad, Haryana, India' };
  }
  if (lower.includes('noida') || lower.includes('201301')) {
    return { lat: 28.5708, lng: 77.3219, displayName: 'Noida, Uttar Pradesh, India' };
  }
  if (lower.includes('amritsar') || lower.includes('143001')) {
    return { lat: 31.6264, lng: 74.8765, displayName: 'Amritsar, Punjab, India' };
  }
  if (lower.includes('ludhiana') || lower.includes('141001')) {
    return { lat: 30.9010, lng: 75.8271, displayName: 'Ludhiana, Punjab, India' };
  }
  if (lower.includes('jalandhar') || lower.includes('144001')) {
    return { lat: 31.3218, lng: 75.5802, displayName: 'Jalandhar, Punjab, India' };
  }
  if (lower.includes('surat') || lower.includes('395002')) {
    return { lat: 21.1925, lng: 72.8421, displayName: 'Surat, Gujarat, India' };
  }
  if (lower.includes('vadodara') || lower.includes('baroda') || lower.includes('390005')) {
    return { lat: 22.3106, lng: 73.1812, displayName: 'Vadodara, Gujarat, India' };
  }
  if (lower.includes('coimbatore') || lower.includes('641002')) {
    return { lat: 11.0084, lng: 76.9498, displayName: 'Coimbatore, Tamil Nadu, India' };
  }
  if (lower.includes('nagpur') || lower.includes('440010')) {
    return { lat: 21.1441, lng: 79.0628, displayName: 'Nagpur, Maharashtra, India' };
  }

  // Check verified BRANCHES dataset for IFSC, branch name, city, pincode, or Daltonganj -> Medininagar alias
  const matchedBranch = BRANCHES.find(b => 
    (b.ifsc && b.ifsc.toLowerCase() === lower) ||
    b.pincode === cleanQuery ||
    (b.branchName && b.branchName.toLowerCase().includes(lower)) ||
    (b.address && b.address.toLowerCase().includes(lower)) ||
    b.city.toLowerCase() === lower ||
    b.city.toLowerCase().includes(lower) ||
    lower.includes(b.city.toLowerCase()) ||
    (lower.includes('daltonganj') && b.city.toLowerCase() === 'medininagar')
  );
  if (matchedBranch && typeof matchedBranch.latitude === 'number' && typeof matchedBranch.longitude === 'number') {
    return {
      lat: matchedBranch.latitude,
      lng: matchedBranch.longitude,
      displayName: `${matchedBranch.branchName}, ${matchedBranch.city}, ${matchedBranch.state}`
    };
  }

  // Secondary fallback: Nominatim OpenStreetMap Geocoding
  try {
    const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery + ', India')}&limit=1`;
    const res = await fetch(fallbackUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DCardBankFinder/1.0 (dcard.website@gmail.com)'
      },
      signal
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          displayName: data[0].display_name
        };
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') throw err;
  }

  throw new Error(`Location "${cleanQuery}" could not be found. Please try searching with city name or 6-digit PIN code.`);
}

/**
 * Filters and ranks bank branches strictly within radius from user coordinates
 */
export function findNearbyBranches({
  userLat,
  userLng,
  radiusKm = 10,
  bankFilter = 'All Banks',
  typeFilter = 'All' // 'All' | 'Branch' | 'ATM'
}) {
  if (userLat === undefined || userLng === undefined || userLat === null || userLng === null) {
    return [];
  }

  const normalizedSelectedBank = bankFilter === 'All Banks' ? null : normalizeBankName(bankFilter);

  const results = [];
  const seenIds = new Set();

  const allBranches = getAllBranches();

  for (const branch of allBranches) {
    // Deduplication check
    if (seenIds.has(branch.id)) continue;
    seenIds.add(branch.id);

    // 1. Bank Name Filter
    if (normalizedSelectedBank) {
      const branchBankNorm = normalizeBankName(branch.bank_name);
      if (branchBankNorm !== normalizedSelectedBank) {
        continue;
      }
    }

    // 2. Type Filter (Branch vs ATM)
    if (typeFilter !== 'All') {
      if (branch.branch_type.toLowerCase() !== typeFilter.toLowerCase()) {
        continue;
      }
    }

    // 3. Distance Calculation
    const distanceKm = calculateDistance(userLat, userLng, branch.latitude, branch.longitude);

    // 4. Radius Filter
    if (distanceKm <= radiusKm) {
      results.push({
        ...branch,
        distanceKm,
        distanceFormatted: formatDistance(distanceKm),
        googleMapsUrl: `https://www.google.com/maps?q=${branch.latitude},${branch.longitude}`,
        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`
      });
    }
  }

  // 5. Strict Nearest-First Sorting
  results.sort((a, b) => a.distanceKm - b.distanceKm);

  return results;
}

/**
 * Calculates matching branch counts per bank within radius
 */
export function getBranchCountsByBank({
  userLat,
  userLng,
  radiusKm = 10,
  typeFilter = 'All'
}) {
  if (userLat === undefined || userLng === undefined || userLat === null || userLng === null) {
    return {};
  }

  const counts = {};
  const seenIds = new Set();
  const allBranches = getAllBranches();

  for (const branch of allBranches) {
    // Deduplication check
    if (seenIds.has(branch.id)) continue;
    seenIds.add(branch.id);

    if (typeFilter !== 'All') {
      if (branch.branch_type.toLowerCase() !== typeFilter.toLowerCase()) {
        continue;
      }
    }

    const distanceKm = calculateDistance(userLat, userLng, branch.latitude, branch.longitude);
    if (distanceKm <= radiusKm) {
      const normName = normalizeBankName(branch.bank_name);
      counts[normName] = (counts[normName] || 0) + 1;
    }
  }

  return counts;
}

/**
 * Obtains unique bank names dynamically from the data provider
 */
export function getUniqueBankNamesFromDatabase() {
  const banks = getUniqueBankNames();
  return ['All Banks', ...banks];
}
