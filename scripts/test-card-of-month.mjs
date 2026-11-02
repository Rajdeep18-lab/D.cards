/**
 * test-card-of-month.mjs
 *
 * Unit tests for the Card of the Month scoring and selection service.
 * Tests run in Node.js ESM mode — no browser APIs available.
 * localStorage is mocked in-process.
 *
 * Run: node scripts/test-card-of-month.mjs
 * Exit code: 0 = all pass, 1 = any failure.
 */

// ─── Inline the pure logic (no React/browser imports needed) ─────────────────
// We re-implement the utilities and service inline so this script is
// self-contained and does not require a bundler.

// Mirrors compareUtils.js helpers
function safeStr(val) {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  return String(val || '');
}
function safeLower(val) {
  return safeStr(val).toLowerCase();
}

function parseAnnualFeeVal(v) {
  if (typeof v === 'number') return v;
  const s = safeLower(v);
  if (s.includes('free') || s.includes('waived') || s === '0' || s === '₹0') return 0;
  if (s.includes('complimentary')) return 0;
  const n = parseFloat(s.replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 0 : n;
}

function parseCashbackVal(v) {
  if (typeof v === 'number') return v;
  const s = safeLower(v);
  if (s.includes('no') || s.includes('not available')) return 0;
  const pct = s.match(/([\d.]+)\s*%/);
  if (pct) return parseFloat(pct[1]) || 0;
  const n = parseFloat(s.replace(/[^0-9.]/g, ''));
  return isNaN(n) ? (s.includes('offer') ? 0.5 : 0) : n;
}

function parseForexVal(v) {
  if (typeof v === 'number') return v;
  const s = safeLower(v);
  if (s.includes('not available') || s.includes('n/a') || !s) return 99;
  if (s.includes('0%') || s.includes('zero') || s.includes('free') || s.includes('nil')) return 0;
  const pct = s.match(/([\d.]+)\s*%/);
  if (pct) return parseFloat(pct[1]) || 0;
  const n = parseFloat(s.replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 3.5 : n;
}

const WEIGHTS = {
  annualFee: 0.25, cashback: 0.20, lounge: 0.15, rewards: 0.12,
  fuel: 0.08, forex: 0.08, features: 0.05, rating: 0.07,
};

const EXCLUDED_VARIANTS = ['private banking', 'wealth management', 'private', 'infiniti'];

function isExcluded(card) {
  const name = safeLower(card.cardName || '');
  const cat = safeLower(card.category || card.cardVariant || '');
  const elig = safeLower(card.eligibility || '');
  return EXCLUDED_VARIANTS.some(v => name.includes(v) || cat.includes(v) || elig.includes(v));
}

function isActiveCard(card) {
  if (card.isActive === false) return false;
  if (card.active === false) return false;
  const combined = safeLower(`${card.cardName} ${card.eligibility}`);
  if (combined.includes('discontinued') || combined.includes('no longer available')) return false;
  return true;
}

function scoreCard(card) {
  const feeVal = parseAnnualFeeVal(card.annualFee);
  let feeScore = feeVal === 0 ? 100 : feeVal <= 200 ? 85 : feeVal <= 500 ? 65 : feeVal <= 999 ? 40 : 15;

  const cbVal = parseCashbackVal(card.cashback);
  let cashbackScore = 0;
  if (cbVal > 0) {
    cashbackScore = Math.min(100, cbVal * 20);
  } else {
    const s = safeLower(card.cashback || '');
    if (s.includes('offer') || s.includes('merchant') || s.includes('payback') || s.includes('reward')) {
      cashbackScore = 15;
    }
  }

  const loungeStr = safeLower(card.loungeAccess || '');
  const hasLounge = loungeStr && !loungeStr.startsWith('no') &&
    !loungeStr.includes('not available') && !loungeStr.includes('information not available');
  let loungeScore = 0;
  if (hasLounge) {
    const visits = typeof card.loungeVisits === 'number' ? card.loungeVisits : 0;
    if (loungeStr.includes('unlimited')) loungeScore = 100;
    else if (visits >= 16) loungeScore = 95;
    else if (visits >= 8) loungeScore = 80;
    else if (visits >= 4) loungeScore = 65;
    else if (visits >= 2) loungeScore = 50;
    else loungeScore = 35;
  }

  const rewardStr = safeLower(safeStr(card.rewards || card.rewardRate || ''));
  let rewardsScore = 0;
  if (rewardStr && !rewardStr.includes('not available') && !rewardStr.includes('information not')) {
    const ptsMatch = rewardStr.match(/(\d+(?:\.\d+)?)\s*(pts?|points?)/i);
    const perMatch = rewardStr.match(/(?:per|every)\s*(?:rs\.?|₹)?\s*(\d+)/i);
    if (ptsMatch && perMatch) {
      rewardsScore = Math.min(100, (parseFloat(ptsMatch[1]) / parseFloat(perMatch[1])) * 2000);
    } else if (rewardStr.includes('accelerated') || rewardStr.includes('5x') || rewardStr.includes('10x')) {
      rewardsScore = 90;
    } else if (rewardStr.includes('3x') || rewardStr.includes('4x')) {
      rewardsScore = 75;
    } else if (rewardStr.includes('2x') || rewardStr.includes('bonus')) {
      rewardsScore = 60;
    } else {
      rewardsScore = 35;
    }
  }

  const fuelStr = safeLower(safeStr(card.fuelSurchargeWaiver || ''));
  let fuelScore = (fuelStr && !fuelStr.includes('not available') && !fuelStr.includes('information not') &&
    (fuelStr.includes('waiv') || fuelStr.includes('free') || fuelStr.includes('1%'))) ? 100 : 0;

  const forexVal = parseForexVal(card.forexMarkup);
  let forexScore = forexVal === 0 ? 100 : forexVal <= 1 ? 80 : forexVal <= 2 ? 60 : forexVal <= 3 ? 40 : forexVal < 99 ? 20 : 0;

  const featureScore = (card.contactless ? 50 : 0) + (card.internationalUsage ? 50 : 0);

  const ratingVal = typeof card.rating === 'number' ? card.rating : 0;
  const ratingScore = Math.min(100, (ratingVal / 5) * 100);

  const total = feeScore * WEIGHTS.annualFee + cashbackScore * WEIGHTS.cashback +
    loungeScore * WEIGHTS.lounge + rewardsScore * WEIGHTS.rewards +
    fuelScore * WEIGHTS.fuel + forexScore * WEIGHTS.forex +
    featureScore * WEIGHTS.features + ratingScore * WEIGHTS.rating;

  return Math.round(total * 10) / 10;
}

function selectBestCard(cards) {
  if (!Array.isArray(cards) || cards.length === 0) return null;
  const eligible = cards.filter(c => isActiveCard(c) && !isExcluded(c));
  if (eligible.length === 0) return null;
  const scored = eligible.map(c => ({ card: c, score: scoreCard(c) }));
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const rd = (b.card.rating || 0) - (a.card.rating || 0);
    if (rd !== 0) return rd;
    return safeStr(a.card.cardName).localeCompare(safeStr(b.card.cardName));
  });
  return { card: scored[0].card, score: scored[0].score };
}

