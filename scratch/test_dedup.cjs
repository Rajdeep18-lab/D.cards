const fs = require('fs');

const rawDcards = JSON.parse(fs.readFileSync('./dcard_debit_cards.json', 'utf8'));

// Import debitCards from mockData using regex extraction or simple parse
console.log("Raw JSON cards:", rawDcards.length);

function safeStr(val) {
  if (val == null) return "";
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  return String(val || "");
}

function normalizeCard(raw = {}) {
  const id = raw.id != null ? String(raw.id) : "";
  const bank = safeStr(raw.bank || raw.bankName || raw.bank_name || raw.name).trim();
  const cardName = safeStr(raw.cardName || raw.name || raw.title || raw.card_name).trim();
  return { id, bank, cardName };
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

const jsonNorm = rawDcards.map(c => ({ ...c, id: `json-${c.id}` }));
const deduped = deduplicateCards(jsonNorm);
console.log("Deduplicated json cards:", deduped.length);
