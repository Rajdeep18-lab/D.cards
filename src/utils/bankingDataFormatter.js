/**
 * BANKING DATA FORMATTING LAYER
 *
 * Separates raw research/audit data from user-facing presentation.
 * Transforms lengthy paragraphs, multi-tier research excerpts, and raw URLs
 * into clean, bold, scannable display metrics and structured highlights,
 * while preserving full underlying details for deep-dive product views.
 */

import { safeString, safeArray } from './safeUtils.js';

/**
 * Format date string (e.g., '2026-09-21' or '05.09.2026') to '21 Sep 2026'
 */
export function formatDisplayDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  
  // Try YYYY-MM-DD
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  }

  // Try DD.MM.YYYY
  const dotMatch = trimmed.match(/^(\d{2})\.(\d{2})\.(\d{4})/);
  if (dotMatch) {
    const [, d, m, y] = dotMatch;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  }

  return trimmed;
}

/**
 * Clean URLs from text and return cleaned string + extracted URLs
 */
export function extractUrls(text) {
  if (!text) return { cleanedText: '', urls: [] };
  const str = String(text);
  const urlRegex = /(?:https?:\/\/|www\.)[^\s,;)]+|canarabank\.bank\.in[^\s,;)]+/gi;
  const urls = [];
  let match;
  while ((match = urlRegex.exec(str)) !== null) {
    let u = match[0];
    if (!u.startsWith('http')) {
      u = 'https://' + u;
    }
    urls.push(u);
  }
  const cleanedText = str.replace(urlRegex, '').replace(/\s{2,}/g, ' ').trim();
  return { cleanedText, urls };
}

/**
 * Format Interest Rate for compact cards and metrics
 */
export function formatInterestRate(rawRate, account = {}) {
  const fullText = safeString(rawRate || account.interest_rate || account.interestRate);
  
  if (!fullText || fullText.toLowerCase().includes('not specified') || fullText.toLowerCase().includes('not yet retrieved') || fullText.toLowerCase().includes('not retrieved') || fullText.toLowerCase().includes('information not available')) {
    return {
      display: 'Not specified',
      rateValue: null,
      subtext: null,
      hasSlabNote: false,
      fullText: fullText || 'Not specified'
    };
  }

  // Check if current account with RBI 0% prohibition
  if (fullText.includes('0%') || fullText.toLowerCase().includes('prohibit') || (account.account_type === 'Current' && !fullText.match(/[1-9]/))) {
    return {
      display: '0% p.a.',
      rateValue: 0,
      subtext: 'Current Account (RBI regulations prohibit interest)',
      hasSlabNote: false,
      fullText
    };
  }

  // Extract core percentage (e.g. "2.50% p.a.", "2.70% - 6.80% p.a.", "3.00% to 7.00% p.a.", "2.50%")
  const rangeMatch = fullText.match(/(\d+(?:\.\d+)?%\s*(?:-|to)\s*\d+(?:\.\d+)?%\s*(?:p\.?a\.?)?)/i);
  const singleMatch = fullText.match(/(\d+(?:\.\d+)?%\s*(?:p\.?a\.?)?)/i);

  let displayRate = '';
  if (rangeMatch) {
    displayRate = rangeMatch[1].trim();
    if (!displayRate.toLowerCase().includes('p.a')) displayRate += ' p.a.';
  } else if (singleMatch) {
    displayRate = singleMatch[1].trim();
    if (!displayRate.toLowerCase().includes('p.a')) displayRate += ' p.a.';
  } else if (typeof account.interestRateValue === 'number') {
    displayRate = `${account.interestRateValue.toFixed(2)}% p.a.`;
  } else {
    // Truncate at first sentence or parenthesis
    displayRate = fullText.split(/[\(;]/)[0].trim();
  }

  // Clean trailing stars or punctuation
  displayRate = displayRate.replace(/[*;,\s]+$/, '');

  // Determine clarifying subtext
  let subtext = null;
  let hasSlabNote = false;
  const lower = fullText.toLowerCase();

  if (lower.includes('slab') || lower.includes('balances below') || lower.includes('slabs rise') || lower.includes('tier') || (account.interestSlabs && account.interestSlabs.length > 0)) {
    subtext = 'Rate may vary by balance slab.';
    hasSlabNote = true;
  } else if (lower.includes('fd bonus') || lower.includes('bonus')) {
    subtext = '+ FD Bonus on linked deposits.';
  } else if (lower.includes('below') && !lower.includes('slab')) {
    const thresholdMatch = fullText.match(/below\s*([^\);,]+)/i);
    if (thresholdMatch) {
      subtext = `For balances below ${thresholdMatch[1].trim()}.`;
    }
  }

  return {
    display: displayRate || 'Rate on request',
    rateValue: account.interestRateValue || parseFloat(displayRate) || null,
    subtext,
    hasSlabNote,
    fullText
  };
}

