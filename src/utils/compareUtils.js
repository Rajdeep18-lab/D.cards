/**
 * Utility functions and schema normalization for Compare Cards system
 */

// Safe primitive/string helpers
export function safeStr(val) {
  if (val == null) return "";
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  return String(val || "");
}

export function safeLower(val) {
  return safeStr(val).toLowerCase();
}

export function safeUpper(val) {
  return safeStr(val).toUpperCase();
}

export function safeIncludes(val, searchTerm) {
  if (val == null) return false;
  return safeLower(val).includes(safeLower(searchTerm));
}

export function safeMap(arr, fn) {
  if (!Array.isArray(arr)) return [];
  return arr.map(fn);
}

export function safeFilter(arr, fn) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(fn);
}

export function safeFormatNumber(val) {
  if (typeof val === 'number' && !isNaN(val)) {
    return val.toLocaleString('en-IN');
  }
  const parsed = parseFloat(String(val || '').replace(/[^0-9.]/g, ''));
  if (!isNaN(parsed)) {
    return parsed.toLocaleString('en-IN');
  }
  return String(val || '0');
}

/**
 * Calculates default AI Score (0-100) if missing on a card
 */
export function calculateCardAIScore(card = {}) {
  if (!card) return 50;

  const annualFeeNum = typeof card.annualFee === 'number'
    ? card.annualFee
    : parseFloat(safeStr(card.annualFee).replace(/[^0-9.]/g, '')) || 0;
    
  const minBalNum = typeof card.minimumBalance === 'number'
    ? card.minimumBalance
    : (typeof card.minBalance === 'number'
      ? card.minBalance
      : parseFloat(safeStr(card.minBalance || card.minimumBalance).replace(/[^0-9.]/g, '')) || 0);

  let chargesScore = Math.round(98 - (annualFeeNum / 35) - (minBalNum / 9000));
  chargesScore = Math.min(98, Math.max(45, chargesScore));

  const loungeStr = safeLower(card.loungeAccess);
  const bankStr = safeLower(card.bank);
  const cardNameStr = safeLower(card.cardName);
  const categoryStr = safeLower(card.category);

  let perksCount = (loungeStr && !loungeStr.startsWith('no') && !loungeStr.includes('not available') ? 1.5 : 0) +
                   (card.travelZeroForex || safeIncludes(card.forexMarkup, '0%') ? 1.5 : 0) +
                   (card.healthcareFriendly ? 1.5 : 0) +
                   (card.contactless ? 0.5 : 0) +
                   (card.international || card.internationalUsage ? 0.5 : 0);

  let benefitsScore = Math.round(55 + (perksCount * 6.5));
  benefitsScore = Math.min(98, Math.max(50, benefitsScore));

  let trustScoreVal = card.verificationStatus === 'Verified' ? 95 : 85;

  let digitalScore = categoryStr.includes('digital') || bankStr.includes("fi money") ? 96 : 88;
  if (cardNameStr.includes("wealth") || cardNameStr.includes("private") || cardNameStr.includes("platinum")) {
    digitalScore = 95;
  }

  let overallScore = Math.round((chargesScore * 0.3) + (benefitsScore * 0.3) + (trustScoreVal * 0.2) + (digitalScore * 0.2));
  return Math.min(98, Math.max(50, overallScore));
}

/**
 * Normalizes any raw card object into the strict 24-field common schema.
 * Missing values are guaranteed to be:
 * String -> ""
 * Number -> 0
 * Boolean -> false
 * Array -> []
 * Never null or undefined.
 */
