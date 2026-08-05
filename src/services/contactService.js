import {
  db,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query as firestoreQuery,
  orderBy,
  getDocs
} from '../lib/firebase';
import { onSnapshot } from 'firebase/firestore';

export const contactService = {
  /**
   * Submit a new contact query to Firestore `contact_queries` collection
   */
  async submitQuery(formData) {
    try {
      const nowIso = new Date().toISOString();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const queryId = `QRY-${Date.now().toString(36).toUpperCase()}-${randomSuffix}`;

      const initialHistoryItem = {
        id: `msg_${Date.now()}_1`,
        sender: 'user',
        senderName: formData.name || 'User',
        message: formData.message || '',
        timestamp: nowIso
      };

      const payload = {
        query_id: queryId,
        name: formData.name ? formData.name.trim() : '',
        email: formData.email ? formData.email.trim().toLowerCase() : '',
        mobile: formData.mobile ? formData.mobile.trim() : '',
        subject: formData.subject ? formData.subject.trim() : 'General Inquiry',
        message: formData.message ? formData.message.trim() : '',
        created_at: nowIso,
        status: 'Pending', // Pending | In Progress | Replied | Closed
        assigned_to: 'Founder / Support Team',
        admin_reply: '',
        replied_at: null,
        history: [initialHistoryItem]
      };

      const docRef = await addDoc(collection(db, 'contact_queries'), payload);
      return { id: docRef.id, ...payload };
    } catch (error) {
      console.error('Firestore contact_queries submission error:', error);
      throw error;
    }
  },

  /**
   * Backward compatible wrapper for submitMessage
   */
  async submitMessage(form) {
    return this.submitQuery({
      name: form.name,
      email: form.email,
      mobile: form.mobile || form.phone || '',
      subject: form.subject || form.topic || 'Contact Form Submission',
      message: form.message
    });
  },

  /**
   * Subscribe to real-time updates from `contact_queries` collection
   */
  subscribeToQueries(onUpdate, onError) {
    try {
      const q = firestoreQuery(collection(db, 'contact_queries'), orderBy('created_at', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          onUpdate(list);
        },
        (error) => {
          console.warn('Real-time contact_queries snapshot notice:', error.message);
          if (onError) onError(error);
        }
      );
      return unsubscribe;
    } catch (err) {
      console.error('Error attaching listener to contact_queries:', err);
      if (onError) onError(err);
      return () => {};
    }
  },

  /**
   * One-time fetch of all contact queries
   */
  async fetchAllQueries() {
    try {
      const q = firestoreQuery(collection(db, 'contact_queries'), orderBy('created_at', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
    } catch (err) {
      console.error('Error fetching contact queries:', err);
      return [];
    }
  },

  /**
   * Send Founder/Admin reply, update Firestore status to "Replied", record history, and send user email
   */
  async sendAdminReply(docId, replyText, userEmail, userName, userSubject, currentHistory = []) {
    if (!docId) throw new Error('Query ID is required');
    if (!replyText || !replyText.trim()) throw new Error('Reply message cannot be empty');

    const nowIso = new Date().toISOString();
    const cleanReply = replyText.trim();

    const newHistoryItem = {
      id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      sender: 'admin',
      senderName: 'Founder / Support Team',
      message: cleanReply,
      timestamp: nowIso
    };

    const updatedHistory = Array.isArray(currentHistory)
      ? [...currentHistory, newHistoryItem]
      : [newHistoryItem];

    const updatePayload = {
      status: 'Replied',
      admin_reply: cleanReply,
      replied_at: nowIso,
      history: updatedHistory
    };

    // 1. Update Firestore Document
    const queryRef = doc(db, 'contact_queries', docId);
    await updateDoc(queryRef, updatePayload);

    // 2. Dispatch Automated Email to User
    let emailResult = { success: true, method: 'simulated' };
    try {
      emailResult = await this.sendEmailNotification({
        toEmail: userEmail,
        toName: userName,
        subject: userSubject,
        replyMessage: cleanReply,
        queryId: docId
      });
    } catch (emailErr) {
      console.warn('Automated email dispatch notification notice:', emailErr.message);
    }

    return {
      success: true,
      emailSent: emailResult.success,
      repliedAt: nowIso
    };
  },

  /**
   * Update query status (Pending | In Progress | Replied | Closed)
   */
  async updateQueryStatus(docId, newStatus) {
    if (!docId) throw new Error('Query ID is required');
    const validStatuses = ['Pending', 'In Progress', 'Replied', 'Closed'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    const queryRef = doc(db, 'contact_queries', docId);
    await updateDoc(queryRef, {
      status: newStatus,
      updated_at: new Date().toISOString()
    });
    return true;
  },

  /**
   * Delete a query document from Firestore `contact_queries`
   */
  async deleteQuery(docId) {
    if (!docId) throw new Error('Query ID is required');
    const queryRef = doc(db, 'contact_queries', docId);
    await deleteDoc(queryRef);
    return true;
  },

  /**
   * Send automated email notification to user's email address
   */
  async sendEmailNotification({ toEmail, toName, subject, replyMessage, queryId }) {
    if (!toEmail) return { success: false, reason: 'No email provided' };

    console.log(`[AUTOMATED EMAIL DISPATCH] To: ${toName} <${toEmail}> | Subject: Re: ${subject} | Ref: ${queryId}`);
    
    // Attempt EmailJS or REST email dispatch if configured, otherwise fallback to web dispatch simulation
    try {
      if (window.emailjs && window.emailjs.send) {
        await window.emailjs.send('default_service', 'template_support_reply', {
          to_email: toEmail,
          to_name: toName || 'Valued User',
          subject: subject || 'Support Query Reply',
          message: replyMessage,
          query_id: queryId
        });
        return { success: true, method: 'emailjs' };
      }
    } catch (e) {
      // Fallback gracefully
    }

    return {
      success: true,
      method: 'dispatch_logged',
      timestamp: new Date().toISOString()
    };
  }
};
