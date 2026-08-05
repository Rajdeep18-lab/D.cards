import { db, collection, addDoc, getDocs, query, where, orderBy, limit, deleteDoc, doc } from '../lib/firebase';

/**
 * Computes the overall D.Card Score™ using the same logic as DebitCardCard.jsx
 */
function calculateCardScore(card) {
  if (!card) return 50;
  let annualFeeNum = typeof card.annualFee === 'number' ? card.annualFee : parseFloat(String(card.annualFee || '').replace(/[^0-9.]/g, '')) || 0;
  let minBalNum = typeof card.minBalance === 'number' ? card.minBalance : parseFloat(String(card.minBalance || '').replace(/[^0-9.]/g, '')) || 0;

  let chargesScore = Math.round(98 - (annualFeeNum / 35) - (minBalNum / 9000));
  chargesScore = Math.min(98, Math.max(45, chargesScore));

  const loungeStr = String(card.loungeAccess || '').toLowerCase();
  const bankStr = String(card.bank || '').toLowerCase();
  const cardNameStr = String(card.cardName || '').toLowerCase();
  const categoryStr = String(card.category || '').toLowerCase();

  let perksCount = (loungeStr && !loungeStr.startsWith('no') ? 1.5 : 0) + 
                   (card.travelZeroForex ? 1.5 : 0) + 
                   (card.healthcareFriendly ? 1.5 : 0) + 
                   ((card.cashbackPct || 0) >= 1.0 ? 1 : 0) + 
                   (card.contactless ? 0.5 : 0) + 
                   (card.fuelWaiver ? 0.5 : 0);
  let benefitsScore = Math.round(55 + (perksCount * 6.5));
  benefitsScore = Math.min(98, Math.max(50, benefitsScore));

  let trustScoreVal = card.verificationStatus === 'Verified' ? 95 : card.verificationStatus === 'Recently Updated' ? 88 : 72;

  let digitalExperienceScore = categoryStr === 'digital' || bankStr.includes("fi money") ? 96 : 88;
  if (cardNameStr.includes("wealth") || cardNameStr.includes("private")) {
    digitalExperienceScore = 98;
  }

  let overallScore = Math.round((chargesScore * 0.3) + (benefitsScore * 0.3) + (trustScoreVal * 0.2) + (digitalExperienceScore * 0.2));
  overallScore = Math.min(98, Math.max(50, overallScore));

  return overallScore;
}

export const compareService = {
  /**
   * Logs a card comparison list to Firestore compare_history collection
   */
  async logComparison(userId, cardsOrIds) {
    if (!userId || !Array.isArray(cardsOrIds) || cardsOrIds.length === 0) return null;

    const isObjects = typeof cardsOrIds[0] === 'object' && cardsOrIds[0] !== null;

    let comparedCards = [];
    let comparedCardNames = [];
    let comparedBanks = [];
    let comparedCardDetails = [];

    if (isObjects) {
      comparedCards = cardsOrIds.map(c => c?.id || 'unknown');
      comparedCardNames = cardsOrIds.map(c => c?.cardName || 'Unknown Card');
      comparedBanks = cardsOrIds.map(c => c?.bank || 'Unknown Bank');
      comparedCardDetails = cardsOrIds.map(c => {
        const scoreVal = calculateCardScore(c);
        return {
          card_id: c?.id || 'unknown',
          card_name: c?.cardName || 'Unknown Card',
          bank_name: c?.bank || 'Unknown Bank',
          annual_fee: c?.annualFee === 0 ? "Lifetime Free" : (c?.annualFee ? `₹${c.annualFee}` : "Not Available"),
          score: `${scoreVal}/100`
        };
      });
    } else {
      comparedCards = cardsOrIds;
    }

    const firstCardVal = isObjects ? (cardsOrIds[0]?.cardName || cardsOrIds[0]?.id || '') : (cardsOrIds[0] || '');
    const secondCardVal = cardsOrIds.length > 1 ? (isObjects ? (cardsOrIds[1]?.cardName || cardsOrIds[1]?.id || '') : (cardsOrIds[1] || '')) : null;
    const comparedAtTimestamp = new Date().toISOString();

    const insertPayload = {
      // Requirement 2 fields:
      userId: userId,
      firstCard: firstCardVal,
      secondCard: secondCardVal,
      comparedAt: comparedAtTimestamp,
      // Compatibility fields:
      user_id: userId,
      compared_cards: comparedCards,
      created_at: comparedAtTimestamp
    };

    if (isObjects) {
      insertPayload.compared_card_names = comparedCardNames;
      insertPayload.compared_banks = comparedBanks;
      insertPayload.compared_card_details = comparedCardDetails;
    }

    try {
      const docRef = await addDoc(collection(db, 'compare_history'), insertPayload);
      return { id: docRef.id, ...insertPayload };
    } catch (error) {
      console.warn("Could not log comparison history to Firestore: ", error.message);
      return insertPayload;
    }
  },

  /**
   * Retrieves the latest 10 card comparisons logged by a user
   */
  async getComparisonHistory(userId) {
    if (!userId) return [];
    try {
      const q = query(
        collection(db, 'compare_history'),
        where('user_id', '==', userId),
        orderBy('created_at', 'desc'),
        limit(10)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
    } catch (error) {
      // Fallback query if compound index on (user_id, created_at) is not yet built in Firestore console
      try {
        const fallbackQ = query(
          collection(db, 'compare_history'),
          where('user_id', '==', userId)
        );
        const snapshot = await getDocs(fallbackQ);
        const docs = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        return docs
          .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
          .slice(0, 10);
      } catch (fallbackErr) {
        console.warn("Firestore comparison history fallback notice: ", fallbackErr.message);
        return [];
      }
    }
  },

  /**
   * Deletes a comparison history item by ID
   */
  async deleteComparisonHistory(userId, historyId) {
    if (!historyId) return;
    try {
      await deleteDoc(doc(db, 'compare_history', historyId));
    } catch (error) {
      console.warn("Firestore delete comparison history notice: ", error.message);
    }
  }
};
