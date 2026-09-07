import { accountDebitCardMappings } from "./accountCardMappingsData.js";
import { normalizeDebitCardRelationship, NOT_SPECIFIED } from "../../utils/dataValidation.js";

/**
 * Retrieve explicit account-debit card mapping entries for an account
 */
export function getAccountDebitCardMappings(accountOrId) {
  if (!accountOrId) return [];

  let productId = "";
  let numericId = "";

  if (typeof accountOrId === "object" && accountOrId !== null) {
    productId = String(accountOrId.product_id || "").toLowerCase();
    numericId = String(accountOrId.id || "").toLowerCase();
  } else {
    productId = String(accountOrId).toLowerCase();
    numericId = String(accountOrId).toLowerCase();
  }

  return accountDebitCardMappings.filter((m) => {
    const target = String(m.account_id || "").toLowerCase();
    const numTarget = String(m.account_numeric_id || "").toLowerCase();
    return target === productId || target === numericId || numTarget === productId || numTarget === numericId;
  });
}

/**
 * Resolves verified debit cards for any account (Savings or Current) against a master cards map
 */
export function resolveAssociatedDebitCards(accountOrId, masterCardsMap = new Map()) {
  if (!accountOrId) return [];

  let account = null;
  if (typeof accountOrId === "object" && accountOrId !== null) {
    account = accountOrId;
  }

  const explicitMappings = getAccountDebitCardMappings(account || accountOrId);
  const localMappings = account && Array.isArray(account.debit_card_relationships)
    ? account.debit_card_relationships
    : [];

  const allMappings = [...explicitMappings, ...localMappings];
  const accountBankId = account ? String(account.bank_id || "").toLowerCase().trim() : "";

  const verifiedCards = [];
  const seenCardIds = new Set();

  for (const rel of allMappings) {
    const cardId = rel.card_id || rel.cardId;
    if (!cardId || seenCardIds.has(cardId)) continue;

    const card = masterCardsMap.get(cardId);
    if (!card) continue;

    // Strict validation: card bank ID must match account bank ID AND relationship must be explicit
    const cardBankId = String(card.bank_id || "").toLowerCase().trim();
    if (accountBankId && cardBankId && cardBankId !== accountBankId) {
      continue;
    }

    seenCardIds.add(cardId);
    verifiedCards.push({
      ...card,
      relationship: normalizeDebitCardRelationship(rel.relationship),
      verification_status: rel.verification_status || 'verified'
    });
  }

  return verifiedCards;
}

/**
 * Retrieve relationship status message and cards
 */
export function getAccountCardRelationshipStatus(accountOrId, masterCardsMap = new Map()) {
  if (!accountOrId) {
    return { status: 'none', cards: [], message: NOT_SPECIFIED };
  }

  const verifiedCards = resolveAssociatedDebitCards(accountOrId, masterCardsMap);
  if (verifiedCards.length > 0) {
    return { status: 'verified', cards: verifiedCards, message: null };
  }

  const mappings = getAccountDebitCardMappings(accountOrId);
  const hasPending = mappings.some(m => m.verification_status === 'pending');
  if (hasPending) {
    return { status: 'pending', cards: [], message: 'Debit card relationship pending verification.' };
  }

  return { status: 'none', cards: [], message: NOT_SPECIFIED };
}

export { accountDebitCardMappings };
export default accountDebitCardMappings;