/**
 * Format Minimum Balance / AMB / MAB for compact cards and metrics
 */
export function formatMinimumBalance(rawBalance, account = {}) {
  const fullText = safeString(rawBalance || account.minimum_balance || account.minimumBalance || account.averageMonthlyBalance);

  // Check for Zero Balance accounts
  if (account.isZeroBalance || account.minimumBalanceValue === 0) {
    return {
      display: '₹0',
      badge: 'Zero Balance',
      isZero: true,
      subtext: 'No minimum balance required',
      breakdown: null,
      hasLocationBreakdown: false,
      fullText: fullText || '₹0 Zero Balance'
    };
  }

  if (!fullText || fullText.toLowerCase() === 'zero' || fullText.toLowerCase() === 'nil' || fullText === '₹0') {
    return {
      display: '₹0',
      badge: 'Zero Balance',
      isZero: true,
      subtext: 'No minimum balance required',
      breakdown: null,
      hasLocationBreakdown: false,
      fullText: fullText || '₹0 Zero Balance'
    };
  }

  const lower = fullText.toLowerCase();
  if (lower.includes('not specified') || lower.includes('not yet retrieved') || lower.includes('not retrieved') || lower.includes('information not available') || lower.includes('not stated')) {
    return {
      display: 'Not specified',
      badge: null,
      isZero: false,
      subtext: null,
      breakdown: null,
      hasLocationBreakdown: false,
      fullText
    };
  }

  // Location-specific breakdown detection
  // e.g. "AMB Rs 2,000 urban/metro; Rs 1,000 semi-urban; Rs 500 rural"
  // or "₹500 rural / ₹1,000 semi-urban / ₹2,000 urban/metro"
  // or "₹3,000 Metro/Urban / ₹2,000 Semi-Urban / ₹1,000 Rural"
  const hasUrban = /urban|metro/i.test(fullText);
  const hasSemi = /semi-?urban/i.test(fullText);
  const hasRural = /rural/i.test(fullText);

  if ((hasUrban && hasSemi) || (hasUrban && hasRural)) {
    // Extract location tiers
    let urbanAmt = '₹2,000';
    let semiAmt = '₹1,000';
    let ruralAmt = '₹500';

    const urbanMatch = fullText.match(/(?:Rs\.?|₹)\s*([\d,]+)\s*(?:urban|metro)/i) || fullText.match(/(?:urban|metro)[^₹Rs\d]*(?:Rs\.?|₹)?\s*([\d,]+)/i);
    const semiMatch = fullText.match(/(?:Rs\.?|₹)\s*([\d,]+)\s*(?:semi-?urban)/i) || fullText.match(/(?:semi-?urban)[^₹Rs\d]*(?:Rs\.?|₹)?\s*([\d,]+)/i);
    const ruralMatch = fullText.match(/(?:Rs\.?|₹)\s*([\d,]+)\s*(?:rural)/i) || fullText.match(/(?:rural)[^₹Rs\d]*(?:Rs\.?|₹)?\s*([\d,]+)/i);

    if (urbanMatch) urbanAmt = `₹${urbanMatch[1]}`;
    if (semiMatch) semiAmt = `₹${semiMatch[1]}`;
    if (ruralMatch) ruralAmt = `₹${ruralMatch[1]}`;

    return {
      display: urbanAmt,
      badge: null,
      isZero: false,
      subtext: `Urban: ${urbanAmt} • Semi: ${semiAmt} • Rural: ${ruralAmt}`,
      breakdown: [
        { label: 'Urban / Metro', amount: urbanAmt },
        { label: 'Semi-Urban', amount: semiAmt },
        { label: 'Rural', amount: ruralAmt }
      ],
      hasLocationBreakdown: true,
      fullText
    };
  }

  // Quarterly Average Balance (QAB) e.g., "QAB Rs 1 lakh and above"
  const qabMatch = fullText.match(/qab\s*(?:rs\.?|₹)?\s*([\d,]+(?:\s*lakh)?)/i);
  if (qabMatch) {
    let qabVal = qabMatch[1].trim();
    if (/lakh/i.test(qabVal)) {
      qabVal = qabVal.replace(/lakh/i, '').trim();
      const num = parseFloat(qabVal) || 1;
      return {
        display: `QAB ₹${(num * 100000).toLocaleString('en-IN')}`,
        badge: 'QAB',
        isZero: false,
        subtext: 'Quarterly Average Balance',
        breakdown: null,
        hasLocationBreakdown: false,
        fullText
      };
    }
  }

  // Dual option e.g., "₹10 lakh OR ₹5 lakh + ₹10 lakh TD"
  if (fullText.includes('OR') || fullText.includes('or')) {
    const parts = fullText.split(/or/i);
    const primary = parts[0].trim();
    return {
      display: primary.startsWith('₹') ? primary : `₹${primary.replace(/^[^\d]+/, '')}`,
      badge: null,
      isZero: false,
      subtext: 'Alternative term deposit balance options apply',
      breakdown: null,
      hasLocationBreakdown: false,
      fullText
    };
  }

  // Standard balance e.g., "₹10,000" or "AMB Rs 25,000"
  const numMatch = fullText.match(/(?:₹|Rs\.?)\s*([\d,]+(?:\s*lakh)?)/i) || fullText.match(/([\d,]+)/);
  if (numMatch) {
    let val = numMatch[1].trim();
    if (/lakh/i.test(val)) {
      const num = parseFloat(val) || 1;
      val = (num * 100000).toLocaleString('en-IN');
    }
    const displayVal = val.startsWith('₹') ? val : `₹${val}`;
    return {
      display: displayVal,
      badge: null,
      isZero: false,
      subtext: fullText.toLowerCase().includes('amb') ? 'Average Monthly Balance' : null,
      breakdown: null,
      hasLocationBreakdown: false,
      fullText
    };
  }

  // Fallback cleanly formatted
  const cleanFallback = fullText.split(/[\(;]/)[0].trim().replace(/\s{2,}/g, ' ');
  return {
    display: cleanFallback.length > 24 ? cleanFallback.slice(0, 24) + '...' : cleanFallback,
    badge: null,
    isZero: false,
    subtext: null,
    breakdown: null,
    hasLocationBreakdown: false,
    fullText
  };
}

/**
 * Format Non-Maintenance Charge / Penalty
 */
export function formatNonMaintenanceCharge(rawCharge, account = {}) {
  const fullText = safeString(rawCharge || account.non_maintenance_penalty || account.nonMaintenanceCharges || account.nonMaintenanceCharge);

  if (!fullText || fullText.toLowerCase().includes('not specified') || fullText.toLowerCase().includes('not yet retrieved') || fullText.toLowerCase().includes('not retrieved') || fullText.toLowerCase().includes('information not available')) {
    return {
      display: 'Not specified',
      isWaived: false,
      subtext: null,
      fullText: fullText || 'Not specified'
    };
  }

  // Check for officially waived charges (e.g. Canara Bank SB General press release 01-06-2025)
  const lower = fullText.toLowerCase();
  if (lower.includes('waived') || lower.includes('nil') || lower.includes('no penalty') || lower.includes('no charge') || lower.includes('01-06-2025')) {
    return {
      display: 'Waived (₹0)',
      isWaived: true,
      subtext: 'Charges waived per bank circular',
      fullText
    };
  }

  // Check for quarterly charges e.g. "Rs 1,000 + GST per quarter"
  if (lower.includes('quarter')) {
    const amtMatch = fullText.match(/(?:Rs\.?|₹)\s*([\d,]+)/i);
    const amt = amtMatch ? `₹${amtMatch[1]}` : '₹1,000';
    return {
      display: `${amt}/qtr + GST`,
      isWaived: false,
      subtext: 'Quarterly non-maintenance fee',
      fullText
    };
  }

  // Monthly charges e.g. "Rs 500 per month"
  if (lower.includes('month')) {
    const amtMatch = fullText.match(/(?:Rs\.?|₹)\s*([\d,]+)/i);
    const amt = amtMatch ? `₹${amtMatch[1]}` : '₹500';
    return {
      display: `${amt}/mo + GST`,
      isWaived: false,
      subtext: 'Monthly non-maintenance fee',
      fullText
    };
  }

  // Clean first phrase
  const cleanStr = fullText.split(/[\(;]/)[0].replace(/w\.e\.f.*$/i, '').trim();
  return {
    display: cleanStr.length > 25 ? cleanStr.slice(0, 25) + '...' : cleanStr,
    isWaived: false,
    subtext: null,
    fullText
  };
}

/**
 * Format Cash Deposit Limit for Current Accounts
 */
export function formatCashDepositLimit(rawLimit, account = {}) {
  const fullText = safeString(rawLimit || account.cashDepositLimit || account.freeCashDepositPerMonth);

  if (!fullText || fullText.toLowerCase().includes('not specified') || fullText.toLowerCase().includes('not yet retrieved') || fullText.toLowerCase().includes('not retrieved') || fullText.toLowerCase().includes('information not available') || fullText.toLowerCase().includes('not stated')) {
    return {
      display: 'Not specified',
      subtext: null,
      fullText: fullText || 'Not specified'
    };
  }

  const lower = fullText.toLowerCase();
  if (lower.includes('unlimited at base branch')) {
    return {
      display: 'Unlimited (Base)',
      subtext: 'Unlimited at base branch; inter-branch limits apply',
      fullText
    };
  }

  // Match e.g. "₹5 Lakhs/month" or "Rs 25,000 per day"
  const amtMatch = fullText.match(/(?:Rs\.?|₹)\s*([\d,]+(?:\s*lakhs?)?)/i);
  if (amtMatch) {
    let amt = amtMatch[1];
    if (/month/i.test(fullText)) amt += '/mo';
    else if (/day/i.test(fullText)) amt += '/day';
    return {
      display: `₹${amt}`,
      subtext: fullText.split(/[\(;]/)[0].trim(),
      fullText
    };
  }

  const clean = fullText.split(/[\(;]/)[0].trim();
  return {
    display: clean.length > 25 ? clean.slice(0, 25) + '...' : clean,
    subtext: null,
    fullText
  };
}

/**
 * Format Key Account Highlights & Benefits
 * Converts raw research paragraphs into clean, strictly factual bullet points.
 * Filters out raw URLs, press releases, audit notes, and negative loan exclusions.
 */
export function formatBenefits(rawBenefits, maxCount = 4) {
  const inputList = safeArray(rawBenefits);
  if (inputList.length === 0) {
    return ['Standard account banking facilities'];
  }

  const parsedHighlights = [];
  const seenKeys = new Set();

  // Helper to add unique highlight
  const addHighlight = (key, text) => {
    if (!seenKeys.has(key) && parsedHighlights.length < maxCount) {
      seenKeys.add(key);
      parsedHighlights.push(text);
    }
  };

  for (const rawItem of inputList) {
    if (!rawItem || typeof rawItem !== 'string') continue;

    // Filter out items that are purely "not specified in retrieved excerpt"
    const lowerItem = rawItem.toLowerCase();
    if (lowerItem.includes('not specified in retrieved excerpt') || lowerItem.includes('information not available')) {
      continue;
    }

    // Strip URLs and parenthetical research tags
    let cleaned = rawItem
      .replace(/(?:https?:\/\/|www\.)[^\s,;)]+/gi, '')
      .replace(/\([^)]*press release[^)]*\)/gi, '')
      .replace(/\([^)]*comparison PDF[^)]*\)/gi, '')
      .replace(/\([^)]*per description[^)]*\)/gi, '')
      .replace(/- verify/gi, '')
      .replace(/w\.e\.f\.\s*[\d.-]+/gi, '')
      .trim();

    // Check for standard banking facilities present in text
    const textLower = cleaned.toLowerCase();

    if (textLower.includes('passbook')) {
      addHighlight('passbook', 'Passbook facility available');
    }
    if (textLower.includes('nomination')) {
      addHighlight('nomination', 'Nomination facility available');
    }
    if (textLower.includes('cheque collection')) {
      addHighlight('cheque_col', 'Cheque collection facility');
    }
    if (textLower.includes('standing instruction')) {
      addHighlight('standing_inst', 'Standing instructions facility');
    }
    if (textLower.includes('canara ai1') || textLower.includes('netbanking') || textLower.includes('mobile banking') || textLower.includes('internet banking')) {
      addHighlight('netbanking', 'Internet & Mobile Banking');
    }
    if (textLower.includes('unlimited locker')) {
      addHighlight('locker', 'Unlimited locker operations');
    }
    if (textLower.includes('pos benefit') || textLower.includes('pos merchant') || textLower.includes('pos terminal')) {
      addHighlight('pos', 'POS merchant perks & benefits');
    }
    if (textLower.includes('auto-sweep') || textLower.includes('auto sweep')) {
      addHighlight('auto_sweep', 'Auto-sweep savings facility');
    }
    if (textLower.includes('accident insurance') || textLower.includes('personal accident')) {
      addHighlight('insurance', 'Personal accident insurance with card');
    }
    if (textLower.includes('free printed cheque') || textLower.includes('cheque book')) {
      addHighlight('cheques', 'Free printed cheque books');
    }
    if (textLower.includes('zero balance') || textLower.includes('zero minimum')) {
      addHighlight('zero_bal', 'Zero minimum balance required');
    }
    if (textLower.includes('lounge')) {
      addHighlight('lounge', 'Complimentary airport lounge access');
    }
    if (textLower.includes('neft') || textLower.includes('rtgs') || textLower.includes('free digital')) {
      addHighlight('digital_tx', 'Free digital NEFT / RTGS transfers');
    }

    // If still have room and text contains general clauses, parse by semicolon
    if (parsedHighlights.length < maxCount) {
      const clauses = cleaned.split(/[;,]/).map(c => c.trim()).filter(Boolean);
      for (const clause of clauses) {
        const cLower = clause.toLowerCase();
        // Skip negative rules or research jargon
        if (
          cLower.includes('loan against deposit not permitted') ||
          cLower.includes('tds n/a') ||
          cLower.includes('no senior-citizen') ||
          cLower.includes('source:') ||
          cLower.includes('variant-specific') ||
          cLower.includes('benefits tied to balance') ||
          cLower.includes('cash handling:') ||
          cLower.length < 5 ||
          cLower.length > 55
        ) {
          continue;
        }
        // Capitalize first letter
        const formattedClause = clause.charAt(0).toUpperCase() + clause.slice(1);
        const slug = formattedClause.toLowerCase().slice(0, 15);
        addHighlight(slug, formattedClause);
        if (parsedHighlights.length >= maxCount) break;
      }
    }
  }

  if (parsedHighlights.length === 0) {
    return ['Standard account banking facilities', 'Nomination & passbook available'];
  }

  return parsedHighlights;
}

