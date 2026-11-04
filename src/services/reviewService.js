import {
  db,
  collection,
  addDoc,
  serverTimestamp,
  auth
} from '../lib/firebase';

const REVIEWS_STORAGE_KEY = 'dcard_user_reviews';

/**
 * Storage helpers - maintain local review display, instant UI feedback, and offline continuity.
 */
export function getStoredReviews() {
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Could not read user reviews from localStorage:', e);
    return [];
  }
}

export function saveStoredReview(newReview) {
  try {
    const current = getStoredReviews();
    const updated = [newReview, ...current.filter((r) => r.id !== newReview.id)].slice(0, 50);
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Could not save user review to localStorage:', e);
    return null;
  }
}

export const reviewService = {
  /**
   * Save a review to Cloud Firestore `reviews` collection and sync with local display.
   *
   * Document structure in Firestore:
   * - userId: Firebase UID (if authenticated), otherwise null
   * - userName: User's display name or provided name
   * - userEmail: User's email (if provided or available in auth profile)
   * - rating: Numeric rating between 1 and 5
   * - message: The review text
   * - category: Feedback category (e.g. 'General', or card/bank name)
   * - role: Role / title (optional, e.g. 'Cardholder', 'Working Professional')
   * - cardName: Card name (optional)
   * - createdAt: Firebase serverTimestamp()
   * - date: Human-readable date string (e.g. "5 Nov 2026")
   * - isUserSubmitted: true
   */
  async submitReview(reviewData = {}) {
    const currentUser = auth?.currentUser || reviewData.user || null;
    const userId = currentUser?.uid || reviewData.userId || null;

    const rawName = reviewData.name || reviewData.userName || currentUser?.displayName || currentUser?.name || 'Anonymous';
    const userName = String(rawName).trim().slice(0, 100) || 'Anonymous';

    const rawEmail = reviewData.email || reviewData.userEmail || currentUser?.email || null;
    const userEmail = rawEmail ? String(rawEmail).trim().toLowerCase().slice(0, 150) : null;

    const rating = Math.min(5, Math.max(1, Number(reviewData.rating) || 5));
    const message = String(reviewData.message || reviewData.text || '').trim().slice(0, 2000);

    const category = String(reviewData.category || reviewData.cardName || 'General').trim().slice(0, 100);
    const role = reviewData.role ? String(reviewData.role).trim().slice(0, 100) : null;
    const cardName = reviewData.cardName ? String(reviewData.cardName).trim().slice(0, 100) : null;

    const dateStr = reviewData.date || new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    const firestorePayload = {
      userId,
      userName,
      userEmail,
      rating,
      message,
      category,
      createdAt: serverTimestamp(),
      date: dateStr,
      isUserSubmitted: true
    };

    if (role) firestorePayload.role = role;
    if (cardName) firestorePayload.cardName = cardName;

    // 1. Save to Cloud Firestore `reviews` collection
    let docRef = null;
    try {
      docRef = await addDoc(collection(db, 'reviews'), firestorePayload);
    } catch (firestoreError) {
      console.error('Firestore reviews collection submission error:', firestoreError);
      throw firestoreError;
    }

    // 2. Sync to local storage for instant frontend rendering (WITHOUT userEmail to protect privacy)
    const localReview = {
      id: docRef?.id || `review-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: userName,
      user: userName,
      rating,
      text: message,
      message,
      category,
      role: role || 'Cardholder',
      cardName: cardName || (category !== 'General' ? category : null),
      date: dateStr,
      createdAt: new Date().toISOString(),
      isUserSubmitted: true
    };

    saveStoredReview(localReview);

    return {
      id: docRef?.id,
      ...firestorePayload,
      localReview
    };
  },

  getStoredReviews,
  saveStoredReview
};

export default reviewService;

