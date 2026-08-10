import { db, collection, getDocs } from '../lib/firebase';
import { savingsAccounts } from '../data/mockSavingsAccounts';

export const SAVINGS_ACCOUNTS_COLLECTION = 'savings_accounts';

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
      const querySnapshot = await getDocs(collection(db, SAVINGS_ACCOUNTS_COLLECTION));
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
      console.warn("Firestore fetch notice for savings_accounts collection, using static dataset:", err.message || err);
    }

    cachedSavingsAccounts = savingsAccounts;
    lastCacheTime = now;
    return savingsAccounts;
  },

  async getSavingsAccountById(accountId) {
    const all = await this.getSavingsAccounts();
    const strId = String(accountId);
    return all.find(acc => String(acc.id) === strId) || null;
  },

  clearCache() {
    cachedSavingsAccounts = null;
    lastCacheTime = 0;
  }
};
