/**
 * D.CARD Smart Search Deterministic Query Parser
 * 
 * Accurately parses natural language query strings without external AI APIs.
 * Deconstructs user intent into:
 * - Bank name (canonical)
 * - Location (city / area / landmark / PIN code)
 * - Type intent (Branch vs ATM vs All)
 * - "Near me" / live GPS intent
 * 
 * Examples:
 * "HDFC Bank Kharar" -> bank: 'HDFC Bank', location: 'Kharar', type: null
 * "SBI Chandigarh" -> bank: 'State Bank of India', location: 'Chandigarh', type: null
 * "ATM near Kharar" -> bank: null, location: 'Kharar', type: 'ATM'
 * "ICICI near me" -> bank: 'ICICI Bank', location: null, isNearMe: true
 * "banks near 140301" -> bank: null, location: '140301', type: 'All'
 */

// Canonical Bank dictionary with multi-word and short aliases (ordered by descending specificity)
const BANK_ALIASES = [
  { canonical: 'State Bank of India', aliases: ['state bank of india', 'state bank', 'sbi'] },
  { canonical: 'Punjab National Bank', aliases: ['punjab national bank', 'punjab national', 'pnb'] },
  { canonical: 'Kotak Mahindra Bank', aliases: ['kotak mahindra bank', 'kotak mahindra', 'kotak bank', 'kotak'] },
  { canonical: 'IDFC FIRST Bank', aliases: ['idfc first bank', 'idfc first', 'idfc bank', 'idfc'] },
  { canonical: 'Punjab & Sind Bank', aliases: ['punjab & sind bank', 'punjab and sind bank', 'punjab & sind', 'punjab and sind', 'psb'] },
  { canonical: 'Central Bank of India', aliases: ['central bank of india', 'central bank'] },
  { canonical: 'Union Bank of India', aliases: ['union bank of india', 'union bank'] },
  { canonical: 'AU Small Finance Bank', aliases: ['au small finance bank', 'au small finance', 'au bank'] },
  { canonical: 'Bank of Baroda', aliases: ['bank of baroda', 'bob'] },
  { canonical: 'Bank of India', aliases: ['bank of india', 'boi'] },
  { canonical: 'HDFC Bank', aliases: ['hdfc bank', 'hdfc'] },
  { canonical: 'ICICI Bank', aliases: ['icici bank', 'icici'] },
  { canonical: 'Axis Bank', aliases: ['axis bank', 'axis'] },
  { canonical: 'IndusInd Bank', aliases: ['indusind bank', 'indusind'] },
  { canonical: 'Federal Bank', aliases: ['federal bank', 'federal'] },
  { canonical: 'Canara Bank', aliases: ['canara bank', 'canara'] },
  { canonical: 'Indian Bank', aliases: ['indian bank'] },
  { canonical: 'Yes Bank', aliases: ['yes bank'] },
  { canonical: 'UCO Bank', aliases: ['uco bank', 'uco'] },
  { canonical: 'IDBI Bank', aliases: ['idbi bank', 'idbi'] },
  { canonical: 'RBL Bank', aliases: ['rbl bank', 'rbl'] }
];

// Noise words connecting location and bank
const CONNECTIVE_WORDS = new Set([
  'near', 'in', 'at', 'around', 'for', 'of', 'to', 'the', 'find', 'show', 'search', 'locate',
  'me', 'please', 'nearby', 'closest', 'nearest', 'any', 'where', 'is', 'within', 'under', 'km', 'kms'
]);

/**
 * Parses user search query into structured bank, location, type, radius, and GPS intent.
 * @param {string} rawInput 
 * @returns {Object} Structured parse result
 */
