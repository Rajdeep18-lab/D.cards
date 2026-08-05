import { auth, db, doc, getDoc, setDoc, updateDoc } from '../lib/firebase';

/**
 * Normalizes user profile data across column name aliases
 */
function normalizeProfile(data) {
  if (!data) return null;
  return {
    ...data,
    full_name: data.full_name || data.name || '',
    name: data.name || data.full_name || '',
    phone: data.phone || data.phone_number || '',
    phone_number: data.phone_number || data.phone || '',
    profile_image: data.profile_image || data.avatar_url || '',
    avatar_url: data.avatar_url || data.profile_image || '',
    country: data.country || 'India',
    state: data.state || '',
    city: data.city || ''
  };
}

export const profileService = {
  /**
   * Retrieves profile details for an authenticated user using Firestore
   */
  async getProfile(passedUserId) {
    try {
      const targetUserId = auth.currentUser?.uid || passedUserId;

      if (!targetUserId) {
        return null;
      }

      // Check localStorage cached profile first
      const cached = localStorage.getItem(`dcard_firebase_profile_${targetUserId}`);
      if (cached) {
        try {
          return normalizeProfile(JSON.parse(cached));
        } catch (e) {}
      }

      // Query Firestore profiles collection
      const docRef = doc(db, 'profiles', targetUserId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        localStorage.setItem(`dcard_firebase_profile_${targetUserId}`, JSON.stringify(data));
        return normalizeProfile(data);
      }

      // Fallback profile if user object is present
      const user = auth.currentUser;
      if (user && user.uid === targetUserId) {
        const fallback = {
          id: user.uid,
          uid: user.uid,
          user_id: user.uid,
          email: user.email,
          full_name: user.displayName || user.email?.split('@')[0] || 'User',
          created_at: new Date().toISOString()
        };
        return normalizeProfile(fallback);
      }

      return null;
    } catch (err) {
      console.warn('[getProfile Firestore Warning]:', err.message || err);
      return null;
    }
  },

  /**
   * Updates profile data for an authenticated user using Firestore
   */
  async updateProfile(passedUserId, profileData) {
    const user = auth.currentUser;
    const targetUserId = user?.uid || passedUserId;

    if (!targetUserId) {
      throw new Error("No active authentication session found. Please log in again.");
    }

    const updatePayload = {
      ...profileData,
      id: targetUserId,
      uid: targetUserId,
      user_id: targetUserId,
      ...(profileData.full_name ? { full_name: profileData.full_name, name: profileData.full_name } : {}),
      ...(profileData.phone ? { phone: profileData.phone, phone_number: profileData.phone } : {}),
      ...(profileData.profile_image ? { profile_image: profileData.profile_image, avatar_url: profileData.profile_image } : {}),
      updated_at: new Date().toISOString()
    };

    try {
      const docRef = doc(db, 'profiles', targetUserId);
      await setDoc(docRef, updatePayload, { merge: true });

      // Also sync to "users" collection (Requirement 1)
      const usersDocRef = doc(db, 'users', targetUserId);
      await setDoc(usersDocRef, {
        uid: targetUserId,
        name: updatePayload.full_name || updatePayload.name || '',
        email: user?.email || updatePayload.email || '',
        city: updatePayload.city || '',
        state: updatePayload.state || '',
        profileImage: updatePayload.profile_image || updatePayload.avatar_url || ''
      }, { merge: true });

      // Sync localStorage
      localStorage.setItem(`dcard_firebase_profile_${targetUserId}`, JSON.stringify(updatePayload));

      return normalizeProfile(updatePayload);
    } catch (err) {
      console.warn('[updateProfile Firestore Warning]:', err.message || err);
      // Fallback to local storage update if offline
      localStorage.setItem(`dcard_firebase_profile_${targetUserId}`, JSON.stringify(updatePayload));
      return normalizeProfile(updatePayload);
    }
  },

  /**
   * Records a user login event (increments login_count and sets last_login)
   */
  async recordUserLogin(passedUserId, currentProfile) {
    try {
      const targetUserId = auth.currentUser?.uid || passedUserId;
      if (!targetUserId) return normalizeProfile(currentProfile);

      const loginCount = (currentProfile?.login_count || 0) + 1;
      const updateData = {
        last_login: new Date().toISOString(),
        login_count: loginCount
      };

      const docRef = doc(db, 'profiles', targetUserId);
      await setDoc(docRef, updateData, { merge: true });

      const updatedProfile = { ...currentProfile, ...updateData };
      localStorage.setItem(`dcard_firebase_profile_${targetUserId}`, JSON.stringify(updatedProfile));
      return normalizeProfile(updatedProfile);
    } catch (err) {
      return normalizeProfile(currentProfile);
    }
  }
};
