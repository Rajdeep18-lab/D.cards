import { db, collection, addDoc, getDocs, query, where, orderBy, limit, deleteDoc, doc } from '../lib/firebase';
import { normalizeCard, calculateCardAIScore } from '../utils/compareUtils';

export const compareService = {
  /**
   * Logs a card comparison list to Firestore compare_history collection
   */
  async logComparison(userId, cardsOrIds, type = 'debitCard') {
    if (!userId || !Array.isArray(cardsOrIds) || cardsOrIds.length === 0) return null;

    const isObjects = typeof cardsOrIds[0] === 'object' && cardsOrIds[0] !== null;
    const isSavings = type === 'savingsAccount' || (isObjects && Boolean(cardsOrIds[0]?.accountName));

    let comparedCards = [];
    let comparedCardNames = [];
    let comparedBanks = [];
    let comparedCardDetails = [];

    if (isObjects) {
      const normalizedList = cardsOrIds.map(c => isSavings ? c : normalizeCard(c));
      comparedCards = normalizedList.map(c => c.id || 'unknown');
      comparedCardNames = normalizedList.map(c => c.accountName || c.cardName || 'Unknown Product');
      comparedBanks = normalizedList.map(c => c.bank || 'Unknown Bank');
      comparedCardDetails = normalizedList.map(c => {
        return {
          card_id: c.id || 'unknown',
          card_name: c.accountName || c.cardName || 'Unknown Product',
          bank_name: c.bank || 'Unknown Bank',
          annual_fee: c.minimumBalance || c.annualFee || "Free",
          productType: isSavings ? 'savingsAccount' : 'debitCard'
        };
      });
    } else {
      comparedCards = cardsOrIds.map(item => String(item || ''));
    }

    const firstCardVal = isObjects ? (cardsOrIds[0]?.accountName || cardsOrIds[0]?.cardName || cardsOrIds[0]?.id || '') : (cardsOrIds[0] || '');
    const secondCardVal = cardsOrIds.length > 1 ? (isObjects ? (cardsOrIds[1]?.accountName || cardsOrIds[1]?.cardName || cardsOrIds[1]?.id || '') : (cardsOrIds[1] || '')) : null;
    const comparedAtTimestamp = new Date().toISOString();

    const insertPayload = {
      userId: userId,
      firstCard: firstCardVal,
      secondCard: secondCardVal,
      comparedAt: comparedAtTimestamp,
      user_id: userId,
      compared_cards: comparedCardNames.length > 0 ? comparedCardNames : comparedCards,
      created_at: comparedAtTimestamp,
      comparisonType: isSavings ? 'savingsAccount' : 'debitCard'
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
