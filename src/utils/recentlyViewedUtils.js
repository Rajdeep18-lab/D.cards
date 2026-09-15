/**
 * recentlyViewedUtils.js
 * Manages a localStorage list of recently viewed banking products.
 * No Firestore or backend dependency — purely client-side.
 */

const STORAGE_KEY = 'dcards_recently_viewed';
const MAX_ITEMS = 20;

/**
 * Returns the full list of recently viewed items (newest first).
 * @returns {Array<{id, type, bank, name, category, viewedAt}>}
 */
export function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Logs a product view to the recently viewed list.
 * Deduplicates by id, keeps newest first, trims to MAX_ITEMS.
 *
 * @param {object} product - The banking product being viewed
 */
export function logRecentlyViewed(product) {
  if (!product || !product.id) return;

  try {
    const isCurrentAccount =
      product.productType === 'currentAccount' ||
      product.category === 'current_account' ||
      Boolean(product.businessConstitution) ||
      Boolean(product.cashDepositLimit) ||
      (product.product_id && String(product.product_id).toLowerCase().includes('current')) ||
      (product.accountName && String(product.accountName).toLowerCase().includes('current account')) ||
      (product.accountType && String(product.accountType).toLowerCase().includes('current'));

    const isSavingsAccount =
      !isCurrentAccount &&
      (product.productType === 'savingsAccount' || Boolean(product.accountName));

    let type, category;
    if (isCurrentAccount) {
      type = 'currentAccount';
      category = 'Current Account';
    } else if (isSavingsAccount) {
      type = 'savingsAccount';
      category = 'Savings Account';
    } else {
      type = 'debitCard';
      category = product.category || 'Debit Card';
    }

    const entry = {
      id: String(product.id || product.product_id),
      type,
      bank: product.bank || product.bankName || '',
      name: product.cardName || product.accountName || product.variant_name || product.name || 'Unknown Product',
      category,
      annualFee: product.annualFee,
      interestRate: product.interestRate,
      minimumBalance: product.minimumBalance,
      viewedAt: new Date().toISOString(),
    };

    const existing = getRecentlyViewed();
    // Remove any prior entry for same product
    const filtered = existing.filter((item) => item.id !== entry.id);
    // Prepend newest
    const updated = [entry, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Silently fail — never crash the app over analytics
  }
}

/**
 * Removes a single item from recently viewed by id.
 * @param {string} id
 */
export function removeRecentlyViewed(id) {
  try {
    const existing = getRecentlyViewed();
    const updated = existing.filter((item) => item.id !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

/**
 * Clears all recently viewed items.
 */
export function clearRecentlyViewed() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
