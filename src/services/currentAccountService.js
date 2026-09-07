import { db, collection, getDocs } from '../lib/firebase';
import { currentAccounts } from '../data/currentAccounts';

export const PRIMARY_COLLECTION = 'currentAccounts';
export const ALT_COLLECTION = 'current_accounts';

let cachedCurrentAccounts = null;
let lastCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

export const currentAccountService = {
  /**
   * Fetch all current accounts from memory or Firestore
   */
  async getCurrentAccounts(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && cachedCurrentAccounts && (now - lastCacheTime < CACHE_TTL)) {
      return cachedCurrentAccounts;
    }

    try {
      let querySnapshot = await getDocs(collection(db, PRIMARY_COLLECTION));
      if (querySnapshot.empty) {
        querySnapshot = await getDocs(collection(db, ALT_COLLECTION));
      }

      if (!querySnapshot.empty) {
        const firestoreAccounts = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        const mergedMap = new Map();

        currentAccounts.forEach(acc => mergedMap.set(String(acc.id), acc));
        firestoreAccounts.forEach(fa => mergedMap.set(String(fa.id), fa));

        cachedCurrentAccounts = Array.from(mergedMap.values());
        lastCacheTime = now;
        return cachedCurrentAccounts;
      }
    } catch (err) {
      console.warn("Firestore fetch notice for currentAccounts collection, using static dataset:", err.message || err);
    }

    cachedCurrentAccounts = currentAccounts;
    lastCacheTime = now;
    return currentAccounts;
  },

  /**
   * Fetch a single current account by ID or product slug
   */
  async getCurrentAccountById(accountId) {
    const all = await this.getCurrentAccounts();
    const strId = String(accountId).toLowerCase();
    return all.find(acc => String(acc.id).toLowerCase() === strId || String(acc.product_id).toLowerCase() === strId) || null;
  },

  /**
   * Invalidate local memory cache
   */
  clearCache() {
    cachedCurrentAccounts = null;
    lastCacheTime = 0;
  }
};

export default currentAccountService;
