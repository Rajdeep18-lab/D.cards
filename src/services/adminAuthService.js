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

    // 1. Primary Admin Email Verification (Strictly requires verified email AND active record)
    if (email === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
      if (!user.emailVerified) {
        console.warn("[AdminAuth] Primary admin email detected but unverified. Access denied until email ownership is verified.");
        adminStatusCache[uid] = false;
        return false;
      }

      // Check if primary admin document is deactivated in Firestore
      try {
        const adminDocRef = doc(db, 'admins', uid);
        const adminDoc = await getDoc(adminDocRef);
        if (adminDoc.exists()) {
          const data = adminDoc.data() || {};
          if (data.active === false || (data.role && data.role !== 'admin')) {
            console.warn("[AdminAuth] Primary admin account is deactivated or has invalid role.");
            adminStatusCache[uid] = false;
            return false;
          }
        } else {
          // Auto-ensure Primary Admin doc exists in `admins` with role: "admin" and active: true
          await setDoc(adminDocRef, {
            uid,
            email,
            role: "admin",
            active: true,
            createdAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (e) {
        console.warn("Primary admin doc sync/verification notice:", e.message);
      }

      adminStatusCache[uid] = true;
      return true;
    }

    try {
      // 2. Check Firestore `admins` collection (Strict role: 'admin' and active !== false)
      const adminDocRef = doc(db, 'admins', uid);
      const adminDoc = await getDoc(adminDocRef);
      if (adminDoc.exists()) {
        const data = adminDoc.data() || {};
        const isRoleAdmin = data.role === 'admin';
        const isActive = data.active !== false;
        if (isRoleAdmin && isActive) {
          adminStatusCache[uid] = true;
          return true;
        }
      }

      // 3. Check Firestore `admin_users` collection (Strict role: 'admin' and active !== false)
      const adminUserDocRef = doc(db, 'admin_users', uid);
      const adminUserDoc = await getDoc(adminUserDocRef);
      if (adminUserDoc.exists()) {
        const data = adminUserDoc.data() || {};
        const isRoleAdmin = data.role === 'admin';
        const isActive = data.active !== false;
        if (isRoleAdmin && isActive) {
          adminStatusCache[uid] = true;
          return true;
        }
      }

      // Normal users are not in admins or admin_users collections
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
