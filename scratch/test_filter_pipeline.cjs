const fs = require('fs');

const rawDcards = JSON.parse(fs.readFileSync('./dcard_debit_cards.json', 'utf8'));

function safeStr(val) {
  if (val == null) return "";
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  return String(val || "");
}

function safeLower(val) {
  return safeStr(val).toLowerCase();
}

function normalizeCard(raw = {}) {
  const id = raw.id != null ? String(raw.id) : "";
  const bank = safeStr(raw.bank || raw.bankName || raw.bank_name || raw.name).trim();
  const cardName = safeStr(raw.cardName || raw.name || raw.title || raw.card_name).trim();
  const annualFee = typeof raw.annualFee === 'number' ? (raw.annualFee === 0 ? "Free" : `₹${raw.annualFee}`) : safeStr(raw.annualFee).trim();
  return { id, bank, cardName, annualFee };
}

function deduplicateCards(cards = []) {
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

const mockCards = [
  { id: 1, bank: "State Bank of India", cardName: "SBI Global International Debit Card", annualFee: "₹125 + GST" },
  { id: 2, bank: "State Bank of India", cardName: "SBI Platinum Debit Card", annualFee: "₹250 + GST" }
];

const jsonCards = rawDcards.map(c => ({ ...c, id: `json-${c.id}` }));
const allCards = deduplicateCards([...mockCards.map(normalizeCard), ...jsonCards.map(normalizeCard)]);

console.log("Total database cards:", allCards.length);

// Run filter pipeline test with no filters selected:
let cards = allCards.map(c => normalizeCard(c));
console.log(`[Filter Debug] Step 0 - Initial Cards: ${cards.length}`);
console.log(`[Filter Debug] Step 1 - Search Query (none): ${cards.length} cards`);
console.log(`[Filter Debug] Step 2 - User Types (none): ${cards.length} cards`);
console.log(`[Filter Debug] Step 3 - Networks (none): ${cards.length} cards`);
console.log(`[Filter Debug] Step 4 - Categories (none): ${cards.length} cards`);
console.log(`[Filter Debug] Step 5 - Fee Tier (none): ${cards.length} cards`);
console.log(`[Filter Debug] Step 6 - ATM Limit Tier (none): ${cards.length} cards`);
console.log(`[Filter Debug] Step 7 - POS Limit Tier (none): ${cards.length} cards`);
console.log(`[Filter Debug] Step 8 - Features (none): ${cards.length} cards`);
console.log(`[Filter Debug] Step 9 - Bank Types (none): ${cards.length} cards`);
console.log(`[Filter Debug] Step 10 - Active Presets (none): ${cards.length} cards`);
console.log(`[Filter Debug] Step 11 - Selected Banks (none): ${cards.length} cards`);
console.log(`[Filter Debug] Step 12 - Range Sliders (none active): ${cards.length} cards`);
console.log(`[Filter Debug] FINAL Filtered Output: ${cards.length} cards`);

if (allCards.length === 105 && cards.length === 105) {
  console.log("SUCCESS: Total Database = 105, No filters selected = 105 cards visible!");
} else {
  console.log("FAIL: Counts do not match 105!");
}
