import { db, doc, getDoc, setDoc } from "../lib/firebase";

export const PRIMARY_ADMIN_EMAIL = "ritikanshu072@gmail.com";

// In-memory cache to optimize checkIsAdmin calls
let adminStatusCache = {};

export const adminAuthService = {
  /**
   * Strictly verifies whether the authenticated user has admin privileges.
   * Checks:
   * 1. Primary admin email ritikanshu072@gmail.com
   * 2. Firestore `admins` collection by uid (role === 'admin')
   * 3. Firestore `admin_users` collection by uid (role === 'admin')
   * 4. Firestore `users` collection by uid (role === 'admin')
   * 
   * NEVER grants admin access to standard non-admin users.
   */
  async checkIsAdmin(user) {
    if (!user) {
      return false;
    }

    const email = (user.email || '').toLowerCase().trim();
    const uid = user.uid;

    if (!uid) return false;

    // Check memory cache first
    if (adminStatusCache[uid] !== undefined) {
      return adminStatusCache[uid];
    }

    // 1. Primary Admin Email Instant Verification
    if (email === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
      adminStatusCache[uid] = true;
      
      // Auto-ensure Primary Admin doc exists in `admins` and `admin_users`
      try {
        const docRef = doc(db, 'admins', uid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            uid,
            email,
            role: "admin",
            createdAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (e) {
        console.warn("Primary admin doc sync warning:", e.message);
      }

      return true;
    }

    try {
      // 2. Check Firestore `admins` collection
      const adminDocRef = doc(db, 'admins', uid);
      const adminDoc = await getDoc(adminDocRef);
      if (adminDoc.exists()) {
        const data = adminDoc.data() || {};
        if (data.role === 'admin' || data.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
          adminStatusCache[uid] = true;
          return true;
        }
      }

      // 3. Check Firestore `admin_users` collection
      const adminUserDocRef = doc(db, 'admin_users', uid);
      const adminUserDoc = await getDoc(adminUserDocRef);
      if (adminUserDoc.exists()) {
        const data = adminUserDoc.data() || {};
        if (data.role === 'admin' || data.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
          adminStatusCache[uid] = true;
          return true;
        }
      }

      // 4. Check Firestore `users` collection for role === 'admin'
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data() || {};
        if (data.role === 'admin') {
          adminStatusCache[uid] = true;
          return true;
        }
      }

      // Explicitly return FALSE for all normal users
      adminStatusCache[uid] = false;
      return false;
    } catch (err) {
      console.warn("Admin role verification warning:", err.message);
      adminStatusCache[uid] = false;
      return false;
    }
  },

  clearCache() {
    adminStatusCache = {};
  }
};
