import { db, collection, addDoc } from '../lib/firebase';

export const referralService = {
  /**
   * Logs an outbound redirect clickout / referral click to Firestore referral_clicks collection
   */
  async logReferralClick(userId, card, clickedUrl, referralCode = null, sourcePage = 'Card Application Link') {
    try {
      const nowTimestamp = new Date().toISOString();
      const code = referralCode || (card ? `REF_${card.id}_${(card.bank || 'BANK').replace(/\s+/g, '_').toUpperCase()}` : 'REF_DCARD');

      const payload = {
        // Requirement 5 fields:
        referralCode: code,
        userId: userId || null,
        timestamp: nowTimestamp,
        source: sourcePage,
        page: sourcePage,
        // Compatibility fields:
        user_id: userId || null,
        card_id: card?.id || null,
        card_name: card?.cardName || card?.name || 'Debit Card',
        bank_name: card?.bank || 'Bank',
        clicked_url: clickedUrl || card?.applyUrl || '',
        clicked_at: nowTimestamp
      };

      const docRef = await addDoc(collection(db, 'referral_clicks'), payload);
      return { id: docRef.id, ...payload };
    } catch (error) {
      console.warn("Could not log referral outlink clickout analytics to Firestore: ", error.message);
      return null;
    }
  }
};
