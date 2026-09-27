/**
 * D.CARD AI Location & Intent Service
 * 
 * Provides:
 * 1. Controlled Intent Classification (English, Hindi, Hinglish)
 * 2. Structured Requirement Extraction for Products
 * 3. Controlled Bank Location Search Tool (find_bank_locations)
 * 4. Grounded Location Context Generation for AI Prompting
 * 
 * Complies strictly with the Zero Fake Data Policy — only verified records
 * from D.CARD's database / API are returned or cited.
 */

import { getBranches, getNearbyBranches, getBranchById, normalizeBankName } from './banksService.js';
import { parseSmartSearchQuery } from '../src/utils/smartSearchParser.js';

// Canonical Known Banking Hub Coordinates for Deterministic Geocoding
const KNOWN_HUBS = {
  'kharar': { lat: 30.7463, lng: 76.6469, city: 'Kharar', state: 'Punjab' },
  'mohali': { lat: 30.7046, lng: 76.7179, city: 'Mohali', state: 'Punjab' },
  'sas nagar': { lat: 30.7046, lng: 76.7179, city: 'Mohali', state: 'Punjab' },
  'chandigarh': { lat: 30.7333, lng: 76.7794, city: 'Chandigarh', state: 'Chandigarh' },
  'new delhi': { lat: 28.6139, lng: 77.2090, city: 'New Delhi', state: 'Delhi' },
  'delhi': { lat: 28.6139, lng: 77.2090, city: 'New Delhi', state: 'Delhi' },
  'connaught place': { lat: 28.6304, lng: 77.2177, city: 'New Delhi', state: 'Delhi' },
  'mumbai': { lat: 18.9322, lng: 72.8335, city: 'Mumbai', state: 'Maharashtra' },
  'bengaluru': { lat: 12.9716, lng: 77.5946, city: 'Bengaluru', state: 'Karnataka' },
  'bangalore': { lat: 12.9716, lng: 77.5946, city: 'Bengaluru', state: 'Karnataka' },
  'hyderabad': { lat: 17.3850, lng: 78.4867, city: 'Hyderabad', state: 'Telangana' },
  'chennai': { lat: 13.0827, lng: 80.2707, city: 'Chennai', state: 'Tamil Nadu' },
  'kolkata': { lat: 22.5726, lng: 88.3639, city: 'Kolkata', state: 'West Bengal' },
  'pune': { lat: 18.5204, lng: 73.8567, city: 'Pune', state: 'Maharashtra' },
  'ahmedabad': { lat: 23.0225, lng: 72.5714, city: 'Ahmedabad', state: 'Gujarat' },
  'jaipur': { lat: 26.9124, lng: 75.7873, city: 'Jaipur', state: 'Rajasthan' },
  'lucknow': { lat: 26.8467, lng: 80.9462, city: 'Lucknow', state: 'Uttar Pradesh' },
  'kochi': { lat: 9.9796, lng: 76.2755, city: 'Kochi', state: 'Kerala' },
  'cochin': { lat: 9.9796, lng: 76.2755, city: 'Kochi', state: 'Kerala' },
  'ernakulam': { lat: 9.9812, lng: 76.2764, city: 'Kochi', state: 'Kerala' },
  'thiruvananthapuram': { lat: 8.4984, lng: 76.9558, city: 'Thiruvananthapuram', state: 'Kerala' },
  'trivandrum': { lat: 8.4984, lng: 76.9558, city: 'Thiruvananthapuram', state: 'Kerala' },
  'bhubaneswar': { lat: 20.2662, lng: 85.8398, city: 'Bhubaneswar', state: 'Odisha' },
  'guwahati': { lat: 26.1425, lng: 91.7905, city: 'Guwahati', state: 'Assam' },
  'bhopal': { lat: 23.2324, lng: 77.4332, city: 'Bhopal', state: 'Madhya Pradesh' },
  'indore': { lat: 22.7533, lng: 75.8937, city: 'Indore', state: 'Madhya Pradesh' },
  'patna': { lat: 25.6178, lng: 85.1415, city: 'Patna', state: 'Bihar' },
  'ranchi': { lat: 23.3705, lng: 85.3256, city: 'Ranchi', state: 'Jharkhand' },
  'dehradun': { lat: 30.3244, lng: 78.0418, city: 'Dehradun', state: 'Uttarakhand' },
  'raipur': { lat: 21.2405, lng: 81.6337, city: 'Raipur', state: 'Chhattisgarh' },
  'shimla': { lat: 31.1048, lng: 77.1734, city: 'Shimla', state: 'Himachal Pradesh' },
  'jammu': { lat: 32.7061, lng: 74.8785, city: 'Jammu', state: 'Jammu and Kashmir' },
  'srinagar': { lat: 34.0722, lng: 74.8145, city: 'Srinagar', state: 'Jammu and Kashmir' },
  'visakhapatnam': { lat: 17.7231, lng: 83.3159, city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  'vizag': { lat: 17.7231, lng: 83.3159, city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  'vijayawada': { lat: 16.5033, lng: 80.6465, city: 'Vijayawada', state: 'Andhra Pradesh' },
  'panaji': { lat: 15.4989, lng: 73.8278, city: 'Panaji', state: 'Goa' },
  'goa': { lat: 15.4989, lng: 73.8278, city: 'Panaji', state: 'Goa' },
  'gurugram': { lat: 28.4721, lng: 77.0725, city: 'Gurugram', state: 'Haryana' },
  'gurgaon': { lat: 28.4721, lng: 77.0725, city: 'Gurugram', state: 'Haryana' },
  'faridabad': { lat: 28.4112, lng: 77.3184, city: 'Faridabad', state: 'Haryana' },
  'noida': { lat: 28.5708, lng: 77.3219, city: 'Noida', state: 'Uttar Pradesh' },
  'amritsar': { lat: 31.6264, lng: 74.8765, city: 'Amritsar', state: 'Punjab' },
  'ludhiana': { lat: 30.9010, lng: 75.8271, city: 'Ludhiana', state: 'Punjab' },
  'jalandhar': { lat: 31.3218, lng: 75.5802, city: 'Jalandhar', state: 'Punjab' },
  'surat': { lat: 21.1925, lng: 72.8421, city: 'Surat', state: 'Gujarat' },
  'vadodara': { lat: 22.3106, lng: 73.1812, city: 'Vadodara', state: 'Gujarat' },
  'baroda': { lat: 22.3106, lng: 73.1812, city: 'Vadodara', state: 'Gujarat' },
  'coimbatore': { lat: 11.0084, lng: 76.9498, city: 'Coimbatore', state: 'Tamil Nadu' },
  'nagpur': { lat: 21.1441, lng: 79.0628, city: 'Nagpur', state: 'Maharashtra' }
};

export const KNOWN_STATES = {
  'punjab': 'Punjab',
  'chandigarh': 'Chandigarh',
  'delhi': 'Delhi',
  'new delhi': 'Delhi',
  'maharashtra': 'Maharashtra',
  'karnataka': 'Karnataka',
  'telangana': 'Telangana',
  'tamil nadu': 'Tamil Nadu',
  'west bengal': 'West Bengal',
  'bengal': 'West Bengal',
  'gujarat': 'Gujarat',
  'rajasthan': 'Rajasthan',
  'uttar pradesh': 'Uttar Pradesh',
  'up': 'Uttar Pradesh',
  'haryana': 'Haryana',
  'kerala': 'Kerala',
  'odisha': 'Odisha',
  'orissa': 'Odisha',
  'assam': 'Assam',
  'madhya pradesh': 'Madhya Pradesh',
  'mp': 'Madhya Pradesh',
  'bihar': 'Bihar',
  'jharkhand': 'Jharkhand',
  'uttarakhand': 'Uttarakhand',
  'chhattisgarh': 'Chhattisgarh',
  'himachal pradesh': 'Himachal Pradesh',
  'himachal': 'Himachal Pradesh',
  'jammu and kashmir': 'Jammu and Kashmir',
  'j&k': 'Jammu and Kashmir',
  'andhra pradesh': 'Andhra Pradesh',
  'andhra': 'Andhra Pradesh',
  'goa': 'Goa'
};

export const SUPPORTED_BANKS = new Set([
  'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
  'Kotak Mahindra Bank', 'IndusInd Bank', 'Federal Bank', 'IDFC FIRST Bank',
  'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank of India',
  'Central Bank of India', 'Bank of India', 'Indian Bank', 'UCO Bank',
  'Punjab & Sind Bank', 'Yes Bank', 'AU Small Finance Bank', 'RBL Bank', 'IDBI Bank'
]);

/**
 * Normalizes Hindi and Hinglish terms into standardized phrases for intent detection
 */
export function normalizeHinglishInput(text = '') {
  let lower = String(text || '').toLowerCase().trim();

  // Remove punctuation
  lower = lower.replace(/[?!,.]/g, ' ');

  // Hinglish greetings and polite fillers
  lower = lower.replace(/\b(bhai|yaar|batao|bata|bataiye|dikhaye|dikhao|kripya|please)\b/gi, ' ');

  // Amount phrases in Hindi/Hinglish
  lower = lower.replace(/\b(paanch\s+hazaar|5\s+hazaar|paanch\s+k)\b/gi, '5000');
  lower = lower.replace(/\b(dus\s+hazaar|10\s+hazaar|dus\s+k)\b/gi, '10000');
  lower = lower.replace(/\b(do\s+hazaar|2\s+hazaar|do\s+k)\b/gi, '2000');
  lower = lower.replace(/\b(ek\s+hazaar|1\s+hazaar|ek\s+k)\b/gi, '1000');
  lower = lower.replace(/\b(pachaas\s+hazaar|50\s+hazaar)\b/gi, '50000');
  lower = lower.replace(/\b(ek\s+laakh|1\s+laakh|1\s+lac|ek\s+lac)\b/gi, '100000');

  // Location inquiry phrases in Hindi/Hinglish
  // "5 km ke andar" -> "within 5 km"
  lower = lower.replace(/(\d+)\s*(?:km|kms|kilo)\s*ke\s*andar/gi, 'within $1 km');
  // "mere location ke paas" / "meri location ke paas" / "mere paas" / "paas mein" / "pass mein" -> "near me"
  lower = lower.replace(/\b(mere\s+location\s+ke\s+paas|meri\s+location\s+ke\s+paas|mere\s+paas|paas\s+mein|pass\s+mein)\b/gi, 'near me');
  // "kaha hai" / "kahan hai" / "kidhar hai" -> "where"
  lower = lower.replace(/\b(kaha\s+hai|kahan\s+hai|kidhar\s+hai|kaha\s+pe\s+hai|kaunsa|kaunsi)\b/gi, ' ');

  return lower.replace(/\s+/g, ' ').trim();
}

/**
 * Classifies query intent across 9 controlled intent categories
 */
export function classifyUserIntent(rawMessage = '', conversationState = {}) {
  const clean = String(rawMessage || '').trim();
  const lower = clean.toLowerCase();
  const normalized = normalizeHinglishInput(clean);

  // 1. Check for location queries
  const hasLocationWords = /\b(atm|branch|branches|location|locations|address|ifsc|locator|near|nearby|nearest|closest|within|andar|kaha|kahan|kidhar|pass|paas)\b/i.test(lower);
  const mentionsBank = /\b(sbi|hdfc|icici|axis|kotak|pnb|bob|baroda|canara|union\s+bank|bank|banks)\b/i.test(lower);
  const mentionsCity = Object.keys(KNOWN_HUBS).some(c => lower.includes(c)) || /\b\d{6}\b/.test(lower);

  const isLocationSearch = (hasLocationWords && (mentionsBank || mentionsCity || /\b(near me|nearby|nearest|atm|branch)\b/i.test(lower))) ||
    (mentionsBank && mentionsCity);

  // 2. Check for product comparison
  const isComparison = /\b(compare|versus|vs|difference|antar|kaunsa\s+achha|better)\b/i.test(lower);

  // 3. Check for specific product types
  const mentionsAccount = /\b(account|savings|current|bachat|khata|zero balance|mab|interest)\b/i.test(lower);
  const mentionsCard = /\b(debit card|atm card|rupay|visa|mastercard|lounge|card)\b/i.test(lower) && !/\b(atm\s+kaha|atm\s+near|nearest\s+atm)\b/i.test(lower);

  // Combined product + location intent (e.g. "Student savings account aur nearby ATM")
  const isCombined = (mentionsAccount || mentionsCard) && (hasLocationWords && (mentionsCity || lower.includes('near') || lower.includes('atm')));

  if (isCombined) {
    return {
      primaryIntent: 'PRODUCT_SEARCH',
      secondaryIntent: 'BANK_LOCATION_SEARCH',
      isCombined: true
    };
  }

  if (isLocationSearch) {
    let subIntent = 'BANK_LOCATION_SEARCH';
    if (/\b(near me|around me|my location|mere paas|within\s+\d+\s*km|\d+\s*km\s*ke\s*andar)\b/i.test(lower) || /\b(near me|within\s+\d+\s*km)\b/i.test(normalized)) {
      subIntent = 'BANK_LOCATION_NEARBY';
    } else if (/\b(ifsc|phone|timing|hours|open|address)\b/i.test(lower) && mentionsBank) {
      subIntent = 'BANK_LOCATION_DETAILS';
    }
    return {
      primaryIntent: 'find_bank_location',
      subIntent,
      isCombined: false,
      isLocation: true
    };
  }

  if (isComparison) {
    return { primaryIntent: 'PRODUCT_COMPARISON', isCombined: false };
  }

  if (mentionsAccount || mentionsCard || /\b(5000|10000|student|salary|women|senior|kyc|video kyc|free)\b/i.test(lower)) {
    return { primaryIntent: 'PRODUCT_SEARCH', isCombined: false };
  }

  if (/\b(what is|how to|explain|meaning|mab kya hai|cvv kya hai|eligibility)\b/i.test(lower)) {
    return { primaryIntent: 'PRODUCT_INFORMATION', isCombined: false };
  }

  return { primaryIntent: 'GENERAL_BANKING_INFORMATION', isCombined: false };
}

/**
 * Extracts structured product requirements from user query
 */
export function extractProductRequirements(rawMessage = '') {
  const norm = normalizeHinglishInput(rawMessage);
  const lower = norm.toLowerCase();

  const reqs = {};

  // Zero balance
  if (lower.includes('zero balance') || lower.includes('0 balance') || lower.includes('no minimum') || lower.includes('bina balance')) {
    reqs.zero_balance = true;
  }

  // Lounge access
  if (lower.includes('lounge') || lower.includes('airport')) {
    reqs.lounge_access = true;
  }

  // Minimum balance budget (e.g. "mere paas 5000 rupaye hain")
  const amountMatch = lower.match(/\b(\d{3,6})\b/);
  if (amountMatch) {
    const amt = parseInt(amountMatch[1], 10);
    if (amt >= 500 && amt <= 200000) {
      reqs.minimum_balance_max = amt;
    }
  }

  // Segment: Student
  if (lower.includes('student') || lower.includes('college') || lower.includes('padhai')) {
    reqs.student_friendly = true;
  }

  // Segment: Business / Current Account
  if (lower.includes('business') || lower.includes('current account') || lower.includes('vyapar') || lower.includes('shop')) {
    reqs.business_account = true;
  }

  // Digital / Video KYC
  if (lower.includes('video kyc') || lower.includes('online open') || lower.includes('digital account')) {
    reqs.online_kyc = true;
  }

  // Zero annual fee
  if (lower.includes('zero fee') || lower.includes('free card') || lower.includes('no annual fee')) {
    reqs.zero_annual_fee = true;
  }

  // High ATM limit
  if (lower.includes('high atm limit') || lower.includes('higher limit') || lower.includes('cash limit')) {
    reqs.high_atm_limit = true;
  }

  return reqs;
}

/**
 * Extracts structured parameters for Bank Location inquiries
 * Conforms to { bank_name, location_query, latitude, longitude, radius_km, branch_type, city, state, pincode, services }
 */
export function extractLocationParameters(rawMessage = '', conversationState = {}, userCoords = null) {
  const normalized = normalizeHinglishInput(rawMessage);
  const parsed = parseSmartSearchQuery(normalized);

  let bank = parsed.matchedBank || null;
  let type = parsed.matchedType || 'All';
  let location = parsed.matchedLocation || null;
  let pincode = parsed.matchedPincode || null;
  let radiusKm = parsed.matchedRadius || 10;
  let isNearMe = parsed.isNearMe;
  let state = null;
  let city = null;
  let isUnknownBank = false;
  let unknownBankName = null;

  const lower = normalized.toLowerCase();

  // Unknown bank detection
  const unknownBankList = [
    'barclays', 'citibank', 'citi', 'standard chartered', 'stanbic', 'hsbc', 
    'deutsche bank', 'deutsche', 'chase', 'jpmorgan', 'silicon valley bank', 'svb',
    'wells fargo', 'bank of america', 'bofa', 'dbs', 'mizuho', 'bnp paribas', 'santander', 'xyz bank'
  ];
  for (const ub of unknownBankList) {
    if (new RegExp(`\\b${ub}\\b`, 'i').test(lower)) {
      isUnknownBank = true;
      unknownBankName = ub.toUpperCase();
      break;
    }
  }

  // Detect explicit bank if parser missed it in Hinglish
  if (!bank && !isUnknownBank) {
    if (lower.includes('sbi') || lower.includes('state bank')) bank = 'State Bank of India';
    else if (lower.includes('hdfc')) bank = 'HDFC Bank';
    else if (lower.includes('icici')) bank = 'ICICI Bank';
    else if (lower.includes('axis')) bank = 'Axis Bank';
    else if (lower.includes('kotak')) bank = 'Kotak Mahindra Bank';
    else if (lower.includes('pnb') || lower.includes('punjab national')) bank = 'Punjab National Bank';
    else if (lower.includes('bob') || lower.includes('baroda')) bank = 'Bank of Baroda';
    else if (lower.includes('canara')) bank = 'Canara Bank';
    else if (lower.includes('indusind')) bank = 'IndusInd Bank';
    else if (lower.includes('idfc')) bank = 'IDFC FIRST Bank';
    else if (lower.includes('federal')) bank = 'Federal Bank';
    else if (lower.includes('union bank')) bank = 'Union Bank of India';
    else if (lower.includes('central bank')) bank = 'Central Bank of India';
    else if (lower.includes('bank of india') && !lower.includes('state') && !lower.includes('central') && !lower.includes('union')) bank = 'Bank of India';
    else if (lower.includes('indian bank')) bank = 'Indian Bank';
    else if (lower.includes('uco')) bank = 'UCO Bank';
    else if (lower.includes('punjab & sind') || lower.includes('punjab and sind') || lower === 'psb') bank = 'Punjab & Sind Bank';
    else if (lower.includes('yes bank')) bank = 'Yes Bank';
    else if (lower.includes('au small') || lower.includes('au bank')) bank = 'AU Small Finance Bank';
    else if (lower.includes('rbl')) bank = 'RBL Bank';
    else if (lower.includes('idbi')) bank = 'IDBI Bank';
  }

  // Detect State
  for (const st of Object.keys(KNOWN_STATES)) {
    if (new RegExp(`\\b${st}\\b`, 'i').test(lower)) {
      state = KNOWN_STATES[st];
      break;
    }
  }

  // Detect explicit city from known hubs
  for (const cityName of Object.keys(KNOWN_HUBS)) {
    if (new RegExp(`\\b${cityName}\\b`, 'i').test(lower)) {
      city = KNOWN_HUBS[cityName].city;
      location = city;
      break;
    }
  }

  // Detect "near me"
  if (lower.includes('near me') || lower.includes('mere paas') || lower.includes('nearest') || lower.includes('closest') || lower.includes('pass mein')) {
    isNearMe = true;
  }

  // Clean location if it still contains stop words or punctuation
  if (location) {
    location = location.replace(/[?!.,]/g, '').trim();
    location = location.replace(/\b(mein|ki|ka|ke|in|near|near me|kaunsa|hai|batao|bata|shakha|branch|branches|atm|atms|mere|paas|pass|where|which|timing|address|aur)\b/gi, '').trim();
    if (!location || location === '?' || location.length < 2) {
      location = null;
    }
  }

  if (state && !location) {
    location = state;
  }

  // Detect type if specific ATM or Branch was requested
  if (type === 'All') {
    if (/\b(atm|atms|cash machine)\b/i.test(normalized)) {
      type = 'ATM';
    } else if (/\b(branch|branches|shakha|office)\b/i.test(normalized)) {
      type = 'Branch';
    }
  }

  // Radius handling (clamped to supported options [5, 10, 25, 50])
  const radiusMatch = normalized.match(/\b(?:within|in|under|radius\s+of)?\s*(\d+)\s*(?:km|kms)\b/i);
  if (radiusMatch) {
    const r = parseInt(radiusMatch[1], 10);
    if ([5, 10, 25, 50].includes(r)) radiusKm = r;
    else if (r <= 7) radiusKm = 5;
    else if (r <= 15) radiusKm = 10;
    else if (r <= 35) radiusKm = 25;
    else radiusKm = 50;
  }

  // Extract requested services
  const services = [];
  if (/\b(cash deposit|cdm|deposit)\b/i.test(normalized)) services.push('Cash Deposit');
  if (/\b(locker|safe deposit)\b/i.test(normalized)) services.push('Locker Facility');
  if (/\b(forex|foreign exchange)\b/i.test(normalized)) services.push('Forex Services');
  if (/\b(cheque|passbook)\b/i.test(normalized)) services.push('Passbook Printing');

  const activeLat = userCoords?.lat || null;
  const activeLng = userCoords?.lng || null;

  return {
    bank_name: bank,
    location_query: location,
    latitude: activeLat,
    longitude: activeLng,
    radius_km: radiusKm,
    branch_type: type,
    city: city || (location && !state ? location : null),
    state: state,
    pincode: pincode,
    services: services.length > 0 ? services : undefined,
    // backward compatibility
    bank,
    location,
    type,
    radiusKm,
    isNearMe,
    isUnknownBank,
    unknownBankName,
    sort: 'nearest'
  };
}

/**
 * Checks whether a location query is ambiguous and requires clarification
 */
export function isLocationQueryAmbiguous(params, userCoords = null) {
  if (userCoords && userCoords.lat != null && userCoords.lng != null) {
    return false;
  }
  if (params.location_query || params.location || params.city || params.state || params.pincode) {
    return false;
  }
  // User asked "near me" but GPS was not provided
  if (params.isNearMe) {
    return true;
  }
  // User just asked for "branches" with no location and no bank
  if (!params.bank_name && !params.bank) {
    return true;
  }
  return false;
}

/**
 * Controlled Internal Tool: find_bank_locations
 * 
 * Invokes the existing backend API / services to find verified branches and ATMs.
 * Never generates arbitrary queries.
 */
export async function find_bank_locations({
  bank = 'All Banks',
  bank_name = null,
  location = null,
  location_query = null,
  city = null,
  state = null,
  pincode = null,
  type = 'All',
  branch_type = null,
  radiusKm = 10,
  radius_km = null,
  lat = null,
  lng = null,
  latitude = null,
  longitude = null,
  services = null,
  isUnknownBank = false,
  unknownBankName = null
} = {}) {
  // If unknown bank, return immediately
  if (isUnknownBank) {
    return {
      success: true,
      method: 'unknown_bank',
      bankName: unknownBankName,
      totalFound: 0,
      count: 0,
      locations: []
    };
  }

  // 1. Parameter Validation & Clamping
  let safeRadius = parseFloat(radius_km || radiusKm || 10);
  if (isNaN(safeRadius) || safeRadius <= 0) safeRadius = 10;
  if (safeRadius > 50) safeRadius = 50;

  const rawBank = bank_name || bank;
  const safeBank = rawBank && rawBank !== 'All Banks' ? normalizeBankName(rawBank) : 'All Banks';
  const rawType = branch_type || type;
  const safeType = ['Branch', 'ATM', 'All'].includes(rawType) ? rawType : 'All';

  const activeLat = latitude !== null ? latitude : lat;
  const activeLng = longitude !== null ? longitude : lng;

  // 2. Scenario A: Live Coordinates provided (from client geolocation when authorized)
  if (activeLat !== null && activeLng !== null && !isNaN(activeLat) && !isNaN(activeLng)) {
    try {
      const nearbyRes = await getNearbyBranches({
        lat: activeLat,
        lng: activeLng,
        radiusKm: safeRadius,
        bank: safeBank,
        type: safeType,
        page: 1,
        limit: 10
      });

      if (nearbyRes && nearbyRes.success && Array.isArray(nearbyRes.data)) {
        let locs = nearbyRes.data;
        if (Array.isArray(services) && services.length > 0) {
          locs = locs.filter(l => Array.isArray(l.services) && services.some(s => l.services.includes(s)));
        }
        locs = locs.slice(0, 5);
        return {
          success: true,
          method: 'nearby_coords',
          totalFound: nearbyRes.pagination?.total || locs.length,
          count: locs.length,
          locations: locs
        };
      }
    } catch (err) {
      console.warn('[find_bank_locations] Nearby coords query notice:', err.message);
    }
  }

  // 3. Scenario B: Known city hub query or PIN/City lookup
  const targetLocation = location_query || location || city || pincode;
  if (targetLocation) {
    const locLower = String(targetLocation).toLowerCase().trim();
    const isPin = /^\d{6}$/.test(locLower);
    const knownHub = !isPin ? KNOWN_HUBS[locLower] : null;

    if (knownHub) {
      try {
        const nearbyRes = await getNearbyBranches({
          lat: knownHub.lat,
          lng: knownHub.lng,
          radiusKm: safeRadius,
          bank: safeBank,
          type: safeType,
          page: 1,
          limit: 10
        });

        if (nearbyRes && nearbyRes.success && Array.isArray(nearbyRes.data)) {
          let locs = nearbyRes.data;
          if (Array.isArray(services) && services.length > 0) {
            locs = locs.filter(l => Array.isArray(l.services) && services.some(s => l.services.includes(s)));
          }
          locs = locs.slice(0, 5);
          return {
            success: true,
            method: 'city_hub_radius',
            city: knownHub.city,
            totalFound: nearbyRes.pagination?.total || locs.length,
            count: locs.length,
            locations: locs
          };
        }
      } catch (err) {
        console.warn('[find_bank_locations] City hub query notice:', err.message);
      }
    }

    // 4. Scenario C: State query (e.g. "Punjab mein HDFC branches")
    const targetState = !isPin ? (state || KNOWN_STATES[locLower]) : null;
    if (targetState) {
      try {
        const stateRes = await getBranches({
          bank: safeBank,
          state: targetState,
          type: safeType,
          page: 1,
          limit: 10
        });

        if (stateRes && stateRes.success && Array.isArray(stateRes.data) && stateRes.data.length > 0) {
          let locs = stateRes.data;
          if (Array.isArray(services) && services.length > 0) {
            locs = locs.filter(l => Array.isArray(l.services) && services.some(s => l.services.includes(s)));
          }
          locs = locs.slice(0, 5);
          return {
            success: true,
            method: 'state_search',
            state: targetState,
            totalFound: stateRes.pagination?.total || locs.length,
            count: locs.length,
            locations: locs
          };
        }
      } catch (err) {
        console.warn('[find_bank_locations] State search notice:', err.message);
      }
    }

    // 5. Scenario D: Fallback to directory city/pincode search
    try {
      const dirRes = await getBranches({
        bank: safeBank,
        city: isPin ? null : targetLocation,
        pincode: isPin ? targetLocation : pincode,
        type: safeType,
        page: 1,
        limit: 10
      });

      if (dirRes && dirRes.success && Array.isArray(dirRes.data) && dirRes.data.length > 0) {
        let locs = dirRes.data;
        if (Array.isArray(services) && services.length > 0) {
          locs = locs.filter(l => Array.isArray(l.services) && services.some(s => l.services.includes(s)));
        }
        locs = locs.slice(0, 5);
        return {
          success: true,
          method: 'directory_search',
          totalFound: dirRes.pagination?.total || locs.length,
          count: locs.length,
          locations: locs
        };
      }
    } catch (err) {
      console.warn('[find_bank_locations] Directory search notice:', err.message);
    }

    return {
      success: true,
      method: 'location_not_found',
      totalFound: 0,
      count: 0,
      locations: []
    };
  }

  // 6. Scenario E: Bank specified without location
  if (safeBank && safeBank !== 'All Banks') {
    try {
      const bankRes = await getBranches({
        bank: safeBank,
        type: safeType,
        page: 1,
        limit: 5
      });
      if (bankRes && bankRes.success && Array.isArray(bankRes.data) && bankRes.data.length > 0) {
        const locs = bankRes.data.slice(0, 5);
        return {
          success: true,
          method: 'bank_general',
          totalFound: bankRes.pagination?.total || bankRes.data.length,
          count: locs.length,
          locations: locs
        };
      }
    } catch (err) {
      console.warn('[find_bank_locations] General bank query notice:', err.message);
    }
  }

  return {
    success: true,
    totalFound: 0,
    count: 0,
    locations: []
  };
}

/**
 * Builds grounded prompt context containing verified bank branches for Gemini
 */
export function buildLocationPromptContext(locations = []) {
  if (!locations || locations.length === 0) {
    return 'NO VERIFIED BANK BRANCHES/ATMS FOUND IN D.CARD DATABASE FOR THIS LOCATION QUERY.';
  }

  const lines = locations.map((loc, idx) => {
    const dist = loc.distanceFormatted ? ` (${loc.distanceFormatted})` : '';
    const ifsc = loc.ifsc ? ` | IFSC: ${loc.ifsc}` : '';
    const phone = loc.phone ? ` | Phone: ${loc.phone}` : '';
    const hours = loc.opening_hours ? ` | Hours: ${loc.opening_hours}` : '';
    return [
      `${idx + 1}. [${loc.branch_type.toUpperCase()}] ${loc.bank_name} - ${loc.branch_name}${dist}`,
      `   Address: ${loc.address}, ${loc.city}, ${loc.state} - ${loc.pincode}`,
      `   Contact: ${phone}${hours}${ifsc}`,
      `   Verified on: ${loc.verified_on || 'Verified'} | Source: ${loc.source_url}`
    ].join('\n');
  });

  return `VERIFIED D.CARD BANK BRANCH & ATM LOCATIONS:\n========================================\n${lines.join('\n\n')}\n========================================`;
}