export function normalizeCard(raw = {}) {
  if (!raw || typeof raw !== 'object') {
    raw = {};
  }

  // 1. id (String)
  const id = raw.id != null ? String(raw.id) : (raw.card_id != null ? String(raw.card_id) : "");

  // 2. bank (String)
  const bank = safeStr(raw.bank || raw.bankName || raw.bank_name || raw.name).trim();

  // 3. cardName (String)
  const cardName = safeStr(raw.cardName || raw.name || raw.title || raw.card_name).trim();

  // 4. network (String)
  const network = safeStr(raw.network || raw.cardVariant).trim();

  // 5. category (String)
  const category = safeStr(raw.category || raw.segment || raw.cardVariant).trim();

  // 6. annualFee (String)
  let annualFee = "";
  if (typeof raw.annualFee === 'number') {
    annualFee = raw.annualFee === 0 ? "Free" : `₹${raw.annualFee}`;
  } else if (raw.annualFee != null) {
    annualFee = safeStr(raw.annualFee).trim();
  } else if (typeof raw.numAnnualFee === 'number') {
    annualFee = raw.numAnnualFee === 0 ? "Free" : `₹${raw.numAnnualFee}`;
  }

  // 7. joiningFee (String)
  let joiningFee = "";
  if (typeof raw.joiningFee === 'number') {
    joiningFee = raw.joiningFee === 0 ? "Free" : `₹${raw.joiningFee}`;
  } else if (raw.joiningFee != null) {
    joiningFee = safeStr(raw.joiningFee).trim();
  } else if (typeof raw.numJoiningFee === 'number') {
    joiningFee = raw.numJoiningFee === 0 ? "Free" : `₹${raw.numJoiningFee}`;
  }

  // 8. joiningFeeWaived (Boolean)
  let joiningFeeWaived = false;
  if (typeof raw.joiningFeeWaived === 'boolean') {
    joiningFeeWaived = raw.joiningFeeWaived;
  } else {
    const feeStr = safeLower(joiningFee || raw.joiningFee);
    joiningFeeWaived = feeStr.includes("free") || feeStr.includes("waived") || feeStr === "0" || feeStr === "₹0" || feeStr === "rs.0";
  }

  // 9. cashback (String)
  let cashback = "";
  if (raw.cashback != null) {
    cashback = safeStr(raw.cashback).trim();
  } else if (typeof raw.cashbackPct === 'number' && raw.cashbackPct > 0) {
    cashback = `${raw.cashbackPct}% Cashback`;
  }

  // 10. rewards (String)
  let rewards = "";
  if (raw.rewards != null) {
    rewards = safeStr(raw.rewards).trim();
  } else if (raw.rewardPoints != null) {
    rewards = safeStr(raw.rewardPoints).trim();
  }

  // 11. rewardRate (String)
  let rewardRate = "";
  if (raw.rewardRate != null) {
    rewardRate = safeStr(raw.rewardRate).trim();
  } else if (typeof raw.cashbackPct === 'number' && raw.cashbackPct > 0) {
    rewardRate = `${raw.cashbackPct}%`;
  }

  // 12. loungeAccess (String)
  let loungeAccess = "";
  if (raw.loungeAccess != null) {
    loungeAccess = safeStr(raw.loungeAccess).trim();
  } else if (raw.airportBenefits != null) {
    loungeAccess = safeStr(raw.airportBenefits).trim();
  }

  // 13. loungeVisits (Number)
  let loungeVisits = 0;
  if (typeof raw.loungeVisits === 'number' && !isNaN(raw.loungeVisits)) {
    loungeVisits = raw.loungeVisits;
  } else {
    const loungeStr = safeLower(loungeAccess);
    if (loungeStr && !loungeStr.startsWith("no") && !loungeStr.includes("not available")) {
      const match = loungeStr.match(/(\d+)/);
      if (match) {
        let count = parseInt(match[1], 10) || 1;
        if (loungeStr.includes("quarter")) count *= 4;
        loungeVisits = count;
      } else if (loungeStr.includes("yes") || loungeStr.includes("complimentary")) {
        loungeVisits = 4;
      }
    }
  }

  // 14. forexMarkup (String)
  let forexMarkup = "";
  if (raw.forexMarkup != null) {
    forexMarkup = safeStr(raw.forexMarkup).trim();
  } else if (raw.travelZeroForex) {
    forexMarkup = "0%";
  }

  // 15. contactless (Boolean)
  const contactless = Boolean(raw.contactless);

  // 16. internationalUsage (Boolean)
  const internationalUsage = Boolean(raw.internationalUsage ?? raw.international ?? raw.international_usage);

  // 17. emi (String)
  let emi = "";
  if (typeof raw.emi === 'boolean') {
    emi = raw.emi ? "Available" : "Not Available";
  } else if (raw.emi != null) {
    emi = safeStr(raw.emi).trim();
  }

  // 18. minimumBalance (Number)
  let minimumBalance = 0;
  if (typeof raw.minimumBalance === 'number' && !isNaN(raw.minimumBalance)) {
    minimumBalance = raw.minimumBalance;
  } else if (typeof raw.minBalance === 'number' && !isNaN(raw.minBalance)) {
    minimumBalance = raw.minBalance;
  } else if (raw.minBalance != null || raw.minimumBalance != null) {
    const valStr = safeStr(raw.minBalance ?? raw.minimumBalance);
    const parsed = parseFloat(valStr.replace(/[^0-9.]/g, ''));
    minimumBalance = !isNaN(parsed) ? parsed : 0;
  }

  // 19. bestFor (Array of Strings)
  let bestFor = [];
  if (Array.isArray(raw.bestFor)) {
    bestFor = safeMap(raw.bestFor, item => safeStr(item).trim()).filter(Boolean);
  } else if (typeof raw.bestFor === 'string' && raw.bestFor.trim()) {
    bestFor = raw.bestFor.split(',').map(s => s.trim()).filter(Boolean);
  }

  // 20. rating (Number)
  let rating = 0;
  if (typeof raw.rating === 'number' && !isNaN(raw.rating)) {
    rating = raw.rating;
  } else if (raw.rating != null) {
    const parsed = parseFloat(safeStr(raw.rating));
    rating = !isNaN(parsed) ? parsed : 0;
  }

  // 21. aiScore (Number)
  let aiScore = 0;
  if (typeof raw.aiScore === 'number' && !isNaN(raw.aiScore)) {
    aiScore = raw.aiScore;
  } else if (raw.overallScore != null) {
    const parsed = parseFloat(safeStr(raw.overallScore));
    aiScore = !isNaN(parsed) ? parsed : 0;
  } else {
    aiScore = calculateCardAIScore(raw);
  }

  // 22. eligibility (String)
  let eligibility = "";
  if (raw.eligibility != null) {
    eligibility = safeStr(raw.eligibility).trim();
  } else if (raw.salaryAccount) {
    eligibility = "Salary Account Holders";
  } else if (raw.studentFriendly) {
    eligibility = "Students & Young Adults";
  } else if (raw.description != null) {
    eligibility = safeStr(raw.description).trim();
  }

  // 23. features (Array of Strings)
  let features = [];
  if (Array.isArray(raw.features)) {
    features = safeMap(raw.features, f => safeStr(f).trim()).filter(Boolean);
  } else if (typeof raw.features === 'string' && raw.features.trim()) {
    features = raw.features.split(',').map(s => s.trim()).filter(Boolean);
  } else {
    const autoFeats = [];
    if (contactless) autoFeats.push("Contactless Payment");
    if (internationalUsage) autoFeats.push("International Acceptance");
    if (raw.insurance) autoFeats.push(safeStr(raw.insurance));
    if (raw.fuelSurchargeWaiver) autoFeats.push(safeStr(raw.fuelSurchargeWaiver));
    features = autoFeats;
  }

  // 24. benefits (String)
  let benefits = "";
  if (raw.benefits != null) {
    benefits = safeStr(raw.benefits).trim();
  } else if (raw.insurance != null) {
    benefits = safeStr(raw.insurance).trim();
  } else if (raw.description != null) {
    benefits = safeStr(raw.description).trim();
  }

  return {
    id,
    bank,
    cardName,
    network,
    category,
    annualFee,
    joiningFee,
    joiningFeeWaived,
    cashback,
    rewards,
    rewardRate,
    loungeAccess,
    loungeVisits,
    forexMarkup,
    contactless,
    internationalUsage,
    emi,
    minimumBalance,
    bestFor,
    rating,
    aiScore,
    eligibility,
    features,
    benefits,
    // Optional display properties
    image: safeStr(raw.image),
    applyUrl: safeStr(raw.applyUrl || raw.applyLink),
    limits: raw.limits || null,
    isPopular: Boolean(raw.isPopular)
  };
}

