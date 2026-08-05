import { db, doc, getDoc, setDoc, updateDoc, collection, addDoc, arrayUnion, arrayRemove } from '../lib/firebase';

export const wishlistService = {
  /**
   * Retrieves all bookmarked cards saved in Firestore wishlists collection for a user
   */
  async getWishlist(userId) {
    if (!userId) return [];
    try {
      const docRef = doc(db, 'wishlists', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.items || [];
      }
      return [];
    } catch (err) {
      console.warn('[Firestore Wishlist getWishlist Notice]:', err.message);
      return [];
    }
  },

  /**
   * Bookmarks a card inside Firestore wishlists & saved_cards collections
   */
  async saveCard(userId, card) {
    if (!userId || !card) return null;
    const savedAtTimestamp = new Date().toISOString();
    const cardId = card.id;
    const cardName = card.cardName || card.name || 'Debit Card';
    const bankName = card.bank || card.bank_name || 'Partner Bank';

    const cardItem = {
      card_id: cardId,
      card_name: cardName,
      bank_name: bankName,
      saved_at: savedAtTimestamp,
      card
    };

    try {
      // 1. Save entry to Firestore collection "saved_cards" (Requirement 3)
      await addDoc(collection(db, 'saved_cards'), {
        userId: userId,
        cardId: cardId,
        cardName: cardName,
        bankName: bankName,
        savedAt: savedAtTimestamp
      });

      // 2. Also sync to user wishlists collection for user dashboard persistence
      const docRef = doc(db, 'wishlists', userId);
      await setDoc(docRef, {
        user_id: userId,
        updated_at: savedAtTimestamp,
        items: arrayUnion(cardItem)
      }, { merge: true });

      return cardItem;
    } catch (err) {
      console.warn('[Firestore Wishlist saveCard Notice]:', err.message);
      return cardItem;
    }
  },

  /**
   * Deletes a card bookmark from Firestore wishlists collection
   */
  async removeCard(userId, cardId) {
    if (!userId || !cardId) return;
    try {
      const docRef = doc(db, 'wishlists', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const currentItems = data.items || [];
        const updatedItems = currentItems.filter(item => item.card_id !== cardId && item.id !== cardId && item.card?.id !== cardId);
        await updateDoc(docRef, {
          items: updatedItems,
          updated_at: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('[Firestore Wishlist removeCard Notice]:', err.message);
    }
  },

  /**
   * Merges and synchronizes local guest bookmarks into Firestore on login
   */
  async syncWishlist(userId, localWishlist) {
    if (!userId || !localWishlist || localWishlist.length === 0) return;
    try {
      const docRef = doc(db, 'wishlists', userId);
      const itemsToSync = localWishlist.map(card => ({
        card_id: card.id,
        card_name: card.cardName || card.name || 'Debit Card',
        bank_name: card.bank || card.bank_name || 'Partner Bank',
        saved_at: new Date().toISOString(),
        card
      }));

      await setDoc(docRef, {
        user_id: userId,
        updated_at: new Date().toISOString(),
        items: itemsToSync
      }, { merge: true });

    } catch (err) {
      console.warn('[Firestore Wishlist syncWishlist Notice]:', err.message);
    }
  },

  /**
   * Clears all card bookmarks from Firestore wishlists collection in a single request
   */
  async clearAllWishlist(userId) {
    if (!userId) return;
    try {
      const docRef = doc(db, 'wishlists', userId);
      await setDoc(docRef, {
        items: [],
        updated_at: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore Wishlist clearAllWishlist Notice]:', err.message);
    }
  }
};
