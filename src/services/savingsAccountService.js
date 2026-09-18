import { db, collection, getDocs } from '../lib/firebase';
import { savingsAccounts } from '../data/mockSavingsAccounts';

export const PRIMARY_COLLECTION = 'savingsAccounts';
export const ALT_COLLECTION = 'savings_accounts';

let cachedSavingsAccounts = null;
let lastCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

export const savingsAccountService = {
  async getSavingsAccounts(forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && cachedSavingsAccounts && (now - lastCacheTime < CACHE_TTL)) {
      return cachedSavingsAccounts;
    }

    try {
      let querySnapshot = await getDocs(collection(db, PRIMARY_COLLECTION));
      if (querySnapshot.empty) {
        querySnapshot = await getDocs(collection(db, ALT_COLLECTION));
      }

      if (!querySnapshot.empty) {
        const firestoreAccounts = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
        const mergedMap = new Map();

        savingsAccounts.forEach(acc => mergedMap.set(String(acc.id), acc));
        firestoreAccounts.forEach(fa => mergedMap.set(String(fa.id), fa));

        cachedSavingsAccounts = Array.from(mergedMap.values());
        lastCacheTime = now;
        return cachedSavingsAccounts;
      }
    } catch (err) {
      console.warn("Firestore fetch notice for savingsAccounts collection, using static dataset:", err.message || err);
    }

    cachedSavingsAccounts = savingsAccounts;
    lastCacheTime = now;
    return savingsAccounts;
  },

  async getSavingsAccountById(accountId) {
    if (!accountId) return null;
    const all = await this.getSavingsAccounts();
    const strId = String(accountId).toLowerCase().trim();
    return all.find(acc => 
      (acc.id != null && String(acc.id).toLowerCase().trim() === strId) || 
      (acc.product_id != null && String(acc.product_id).toLowerCase().trim() === strId) ||
      (acc.slug != null && String(acc.slug).toLowerCase().trim() === strId)
    ) || null;
  },

  clearCache() {
    cachedSavingsAccounts = null;
    lastCacheTime = 0;
  }
};
