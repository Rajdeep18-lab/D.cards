import { currentAccountsData } from "./currentAccountsData.js";
import { masterDebitCardsMap } from "../debitCardsData.js";
import { 
  resolveAssociatedDebitCards, 
  getAccountCardRelationshipStatus 
} from "../accountCardMappings/index.js";

export const currentAccounts = currentAccountsData;

/**
 * Retrieve verified debit cards associated with a current account
 */
export function getAssociatedDebitCardsForCurrentAccount(accountOrId) {
  return resolveAssociatedDebitCards(accountOrId, masterDebitCardsMap);
}

/**
 * Retrieve primary debit card associated with a current account
 */
export function getAssociatedDebitCardForCurrentAccount(accountOrId) {
  const cards = getAssociatedDebitCardsForCurrentAccount(accountOrId);
  return cards.length > 0 ? cards[0] : null;
}

/**
 * Retrieve full debit card relationship status for a current account
 */
export function getDebitCardRelationshipStatusForCurrentAccount(accountOrId) {
  return getAccountCardRelationshipStatus(accountOrId, masterDebitCardsMap);
}

/**
 * Lookup current account by numeric ID or product_id slug
 */
export function getCurrentAccountById(id) {
  if (!id) return null;
  const strId = String(id).toLowerCase().trim();
  return currentAccounts.find(c => 
    String(c.id).toLowerCase() === strId || 
    String(c.product_id).toLowerCase() === strId
  ) || null;
}

export default currentAccounts;