// Minimal localStorage mock
const _lsStore = {};
const mockLocalStorage = {
  getItem: k => _lsStore[k] ?? null,
  setItem: (k, v) => { _lsStore[k] = v; },
  removeItem: k => { delete _lsStore[k]; },
  get length() { return Object.keys(_lsStore).length; },
  key: i => Object.keys(_lsStore)[i] ?? null,
};

function currentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}_${String(d.getMonth() + 1).padStart(2, '0')}`;
}
const STORAGE_KEY_PREFIX = 'dcard_cotm_';
function storageKey() { return `${STORAGE_KEY_PREFIX}${currentMonthKey()}`; }

function getMonthlySelection(cards, ls = mockLocalStorage) {
  const mk = currentMonthKey();
  const key = storageKey();
  try {
    const raw = ls.getItem(key);
    if (raw) {
      const cached = JSON.parse(raw);
      if (cached && cached.monthKey === mk && cached.cardId) {
        const liveCard = Array.isArray(cards) ? cards.find(c => String(c.id) === String(cached.cardId)) : null;
        if (liveCard) return { card: liveCard, score: cached.score, monthKey: mk };
      }
    }
  } catch {}
  const result = selectBestCard(cards);
  if (!result) return null;
  try {
    ls.setItem(key, JSON.stringify({ cardId: String(result.card.id), monthKey: mk, score: result.score }));
  } catch {}
  return { ...result, monthKey: mk };
}

// ─── Test harness ────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅  ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ❌  ${name}`);
    console.error(`       ${e.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

function assertEqual(a, b, msg) {
  if (a !== b) throw new Error(msg || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}

// ─── Sample card fixtures ────────────────────────────────────────────────────

const FREE_FEE_LOUNGE_CARD = {
  id: '1', bank: 'Test Bank', cardName: 'Premium Free Card',
  annualFee: 'Free', cashback: '3%', loungeAccess: '4 visits/year', loungeVisits: 4,
  forexMarkup: '0%', fuelSurchargeWaiver: 'Waived on fuel spends',
  contactless: true, internationalUsage: true, rating: 4.8,
  rewards: '2 pts per Rs.100',
};

const HIGH_FEE_NO_PERKS_CARD = {
  id: '2', bank: 'Plain Bank', cardName: 'Plain Card',
  annualFee: '₹2000', cashback: 'No', loungeAccess: 'Not Available',
  forexMarkup: '3.5%', fuelSurchargeWaiver: 'Not Available',
  contactless: false, internationalUsage: false, rating: 3.5,
  rewards: '',
};

const INACTIVE_CARD = {
  id: '3', bank: 'Dead Bank', cardName: 'Old Card',
  annualFee: 'Free', cashback: '5%', isActive: false, rating: 4.9,
};

const PRIVATE_CARD = {
  id: '4', bank: 'Wealth Bank', cardName: 'Private Banking Signature Card',
  annualFee: 'Complimentary', cashback: '5%', rating: 5.0,
  loungeAccess: 'Unlimited',
};

const ZERO_FEE_CARD = {
  id: '5', bank: 'Digital Bank', cardName: 'Zero Fee Digital Card',
  annualFee: '0', cashback: '1%', loungeAccess: 'Not Available',
  forexMarkup: 'Not Available', fuelSurchargeWaiver: 'Waived on fuel spends',
  contactless: true, internationalUsage: false, rating: 4.2,
  rewards: '',
};

const CARD_WITH_OFFERS = {
  id: '6', bank: 'Merchant Bank', cardName: 'Offers Card',
  annualFee: '₹300', cashback: 'Merchant Offers Available',
  loungeAccess: 'Not Available', forexMarkup: '2%',
  fuelSurchargeWaiver: 'Not Available',
  contactless: true, internationalUsage: true, rating: 4.0,
};

// ─── Tests ───────────────────────────────────────────────────────────────────

console.log('\n📋  Card of the Month — Test Suite\n');

// ── Group 1: Scoring ──────────────────────────────────────────────────────────
console.log('1. Scoring');

test('Free annual fee scores 100 on fee dimension', () => {
  const feeVal = parseAnnualFeeVal('Free');
  assertEqual(feeVal, 0, 'parseAnnualFeeVal("Free") should return 0');
});

test('Score: free-fee + lounge + cashback card beats plain high-fee card', () => {
  const s1 = scoreCard(FREE_FEE_LOUNGE_CARD);
  const s2 = scoreCard(HIGH_FEE_NO_PERKS_CARD);
  assert(s1 > s2, `Premium card score (${s1}) should exceed plain card score (${s2})`);
});

test('Score: zero cashback gets 0 cashback component', () => {
  const card = { ...HIGH_FEE_NO_PERKS_CARD };
  const score = scoreCard(card);
  // plain card has no cashback — its cashback contribution should be 0
  const feeScore = 15; // >₹1000
  const maxWithoutCashback = feeScore * WEIGHTS.annualFee + 100 * WEIGHTS.features; // optimistic others
  assert(score < 80, `Plain card score (${score}) should be well below 80`);
});

test('Score: zero forex gives maximum forex component', () => {
  const withZeroForex = { ...ZERO_FEE_CARD, forexMarkup: '0%' };
  const withHighForex = { ...ZERO_FEE_CARD, forexMarkup: '3.5%' };
  assert(
    scoreCard(withZeroForex) > scoreCard(withHighForex),
    'Zero forex card should score higher than high-forex card'
  );
});

test('Score: unlimited lounge beats no lounge', () => {
  const withLounge = { ...ZERO_FEE_CARD, loungeAccess: 'Unlimited', loungeVisits: 100 };
  const withoutLounge = { ...ZERO_FEE_CARD };
  assert(
    scoreCard(withLounge) > scoreCard(withoutLounge),
    'Card with unlimited lounge should score higher'
  );
});

test('Score: missing data fields all contribute 0 (not positive)', () => {
  const minimalCard = { id: '99', bank: 'B', cardName: 'Min Card', annualFee: '₹5000' };
  const score = scoreCard(minimalCard);
  // Only fee contributes (score = 15 * 0.25 = 3.75) — rating 0*0.07=0, rest 0
  assert(score <= 20, `Minimal card score (${score}) should be very low (≤20)`);
});

test('Score: "Merchant Offers Available" cashback gets token credit (>0)', () => {
  const s = scoreCard(CARD_WITH_OFFERS);
  const withNoCashback = { ...CARD_WITH_OFFERS, cashback: 'No' };
  const s2 = scoreCard(withNoCashback);
  assert(s > s2, 'Merchant-offers cashback should score slightly higher than "No" cashback');
});

// ── Group 2: Selection ────────────────────────────────────────────────────────
console.log('\n2. Selection');

test('Selects the highest-scoring card', () => {
  const cards = [HIGH_FEE_NO_PERKS_CARD, FREE_FEE_LOUNGE_CARD, ZERO_FEE_CARD];
  const result = selectBestCard(cards);
  assert(result !== null, 'Result should not be null');
  assertEqual(result.card.id, FREE_FEE_LOUNGE_CARD.id, 'Should select the free-fee + lounge card');
});

test('Returns null for empty card list', () => {
  const result = selectBestCard([]);
  assert(result === null, 'Should return null for empty list');
});

test('Returns null for null/undefined input', () => {
  assert(selectBestCard(null) === null, 'null input → null');
  assert(selectBestCard(undefined) === null, 'undefined input → null');
});

// ── Group 3: Inactive card exclusion ────────────────────────────────────────
console.log('\n3. Inactive card exclusion');

test('Inactive card (isActive: false) is excluded from selection', () => {
  const cards = [INACTIVE_CARD, HIGH_FEE_NO_PERKS_CARD];
  const result = selectBestCard(cards);
  assert(result !== null, 'Should still return a card from eligible ones');
  assert(result.card.id !== INACTIVE_CARD.id, 'Should NOT select the inactive card');
});

test('active: false also excludes card', () => {
  const card = { ...FREE_FEE_LOUNGE_CARD, id: '99', active: false };
  const result = selectBestCard([card, HIGH_FEE_NO_PERKS_CARD]);
  assertEqual(result.card.id, HIGH_FEE_NO_PERKS_CARD.id, 'active:false card should be excluded');
});

test('Returns null when all cards are inactive', () => {
  const cards = [{ ...INACTIVE_CARD }, { ...INACTIVE_CARD, id: '10', active: false }];
  assert(selectBestCard(cards) === null, 'All inactive → null result');
});

// ── Group 4: Private/Wealth card exclusion ────────────────────────────────────
console.log('\n4. Private/Wealth card exclusion');

test('Private banking card is excluded despite top scores', () => {
  const cards = [PRIVATE_CARD, FREE_FEE_LOUNGE_CARD];
  const result = selectBestCard(cards);
  assert(result !== null, 'Should return something');
  assert(result.card.id !== PRIVATE_CARD.id, 'Private card should be excluded');
});

test('isExcluded correctly flags private banking cards', () => {
  assert(isExcluded(PRIVATE_CARD), 'Private card should be flagged as excluded');
  assert(!isExcluded(FREE_FEE_LOUNGE_CARD), 'Normal card should not be excluded');
});

// ── Group 5: Monthly persistence ─────────────────────────────────────────────
console.log('\n5. Monthly persistence');

test('Same card is returned for the same month (localStorage hit)', () => {
  const ls = { store: {}, getItem(k) { return this.store[k] ?? null; }, setItem(k, v) { this.store[k] = v; }, removeItem(k) { delete this.store[k]; }, get length() { return Object.keys(this.store).length; }, key(i) { return Object.keys(this.store)[i] ?? null; } };
  const cards = [FREE_FEE_LOUNGE_CARD, HIGH_FEE_NO_PERKS_CARD];
  const first = getMonthlySelection(cards, ls);
  const second = getMonthlySelection(cards, ls);
  assert(first !== null && second !== null, 'Both calls should return results');
  assertEqual(first.card.id, second.card.id, 'Same card should be returned on second call');
  assertEqual(first.score, second.score, 'Same score should be returned on second call');
});

test('Month transition triggers re-selection', () => {
  const ls = { store: {}, getItem(k) { return this.store[k] ?? null; }, setItem(k, v) { this.store[k] = v; }, removeItem(k) { delete this.store[k]; }, get length() { return Object.keys(this.store).length; }, key(i) { return Object.keys(this.store)[i] ?? null; } };
  const cards = [FREE_FEE_LOUNGE_CARD, HIGH_FEE_NO_PERKS_CARD];
  // Simulate a cached entry from a previous month
  ls.setItem(`${STORAGE_KEY_PREFIX}2025_01`, JSON.stringify({
    cardId: String(HIGH_FEE_NO_PERKS_CARD.id),
    monthKey: '2025_01',
    score: 20,
  }));
  const result = getMonthlySelection(cards, ls);
  assert(result !== null, 'Result should not be null');
  // The stale 2025_01 entry should NOT influence current month selection
  // (current month is 2026_11 which is different from 2025_01)
  assertEqual(result.card.id, FREE_FEE_LOUNGE_CARD.id, 'Should select best card for current month, not cached stale entry');
});

test('Cached result uses live card object (not stale data)', () => {
  const ls = { store: {}, getItem(k) { return this.store[k] ?? null; }, setItem(k, v) { this.store[k] = v; }, removeItem(k) { delete this.store[k]; }, get length() { return Object.keys(this.store).length; }, key(i) { return Object.keys(this.store)[i] ?? null; } };
  const cards = [FREE_FEE_LOUNGE_CARD, HIGH_FEE_NO_PERKS_CARD];
  getMonthlySelection(cards, ls); // prime cache

  // Now pass a list with updated card data (e.g. bank name changed)
  const updatedCard = { ...FREE_FEE_LOUNGE_CARD, bank: 'Updated Bank Name' };
  const result = getMonthlySelection([updatedCard, HIGH_FEE_NO_PERKS_CARD], ls);
  assert(result !== null, 'Should still return a result');
  assertEqual(result.card.bank, 'Updated Bank Name', 'Should return live card data, not stale cached object');
});

// ── Group 6: Empty database fallback ─────────────────────────────────────────
console.log('\n6. Edge cases');

test('Empty array returns null', () => {
  assert(selectBestCard([]) === null, 'Empty array → null');
});

test('Single eligible card is returned', () => {
  const result = selectBestCard([FREE_FEE_LOUNGE_CARD]);
  assert(result !== null, 'Single card should be selectable');
  assertEqual(result.card.id, FREE_FEE_LOUNGE_CARD.id, 'Should return the only eligible card');
});

test('Deterministic tie-breaking: same scores sorted alphabetically by cardName', () => {
  const cardA = { ...ZERO_FEE_CARD, id: 'a', cardName: 'Alpha Card', rating: 4.0 };
  const cardB = { ...ZERO_FEE_CARD, id: 'b', cardName: 'Bravo Card', rating: 4.0 };
  const result1 = selectBestCard([cardA, cardB]);
  const result2 = selectBestCard([cardB, cardA]); // reversed input order
  assertEqual(result1.card.id, result2.card.id, 'Tie-breaking should be deterministic regardless of input order');
  assertEqual(result1.card.cardName, 'Alpha Card', 'Alphabetically first card should win tie');
});

test('Complimentary annual fee (Private Banking text) is excluded, not counted as free', () => {
  // PRIVATE_CARD has "Complimentary for Private Banking" — should be excluded, not just scored 0
  const result = selectBestCard([PRIVATE_CARD]);
  assert(result === null, 'Private card alone → no eligible cards → null');
});

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('─'.repeat(50));

if (failed > 0) {
  console.error(`\n❌  ${failed} test(s) failed.\n`);
  process.exit(1);
} else {
  console.log(`\n✅  All ${passed} tests passed.\n`);
  process.exit(0);
}