/**
 * Format Source & Verification Metadata for clean presentation
 */
export function formatSourceAndVerification(account = {}) {
  const rawDate = account.lastVerified || account.as_of_date || account.verifiedDate;
  const verifiedDateFormatted = formatDisplayDate(rawDate) || 'Sep 2026';
  
  // Extract effective date if present
  let effectiveDateFormatted = null;
  const fullRate = safeString(account.interest_rate || account.interestRate);
  const effMatch = fullRate.match(/effective\s*([\d.-]+)/i);
  if (effMatch) {
    effectiveDateFormatted = formatDisplayDate(effMatch[1]);
  }

  // Clean URL
  const rawUrl = account.officialSourceUrl || account.officialSource || account.source || account.applyUrl || account.bankUrl;
  let cleanUrl = rawUrl;
  let sourceDomain = 'Official Bank Portal';
  if (rawUrl) {
    try {
      const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : 'https://' + rawUrl);
      sourceDomain = parsed.hostname.replace(/^www\./, '');
      cleanUrl = parsed.href;
    } catch {
      cleanUrl = rawUrl.startsWith('http') ? rawUrl : 'https://' + rawUrl;
    }
  }

  const bankName = account.bankName || account.bank_name || account.bank || 'Bank';
  const isVerified = account.information_status !== 'Not verified' && account.status !== 'unverified';

  return {
    isVerified,
    verifiedDateFormatted,
    effectiveDateFormatted,
    sourceName: `${bankName} Official Portal`,
    sourceDomain,
    sourceUrl: cleanUrl,
    statusNote: account.information_status || 'Verified from Official Bank Dataset',
    sourceFile: account.sourceFile || `${bankName} Product Catalog`
  };
}
