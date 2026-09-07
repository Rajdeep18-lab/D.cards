import { savingsAccountsData } from "./savingsAccountsData.js";
import { masterDebitCardsMap } from "../debitCardsData.js";
import { 
  resolveAssociatedDebitCards, 
  getAccountCardRelationshipStatus,
  getAccountDebitCardMappings 
} from "../accountCardMappings/index.js";

export const savingsAccounts = savingsAccountsData;

/**
 * Retrieve verified debit cards associated with a savings account
 */
export function getAssociatedDebitCards(accountOrId) {
  return resolveAssociatedDebitCards(accountOrId, masterDebitCardsMap);
}

/**
 * Retrieve primary debit card associated with a savings account
 */
export function getAssociatedDebitCard(accountOrId) {
  const cards = getAssociatedDebitCards(accountOrId);
  return cards.length > 0 ? cards[0] : null;
}

/**
 * Retrieve full debit card relationship status
 */
export function getDebitCardRelationshipStatus(accountOrId) {
  return getAccountCardRelationshipStatus(accountOrId, masterDebitCardsMap);
}

/**
 * Lookup savings account by numeric ID or product_id slug
 */
export function getSavingsAccountById(id) {
  if (!id) return null;
  const strId = String(id).toLowerCase().trim();
  return savingsAccounts.find(s => 
    String(s.id).toLowerCase() === strId || 
    String(s.product_id).toLowerCase() === strId
  ) || null;
}

export default savingsAccounts;