export function parseSmartSearchQuery(rawInput = '') {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      rawQuery: '',
      matchedBank: null,
      matchedLocation: null,
      matchedPincode: null,
      matchedType: null,
      matchedRadius: null,
      isNearMe: false,
      hasExplicitBank: false,
      hasExplicitLocation: false
    };
  }

  let text = rawInput.trim();
  let lower = text.toLowerCase();

  // 1. Detect "Near Me" / Live GPS Intent
  const nearMeRegex = /\b(near\s+me|around\s+me|closest\s+to\s+me|nearby\s+me|near\s+by\s+me|closest|nearest|my\s+location)\b/i;
  let isNearMe = nearMeRegex.test(lower);
  if (isNearMe) {
    lower = lower.replace(nearMeRegex, ' ').trim();
  }

  // 2. Detect Natural Search Radius Phrases (e.g. "within 5 km", "within 10km", "in 25 km", "under 50 km", "5 km")
  let matchedRadius = null;
  const radiusRegex = /\b(?:within|in|under|radius\s+of)?\s*(\d+)\s*(?:km|kms|kilometers|kilometres)\b/i;
  const radiusMatch = lower.match(radiusRegex);
  if (radiusMatch) {
    const parsedKm = parseInt(radiusMatch[1], 10);
    if ([5, 10, 25, 50].includes(parsedKm)) {
      matchedRadius = parsedKm;
    } else if (parsedKm <= 7) {
      matchedRadius = 5;
    } else if (parsedKm <= 15) {
      matchedRadius = 10;
    } else if (parsedKm <= 35) {
      matchedRadius = 25;
    } else {
      matchedRadius = 50;
    }
    lower = lower.replace(radiusMatch[0], ' ').trim();
  }

  // 3. Detect 6-digit Indian PIN Code
  let matchedPincode = null;
  const pincodeMatch = lower.match(/\b([1-9][0-9]{5})\b/);
  if (pincodeMatch) {
    matchedPincode = pincodeMatch[1];
    lower = lower.replace(pincodeMatch[0], ' ').trim();
  }

  // 4. Detect Bank Name & Canonical Form
  let matchedBank = null;
  for (const item of BANK_ALIASES) {
    for (const alias of item.aliases) {
      // Regex boundary match to prevent partial subword matches
      const aliasRegex = new RegExp(`\\b${alias.replace(/&/g, '(&|and)')}\\b`, 'i');
      if (aliasRegex.test(lower)) {
        matchedBank = item.canonical;
        lower = lower.replace(aliasRegex, ' ').trim();
        break;
      }
    }
    if (matchedBank) break;
  }

  // 5. Detect Branch vs ATM vs All Type Intent
  let matchedType = null;
  if (/\b(atms|atm|cash\s+machine|cash\s+point)\b/i.test(lower)) {
    matchedType = 'ATM';
    lower = lower.replace(/\b(atms|atm|cash\s+machine|cash\s+point)\b/gi, ' ').trim();
  } else if (/\b(branches|branch)\b/i.test(lower)) {
    matchedType = 'Branch';
    lower = lower.replace(/\b(branches|branch)\b/gi, ' ').trim();
  } else if (/\b(banks|bank)\b/i.test(lower)) {
    matchedType = 'All';
    lower = lower.replace(/\b(banks|bank)\b/gi, ' ').trim();
  }

  // 6. Clean Remaining Text to Extract Location
  // Split into tokens, strip noise words and punctuation
  const remainingTokens = lower
    .replace(/[,.-]/g, ' ')
    .split(/\s+/)
    .filter((token) => token && !CONNECTIVE_WORDS.has(token));

  let matchedLocation = null;
  if (remainingTokens.length > 0) {
    // Reconstruct cleaned location string with title casing
    matchedLocation = remainingTokens
      .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
      .join(' ')
      .trim();
  } else if (matchedPincode) {
    matchedLocation = matchedPincode;
  }

  return {
    rawQuery: rawInput.trim(),
    matchedBank,
    matchedLocation,
    matchedPincode,
    matchedType,
    matchedRadius,
    isNearMe,
    hasExplicitBank: Boolean(matchedBank),
    hasExplicitLocation: Boolean(matchedLocation || matchedPincode),
    summaryText: buildSearchSummary({
      bank: matchedBank,
      location: matchedLocation,
      pincode: matchedPincode,
      type: matchedType,
      radius: matchedRadius,
      isNearMe
    })
  };
}

/**
 * Builds a user-friendly summary string of what was understood
 */
function buildSearchSummary({ bank, location, pincode, type, radius, isNearMe }) {
  const parts = [];
  if (bank) {
    parts.push(bank);
  } else if (type === 'ATM') {
    parts.push('ATMs');
  } else if (type === 'Branch') {
    parts.push('Bank Branches');
  } else {
    parts.push('All Banks');
  }

  if (isNearMe) {
    parts.push('near your current location');
  } else if (location) {
    parts.push(`in ${location}`);
  } else if (pincode) {
    parts.push(`near PIN ${pincode}`);
  }

  if (radius) {
    parts.push(`within ${radius} km`);
  }

  return parts.join(' ');
}
