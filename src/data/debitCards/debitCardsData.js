import { masterDebitCards as rawMasterCards, masterDebitCardsMap as rawMasterCardsMap } from "../debitCardsData.js";
import { validateDebitCard } from "../../utils/dataValidation.js";

/**
 * MASTER DEBIT CARDS REPOSITORY
 * Preserves all 110 cards from masterDebitCards with 100% fidelity,
 * validated and enriched with required parameters.
 */
export const normalizedDebitCards = (rawMasterCards || []).map(card => validateDebitCard(card));

export const masterDebitCardsMap = new Map(
  normalizedDebitCards.map(c => [c.card_id, c])
);

export function getDebitCardByCardId(cardId) {
  if (!cardId) return null;
  return masterDebitCardsMap.get(String(cardId)) || rawMasterCardsMap.get(String(cardId)) || null;
}

export default normalizedDebitCards;
