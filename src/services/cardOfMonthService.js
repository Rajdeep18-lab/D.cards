/**
 * Card of the Month Service
 *
 * Dynamically selects the best debit card from the available dataset using a
 * transparent, weighted scoring algorithm. Persists the monthly selection to
 * localStorage so all users on the same device see the same card for the
 * entire calendar month.
 *
 * Rules:
 *  - Missing data is always treated as 0 (never as a positive).
 *  - Inactive / unavailable cards are excluded before scoring.
 *  - Ties are broken by rating, then by card name (alphabetical) for stability.
 *  - The Private/Wealth tier cards that require exclusive relationships are
 *    excluded from the public "Card of the Month" spotlight so the result is
 *    realistic for ordinary users.
 */

import {
  parseAnnualFeeVal,
  parseCashbackVal,
  parseForexVal,
  safeLower,
  safeStr,
} from '../utils/compareUtils';

// ─── Storage key helpers ───────────────────────────────────────────────────

const STORAGE_KEY_PREFIX = 'dcard_cotm_';

/** Returns "YYYY_MM" for the current calendar month */
function currentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}_${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function storageKey() {
  return `${STORAGE_KEY_PREFIX}${currentMonthKey()}`;
}

// ─── Exclusion helpers ─────────────────────────────────────────────────────

/** Cards that require exclusive private/wealth banking relationships */
const EXCLUDED_VARIANTS = [
  'private banking',
  'wealth management',
  'private',
  'infiniti',
];

function isExcluded(card) {
  const name = safeLower(card.cardName || '');
  const category = safeLower(card.category || card.cardVariant || '');
  const eligibility = safeLower(card.eligibility || '');

  return EXCLUDED_VARIANTS.some(
    (v) => name.includes(v) || category.includes(v) || eligibility.includes(v)
  );
}

function isActiveCard(card) {
  // Firestore cards may have an explicit isActive / active field
  if (card.isActive === false) return false;
  if (card.active === false) return false;
  // Exclude cards with "discontinued" or "no longer available" in name / eligibility
  const combined = safeLower(`${card.cardName} ${card.eligibility}`);
  if (combined.includes('discontinued') || combined.includes('no longer available')) {
    return false;
  }
  return true;
}

// ─── Scoring ───────────────────────────────────────────────────────────────

/**
 * Weight table (must sum to 1.0):
 *   Annual Fee          25 % — lower cost wins
 *   Cashback            20 % — higher percentage wins
 *   Lounge Access       15 % — any lounge beats none; more visits = higher
 *   Reward Points       12 % — presence and quality of reward programme
 *   Fuel Surcharge       8 % — fuel waiver is a common everyday benefit
 *   Forex Markup         8 % — lower markup is better
 *   Contactless+Intl     5 % — modern payment features
 *   Rating               7 % — star rating from the database (out of 5)
 */
const WEIGHTS = {
  annualFee: 0.25,
  cashback: 0.20,
  lounge: 0.15,
  rewards: 0.12,
  fuel: 0.08,
  forex: 0.08,
  features: 0.05,
  rating: 0.07,
};

/**
 * Score a single normalised card. Returns a value in [0, 100].
 * Every dimension is independently clamped to [0, 100] before weighting.
 */
export function scoreCard(card) {
  // ── 1. Annual Fee (0-100, lower fee → higher score) ──────────────────────
  const feeVal = parseAnnualFeeVal(card.annualFee);
  let feeScore;
  if (feeVal === 0) {
    feeScore = 100;
  } else if (feeVal <= 200) {
    feeScore = 85;
  } else if (feeVal <= 500) {
    feeScore = 65;
  } else if (feeVal <= 999) {
    feeScore = 40;
  } else {
    feeScore = 15;
  }

  // ── 2. Cashback (0-100) ───────────────────────────────────────────────────
  const cbVal = parseCashbackVal(card.cashback);
  // Treat text-based mentions ("offers available", "merchant offers") as 0.5%
  let cashbackScore = 0;
  if (cbVal > 0) {
    cashbackScore = Math.min(100, cbVal * 20); // 5% → 100
  } else {
    const cbStr = safeLower(card.cashback || '');
    if (
      cbStr.includes('offer') ||
      cbStr.includes('merchant') ||
      cbStr.includes('payback') ||
      cbStr.includes('reward')
    ) {
      cashbackScore = 15; // token score for non-zero but unparseable mentions
    }
  }

  // ── 3. Lounge Access (0-100) ──────────────────────────────────────────────
  const loungeStr = safeLower(card.loungeAccess || '');
  const hasLounge =
    loungeStr &&
    !loungeStr.startsWith('no') &&
    !loungeStr.includes('not available') &&
    !loungeStr.includes('information not available');

  let loungeScore = 0;
  if (hasLounge) {
    const visits = typeof card.loungeVisits === 'number' ? card.loungeVisits : 0;
    if (loungeStr.includes('unlimited')) {
      loungeScore = 100;
    } else if (visits >= 16) {
      loungeScore = 95;
    } else if (visits >= 8) {
      loungeScore = 80;
    } else if (visits >= 4) {
      loungeScore = 65;
    } else if (visits >= 2) {
      loungeScore = 50;
    } else {
      loungeScore = 35; // lounge mentioned but count unknown/1
    }
  }

  // ── 4. Reward Points (0-100) ──────────────────────────────────────────────
  const rewardStr = safeLower(safeStr(card.rewards || card.rewardRate || ''));
  let rewardsScore = 0;
  if (rewardStr && !rewardStr.includes('not available') && !rewardStr.includes('information not')) {
    // Extract points-per-spend ratio if present (e.g. "2 pts per Rs.100")
    const ptsMatch = rewardStr.match(/(\d+(?:\.\d+)?)\s*(pts?|points?)/i);
    const perMatch = rewardStr.match(/(?:per|every)\s*(?:rs\.?|₹)?\s*(\d+)/i);
    if (ptsMatch && perMatch) {
      const ptsPerUnit = parseFloat(ptsMatch[1]) / parseFloat(perMatch[1]);
      // Typical range: 0.005 to 0.05 pts/₹
      rewardsScore = Math.min(100, ptsPerUnit * 2000);
    } else if (
      rewardStr.includes('accelerated') ||
      rewardStr.includes('5x') ||
      rewardStr.includes('10x')
    ) {
      rewardsScore = 90;
    } else if (rewardStr.includes('3x') || rewardStr.includes('4x')) {
      rewardsScore = 75;
    } else if (rewardStr.includes('2x') || rewardStr.includes('bonus')) {
      rewardsScore = 60;
    } else {
      rewardsScore = 35; // generic rewards exist
    }
  }

  // ── 5. Fuel Surcharge Waiver (0-100) ──────────────────────────────────────
  const fuelStr = safeLower(safeStr(card.fuelSurchargeWaiver || ''));
  let fuelScore = 0;
  if (
    fuelStr &&
    !fuelStr.includes('not available') &&
    !fuelStr.includes('information not') &&
    (fuelStr.includes('waiv') || fuelStr.includes('free') || fuelStr.includes('1%'))
  ) {
    fuelScore = 100;
  }

  // ── 6. Forex Markup (0-100, lower markup → higher score) ─────────────────
  const forexVal = parseForexVal(card.forexMarkup);
  let forexScore = 0;
  if (forexVal === 0) {
    forexScore = 100;
  } else if (forexVal <= 1) {
    forexScore = 80;
  } else if (forexVal <= 2) {
    forexScore = 60;
  } else if (forexVal <= 3) {
    forexScore = 40;
  } else if (forexVal < 99) {
    forexScore = 20; // has forex markup but it's known and not N/A
  }
  // forexVal === 99 (unavailable) → 0

  // ── 7. Modern Payment Features (0-100) ───────────────────────────────────
  const featureScore =
    (card.contactless ? 50 : 0) + (card.internationalUsage ? 50 : 0);

  // ── 8. Rating (0-100) ─────────────────────────────────────────────────────
  const ratingVal = typeof card.rating === 'number' ? card.rating : 0;
  const ratingScore = Math.min(100, (ratingVal / 5) * 100);

  // ── Weighted total ─────────────────────────────────────────────────────────
  const total =
    feeScore      * WEIGHTS.annualFee +
    cashbackScore * WEIGHTS.cashback  +
    loungeScore   * WEIGHTS.lounge    +
    rewardsScore  * WEIGHTS.rewards   +
    fuelScore     * WEIGHTS.fuel      +
    forexScore    * WEIGHTS.forex     +
    featureScore  * WEIGHTS.features  +
    ratingScore   * WEIGHTS.rating;

  return Math.round(total * 10) / 10; // 1 d.p.
}

// ─── Reason builder ─────────────────────────────────────────────────────────

/**
 * Builds a 1-2 sentence human-readable reason for why this card was selected.
 * Only mentions things actually present in the card data.
 */
export function buildSelectionReason(card) {
  const parts = [];

  const feeVal = parseAnnualFeeVal(card.annualFee);
  if (feeVal === 0) {
    parts.push('zero annual fee');
  } else if (feeVal <= 300) {
    parts.push(`low annual fee (₹${feeVal})`);
  }

  const loungeStr = safeLower(card.loungeAccess || '');
  if (
    loungeStr &&
    !loungeStr.startsWith('no') &&
    !loungeStr.includes('not available') &&
    !loungeStr.includes('information not')
  ) {
    if (loungeStr.includes('unlimited')) {
      parts.push('unlimited lounge access');
    } else {
      parts.push('airport lounge access');
    }
  }

  const cbVal = parseCashbackVal(card.cashback);
  if (cbVal > 0) {
    parts.push(`${cbVal}% cashback`);
  } else {
    const cbStr = safeLower(card.cashback || '');
    if (cbStr.includes('payback') || cbStr.includes('reward') || cbStr.includes('offer')) {
      parts.push('reward points programme');
    }
  }

  const fuelStr = safeLower(card.fuelSurchargeWaiver || '');
  if (
    fuelStr &&
    !fuelStr.includes('not available') &&
    !fuelStr.includes('information not') &&
    (fuelStr.includes('waiv') || fuelStr.includes('free'))
  ) {
    parts.push('fuel surcharge waiver');
  }

  const forexVal = parseForexVal(card.forexMarkup);
  if (forexVal === 0) {
    parts.push('zero forex markup');
  }

  if (parts.length === 0) {
    return `Highest overall value among ${card.bank || 'all'} debit cards this month.`;
  }

  const joined = parts.slice(0, 3).join(', ');
  const capitalised = joined.charAt(0).toUpperCase() + joined.slice(1);
  return `${capitalised} — selected as best overall value for ${new Date().toLocaleString('en-IN', { month: 'long' })}.`;
}

// ─── Top-3 Benefit Bullets ──────────────────────────────────────────────────

/**
 * Returns up to 3 concise benefit strings drawn only from actual card data.
 */
export function topBenefitBullets(card) {
  const bullets = [];

  const feeVal = parseAnnualFeeVal(card.annualFee);
  if (feeVal === 0) {
    bullets.push('Zero annual fee — no maintenance cost');
  } else if (feeVal > 0 && feeVal <= 300) {
    bullets.push(`Low annual fee of ₹${feeVal} + GST`);
  }

  const loungeStr = safeLower(card.loungeAccess || '');
  if (
    loungeStr &&
    !loungeStr.startsWith('no') &&
    !loungeStr.includes('not available') &&
    !loungeStr.includes('information not')
  ) {
    const raw = safeStr(card.loungeAccess);
    bullets.push(`Airport lounge: ${raw.length > 60 ? raw.slice(0, 57) + '…' : raw}`);
  }

  const cbVal = parseCashbackVal(card.cashback);
  if (cbVal > 0) {
    bullets.push(`${cbVal}% cashback on eligible spends`);
  } else {
    const cbStr = safeLower(card.cashback || '');
    if (cbStr.includes('payback') || cbStr.includes('reward') || cbStr.includes('offer')) {
      const raw = safeStr(card.cashback);
      bullets.push(raw.length > 60 ? raw.slice(0, 57) + '…' : raw);
    }
  }

  const forexVal = parseForexVal(card.forexMarkup);
  if (forexVal === 0 && bullets.length < 3) {
    bullets.push('Zero forex markup — use globally without extra charges');
  }

  const fuelStr = safeLower(card.fuelSurchargeWaiver || '');
  if (
    bullets.length < 3 &&
    fuelStr &&
    !fuelStr.includes('not available') &&
    !fuelStr.includes('information not') &&
    fuelStr.includes('waiv')
  ) {
    const raw = safeStr(card.fuelSurchargeWaiver);
    bullets.push(raw.length > 60 ? raw.slice(0, 57) + '…' : raw);
  }

  // Fill from features array if still < 3
  if (bullets.length < 3 && Array.isArray(card.features)) {
    for (const f of card.features) {
      if (bullets.length >= 3) break;
      const txt = safeStr(f).trim();
      if (txt && !bullets.includes(txt)) bullets.push(txt);
    }
  }

  return bullets.slice(0, 3);
}

// ─── Selector ───────────────────────────────────────────────────────────────

/**
 * Evaluates all eligible cards and returns the best one with its score and
 * selection metadata. Returns null if there are no eligible cards.
 *
 * @param {Array} cards  Array of normalised card objects
 * @returns {{ card, score, reason, bullets, monthKey } | null}
 */
export function selectBestCard(cards) {
  if (!Array.isArray(cards) || cards.length === 0) return null;

  const eligible = cards.filter((c) => isActiveCard(c) && !isExcluded(c));
  if (eligible.length === 0) return null;

  const scored = eligible.map((c) => ({ card: c, score: scoreCard(c) }));

  // Sort: score DESC → rating DESC → cardName ASC (stable deterministic tie-break)
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const ratingDiff = (b.card.rating || 0) - (a.card.rating || 0);
    if (ratingDiff !== 0) return ratingDiff;
    return safeStr(a.card.cardName).localeCompare(safeStr(b.card.cardName));
  });

  const { card, score } = scored[0];
  const reason = buildSelectionReason(card);
  const bullets = topBenefitBullets(card);
  const monthKey = currentMonthKey();

  return { card, score, reason, bullets, monthKey };
}