/**
 * Removes duplicate cards from a list by ID and Bank + Card Name
 */
export function deduplicateCards(cards = []) {
  if (!Array.isArray(cards)) return [];
  const seenIds = new Set();
  const seenNames = new Set();
  const result = [];

  for (const c of cards) {
    if (!c) continue;
    const norm = normalizeCard(c);
    const normId = norm.id.trim();
    const normKey = `${norm.bank.toLowerCase().trim()}_${norm.cardName.toLowerCase().trim()}`;

    if (normId && seenIds.has(normId)) continue;
    if (normKey && normKey !== '_' && seenNames.has(normKey)) continue;

    if (normId) seenIds.add(normId);
    if (normKey && normKey !== '_') seenNames.add(normKey);
    result.push(norm);
  }

  return result;
}

/**
 * Parses annual fee to numeric value for comparison
 */
export function parseAnnualFeeVal(feeStrOrNum) {
  if (typeof feeStrOrNum === 'number') return feeStrOrNum;
  const str = safeLower(feeStrOrNum);
  if (str.includes('free') || str.includes('waived') || str === '0' || str === '₹0' || str === 'rs.0') return 0;
  const parsed = parseFloat(str.replace(/[^0-9.]/g, ''));
  return !isNaN(parsed) ? parsed : 0;
}

