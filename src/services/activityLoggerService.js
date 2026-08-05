import { db, collection, addDoc, onSnapshot, query, orderBy, limit } from '../lib/firebase';

const ACTIVITY_LOGS_COLLECTION = 'activity_logs';

export const activityLoggerService = {
  /**
   * Log a live activity event into Firestore
   */
  async logActivity(type, text, userEmail = 'Guest', details = {}) {
    try {
      const payload = {
        type, // 'registration' | 'profile_update' | 'favorite' | 'compare' | 'search' | 'chatbot' | 'contact' | 'import_csv' | 'import_json' | 'card_update'
        text,
        user_email: userEmail,
        timestamp: new Date().toISOString(),
        details
      };
      await addDoc(collection(db, ACTIVITY_LOGS_COLLECTION), payload);
      if (type === 'search') {
        try {
          await addDoc(collection(db, 'search_logs'), {
            query: text,
            user_email: userEmail,
            timestamp: payload.timestamp,
            ...details
          });
        } catch (e) {}
      }
    } catch (err) {
      console.warn("Activity log error:", err.message);
    }
  },

  /**
   * Subscribe to real-time activity logs stream via onSnapshot
   */
  subscribeToActivityLogs(callback) {
    try {
      const q = query(collection(db, ACTIVITY_LOGS_COLLECTION), orderBy('timestamp', 'desc'), limit(50));
      return onSnapshot(q, (snapshot) => {
        const logs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(logs);
      }, (err) => {
        console.warn("Activity logs onSnapshot notice:", err.message);
        callback([]);
      });
    } catch (err) {
      console.warn("Activity log subscription error:", err);
      callback([]);
      return () => {};
    }
  }
};

export default activityLoggerService;
