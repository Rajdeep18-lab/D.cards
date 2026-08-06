import { db, collection, getDocs } from '../lib/firebase';
import { allDebitCards, debitCards } from '../data/mockData';
import { normalizeCard } from '../utils/compareUtils';

export const DEBIT_CARDS_COLLECTION = 'debit_cards';

// In-memory caching for zero-latency page transitions
let cachedCards = null;
let lastCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes TTL

/**
 * Service to interact with debit cards collection and static datasets
 */
export const cardService = {
  /**
   * Fetch all debit cards, combining mock and JSON datasets
   */
  async getDebitCards(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && cachedCards && (now - lastCacheTime < CACHE_TTL)) {
      return cachedCards;
    }

    try {
      const querySnapshot = await getDocs(collection(db, DEBIT_CARDS_COLLECTION));
      if (!querySnapshot.empty) {
        const firestoreCards = querySnapshot.docs.map(docSnap => normalizeCard({ id: docSnap.id, ...docSnap.data() }));
        const mergedMap = new Map();
        
        allDebitCards.forEach(c => mergedMap.set(String(c.id), c));
        firestoreCards.forEach(fc => mergedMap.set(String(fc.id), fc));

        cachedCards = Array.from(mergedMap.values());
        lastCacheTime = now;
        return cachedCards;
      }
    } catch (err) {
      console.warn("Firestore fetch notice for debit_cards collection, using combined dataset:", err.message || err);
    }

    cachedCards = allDebitCards;
    lastCacheTime = now;
    return allDebitCards;
  },

  /**
   * Fetch a single debit card by ID from combined dataset
   */
  async getDebitCardById(cardId) {
    const all = await this.getDebitCards();
    const strId = String(cardId);
    return all.find(c => String(c.id) === strId) || null;
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