/**
 * Parses cashback to numeric value for comparison
 */
export function parseCashbackVal(cashbackStrOrNum) {
  if (typeof cashbackStrOrNum === 'number') return cashbackStrOrNum;
  const str = safeLower(cashbackStrOrNum);
  if (str.includes('no') || str.includes('not available')) return 0;
  const pctMatch = str.match(/([\d.]+)\s*%/);
  if (pctMatch) return parseFloat(pctMatch[1]) || 0;
  const num = parseFloat(str.replace(/[^0-9.]/g, ''));
  return !isNaN(num) ? num : (str.includes('offer') ? 0.5 : 0);
}

/**
 * Parses forex markup to numeric percentage for comparison (lower is better)
 */
export function parseForexVal(forexStrOrNum) {
  if (typeof forexStrOrNum === 'number') return forexStrOrNum;
  const str = safeLower(forexStrOrNum);
  if (str.includes('not available') || str.includes('n/a') || !str) return 99;
  if (str.includes('0%') || str.includes('zero') || str.includes('free') || str.includes('nil')) return 0;
  const pctMatch = str.match(/([\d.]+)\s*%/);
  if (pctMatch) return parseFloat(pctMatch[1]) || 0;
  const num = parseFloat(str.replace(/[^0-9.]/g, ''));
  return !isNaN(num) ? num : 3.5;
}

/**
 * Evaluates best values across a list of normalized cards for green highlighting
 */
export function getBestMetrics(cards = []) {
  const normCards = safeMap(cards, normalizeCard);
  if (normCards.length < 2) {
    return {
      minFee: null,
      maxCashback: null,
      maxLoungeVisits: null,
      minForex: null,
      maxAIScore: null
    };
  }

  const fees = normCards.map(c => parseAnnualFeeVal(c.annualFee));
  const minFee = Math.min(...fees);

  const cashbacks = normCards.map(c => parseCashbackVal(c.cashback));
  const maxCashback = Math.max(...cashbacks);

  const loungeVisits = normCards.map(c => c.loungeVisits || 0);
  const maxLoungeVisits = Math.max(...loungeVisits);

  const forexs = normCards.map(c => parseForexVal(c.forexMarkup));
  const minForex = Math.min(...forexs);

  const aiScores = normCards.map(c => c.aiScore || 0);
  const maxAIScore = Math.max(...aiScores);

  return {
    minFee,
    maxCashback: maxCashback > 0 ? maxCashback : null,
    maxLoungeVisits: maxLoungeVisits > 0 ? maxLoungeVisits : null,
    minForex: minForex < 99 ? minForex : null,
    maxAIScore: maxAIScore > 0 ? maxAIScore : null
  };
}