// ─── Monthly Persistence ────────────────────────────────────────────────────

/**
 * Returns the monthly selection for the current month.
 *
 *  - If localStorage already holds a valid result for this month, returns it.
 *  - Otherwise, runs selectBestCard(cards), stores the result, and returns it.
 *
 * Storage format: JSON with { cardId, monthKey, score, reason, bullets }
 * The full card object is NOT stored — it is always resolved from the live
 * cards list to prevent stale data.
 *
 * @param {Array} cards  Normalised card list (from cardService or activeCardsList)
 * @returns {{ card, score, reason, bullets, monthKey } | null}
 */
export function getMonthlySelection(cards) {
  const mk = currentMonthKey();
  const key = storageKey();

  // Try to load from localStorage
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const cached = JSON.parse(raw);
      if (cached && cached.monthKey === mk && cached.cardId) {
        // Resolve the card object from the live list
        const liveCard = Array.isArray(cards)
          ? cards.find((c) => String(c.id) === String(cached.cardId))
          : null;

        if (liveCard) {
          return {
            card: liveCard,
            score: cached.score,
            reason: cached.reason || buildSelectionReason(liveCard),
            bullets: cached.bullets || topBenefitBullets(liveCard),
            monthKey: mk,
          };
        }
      }
    }
  } catch {
    // localStorage unavailable (SSR, private browsing restriction) — just recalculate
  }

  // Calculate fresh selection
  const result = selectBestCard(cards);
  if (!result) return null;

  // Persist only the lightweight metadata (not the whole card object)
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        cardId: String(result.card.id),
        monthKey: mk,
        score: result.score,
        reason: result.reason,
        bullets: result.bullets,
      })
    );

    // Purge entries from previous months to avoid localStorage bloat
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(STORAGE_KEY_PREFIX) && k !== key) {
        localStorage.removeItem(k);
        i--; // index shifts after removal
      }
    }
  } catch {
    // Ignore write failures (quota exceeded, private mode)
  }

  return result;
}

export default { scoreCard, selectBestCard, getMonthlySelection, buildSelectionReason, topBenefitBullets };

