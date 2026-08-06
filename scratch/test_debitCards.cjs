const fs = require('fs');

const mockDataContent = fs.readFileSync('./src/data/mockData.js', 'utf8');
const debitCardsMatch = mockDataContent.match(/export const debitCards = (\[[\s\S]*?\n\];)/);

let mockDebitCards = [];
if (debitCardsMatch) {
  mockDebitCards = eval(debitCardsMatch[1].replace(/;\s*$/, ''));
}

console.log("debitCards count:", mockDebitCards.length);

function safeStr(val) {
  if (val == null) return "";
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  return String(val || "");
}

function safeLower(val) {
  return safeStr(val).toLowerCase();
}

function safeMap(arr, fn) {
  if (!Array.isArray(arr)) return [];
  return arr.map(fn);
}

function parseAnnualFeeVal(feeStrOrNum) {
  if (typeof feeStrOrNum === 'number') return feeStrOrNum;
  const str = safeLower(feeStrOrNum);
  if (str.includes('free') || str.includes('waived') || str === '0' || str === '₹0' || str === 'rs.0') return 0;
  const parsed = parseFloat(str.replace(/[^0-9.]/g, ''));
  return !isNaN(parsed) ? parsed : 0;
}

function normalizeCard(raw = {}) {
  const id = raw.id != null ? String(raw.id) : "";
  const bank = safeStr(raw.bank || raw.bankName || raw.bank_name || raw.name).trim();
  const cardName = safeStr(raw.cardName || raw.name || raw.title || raw.card_name).trim();
  const annualFee = typeof raw.annualFee === 'number' ? (raw.annualFee === 0 ? "Free" : `₹${raw.annualFee}`) : safeStr(raw.annualFee).trim();
  return { id, bank, cardName, annualFee };
}

let cards = mockDebitCards.map(c => normalizeCard(c));
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
