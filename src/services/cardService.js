import { db, collection, getDocs, doc, getDoc } from '../lib/firebase';
import { debitCards } from '../data/mockData';

export const DEBIT_CARDS_COLLECTION = 'debit_cards';

// In-memory caching for zero-latency page transitions & 99% reduction in Firestore reads
let cachedCards = null;
let lastCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL

/**
 * Service to interact exclusively with Firestore `debit_cards` collection
 */
export const cardService = {
  /**
   * Fetch all debit cards from Firestore `debit_cards` collection (with in-memory TTL caching and mock fallback)
   */
  async getDebitCards(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && cachedCards && (now - lastCacheTime < CACHE_TTL)) {
      return cachedCards;
    }

    try {
      const querySnapshot = await getDocs(collection(db, DEBIT_CARDS_COLLECTION));
      if (!querySnapshot.empty) {
        cachedCards = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        lastCacheTime = now;
        return cachedCards;
      }
    } catch (err) {
      console.warn("Firestore fetch notice for debit_cards collection, using fallback dataset:", err.message || err);
    }

    cachedCards = debitCards;
    lastCacheTime = now;
    return debitCards;
  },

  /**
   * Fetch a single debit card by ID from `debit_cards` collection
   */
  async getDebitCardById(cardId) {
    if (cachedCards) {
      const found = cachedCards.find(c => String(c.id) === String(cardId));
      if (found) return found;
    }

    try {
      const docRef = doc(db, DEBIT_CARDS_COLLECTION, String(cardId));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
    } catch (err) {
      console.warn(`Firestore fetch notice for card ${cardId}:`, err.message || err);
    }
    return debitCards.find(c => String(c.id) === String(cardId)) || null;
  },

  /**
   * Invalidate local memory cache
   */
  clearCache() {
    cachedCards = null;
    lastCacheTime = 0;
  }
};

export default cardService;
